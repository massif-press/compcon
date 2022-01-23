<template>
  <cc-solo-dialog ref="dialog" no-confirm large :title="title" @close="setHash()">
    <div v-html-safe="body" class="mt-2 body-text text--text" />
    <v-row no-gutters align="end" justify="end">
      <v-col cols="auto">
        <v-checkbox v-model="noshow" color="secondary" hide-details dense>
          <span slot="label">Don't show this message again</span>
        </v-checkbox>
      </v-col>
    </v-row>
  </cc-solo-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'
import { UserProfile } from '@/user'

export default Vue.extend({
  name: 'welcome-dialog',
  data: () => ({
    welcomeMessageUrl: 'https://compcon-text-assets.s3.amazonaws.com/welcome.json',
    title: '',
    body: '',
    hash: '',
    noshow: true,
  }),
  computed: {
    profile(): UserProfile {
      const store = getModule(UserStore, this.$store)
      return store.UserProfile
    },
  },
  watch: {
    noshow(newval) {
      if (!this.profile) return
      if (newval) this.profile.WelcomeHash = this.hash
      else this.profile.WelcomeHash = ''
    },
    profile(newval) {
      if (!this.profile) return
      if (newval.WelcomeHash !== undefined)
        fetch(this.welcomeMessageUrl, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        })
          .then(res => res.json())
          .then(content => {
            this.title = content.title
            this.body = content.body
            this.hash = content.body
              .split('')
              .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
              .toString()
          })
          .then(() => {
            if (localStorage.getItem('cc-welcome-hash') === this.hash) return
            if (this.hash !== this.profile.WelcomeHash) {
              this.$refs.dialog.show()
              this.setHash()
            }
          })
          .catch(err => {
            console.error('There was an issue downloading the latest welcome message.', err)
          })
    },
  },
  methods: {
    setHash() {
      if (this.noshow) {
        localStorage.setItem('cc-welcome-hash', this.hash)
        this.profile.WelcomeHash = this.hash
      } else {
        localStorage.removeItem('cc-welcome-hash')
        this.profile.WelcomeHash = ''
      }
    },
  },
})
</script>
