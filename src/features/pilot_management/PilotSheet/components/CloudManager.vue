<template>
  <cc-notification ref="note" :color="noteColor">
    <span v-html="notification" />
  </cc-notification>
</template>

<script lang="ts">
import Vue from 'vue'
import ExtLog from '@/io/ExtLog'

export default Vue.extend({
  name: 'ident-block',
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
          ExtLog(`Cloud save error: ${err}`)
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
        .then((res: any) => {
          this.noteColor = 'success darken-2'
          this.notification = 'Pilot Data Loaded'
          this.$refs.note.open()
          this.$emit('end-sync')
        })
        .catch((err: any) => {
          ExtLog(`Cloud update error: ${err}`)
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
        .then((res: any) => {
          this.noteColor = 'success darken-2'
          this.notification = 'Pilot Data Generated'
          this.$refs.note.open()
          this.$emit('end-sync')
        })
        .catch((err: any) => {
          ExtLog(`Cloud update error: ${err}`)
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