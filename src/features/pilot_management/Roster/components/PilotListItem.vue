<template>
  <div id="pc-wrapper" class="my-1" @click="selectable ? $emit('select', pilot) : !dragging ? toPilotSheet() : null">
    <v-card
      tile
      color="primary"
      style="position: absolute; z-index: 5"
      class="overlay clipped-square-invert"
      :min-width="mobile ? '75px' : '108px'"
      :min-height="mobile ? '75px' : '108px'"
    >
      <div id="interior" class="clipped-square-invert">
        <v-img :src="pilot.Portrait" position="top" :height="mobile ? '75px' : '108px'" />
      </div>
    </v-card>
    <div id="banner" style="width: 100%">
      <div
        style="width: 100%; display: flex; justify-content: space-between; align-content: center"
        class="overlay primary"
      >
        <div
          class="heading callsign"
          :style="`margin-left: ${mobile ? '75px' : '108px'}; display: inline-block;`"
        >
          {{ pilot.Callsign }}
          <cc-tooltip
            v-if="!pilot.IsLocallyOwned"
            inline
            title="Remote Pilot"
            content="This pilot is registered to another user, changes made locally will be overwritten by remote changes on sync"
          >
            <v-icon right dark small class="fadeSelect">mdi-cloud-check-outline</v-icon>
          </cc-tooltip>
        </div>
        <edit-menu style="display: inline-block; padding-right: 10px" dense :pilot="pilot" />
      </div>
      <div
        :style="`border-top: 0!important;  min-height: ${mobile ? '44px' : '72px'};`"
        class="light-panel clipped"
      >
        <div :style="`margin-left: ${mobile ? '75px' : '108px'}; padding-left: 8px;`" class="mt-n1">
          <p class="flavor-text">
            <span v-show="!mobile">
              <span class="subtle--text">>[</span>
              <b class="stark--text">{{ pilot.Name }}</b>
              <span class="subtle--text">]</span>
              <span class="subtle--text">STATUS [</span>
              <span :class="`${statusColor(pilot.Status)}--text`">{{ pilot.Status }}</span>
              <span class="subtle--text">] -</span>
              <span class="text--text">
                {{ pilot.Background.Name }}
              </span>
            </span>
            <b class="success--text">LL: {{ pilot.Level }}</b>
            <cc-slashes v-show="$vuetify.breakpoint.mdAndUp" />
            <span class="text--text">
              [ H:{{ pilot.MechSkills.Hull }} A:{{ pilot.MechSkills.Agi }} S:{{
                pilot.MechSkills.Sys
              }}
              E:{{ pilot.MechSkills.Eng }} ]
            </span>
          </p>
          <p v-if="pilot.ActiveMech && !mobile" class="flavor-text mb-0 pb-2 mt-n1">
            <span class="subtle--text">UNB::CAV (LNCR)</span>
            <cc-slashes />
            <span class="text--text">
              {{ pilot.ActiveMech.Frame.Source }} {{ pilot.ActiveMech.Frame.Name }}
            </span>
            <span class="subtle--text">[</span>
            <span class="text--text font-weight-bold">{{ pilot.ActiveMech.Name }}</span>
            <span class="subtle--text">]</span>
          </p>
          <div v-else-if="pilot.ActiveMech" class="mt-n6">
            <span class="overline">
              {{ pilot.ActiveMech.Frame.Source }} {{ pilot.ActiveMech.Frame.Name }}
            </span>
          </div>
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
    dragging: {
      type: Boolean,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown
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
