<template>
  <cc-solo-dialog ref="dialog" icon="cc:pilot" no-confirm title="Edit Pilot level">
    <v-card-text>
      <v-alert icon="mdi-alert" variant="outlined" prominent color="error">
        Editing this Pilot's level may prevent certain achievements from being unlocked with this
        Pilot. If you want to use this Pilot to unlock related achievements normally, use the Level
        Up wizard instead.
      </v-alert>

      <v-alert class="mt-2">
        This tool skips the level up wizard. Pilot attributes gained through levelling up, such as
        skill triggers, licenses, talents, mech skills, and CORE bonuses will have to be updated
        manually
      </v-alert>

      <v-row justify="center" align="center" class="text-center mt-2">
        <v-col cols="auto">
          <div class="text-caption">CURRENT LEVEL:</div>
          <div class="heading h1 py-3">
            {{ pilot.Level }}
          </div>
        </v-col>

        <v-col cols="auto" class="mx-3">
          <v-icon size="60">mdi-arrow-right</v-icon>
        </v-col>

        <v-col cols="auto">
          <div class="text-caption">NEW LEVEL:</div>
          <v-select
            v-model="newLevel"
            :items="levels"
            type="number"
            hide-details
            density="compact"
            variant="outlined"
            class="heading h2" />
        </v-col>
      </v-row>

      <v-row v-if="newLevel !== null" class="ma-4">
        <v-col class="ml-5 mr-5">
          <v-btn
            block
            color="primary"
            x-large
            :disabled="newLevel === 0 || newLevel === pilot.Level"
            @click="setLevel">
            Set Pilot Level
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </cc-solo-dialog>
</template>

<script lang="ts">
import { Rules } from '@/class';

export default {
  name: 'level-edit-dialog',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    alert: true,
    newLevel: 0,
    levels: Array.from(Array(Rules.MaxPilotLevel + 1).keys()),
  }),
  methods: {
    show() {
      (this.$refs.dialog as any).show();
      this.alert = true;
      this.newLevel = this.pilot.Level;
    },
    hide() {
      (this.$refs.dialog as any).hide();
    },
    setLevel() {
      this.pilot.Level = (this.newLevel as Number) || 0;
      this.hide();
    },
  },
};
</script>
