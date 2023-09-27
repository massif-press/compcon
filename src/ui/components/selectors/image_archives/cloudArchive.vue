<template>
  <v-card>
    <v-alert v-if="!isAuthed" color="subtle" variant="outlined" class="ma-2" icon="mdi-cloud-alert">
      Requires COMP/CON Account
    </v-alert>
    <div v-else>
      <v-row dense align="center">
        <v-col v-for="image in displayedUserImages" :key="image.url" cols="4" md="3">
          <v-card
            class="ma-2"
            outlined
            tile
            :color="isSelected(image.url) ? 'primary' : ''"
            :class="{ selected: image === selectedImage }"
            style="border-width: 3px"
            @click="isSelected(image.url) ? (selectedImage = null) : (selectedImage = image)"
          >
            <div class="background">
              <v-img :src="image.url" contain max-height="200px" />
            </div>
          </v-card>
          <v-scale-transition>
            <v-card v-if="isSelected(image.url)" flat outlined class="pa-1" tile>
              <div class="caption pb-1">
                {{ image.filename }} &mdash; {{ image.size.toFixed(2) }}MB
                <span v-if="showAll">&mdash; {{ image.tag }}</span>
              </div>
              <v-menu offset-y offset-x top left>
                <template v-slot:activator="{ on }">
                  <v-btn block outlined color="error" x-small v-on="on">Delete</v-btn>
                </template>
                <cc-confirmation
                  content="This will permanently delete this image from storage.</span> Do you want to continue?"
                  @confirm="deleteCloudImage(image)"
                />
              </v-menu>
            </v-card>
          </v-scale-transition>
        </v-col>
      </v-row>
      <v-pagination
        v-model="currentUserPage"
        :length="totalUserPages"
        total-visible="9"
        @input="currentUserPage = $event"
      />
      <v-divider class="my-3" />
      <v-card-text>
        <div class="heading h3 ml-n2">UPLOAD IMAGE</div>
        <v-row align="center">
          <v-col>
            <v-file-input
              v-model="stagedImage"
              dense
              hide-details
              outlined
              label="Add New Image"
              accept="image/*"
              class="mt-1 mb-2"
              :disabled="loading || isOverCapacity || !isAuthed"
              @change="$emit('set-staged', $event)"
            />
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="secondary"
              :disabled="!stagedImage || isOverCapacity || !isAuthed"
              :loading="loading"
              @click="uploadImage()"
            >
              Upload
            </v-btn>
          </v-col>
        </v-row>
        <div>
          <div class="text-caption">
            ACCOUNT USAGE
            <cc-tooltip
              inline
              :content="`Free accounts are restricted to ${accountMax}MB of storage. In an upcoming release you will be able to link your Patreon account, and COMP/CON supporters will not be subject to any storage limits.`"
            >
              <v-icon small>mdi-information-outline</v-icon>
            </cc-tooltip>
          </div>

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
        <v-alert v-show="isOverCapacity" color="error" prominent outlined tile icon="mdi-alert">
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
import { Auth } from '@aws-amplify/auth';

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
    accountUsage: 0,
    accountMax: 250,
    iid: '',
    userStorageData: null as unknown as any,
    stagedImage: null as unknown as any,
    showAll: false,
    imageUrl: '',
  }),
  async mounted() {
    if (!this.iid) await this.getStorageInfo();
  },
  computed: {
    displayedUserImages() {
      const startIndex = (this.currentUserPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.userImages.slice(startIndex, endIndex);
    },
    totalUserPages() {
      return Math.ceil(this.userImages.length / this.itemsPerPage);
    },
    isAuthed() {
      return false;
      // TODO
      // return getModule(UserStore, this.$store).IsLoggedIn;
    },
    isOverCapacity() {
      return;
      this.isAuthed &&
        this.userStorageData &&
        this.userStorageData.totalSize >= this.userStorageData.max;
    },
    userImages() {
      if (!this.userStorageData || this.userStorageData.contents.length === 0) return [];
      const contents = this.userStorageData.contents
        .flatMap((x) => x.objects)
        .map((x) => ({
          url: `https://d1nurxym97qk9o.cloudfront.net/${x.Key}`,
          filename: x.Key.split('/').pop(),
          tag: x.Key.split('/').slice(-2, -1)[0],
          size: x.Size / 1000000,
          key: x.Key,
        }));
      return contents;
    },
    selectedImageUrl() {
      return this.selectedImage ? this.selectedImage.url : '';
    },
  },
  methods: {
    async getStorageInfo() {
      if (this.isAuthed) {
        const res = await Auth.currentUserCredentials();
        this.iid = res.identityId;
        const info = await storageInfo(this.iid);
        this.userStorageData = info.data;
        if (this.userStorageData) {
          this.accountUsage = info.data.totalSize / 1000000;
          this.accountMax = info.data.max / 1000000;
        }
      }
    },
    isSelected(url) {
      return this.selectedImageUrl === url;
    },
    uploadImage() {
      if (!this.stagedImage) return;
      this.loading = true;

      getPresignedLink(this.iid, 'image', '', this.stagedImage.name)
        .then((res) => {
          const sUrl = res.data;

          const reader = new FileReader();
          reader.onloadend = () => {
            s3api
              .put(sUrl, reader.result)
              .then(() => {
                this.loading = false;
              })
              .then(() => {
                this.stagedImage = null;
                this.getStorageInfo();
              })
              .catch((err) => {
                this.loading = false;
                console.error(err);
              });
          };

          reader.readAsArrayBuffer(this.stagedImage);
        })
        .catch((err) => {
          this.loading = false;
          console.error(err);
        });
    },
    async deleteCloudImage(image) {
      deleteStorage(image.key).then(() => {
        this.selectedImage = null;
        this.getStorageInfo();
      });
    },
  },
};
</script>
