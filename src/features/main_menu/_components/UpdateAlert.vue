<template>
  <div style="z-index: 10">
    <div class="abs">
      <div style="position: absolute; right: 5vw; z-index: 11">
        <v-btn color="primary" outlined small @mouseenter="$emit('hover')" @click="expand">
          <v-icon left small>
            {{ expanded ? 'mdi-chevron-right' : 'mdi-information-outline' }}
          </v-icon>
          {{ expanded ? 'Hide' : 'View' }} Changelog
        </v-btn>
      </div>
    </div>
    <transition name="slide" mode="out-in">
      <div v-if="expanded" id="panel">
        <changelog-panel :loading="loading" :changelog="changelog" :err="err" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import gistApi from '@/io/apis/gist'
import ChangelogPanel from './ChangelogPanel.vue'

export default Vue.extend({
  name: 'update-alert',
  components: { ChangelogPanel },
  data: () => ({
    expanded: false,
    loading: false,
    changelog: {},
    err: null,
    canUpdate: false,
  }),

  created() {
    gistApi
      .getChangelog()
      .then((response: any) => {
        this.loading = false
        if (!response || !response.files) {
          this.err = true
        } else {
          this.err = false
          this.changelog = JSON.parse(response.files['changelog.json'].content)
        }
      })
      .catch(() => {
        this.loading = false
        this.err = true
      })
  },
  methods: {
    expand() {
      this.$emit('expand')
      this.expanded = !this.expanded
    },
  },
})
</script>

<style scoped>
.abs {
  position: absolute;
  top: 10px;
  right: 0px;
}

#panel {
  position: absolute;
  z-index: 9;
  right: 0vw;
  top: 75px;
}
</style>
