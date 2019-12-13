<template>
  <div style="z-index: 10">
    <div class="abs">
      <div v-if="canUpdate" class="text-right" style="width: 100vw">
        <span class="stat-text pr-2">
          <span class="grey--text">//</span>
          <span class="text-capitalize">Update Available</span>
          <span class="grey--text">//</span>
        </span>
      </div>
      <div style="position: absolute; right: 5vw; z-index: 11">
        <v-btn
          :class="{ pulse: !expanded && canUpdate }"
          large
          fab
          :color="canUpdate ? 'warning' : 'primary'"
          dark
          style="box-shadow: 0 0 0 0"
          @mouseenter="$emit('hover')"
          @click="expand"
        >
          <transition name="spin" mode="out-in">
            <v-icon :key="expanded" x-large>
              {{
                expanded ? 'mdi-chevron-right' : canUpdate ? 'warning' : 'mdi-information-outline'
              }}
            </v-icon>
          </transition>
        </v-btn>
      </div>
    </div>
    <transition name="slide" mode="out-in">
      <div v-if="expanded" id="panel">
        <changelog-panel
          :loading="loading"
          :changelog="changelog"
          :err="err"
          :can-update="canUpdate"
        />
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
    this.canUpdate =
      Vue.prototype.version !== this.changelog.beta &&
      Vue.prototype.version !== this.changelog.stable
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
