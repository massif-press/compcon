<template>
  <div style="z-index: 1000">
    <div class="abs">
      <div v-if="canUpdate" class="text-right" style="width: 100vw">
        <span class="stat-text pr-2">
          <span class="grey--text">//</span>
          <span class="text-capitalize">Update Available</span>
          <span class="grey--text">//</span>
        </span>
      </div>
      <div style="position: absolute; right: 5vw; z-index: 1001">
        <v-btn
          :class="{'pulse' : !expanded && canUpdate}"
          large
          fab
          @mouseenter="$emit('hover')"
          @click="expand"
          :color="canUpdate ? 'warning' : 'primary'"
          dark
          style="box-shadow: 0 0 0 0"
        >
          <transition name="spin" mode="out-in">
            <v-icon
              v-bind:key="expanded"
              x-large
            >{{ expanded ? 'mdi-chevron-right' : canUpdate ? 'warning' : 'mdi-information-outline'}}</v-icon>
          </transition>
        </v-btn>
      </div>
    </div>
    <transition name="slide" mode="out-in">
      <div id="panel" v-if="expanded">
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
import apis from '../../pilot_management/logic/apis'
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
  methods: {
    expand() {
      this.$emit('expand')
      this.expanded = !this.expanded
    },
  },
  created() {
    apis
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
  z-index: 1000;
  right: 0vw;
  top: 75px;
}

.slide-enter-active {
  transition: all 0.3s ease;
}
.slide-leave-active {
  transition: all 0.8s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(100vw);
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0px rgba(244, 155, 11, 0.4);
  }
  100% {
    box-shadow: 0 0 0 35px rgba(0, 0, 0, 0);
  }
}
</style>

