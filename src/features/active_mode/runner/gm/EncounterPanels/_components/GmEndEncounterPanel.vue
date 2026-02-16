<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <v-btn flat
        block
        variant="text"
        color="accent"
        prepend-icon="mdi-progress-check"
        @click="props.onClick($event)">
        End Encounter
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
            Confirm End Encounter
          </div>
          <v-spacer />
          <v-btn icon
            @click="isActive.value = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div class="text-cc-overline">// AFTER-ACTION REPORT</div>
          <v-card color="background"
            class="mt-1 mb-4">
            <v-card-text class="pa-2">
              <v-row v-for="c in actionReport"
                dense
                align="center">
                <v-col><cc-chip :bg-color="c.pilotStatus ? 'info' : 'primary'"
                    size="large"
                    flat
                    tile><span class="heading h3 text-text pr-3">{{ c.name
                      }}</span></cc-chip></v-col>
                <v-col cols="auto"
                  v-if="c.status"><v-combobox v-model="c.status"
                    flat
                    tile
                    hide-details
                    density="compact"
                    min-width="250"
                    :items="npcStatusTypes" /></v-col>
                <v-col cols="auto"
                  v-if="c.pilotStatus"><v-combobox v-model="c.pilotStatus"
                    flat
                    tile
                    hide-details
                    density="compact"
                    min-width="250"
                    :items="pilotStatusTypes" /></v-col>
                <v-col cols="auto"
                  v-if="c.mechStatus"><v-combobox v-model="c.mechStatus"
                    flat
                    tile
                    hide-details
                    density="compact"
                    min-width="250"
                    :items="mechStatusTypes" /></v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <div class="text-cc-overline">// RESULT</div>
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
              title="Confirm End Encounter"
              icon="mdi-alert-outline"
              class="mb-4">
              <p class=text-text>Ending this encounter will close the active instance and send a
                copy to the archive. Archived encounters can not be resumed (but may be restarted).
                Are you sure you want to continue?</p>
            </cc-alert>
          </v-slide-y-reverse-transition>
          <v-row>
            <v-col>
              <cc-button block
                v-if="!confirm"
                size=small
                color="primary"
                @click="confirm = true">end encounter</cc-button>
              <cc-button block
                v-else
                size=small
                color="warning"
                @click="end">Confirm end encounter</cc-button>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { EncounterInstance } from '@/classes/encounter/EncounterInstance';
import { EncounterStore } from '@/stores';
import _ from 'lodash';

export default {
  name: 'DamageMenu',
  props: {
    encounterInstance: {
      type: EncounterInstance,
      required: true,
    },
  },
  data: () => ({
    confirm: false,
    result: 'PC VICTORY',
    pilotStatusTypes: [
      'COMBAT EFFECTIVE',
      'INJURED',
      'KIA',
      'MIA',
      'ESCAPED',
      'DISENGAGED',
    ],
    npcStatusTypes: [
      'OPERATIONAL',
      'DESTROYED',
      'ESCAPED',
      'DISENGAGED',
    ],
    mechStatusTypes: [
      'OPERATIONAL',
      'DESTROYED',
      'DESTROYED - REACTOR MELTDOWN',
    ],
  }),
  computed: {
    actionReport() {
      const report = [] as any[];
      for (const c of this.encounterInstance.Combatants) {
        const actor = c.actor.CombatController.RootActor
        const out = {
          id: actor.ID,
          name: actor.CombatController.CombatName
        } as any;
        if (actor.ItemType !== 'Pilot') {
          out.status = actor.CombatController.IsDestroyed ? 'DESTROYED' : 'OPERATIONAL';
        } else {
          out.pilotStatus = 'COMBAT EFFECTIVE'
          if (actor.IsDead) out.pilotStatus = 'KIA';
          if (actor.CombatController.StatController.CurrentStats['hp'] !== actor.CombatController.StatController.MaxStats['hp']) out.pilotStatus = 'INJURED';

          const mech = actor.ActiveMech;
          out.mechStatus = 'MECH OPERATIONAL';
          if (mech.CombatController.AIControl && mech.CombatController.InCascade) out.mechStatus = 'AI CONTROL - IN CASCADE';
          if (mech.CombatController.IsDestroyed) out.mechStatus = 'MECH DESTROYED';
          if (mech.CombatController.ReactorDestroyed) out.mechStatus = 'MECH DESTROYED - REACTOR MELTDOWN';
        }

        report.push(out);

      }
      return report;
    },
  },
  methods: {
    end() {
      EncounterStore().ArchiveEncounterInstance(this.encounterInstance, JSON.stringify(this.actionReport));
      this.$router.replace('/active-mode/manage-encounters');
    },
  },

};
</script>
