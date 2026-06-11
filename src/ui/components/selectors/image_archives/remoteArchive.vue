<template>
  <v-card>
    <v-row dense
      align="center">
      <v-col v-for="image in displayedRemoteImages"
        :key="image"
        cols="4"
        md="3">
        <v-card class="ma-2"
          outlined
          tile
          :color="selectedImage === image ? 'primary' : ''"
          :class="{ selected: image === selectedImage }"
          style="border-width: 3px"
          @click="selectedImage === image ? (selectedImage = null) : stage(image)">
          <div class="background">
            <v-img :src="image"
              contain
              max-height="200px" />
          </div>
        </v-card>
        <v-scale-transition>
          <v-card v-if="selectedImage === image"
            flat
            class="pa-1"
            tile>
            <div class="text-caption pb-1 text-center">
              {{ image }}
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
                content="This will delete this image link from your library.</span> Do you want to continue?"
                @confirm="deleteRemoteImage(image)" />
            </v-menu>
          </v-card>
        </v-scale-transition>
      </v-col>
    </v-row>
    <v-pagination v-model="currentRemotePage"
      :length="totalRemotePages"
      total-visible="5"
      @input="currentRemotePage = $event" />
    <v-divider class="my-3" />
    <cc-alert density="compact"
      class="my-2 text-caption"
      icon="mdi-alert"
      title="External Data Warning">
      <i>
        {{ $t('ui.image.remoteGalleryNote') }}
      </i>
    </cc-alert>

    <v-card-text>
      <div class="heading h3">
        {{ $t('ui.image.addRemote') }}
        <cc-tooltip inline
          content="Link a remotely-hosted image to this asset. These images are not stored or managed by COMP/CON and are subject to change or removal based on their hosts.">
          <v-icon left>mdi-information-outline</v-icon>
        </cc-tooltip>
      </div>
      <v-row align="center">
        <v-col>
          <v-text-field v-model="remoteInput"
            class="px-6 mt-2"
            dense
            outlined
            hide-details
            placeholder="Link Image"
            prepend-icon="mdi-image-sync"
            :disabled="loading" />
        </v-col>
        <v-col cols="auto">
          <v-btn color="secondary"
            :disabled="!remoteInput || remoteError.length > 0"
            @click="setRemoteImage()">
            {{ $t('ui.image.load') }}
          </v-btn>
        </v-col>
      </v-row>
      <v-alert v-if="remoteError"
        type="error"
        class="mt-3">
        <v-row>
          <v-col>{{ remoteError }}</v-col>
          <v-col cols="auto">
            <v-btn icon
              @click="remoteError = ''"><v-icon>mdi-close</v-icon></v-btn>
          </v-col>
        </v-row>
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import * as _ from 'lodash-es';
import { SetItem, RemoveItem, GetKeys } from '@/io/Storage';

defineOptions({ name: 'RemoteImageArchive' })

const emit = defineEmits<{
  'set-staged': []
}>()

const currentRemotePage = ref(1)
const itemsPerPage = ref(12)
const selectedImage = ref(null as unknown as any)
const loading = ref(false)
const imageSelectTab = ref(0)
const remoteInput = ref('')
const remoteError = ref('')
const iid = ref('')
const stagedImage = ref(null as unknown as any)
const showAll = ref(false)
const imageUrl = ref('')
const remoteImages = ref([] as string[])
const urls = ref([] as string[])

onMounted(() => getRemoteImages());

const displayedRemoteImages = computed(() => {
      const startIndex = (currentRemotePage.value - 1) * itemsPerPage.value;
      const endIndex = startIndex + itemsPerPage.value;
      return remoteImages.value.slice(startIndex, endIndex);
    })
const totalRemotePages = computed(() => {
      return Math.ceil(remoteImages.value.length / itemsPerPage.value);
    })

async function getRemoteImages() {
      remoteImages.value = await GetKeys('remote_images');
    }
async function deleteRemoteImage(key) {
      RemoveItem('remote_images', key);
      await getRemoteImages();
    }
function stage(image) {
      selectedImage.value = image;
      emit('set-staged', image);
    }
async function setRemoteImage() {
      if (!remoteInput.value || !validURL(remoteInput.value)) {
        remoteError.value = 'Invalid URL';
        return;
      }
      remoteError.value = '';
      selectedImage.value = remoteInput.value;
      await SetItem('remote_images', remoteInput.value);
      await getRemoteImages();
      currentRemotePage.value = totalRemotePages.value;
    }
function Stackoverflow() {
      const pattern = new RegExp(
        '^(https?:\/\/)?' + // protocol
        '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|' + // domain name
        '((\d{1,3}\.){3}\d{1,3}))' + // OR ip (v4) address
        '(\:\d+)?(\/[-a-z\d%_.~+]*)*' + // port and path
        '(\?[;&a-z\d%_.~+=-]*)?' + // query string
        '(\#[-a-z\d_]*)?$',
        'i'
      ); // fragment locator
      return !!pattern.test(str);
    }
</script>
