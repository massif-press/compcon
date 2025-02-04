<template>
  <div class="sidePanel">
    <cc-panel style="height: 100%">
      <div v-html-safe="body" class="mt-2 body-text text-text" />
      <v-row no-gutters align="end" justify="end">
        <v-col cols="auto">
          <v-checkbox v-model="noShow" color="secondary" hide-details density="compact">
            <span slot="label">Don't show this message again</span>
          </v-checkbox>
        </v-col>
      </v-row>
    </cc-panel>
  </div>
</template>

<script lang="ts">
import { UserStore } from '@/stores';

export default {
  name: 'welcome-dialog',
  data: () => ({
    welcomeMessageUrl: 'https://compcon-text-assets.s3.amazonaws.com/welcome.json',
    title: '',
    body: '',
    hash: '',
    noShow: true,
  }),
  computed: {
    profile() {
      return UserStore().User;
    },
  },
  watch: {
    noShow(newVal) {
      if (!this.profile) return;
      if (newVal) this.profile.WelcomeHash = this.hash;
      else this.profile.WelcomeHash = '';
    },
    profile(newVal) {
      if (!this.profile) return;
      if (newVal.WelcomeHash !== undefined)
        fetch(this.welcomeMessageUrl, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'cache-control': 'no-cache',
          },
        })
          .then((res) => res.json())
          .then((content) => {
            this.title = content.title;
            this.body = content.body;
            this.hash = content.body
              .split('')
              .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
              .toString();
          })
          .then(() => {
            if (localStorage.getItem('cc-welcome-hash') === this.hash) return;
            if (this.hash !== this.profile.WelcomeHash) {
              (this.$refs.dialog as any).show();
              this.setHash();
            }
          })
          .catch((err) => {
            console.error('There was an issue downloading the latest welcome message.', err);
          });
    },
  },
  methods: {
    setHash() {
      if (this.noShow) {
        localStorage.setItem('cc-welcome-hash', this.hash);
        this.profile.WelcomeHash = this.hash;
      } else {
        localStorage.removeItem('cc-welcome-hash');
        this.profile.WelcomeHash = '';
      }
    },
  },
};
</script>

<style scoped>
.sidePanel {
  position: absolute;
  top: 12vh;
  left: 700px;
  right: 5vw;
  bottom: 8vh;
  z-index: 2;
}
</style>
