<template>
  <cc-solo-dialog
    id="image-selector-dialog"
    ref="dialog"
    fullscreen
    no-confirm
    title="Select Image"
  >
    <v-container fluid>
      <v-row align="center">
        <v-col cols="12" md="6" style="min-height: 800px">
          <v-row dense align="start" class="mb-2">
            <v-col>
              <div class="heading h3">AVAILABLE IMAGES</div>
            </v-col>
            <v-col cols="auto">
              <v-switch v-model="showAll" dense hide-details color="warning" class="mb-0 mt-0">
                <cc-tooltip
                  slot="label"
                  simple
                  inline
                  :content="showAll ? 'Showing all images' : `Showing only ${type} images`"
                >
                  <v-icon
                    :color="showAll ? 'warning' : 'success'"
                    v-html="showAll ? 'mdi-lock-open' : 'mdi-lock'"
                  />
                </cc-tooltip>
              </v-switch>
            </v-col>
          </v-row>
          <v-tabs v-model="imageSelectTab">
            <v-tab>Cloud Account</v-tab>
            <v-tab>COMP/CON Image Archive</v-tab>
          </v-tabs>
          <v-tabs-items v-model="imageSelectTab">
            <v-tab-item>
              <v-card>
                <v-alert
                  v-if="!isAuthed"
                  color="subtle"
                  outlined
                  class="ma-2"
                  icon="mdi-cloud-alert"
                >
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
                        @click="
                          isSelected(image.url) ? (selectedImage = null) : (selectedImage = image)
                        "
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
                          @change="setStagedImage"
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
                    <v-alert
                      v-show="isOverCapacity"
                      color="error"
                      prominent
                      outlined
                      tile
                      icon="mdi-alert"
                    >
                      <div class="heading h3">CAPACITY EXCEEDED</div>
                      <span>
                        Your account is over capacity. Free accounts are restricted to
                        {{ accountMax }}MB of storage.
                      </span>
                      <span>
                        In an upcoming release you will be able to link your Patreon account, and
                        COMP/CON supporters will not be subject to any storage limits.
                      </span>
                    </v-alert>
                  </v-card-text>
                </div>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-row dense align="center">
                  <v-col v-for="image in displayedArtistImages" :key="image.url" cols="4" md="3">
                    <v-card
                      class="ma-2"
                      outlined
                      tile
                      :color="isSelected(image.url) ? 'primary' : ''"
                      :class="{ selected: image === selectedImage }"
                      style="border-width: 3px"
                      @click="
                        isSelected(image.url) ? (selectedImage = null) : (selectedImage = image)
                      "
                    >
                      <div class="background">
                        <v-img :src="image.url" contain max-height="200px" />
                      </div>
                    </v-card>
                    <v-scale-transition>
                      <v-card v-if="isSelected(image.url)" flat outlined class="pa-1" tile>
                        <div class="caption text-center">
                          Artwork by
                          <b>{{ image.artist }}</b>
                        </div>
                        <div class="text-center">
                          <v-btn
                            v-if="image.website"
                            small
                            icon
                            :href="image.website"
                            target="_blank"
                            class="mx-2"
                          >
                            <v-icon small>mdi-web</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="image.twitter"
                            small
                            icon
                            :href="`https://twitter.com/${image.twitter}`"
                            target="_blank"
                            class="mx-2"
                          >
                            <v-icon small>mdi-twitter</v-icon>
                          </v-btn>
                        </div>
                      </v-card>
                    </v-scale-transition>
                  </v-col>
                </v-row>
                <v-pagination
                  v-model="currentArtistPage"
                  :length="totalArtistPages"
                  total-visible="9"
                  @input="currentArtistPage = $event"
                />
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-divider class="ma-6" />

          <div class="heading h3">
            USE REMOTE IMAGE
            <cc-tooltip
              inline
              content="Link a remotely-hosted image to this asset. These images are not stored or managed by COMP/CON and are subject to change or removal based on their hosts."
            >
              <v-icon left>mdi-information-outline</v-icon>
            </cc-tooltip>
          </div>
          <v-row align="center">
            <v-col>
              <v-text-field
                v-model="remoteInput"
                class="px-6 mt-2"
                dense
                outlined
                hide-details
                placeholder="Link Image"
                prepend-icon="mdi-image-sync"
                :disabled="loading"
              />
            </v-col>
            <v-col cols="auto">
              <v-btn
                color="secondary"
                :disabled="!remoteInput || remoteError.length"
                @click="setRemoteImage()"
              >
                Load
              </v-btn>
            </v-col>
          </v-row>
          <v-alert v-if="remoteError" type="error" class="mt-3">
            <v-row>
              <v-col>{{ remoteError }}</v-col>
              <v-col cols="auto">
                <v-btn icon @click="remoteError = ''"><v-icon>mdi-close</v-icon></v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-col>
        <v-col>
          <div class="text-center">
            <v-img
              :src="displayImage"
              contain
              max-width="500px"
              max-height="500px"
              class="ml-auto mr-auto"
              :style="`image-rendering: ${isPixel ? 'pixelated' : 'crisp-edges'};`"
            />
            <v-btn
              color="secondary"
              :disabled="(!remoteInput || remoteError.length) && !selectedImageUrl"
              class="px-10 ma-3"
              @click="saveImage()"
            >
              Set Image
            </v-btn>
            <br />
            <v-btn small outlined @click="clearImage()">clear image</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </cc-solo-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import path from 'path'
import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'
import { storageInfo, getPresignedLink, s3api, deleteStorage } from '@/user/api'
import { Auth } from '@aws-amplify/auth'
import artistmap from '@/assets/artistmap.json'

export default Vue.extend({
  name: 'web-image-selector',
  props: {
    item: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    currentUserPage: 1,
    currentArtistPage: 1,
    itemsPerPage: 12,
    selectedImage: null,
    loading: false,
    imageSelectTab: 0,
    remoteInput: '',
    remoteError: '',
    accountUsage: 0,
    accountMax: 250,
    iid: '',
    userStorageData: null,
    stagedImage: null,
    showAll: false,
  }),
  async mounted() {
    if (!this.iid) await this.getStorageInfo()
  },
  computed: {
    displayedUserImages() {
      const startIndex = (this.currentUserPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.userImages.slice(startIndex, endIndex)
    },
    totalUserPages() {
      return Math.ceil(this.userImages.length / this.itemsPerPage)
    },
    displayedArtistImages() {
      const startIndex = (this.currentArtistPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.artistImages.slice(startIndex, endIndex)
    },
    totalArtistPages() {
      return Math.ceil(this.artistImages.length / this.itemsPerPage)
    },
    displayImage() {
      if (this.selectedImage) return this.selectedImage.url
      if (this.item.Portrait) return this.item.Portrait
      else return 'https://via.placeholder.com/550'
    },
    isPixel() {
      return this.selectedImage && path.basename(this.selectedImage).includes('_pixel')
    },
    isAuthed() {
      return getModule(UserStore, this.$store).IsLoggedIn
    },
    isOverCapacity() {
      return (
        this.isAuthed &&
        this.userStorageData &&
        this.userStorageData.totalSize >= this.userStorageData.max
      )
    },
    userImages() {
      if (!this.userStorageData || this.userStorageData.contents.length === 0) return []
      const contents = this.userStorageData.contents
        .flatMap(x => x.objects)
        .map(x => ({
          url: `https://d1nurxym97qk9o.cloudfront.net/${x.Key}`,
          filename: x.Key.split('/').pop(),
          tag: x.Key.split('/').slice(-2, -1)[0],
          size: x.Size / 1000000,
          key: x.Key,
        }))
      return contents
    },
    artistImages() {
      let out = []

      artistmap.forEach(artist => {
        if (this.showAll) {
          Object.keys(artist.images).forEach(tag => {
            artist.images[tag].forEach(image => {
              out.push({
                url: image.img,
                filename: image.name,
                tag: tag,
                artist: artist.artist,
                website: artist.website || '',
                twitter: artist.twitter || '',
              })
            })
          })
        } else {
          if (artist.images[this.type])
            artist.images[this.type].forEach(image => {
              out.push({
                url: image.img,
                filename: image.name,
                tag: this.type,
                artist: artist.artist,
                website: artist.website || '',
                twitter: artist.twitter || '',
              })
            })
        }
      })
      return out
    },
    selectedImageUrl() {
      return this.selectedImage ? this.selectedImage.url : ''
    },
  },
  methods: {
    async getStorageInfo() {
      if (this.isAuthed) {
        const res = await Auth.currentUserCredentials()
        this.iid = res.identityId
        const info = await storageInfo(this.iid)
        this.userStorageData = info.data
        if (this.userStorageData) {
          this.accountUsage = info.data.totalSize / 1000000
          this.accountMax = info.data.max / 1000000
        }
      }
    },
    isSelected(url) {
      return this.selectedImageUrl === url
    },
    clearImage() {
      this.item.PortraitController.SetCloudImage('')
      this.selectedImage = null
    },
    saveImage() {
      this.item.PortraitController.CloudImage =
        typeof this.selectedImage === 'string' ? this.selectedImage : this.selectedImage.url
      this.loading = false
      this.close()
    },
    setRemoteImage() {
      if (!this.remoteInput) return
      if (!this.validURL(this.remoteInput)) {
        this.remoteError = 'Invalid URL'
        return
      }

      const http = new XMLHttpRequest()

      http.open('GET', this.remoteInput, false)
      http.send()

      if (http.status === 404) {
        this.remoteError = 'Image not found'
        return
      }

      this.remoteError = ''
      this.selectedImage = this.remoteInput
    },
    setStagedImage() {
      if (!this.stagedImage) return
      this.selectedImage = null
      this.imageUrl = URL.createObjectURL(this.stagedImage)
    },
    uploadImage() {
      if (!this.stagedImage) return
      this.loading = true

      getPresignedLink(this.iid, 'image', this.type, this.stagedImage.name)
        .then(res => {
          const sUrl = res.data

          const reader = new FileReader()
          reader.onloadend = () => {
            s3api
              .put(sUrl, reader.result)
              .then(() => {
                this.loading = false
              })
              .then(() => {
                this.stagedImage = null
                this.getStorageInfo()
              })
              .catch(err => {
                this.loading = false
                console.error(err)
              })
          }

          reader.readAsArrayBuffer(this.stagedImage)
        })
        .catch(err => {
          this.loading = false
          console.error(err)
        })
    },
    async deleteCloudImage(image) {
      deleteStorage(image.key).then(() => {
        this.selectedImage = null
        this.getStorageInfo()
      })
    },
    // Pulled from Stackoverflow: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    validURL(str: string): boolean {
      const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i'
      ) // fragment locator
      return !!pattern.test(str)
    },
    open() {
      this.$refs.dialog.show()
      if (!this.iid) this.getStorageInfo()
    },
    close() {
      this.$refs.dialog.hide()
    },
  },
})
</script>
