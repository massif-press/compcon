<template>
  <v-card>
    <v-alert v-if="!store.IsLoggedIn"
      color="subtle"
      variant="outlined"
      class="ma-2"
      icon="mdi-cloud-alert">
      {{ $t('ui.image.requiresAccount') }}
    </v-alert>
    <div v-else>
      <v-row dense
        align="center">
        <v-col v-for="image in displayedUserImages"
          :key="image.uri"
          cols="4"
          md="3">
          <v-card class="ma-2"
            outlined
            tile
            :color="isSelected(image.uri) ? 'primary' : ''"
            :class="{ selected: image === selectedImage }"
            style="border-width: 3px"
            @click="handleImageClick(image)">
            <div class="background">
              <v-img :src="`${distributor}/${image.uri}`"
                contain
                max-height="200px" />
            </div>
          </v-card>
          <v-scale-transition>
            <v-card v-if="isSelected(image.uri)"
              flat
              outlined
              class="pa-1"
              tile>
              <div class="text-caption pb-1 text-center">
                {{ image.name }} &mdash; {{ (image.size / 1024 / 1024).toFixed(2) }}{{ $t('ui.image.mb') }}
              </div>
              <v-menu offset-y
                offset-x
                top
                left>
                <template #activator="{ props }">
                  <v-btn block
                    variant="tonal"
                    color="error"
                    size="x-small"
                    v-bind="props">
                    {{ $t('common.delete') }}
                  </v-btn>
                </template>
                <cc-confirmation
                  content="This will permanently delete this image from cloud storage. Do you want to continue?"
                  @confirm="deleteCloudImage(image)" />
              </v-menu>
            </v-card>
          </v-scale-transition>
        </v-col>
      </v-row>
      <v-pagination v-model="currentUserPage"
        :length="totalUserPages"
        total-visible="5"
        @input="currentUserPage = $event" />
      <v-divider class="my-3" />
      <v-card-text>
        <div class="heading h3 ml-n2">{{ $t('ui.image.uploadImage') }}</div>
        <v-row align="center">
          <v-col>
            <v-file-input v-model="file"
              density="compact"
              hide-details
              flat
              tile
              label="Add New Image"
              accept="image/*"
              class="mt-1 mb-2"
              :disabled="loading || store.CloudStorageFull || !store.IsLoggedIn"
              @change="onFileChange($event)" />
          </v-col>
          <v-col cols="auto">
            <cc-button color="accent"
              :disabled="!stagedImage || store.CloudStorageFull || !store.IsLoggedIn"
              :loading="loading"
              @click="uploadImage()">
              {{ $t('ui.image.upload') }}
            </cc-button>
          </v-col>
        </v-row>
        <div>
          <div class="text-caption">{{ $t('ui.image.accountUsage') }}</div>

          <v-progress-linear :value="(accountUsage / accountMax) * 100"
            height="20px">
            <template #default>
              <strong>
                {{ accountUsage.toFixed(2) }}
                <span class="text-caption">{{ $t('ui.image.mb') }}</span>
                &nbsp;/&nbsp;{{ accountMax.toFixed(2) }}
                <span class="text-caption">{{ $t('ui.image.mb') }}</span>
                ({{ (accountUsage / accountMax).toFixed(2) }}%)
              </strong>
            </template>
          </v-progress-linear>
        </div>
        <v-alert v-show="store.CloudStorageFull"
          color="error"
          prominent
          outlined
          tile
          icon="mdi-alert">
          <div class="heading h3">{{ $t('ui.image.capacityExceeded') }}</div>
          <span>{{ $t('ui.image.overCapacity', { max: accountMax }) }}</span>
          <span>{{ $t('ui.image.patreonNote') }}</span>
        </v-alert>
      </v-card-text>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserData } from '@/ui/providers'
import { cloudDelete, updateItem, uploadToS3 } from '@/io/apis/account'
import { CloudController } from '@/classes/components/cloud/CloudController'
import logger from '@/user/logger'
import { notify } from '@/util/notify'

const distributor = import.meta.env.VITE_APP_USERDATA_DISTRIBUTOR || ''

const emit = defineEmits<{ 'set-staged': [image: any] }>()

const currentUserPage = ref(1)
const itemsPerPage = 12
const selectedImage = ref<any>(null)
const loading = ref(false)
const stagedImage = ref<any>(null)
const file = ref<any>(null)

const store = useUserData()

const accountUsage = computed(() => store.CloudStorageUsed / 1024 / 1024)
const accountMax = computed(() => store.MaxCloudStorage / 1024 / 1024)

const userImages = computed(() => store.CloudImages.filter((x: any) => x.uri))

const totalUserPages = computed(() => Math.ceil(userImages.value.length / itemsPerPage))

const displayedUserImages = computed(() => {
  const startIndex = (currentUserPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return userImages.value.slice(startIndex, endIndex)
})

const selectedImageUri = computed(() => selectedImage.value ? selectedImage.value.uri : '')

function isSelected(uri: string) {
  return selectedImageUri.value === uri
}

async function handleImageClick(image: any) {
  if (isSelected(image.uri)) {
    selectedImage.value = null
  } else {
    selectedImage.value = image
  }
  if (selectedImage.value) emit('set-staged', selectedImage.value)
}

function onFileChange(e: any) {
  stagedImage.value = e.target.files[0]
}

async function uploadImage() {
  if (!stagedImage.value) return
  loading.value = true

  const filename = stagedImage.value.name
    .split('.')
    .shift()
    .replace(/[^a-zA-Z0-9]/g, '')
  const ext = stagedImage.value.type.split('/').pop()
  const type = stagedImage.value.type
  const size = stagedImage.value.size

  const res = await updateItem(CloudController.ImageMetadata(filename, ext, size))
  if (!res.presign.upload) throw new Error('Failed to get presigned uri')

  await uploadToS3(stagedImage.value, res.presign.upload, type)
  await store.refreshDbData()
  notify({
    type: 'success',
    title: 'Image Uploaded',
    text: `Uploaded ${filename}.${ext} (${(size / 1024 / 1024).toFixed(2)}MB)`,
  })
  stagedImage.value = null
  selectedImage.value = null
  loading.value = false
  file.value = null
}

async function deleteCloudImage(item: any) {
  loading.value = true
  try {
    const { user_id, sortkey, uri } = item
    await cloudDelete(user_id, sortkey, uri)
    await store.refreshDbData()
    notify({
      type: 'success',
      title: 'Image Deleted',
      text: `Removed ${item.ItemType} ${item.Name}.`,
    })
    loading.value = false
    return true
  } catch (err) {
    logger.error(`Error deleting image: ${err}`, null, err)
    notify({
      type: 'error',
      title: 'Deletion Failed',
      text: `Unable to communicate with server. ${err}`,
    })
  }
  loading.value = false
}
</script>
