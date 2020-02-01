<template>
  <cc-solo-dialog
    id="image-selector-dialog"
    ref="dialog"
    fullscreen
    no-confirm
    title="Select Image"
  >
    <v-container fluid>
      <div class="image-select-column">
        <div class="image-display-block">
          <img :src="displayImage" />
        </div>
        <v-file-input
          ref="fileInput"
          class="image-input"
          accept="image/*"
          outlined
          placeholder="Select Image"
          label="IMAGE FILE"
          prepend-icon="mdi-paperclip"
          :disabled="loading"
          @change="onChange"
        ></v-file-input>
        <cc-btn
          color="secondary"
          style="align-self: center"
          :disabled="!imageData || loading"
          @click="saveImage()"
        >
          <template v-if="!loading">
            Save Image
          </template>
          <template v-else>
            <v-progress-circular size="25" width="3" indeterminate />
          </template>
        </cc-btn>
      </div>
    </v-container>
  </cc-solo-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import imgur from '../../../io/apis/imgur'

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
    imageData: null,
    loading: false,
  }),
  computed: {
    displayImage() {
      if (this.imageData) return `data:image/png;base64,${this.imageData}`
      else if (this.item.Portrait) return this.item.Portrait
      else return 'https://via.placeholder.com/550'
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
        this.item.SetCloudImage(link)
        this.$emit('notify', 'Cloud Upload Successful')
      } catch (err) {
        this.$emit('notify', `Error Uploading to Cloud:<br>${err.message}`)
      }
      this.close()
      this.$refs.fileInput.value = null
      this.loading = false
      this.imageData = null
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

<style scoped>
.image-select-column {
  width: 550px;
  margin: auto;
  display: flex;
  flex-direction: column;
}

.image-display-block {
  width: 550px;
  height: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-display-block img {
  display: block;
  max-width: 100%;
}

.image-input {
  margin-top: 20px !important;
}
</style>
