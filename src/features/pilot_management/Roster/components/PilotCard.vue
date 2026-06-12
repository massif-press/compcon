<template>
  <div class="d-inline-flex"
    :class="small ? 'ma-1' : 'ma-2'"
    :style="`width: ${minWidth};`">
    <v-hover>
      <template #default="{ isHovering, props }">
        <v-card class="card-outline"
          :min-height="minWidth"
          :min-width="minWidth"
          tile
          flat
          style="position: relative"
          v-bind="props"
          @click="toPilotSheet()">
          <v-icon v-if="!small"
            icon="mdi-drag"
            size="18"
            class="drag-handle"
            aria-label="Drag to reorder"
            tabindex="0"
            :style="`position: absolute; top: 36px; left: 4px; cursor: move; z-index: 3; opacity: ${isHovering ? 0.8 : 0.3}; transition: opacity 0.2s;`"
            @click.stop
          />
          <div v-show="!small"
            class="clipped-large background-standard"
            :style="`
              z-index: 2; position: absolute; top: 0; left: -2px; right: -2px; height: ${small ? '25' : '32'
              }px; ${small && isHovering ? 'opacity: 1' : 'opacity: 0.6'
              }; transition: opacity 0.2s;`">
            <div :class="`heading h3 text-white flavor-text ml-2 mt-1`"
              style="letter-spacing: 3px; text-overflow: ellipsis">
              <v-icon v-if="remoteResource"
                size="small">mdi-broadcast</v-icon>
              {{ pilot.Callsign }}
            </div>
          </div>
          <div v-show="!small"
            :class="small ? 'small-triangle' : 'triangle'" />
          <div v-show="!small"
            class="ll text-white"
            style="line-height: 25px">
            <div v-if="!small"
              class="text-overline mb-n1 text-right">{{ $t('pm.sheet.ll') }}</div>
            <div :class="`heading ${small ? 'h3' : 'h2'} mt-n2`">
              {{ pilot.Level.toString().padStart(2, '0') }}
            </div>
          </div>
          <div style="position: relative">
            <cc-img :src="pilot.Portrait"
              position="top center"
              height="100%"
              :aspect-ratio="1"
              cover>
              <v-expand-transition>
                <div v-if="isHovering && !small"
                  class="flavor-text bg-grey-darken-3 pa-3"
                  style="height: 100%; max-width: 100%; opacity: 0.85">
                  <div v-if="remoteResource"
                    class="mt-6"
                    style="letter-spacing: 6px !important">
                    <v-chip label
                      size="x-small">
                      <v-icon start
                        class="mr-3">mdi-broadcast</v-icon>
                      {{ $t('pm.roster.remoteRESOURCE') }}
                    </v-chip>
                  </div>

                  <br v-else />
                  {{ pilot.Name }}
                  <br />
                  <b>{{ pilot.Callsign }}</b>
                  <cc-slashes />
                  <b>{{ pilot.Status }}</b>
                  <v-divider />
                  {{ $t('stats.hull') }} {{ pilot.MechSkillsController.MechSkills.Hull }} {{ $t('stats.agi') }}
                  {{ pilot.MechSkillsController.MechSkills.Agi }} {{ $t('stats.sys') }}
                  {{ pilot.MechSkillsController.MechSkills.Sys }} {{ $t('stats.eng') }}
                  {{ pilot.MechSkillsController.MechSkills.Eng }}
                  <v-divider />
                  <div>
                    <div v-for="s in pilot.TalentsController.Talents" :key="s.Talent.ID">
                      {{ s.Talent.Name }} {{ 'I'.repeat(s.Rank) }}
                    </div>
                    <v-divider />
                    <div v-for="b in pilot.CoreBonusController.CoreBonuses" :key="b.ID">
                      {{ b.Name }}
                    </div>
                  </div>
                </div>
              </v-expand-transition>
            </cc-img>
            <div style="position: absolute; bottom: 2px; left: 2px">
              <cc-brew-info :controller="pilot.BrewController" />
            </div>
          </div>
        </v-card>
      </template>
    </v-hover>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const props = defineProps<{ pilot: any }>()

const emit = defineEmits<{ goTo: [id: string] }>()

const { smAndDown, xs } = useDisplay()

const small = computed(() => smAndDown.value)

const remoteResource = computed(() => props.pilot.SaveController.IsRemote)

const minWidth = computed(() => {
  if (xs.value) return '26vw'
  return small.value ? '22vw' : '17vw'
})

function toPilotSheet() {
  emit('goTo', props.pilot.ID)
}
</script>

<style scoped>
.card-outline {
  border: 1px solid;
  border-color: rgb(var(--v-theme-accent));
}

.card-missing-outline {
  border: 1px solid;
  border-color: rgb(var(--v-theme-error));
}

.background-standard {
  background-color: rgb(var(--v-theme-primary));
}

.background-missing {
  background-color: rgb(var(--v-theme-error));
}

.triangle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 65px 65px;
  z-index: 2;
  border-color: transparent transparent rgb(var(--v-theme-primary)) transparent;
}

.small-triangle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 45px 45px;
  z-index: 2;
  border-color: transparent transparent rgb(var(--v-theme-primary)) transparent;
}

.ll {
  position: absolute;
  bottom: 0;
  right: 4px;
  /* width: 40px; */
  /* height: 40px; */
  z-index: 3;
}
</style>
