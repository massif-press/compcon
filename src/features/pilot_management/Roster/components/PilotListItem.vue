<template>
  <div id="pc-wrapper" class="my-1" @click="selectable ? $emit('select', pilot) : toPilotSheet()">
    <v-card
      tile
      color="primary"
      style="position: absolute; z-index:5"
      class="overlay clipped-square-invert"
      min-width="108px"
      min-height="108px"
    >
      <div id="interior" class="clipped-square-invert">
        <v-img :src="pilot.Portrait" position="top" height="108px" />
      </div>
    </v-card>
    <div id="banner" style="width: 100%">
      <div
        style="width: 100%;display: flex;justify-content: space-between;"
        class="overlay primary"
      >
        <div class="heading callsign" style="margin-left: 108px; display: inline-block;">
          {{ pilot.Callsign }}
        </div>
        <edit-menu style="display: inline-block; padding-right: 10px;" dense :pilot="pilot" />
      </div>
      <div style="border-top: 0!important;  min-height: 72px; " class="light-panel clipped">
        <div style="margin-left: 108px; padding-left: 8px;">
          <p class="flavor-text pt-1">
            <span class="subtle--text">>[</span>
            <b class="stark--text">{{ pilot.Name }}</b>
            <span class="subtle--text">]</span>
            <span class="subtle--text">STATUS [</span>
            <span :class="`${statusColor(pilot.Status)}--text`">{{ pilot.Status }}</span>
            <span class="subtle--text">] -</span>
            <span class="text--text">
              {{ pilot.Background.Name }}
            </span>
            <b class="success--text">LL: {{ pilot.Level }}</b>
            <cc-slashes />
            <span class="text--text">
              [ H:{{ pilot.MechSkills.Hull }} A:{{ pilot.MechSkills.Agi }} S:{{
                pilot.MechSkills.Sys
              }}
              E:{{ pilot.MechSkills.Eng }} ]
            </span>
          </p>
          <p v-if="pilot.ActiveMech" class="flavor-text mb-0 pb-2 mt-n1">
            <span class="subtle--text">UNB::CAV (LNCR)</span>
            <cc-slashes />
            <span class="text--text">
              {{ pilot.ActiveMech.Frame.Source }} {{ pilot.ActiveMech.Frame.Name }}
            </span>
            <span class="subtle--text">[</span>
            <span class="text--text font-weight-bold">{{ pilot.ActiveMech.Name }}</span>
            <span class="subtle--text">]</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import EditMenu from '../../PilotSheet/components/PilotEditMenu.vue'

export default Vue.extend({
  name: 'pilot-list-item',
  components: {
    EditMenu,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    selectable: {
      type: Boolean,
    },
  },
  methods: {
    toPilotSheet() {
      this.$router.push(`pilot/${this.pilot.ID}`)
    },
    statusColor(status: string): string {
      switch (status.toLowerCase()) {
        case 'active':
          return 'success'
          break
        case 'mia':
        case 'kia':
          return 'error'
        default:
          return 'text'
          break
      }
    },
  },
})
</script>

<style scoped>
#pc-wrapper {
  position: relative;
  /* min-height: 150px; */
  min-width: 100%;
  cursor: pointer;
}

.callsign {
  color: white;
  max-height: 32px;
  min-height: 32px;
  line-height: 28px;
}

#interior {
  position: absolute;
  top: 2px;
  left: 2px;
  bottom: 2px;
  right: 2px;
  background-color: var(--v-panel-base);
}

.overlay {
  filter: brightness(70%);
  transition: filter 0.3s ease-in-out;
}

#pc-wrapper:hover .overlay {
  filter: brightness(100%);
}
</style>
