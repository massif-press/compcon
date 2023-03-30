<template>
  <v-row density="compact" align="center">
    <v-col cols="12">
      <div class="centered text-left pl-3">
        <span class="text-stark flavor-text font-weight-bold"
          >NEW CUSTOM TRIGGER</span
        >
      </div>
    </v-col>
    <v-col cols="10" md="">
      <div :class="$vuetify.display.mdAndUp ? 'ml-12 mt-n4' : 'mt-n4'">
        <v-text-field
          v-model="newSkill"
          variant="outlined"
          density="compact"
          hide-details
          label="New Skill Trigger"
        />
        <v-textarea
          v-model="newDesc"
          variant="outlined"
          density="compact"
          hide-details
          rows="1"
          auto-grow
          class="pl-4 mt-1"
          label="Description"
        />
        <v-textarea
          v-model="newDetail"
          variant="outlined"
          density="compact"
          hide-details
          rows="3"
          auto-grow
          class="pl-4 mt-1"
          label="Detail"
        />
      </div>
    </v-col>
    <v-col cols="auto" md="1" class="text-center">
      <div class="mt-2 ml-auto mr-auto">
        <cc-tooltip simple content="Add Skill">
          <v-btn
            :large="$vuetify.display.mdAndUp"
            :small="$vuetify.display.smAndDown"
            icon
            color="secondary"
            :disabled="newSkill === '' || !canAdd"
            @click="addSkill"
          >
            <v-icon x-large>cc:accuracy</v-icon>
          </v-btn>
        </cc-tooltip>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Pilot } from '@/class';
import { CustomSkill } from '@/class';
export default {
  name: 'add-custom-skill',
  props: {
    pilot: Pilot,
  },
  data: () => ({
    newSkill: '',
    newDesc: '',
    newDetail: '',
  }),
  computed: {
    canAdd(): boolean {
      const custSkill = new CustomSkill(
        this.newSkill,
        this.newDesc,
        this.newDetail
      );
      return this.pilot.SkillsController.CanAddSkill(custSkill);
    },
  },
  methods: {
    addSkill() {
      this.$emit('add-custom', {
        skill: this.newSkill,
        description: this.newDesc,
        detail: this.newDetail,
      });
      this.newSkill = '';
      this.newDesc = '';
      this.newDetail = '';
    },
  },
};
</script>
