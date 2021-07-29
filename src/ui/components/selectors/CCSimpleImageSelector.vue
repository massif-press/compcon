<template>
  <cc-solo-dialog
    id="image-selector-dialog"
    ref="dialog"
    width="60vw"
    no-confirm
    title="Select Image"
  >
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-img
            v-if="displayImage"
            :src="displayImage"
            contain
            max-width="500px"
            max-height="500px"
            class="ml-auto mr-auto"
          />
          <v-file-input
            ref="fileInput"
            class="px-6 mt-2"
            accept="image/*"
            dense
            outlined
            placeholder="Select Image"
            prepend-icon="mdi-file-upload-outline"
            :disabled="loading"
            @change="onChange"
          />
          <div>
            <i>10MB maximum file size. PNG files over 5MB will be converted to JPEGs.</i>
          </div>
        </v-col>
        <v-col cols="12">
          <div class="text-center">
            <v-btn color="secondary" :disabled="!imageData || loading" @click="saveImage()">
              <span v-if="!loading">
                Set Image
              </span>
              <v-progress-circular v-else size="25" width="3" indeterminate />
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </cc-solo-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import path from 'path'
import imgur from '../../../io/apis/imgur'

export default Vue.extend({
  name: 'simple-image-selector',
  data: () => ({
    imageData: null,
    loading: false,
  }),
  computed: {
    displayImage() {
      if (this.imageData) return `data:image/png;base64,${this.imageData}`
      return ''
    },
    isPixel() {
      return this.selectedImage && path.basename(this.selectedImage).includes('_pixel')
    },
  },
  methods: {
    onChange(file: File | null) {
      if (!file) {
        this.imageData = null
        return
      }
      const reader = new FileReader()
      reader.addEventListener(
        'load',
        () => {
          // get base64 without url headers for imgur
          this.imageData = btoa(reader.result as string)
        },
        false
      )
      reader.readAsBinaryString(file)
    },
    async saveImage() {
      this.loading = true
      const link = await imgur.uploadImage(this.imageData)
      try {
        this.$emit('set', link)
        this.$emit('notify', 'Cloud Upload Successful')
      } catch (err) {
        console.error(err)
        this.$emit('notify', `Error Uploading to Cloud:<br>${err.message}`)
      }
      this.$refs.fileInput.value = null
      this.loading = false
      this.imageData = null
      this.close()
    },
    open() {
      this.$refs.dialog.show()
    },
    close() {
      this.$refs.dialog.hide()
    },
  },
})
</script>
