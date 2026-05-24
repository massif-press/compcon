<template>
  <v-row dense
    align="center">
    <v-col>
      <div>
        <cc-text-field v-model="newSkill"
          variant="outlined"
          color="primary"
          density="compact"
          hide-details
          label="New Skill Trigger" />
        <cc-text-area v-model="newDesc"
          class="my-2"
          label="Description" />
        <cc-text-area v-model="newDetail"
          class="my-2"
          label="Detail" />
      </div>
    </v-col>
    <v-col cols="auto"
      md="1"
      class="text-center">
      <div class="mt-2 ml-auto mr-auto">
        <v-tooltip text="Add Skill">
          <template #activator="{ props }">
            <cc-button v-bind="props"
              size="large"
              icon="mdi-plus"
              variant="outlined"
              color="success"
              :disabled="newSkill === '' || !canAdd"
              @click="addSkill" />
          </template>
        </v-tooltip>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import CustomSkill from '@/classes/pilot/components/skill/CustomSkill';
import { Pilot } from '@/classes/pilot/Pilot'

export default {
  name: 'AddCustomSkill',
  props: {
    pilot: { type: Pilot, required: true },
  },
  emits: ['add-custom'],
  data: () => ({
    newSkill: '',
    newDesc: '',
    newDetail: '',
  }),
  computed: {
    canAdd(): boolean {
      const custSkill = new CustomSkill(this.newSkill, this.newDesc, this.newDetail);
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
