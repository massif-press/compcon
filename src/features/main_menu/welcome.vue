<template>
  <cc-solo-dialog ref="dialog" no-confirm large :title="title" @close="setHash()">
    <div class="mt-2 body-text text--text" v-html="body" />
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
import gistApi from '@/io/apis/gist'
import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'
import { UserProfile } from '@/user'

export default Vue.extend({
  name: 'welcome-dialog',
  data: () => ({
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
      if (newval) this.profile.WelcomeHash = this.hash
      else this.profile.WelcomeHash = ''
    },
  },
  mounted() {
    gistApi
      .getMessage()
      .then((response: any) => {
        if (!response || !response.files) {
          this.title = 'ERR'
          this.body = 'Unable to download message'
        } else {
          const content = JSON.parse(response.files['welcome.json'].content)
          this.title = content.title
          this.body = content.body
          this.hash = content.hash
          if (content.hash !== this.profile.WelcomeHash) {
            this.$refs.dialog.show()
          }
        }
      })
      .catch(err => {
        console.error('There was an issue downloading the latest welcome message.', err)
      })
  },
  methods: {
    setHash() {
      if (this.noshow) this.profile.WelcomeHash = this.hash
      else this.profile.WelcomeHash = ''
    },
  },
})
</script>
