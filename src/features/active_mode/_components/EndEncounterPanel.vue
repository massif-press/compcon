<template>
  <v-dialog max-width="900px">
    <template #activator="{ props: activatorProps }">
      <v-btn flat
        block
        variant="text"
        color="accent"
        prepend-icon="mdi-progress-check"
        @click="deriveStatuses(); activatorProps.onClick($event)">
        {{ $t('active.endEnc.endEncounter') }}
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar height="40"
          color="primary"
          class="text-center">
          <div class="heading h3 mt-1">
            <v-icon icon="mdi-clock-end"
              class="mt-n1 ml-2"
              start />
            {{ $t('active.endEnc.confirmEndEncounter') }}
          </div>
          <v-spacer />
          <v-btn icon
            @click="isActive.value = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div class="text-cc-overline">// {{ $t('active.encMgr.afterActionReport') }}</div>
          <v-card color="background"
            class="mt-1 mb-4">
            <v-card-text class="pa-2">
              <v-row v-for="c in actionReport"
                :key="c.id"
                dense
                align="center">
                <v-col><cc-chip :bg-color="c.pilotStatus ? 'info' : 'primary'"
                    size="large"
                    flat
                    tile><span class="heading h3 text-text pr-3">{{ c.name ??
                      c.actor?.CombatController?.CombatName
                      }}</span></cc-chip></v-col>
                <v-col v-if="c.status"
                  cols="auto"><v-combobox v-model="c.status"
                    flat
                    tile
                    hide-details
                    density="compact"
                    min-width="250"
                    :items="npcStatusTypes" /></v-col>
                <v-col v-if="c.pilotStatus"
                  cols="auto"><v-combobox v-model="c.pilotStatus"
                    flat
                    tile
                    hide-details
                    density="compact"
                    min-width="250"
                    :items="pilotStatusTypes" /></v-col>
                <v-col v-if="c.mechStatus"
                  cols="auto"><v-combobox v-model="c.mechStatus"
                    flat
                    tile
                    hide-details
                    density="compact"
                    min-width="250"
                    :items="mechStatusTypes" /></v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <div class="text-cc-overline">// {{ $t('common.result') }}</div>
          <v-row>
            <v-col>
              <v-combobox v-model="result"
                :items="['PC VICTORY', 'ENEMY VICTORY', 'STALEMATE']"
                variant="outlined"
                density="compact" />
            </v-col>
          </v-row>

          <v-divider class="my-4" />
          <v-slide-y-reverse-transition>
            <cc-alert v-if="confirm"
              color="warning"
              variant="outlined"
              :title="$t('active.endEnc.confirmEndEncounter')"
              icon="mdi-alert-outline"
              class="mb-4">
              <p class="text-text">{{ confirmMessage }}</p>
            </cc-alert>
          </v-slide-y-reverse-transition>
          <v-row>
            <v-col>
              <cc-button v-if="!confirm"
                block
                size="small"
                color="primary"
                @click="confirm = true"><span class="text-lowercase">{{
                  $t('active.endEnc.endEncounter') }}</span></cc-button>
              <cc-button v-else
                block
                size="small"
                color="warning"
                @click="$emit('end', result)"><span class="text-lowercase">{{
                  $t('active.endEnc.confirmEndEncounter') }}</span></cc-button>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PilotStatus, NpcStatus, MechStatus } from '@/classes/enums'

const props = defineProps<{
  actionReport: any[]
  confirmMessage: string
}>()

defineEmits<{
  'end': [result: string]
}>()

const confirm = ref(false)
const result = ref('PC VICTORY')
const pilotStatusTypes = Object.values(PilotStatus)
const npcStatusTypes = Object.values(NpcStatus)
const mechStatusTypes = Object.values(MechStatus)

// derive each combatant's status from its live combat state as the dialog opens
function deriveStatuses() {
  for (const row of props.actionReport) {
    const actor = row.actor?.CombatController?.RootActor
    if (!actor) continue
    if (actor.ItemType !== 'Pilot') {
      row.status = actor.CombatController.IsDestroyed ? NpcStatus.Destroyed : NpcStatus.Operational
    } else {
      row.pilotStatus = PilotStatus.Active
      if (actor.IsDead) row.pilotStatus = PilotStatus.KIA
      if (
        actor.CombatController.StatController.CurrentStats['hp'] !==
        actor.CombatController.StatController.MaxStats['hp']
      )
        row.pilotStatus = PilotStatus.Injured
      const mech = actor.ActiveMech
      row.mechStatus = MechStatus.Operational
      if (mech.CombatController.AIControl && mech.CombatController.InCascade)
        row.mechStatus = MechStatus.Cascade
      if (mech.CombatController.IsDestroyed) row.mechStatus = MechStatus.Destroyed
      if (mech.CombatController.ReactorDestroyed) row.mechStatus = MechStatus.ReactorMeltdown
    }
  }
}
</script>
