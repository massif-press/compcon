<template>
  <div id="pc-wrapper" @click="selectable ? $emit('select', pilot) : toPilotSheet()">
    <v-card
      tile
      color="primary"
      style="position: absolute; z-index:5"
      class="overlay clipped-square-invert"
      min-width="150px"
      min-height="150px"
    >
      <div id="interior" class="clipped-square-invert">
        <v-img :src="pilot.Portrait" position="top" height="150px" />
      </div>
    </v-card>
    <div id="banner" style="width: 100%">
      <div style="width: 100%;display: flex;justify-content: space-between;" class="overlay primary sliced">
        <div class="heading callsign" style="margin-left: 150px; display: inline-block;">{{ pilot.Callsign }}</div>
        <edit-menu style="display: inline-block; padding-right: 30px;" :pilot="pilot" />
      </div>
      <div style="margin-right: 30px; border-top: 0!important" class="light-panel clipped">
        <div style="margin-left: 150px; padding-left: 8px; min-height: 100px">
          <p class="flavor-text mb-0">
            <span class="grey--text">>IDENT//[</span>
            <b class="black--text">{{ pilot.Name }}</b>
            <span class="grey--text">] -</span>
            <span class="grey--text">>STATUS//[</span>
            <span :class="`${statusColor(pilot.Status)}--text`">{{ pilot.Status }}</span>
            <span class="grey--text">] -</span>
            <span class="text--text">
              {{ pilot.Background.Name }}
              <span class="grey--text">&emsp;UNB::LNCR//OPCON_ID > (CHECKSUM OK)</span>
            </span>
          </p>
          <p class="flavor-text mb-0">
            <span class="grey--text">
              >UNB LICENSING BOARD//REGISTRATION STATUS:
              <span class="success--text">
                VALID [
                <b>LL: {{ pilot.Level }}</b>
                ]
              </span>
              <span class="text--text">
                [ H:{{ pilot.MechSkills.Hull }} A:{{ pilot.MechSkills.Agi }} S:{{
                  pilot.MechSkills.Sys
                }}
                E:{{ pilot.MechSkills.Eng }} ]
              </span>
            </span>
          </p>
          <p class="flavor-text mb-0 ml-3">
            <span v-for="(l, i) in pilot.Licenses" :key="i + pilot.ID">
              <span class="grey--text">[ {{ l.license.Source }}</span>
              <b>
                {{ l.license.Name }}
                <span class="success--text">{{ l.Rank }}</span>
              </b>
              <span class="grey--text">]</span>
            </span>
          </p>
          <p v-if="pilot.ActiveMech" class="flavor-text mb-0">
            <span class="grey--text">UNB::LNCR//CAV - ACTIVE FRAME //</span>
            <span class="text--text">
              {{ pilot.ActiveMech.Frame.Source }} {{ pilot.ActiveMech.Frame.Name }}
            </span>
            <span class="grey--text">[</span>
            <span class="text--text font-weight-bold">{{ pilot.ActiveMech.Name }}</span>
            <span class="grey--text">]</span>
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
  min-height: 150px;
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
