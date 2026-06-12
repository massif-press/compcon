<template>
  <div style="position: relative"
    class="li-top-element">
    <div class="light"
      style="position: absolute; top: 0; left: -15px; bottom: 0; width: 10px" />
    <v-row no-gutters
      class="lighten-select"
      :class="mobile ? 'mb-2' : 'mb-4'"
      @click="toPilotSheet()">
      <v-col cols="auto"
        style="height: 100%; border: rgb(var(--v-theme-primary)) 3px double">
        <v-card>
          <cc-avatar v-if="pilot.PortraitController.Avatar"
            :avatar="pilot.PortraitController.Avatar"
            :size="mobile ? 75 : 150" />
          <cc-img v-else-if="pilot.PortraitController.Portrait"
            :src="pilot.PortraitController.Portrait"
            cover
            position="top center"
            :min-width="mobile ? '75px' : '150px'"
            :height="mobile ? '75px' : '150px'" />
        </v-card>
      </v-col>
      <v-col style="position: relative; ">
        <v-toolbar density="compact"
          class="cToolbar"
          :height="mobile ? '40' : '46'">
          <v-row no-gutters
            align="center"
            class="px-2">
            <v-col v-if="!mobile"
              cols="auto"
              class="d-flex align-center pr-1">
              <v-icon icon="mdi-drag"
                size="23.5"
                class="drag-handle"
                aria-label="Drag to reorder"
                tabindex="0"
                style="cursor: move; opacity: 0.4; transition: opacity 0.2s"
                @click.stop />
            </v-col>
            <v-col class="heading text-white">
              <cc-remote-hover :item="pilot" />
              {{ pilot.Callsign }}
            </v-col>
            <v-col cols="auto">
              <cc-config-tip :actor="pilot" />
            </v-col>

            <v-col cols="auto"
              class="mr-n2">
              <edit-menu density="compact"
                :pilot="pilot" />
            </v-col>
          </v-row>
        </v-toolbar>

        <div v-if="mobile"
          class="detail-row-mobile pa-2">
          <b class="text-stark">{{ pilot.Name }}</b>
          <div class="text-cc-overline">
            <span class="text-disabled">{{ $t('pm.roster.licenseLevel') }}</span>
            {{ pilot.Level }}
          </div>
        </div>

        <div v-else
          class="px-3">
          <v-row class="detail-row">
            <v-col class="flavor-text">
              <div class="mt-1 ml-n2">
                <span class="text-disabled">>[</span>
                <b class="text-stark">{{ pilot.Name }}</b>
                <span class="text-disabled">]</span>
                <span class="text-disabled">&nbsp;{{ $t('pm.roster.status') }}</span>
                <span :class="`text-${statusColor(pilot.Status)}`">{{ pilot.Status }}</span>
                <span class="text-disabled">] -&nbsp;</span>
                <b class="text-success">&nbsp;{{ $t('pm.roster.llColon') }} {{ pilot.Level }}&nbsp;</b>
                <cc-slashes />
                <span class="text-text">
                  [
                  <b>
                    {{ $t('pm.roster.h') }}
                    <span class="text-weight-normal text-accent">
                      {{ pilot.MechSkillsController.MechSkills.Hull }}
                    </span>
                  </b>
                  <b>
                    {{ $t('pm.roster.a') }}
                    <span class="text-weight-normal text-accent">
                      {{ pilot.MechSkillsController.MechSkills.Agi }}
                    </span>
                  </b>
                  <b>
                    {{ $t('pm.roster.s2') }}
                    <span class="text-weight-normal text-accent">
                      {{ pilot.MechSkillsController.MechSkills.Sys }}
                    </span>
                  </b>
                  <b>
                    {{ $t('pm.roster.e') }}
                    <span class="text-weight-normal text-accent">
                      {{ pilot.MechSkillsController.MechSkills.Eng }}
                    </span>
                  </b>
                  ]
                </span>
              </div>
              <v-divider class="my-1" />
              <pilot-list-item-details :pilot="pilot" />
            </v-col>
          </v-row>
        </div>
        <div style="position: absolute; bottom: 2px; right: 2px">
          <cc-brew-info :controller="pilot.BrewController" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { Pilot } from '@/classes/pilot/Pilot'
import EditMenu from '../../PilotSheet/components/PilotEditMenu.vue'
import { PilotStore } from '@/stores'
import PilotListItemDetails from './_pilotListItemDetails.vue'

const props = defineProps<{ pilot: Pilot; selectable?: boolean }>()

const emit = defineEmits<{ goTo: [id: string] }>()

const { smAndDown: mobile } = useDisplay()

function toPilotSheet() {
  emit('goTo', props.pilot.ID)
}

function statusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success'
    case 'mia':
    case 'kia':
    case 'err':
      return 'error'
    default:
      return 'text'
  }
}

function move(direction: 'top' | 'up' | 'down' | 'bottom') {
  PilotStore().ReorderPilot(props.pilot as Pilot, direction)
}
</script>

<style scoped>
@import '@/ui/style/pilot-list-item.css';

.li-top-element:hover .drag-handle {
  opacity: 0.8 !important;
}
</style>
