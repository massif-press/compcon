<template>
  <cc-notification ref="note" :color="noteColor">
    <span v-html="notification" />
  </cc-notification>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cloud-manager',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    noteColor: '',
    notification: '',
  }),
  methods: {
    save() {
      this.$emit('start-sync')
      this.pilot
        .CloudSave()
        .then(() => {
          this.noteColor = 'success darken-2'
          this.notification = 'Pilot Data Saved'
          this.$refs.note.open()
          this.$emit('end-sync')
        })
        .catch((err: any) => {
          console.error(`Cloud save error: ${err}`)
          this.noteColor = 'error'
          this.notification = `Unable to sync: ${err}`
          this.$refs.note.open()
          this.$emit('end-sync')
        })
    },
    load() {
      this.$emit('start-sync')
      this.pilot
        .CloudLoad()
        .then(() => {
          this.noteColor = 'success darken-2'
          this.notification = 'Pilot Data Loaded'
          console.log(this.$refs.note)
          this.$refs.note.open()
          this.$emit('end-sync')
        })
        .catch((err: any) => {
          console.error(`Cloud update error: ${err}`)
          this.noteColor = 'error'
          this.notification = `Unable to sync:<br> ${err}`
          this.$refs.note.open()
          this.$emit('end-sync')
        })
    },
    new() {
      this.$emit('start-sync')
      this.pilot
        .CloudCopy()
        .then(() => {
          this.noteColor = 'success darken-2'
          this.notification = 'Pilot Data Generated'
          this.$refs.note.open()
          this.$emit('end-sync')
        })
        .catch((err: any) => {
          console.error(`Cloud update error: ${err}`)
          this.noteColor = 'error'
          this.notification = `Unable to create cloud save:<br> ${err}`
          this.$refs.note.open()
          this.$emit('end-sync')
        })
    },
    sync() {
      if (this.pilot.IsUserOwned) {
        this.save()
      } else {
        this.load()
      }
    },
  },
})
</script>
