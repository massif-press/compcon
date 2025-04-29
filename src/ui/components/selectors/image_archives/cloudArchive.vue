<template>
  <v-card>
    <v-alert
      v-if="!store.IsLoggedIn"
      color="subtle"
      variant="outlined"
      class="ma-2"
      icon="mdi-cloud-alert">
      Requires COMP/CON Account
    </v-alert>
    <div v-else>
      <v-row dense align="center">
        <v-col v-for="image in displayedUserImages" cols="4" md="3">
          <v-card
            class="ma-2"
            outlined
            tile
            :color="isSelected(image.uri) ? 'primary' : ''"
            :class="{ selected: image === selectedImage }"
            style="border-width: 3px"
            @click="handleImageClick(image)">
            <div class="background">
              <v-img :src="`${distributor}/${image.uri}`" contain max-height="200px" />
            </div>
          </v-card>
          <v-scale-transition>
            <v-card v-if="isSelected(image.uri)" flat outlined class="pa-1" tile>
              <div class="text-caption pb-1 text-center">
                {{ image.name }} &mdash; {{ (image.size / 1024 / 1024).toFixed(2) }}MB
              </div>
              <v-menu offset-y offset-x top left>
                <template v-slot:activator="{ props }">
                  <v-btn block variant="tonal" color="error" size="x-small" v-bind="props">
                    Delete
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
      <v-pagination
        v-model="currentUserPage"
        :length="totalUserPages"
        total-visible="9"
        @input="currentUserPage = $event" />
      <v-divider class="my-3" />
      <v-card-text>
        <div class="heading h3 ml-n2">UPLOAD IMAGE</div>
        <v-row align="center">
          <v-col>
            <v-file-input
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
            <cc-button
              color="accent"
              :disabled="!stagedImage || store.CloudStorageFull || !store.IsLoggedIn"
              :loading="loading"
              @click="uploadImage()">
              Upload
            </cc-button>
          </v-col>
        </v-row>
        <div>
          <div class="text-caption">ACCOUNT USAGE</div>

          <v-progress-linear :value="(accountUsage / accountMax) * 100" height="20px">
            <template v-slot:default="{ value }">
              <strong>
                {{ accountUsage.toFixed(2) }}
                <span class="text-caption">MB</span>
                &nbsp;/&nbsp;{{ accountMax.toFixed(2) }}
                <span class="text-caption">MB</span>
                ({{ (accountUsage / accountMax).toFixed(2) }}%)
              </strong>
            </template>
          </v-progress-linear>
        </div>
        <v-alert
          v-show="store.CloudStorageFull"
          color="error"
          prominent
          outlined
          tile
          icon="mdi-alert">
          <div class="heading h3">CAPACITY EXCEEDED</div>
          <span>
            Your account is over capacity. Free accounts are restricted to
            {{ accountMax }}MB of storage.
          </span>
          <span>
            In an upcoming release you will be able to link your Patreon account, and COMP/CON
            supporters will not be subject to any storage limits.
          </span>
        </v-alert>
      </v-card-text>
    </div>
  </v-card>
</template>

<script lang="ts">
// import { UserStore } from '@/store';
import _ from 'lodash';
import { storageInfo, getPresignedLink, s3api, deleteStorage } from '@/user/api';
import { UserStore } from '@/stores';
import { cloudDelete, updateItem, uploadToS3 } from '@/io/apis/account';
import { CloudController } from '@/classes/components';
import logger from '@/user/logger';
// import { Auth } from '@aws-amplify/auth';

const distributor = import.meta.env.VITE_APP_USERDATA_DISTRIBUTOR || '';

export default {
  name: 'cloud-image-archive',
  data: () => ({
    currentUserPage: 1,
    currentArtistPage: 1,
    itemsPerPage: 12,
    selectedImage: null as unknown as any,
    loading: false,
    imageSelectTab: 0,
    remoteInput: '',
    remoteError: '',
    iid: '',
    userStorageData: null as unknown as any,
    stagedImage: null as unknown as any,
    showAll: false,
    imageuri: '',
  }),
  emits: ['set-staged'],
  computed: {
    store() {
      return UserStore();
    },
    distributor() {
      return distributor;
    },
    accountUsage() {
      return this.store.CloudStorageUsed / 1024 / 1024;
    },
    accountMax() {
      return this.store.MaxCloudStorage / 1024 / 1024;
    },
    displayedUserImages() {
      const startIndex = (this.currentUserPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.userImages.slice(startIndex, endIndex);
    },
    totalUserPages() {
      return Math.ceil(this.userImages.length / this.itemsPerPage);
    },
    userImages() {
      return UserStore().CloudImages;
    },
    selectedImageUri() {
      return this.selectedImage ? this.selectedImage.uri : '';
    },
  },
  methods: {
    async handleImageClick(image) {
      this.isSelected(image.uri) ? (this.selectedImage = null) : (this.selectedImage = image);
      if (this.selectedImage) this.$emit('set-staged', this.selectedImage);
    },
    onFileChange(e) {
      this.stagedImage = e.target.files[0];
    },
    isSelected(uri) {
      return this.selectedImageUri === uri;
    },
    async uploadImage() {
      if (!this.stagedImage) return;
      this.loading = true;

      const filename = this.stagedImage.name
        .split('.')
        .shift()
        .replace(/[^a-zA-Z0-9]/g, '');
      const ext = this.stagedImage.type.split('/').pop();
      const type = this.stagedImage.type;
      const size = this.stagedImage.size;

      const res = await updateItem(CloudController.ImageMetadata(filename, ext, size));
      if (!res.presign.upload) throw new Error('Failed to get presigned uri');

      await uploadToS3(this.stagedImage, res.presign.upload, type);
      await UserStore().refreshDbData();
      this.$notify({
        title: `Image Uploaded`,
        text: `Uploaded ${filename}.${ext} (${(size / 1024 / 1024).toFixed(2)}MB)`,
        data: { icon: 'mdi-check', color: 'success' },
      });
      this.stagedImage = null;
      this.selectedImage = null;
      this.loading = false;
    },
    async deleteCloudImage(item) {
      this.loading = true;
      try {
        const { user_id, sortkey, uri } = item;
        await cloudDelete(user_id, sortkey, uri);

        await UserStore().refreshDbData();
        this.$notify({
          title: `Image Deleted`,
          text: `Removed ${item.ItemType} ${item.Name}.`,
          data: { icon: 'mdi-delete', color: 'success' },
        });
        this.loading = false;
        return true;
      } catch (err) {
        logger.error(`Error deleting image: ${err}`, this);
        this.$notify({
          title: `Deletion Failed`,
          text: `Unable to communicate with server. ${err}`,
          data: { icon: 'mdi-alert', color: 'error' },
        });
      }
      this.loading = false;
    },
  },
};
</script>
