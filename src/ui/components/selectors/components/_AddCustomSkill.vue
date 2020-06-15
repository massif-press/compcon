<template>
  <v-row dense>
    <v-col cols="2">
      <div class="centered text-left pl-3">
        <span class="stark--text flavor-text font-weight-bold">NEW CUSTOM TRIGGER</span>
      </div>
    </v-col>
    <v-col cols="8" class="ml-12">
      <v-text-field v-model="newSkill" outlined dense hide-details label="New Skill Trigger" />
      <v-textarea
        v-model="newDesc"
        outlined
        dense
        hide-details
        rows="1"
        auto-grow
        class="pl-4 mt-1"
        label="Description"
      />
      <v-textarea
        v-model="newDetail"
        outlined
        dense
        hide-details
        rows="3"
        auto-grow
        class="pl-4 mt-1"
        label="Detail"
      />
    </v-col>
    <v-col cols="auto" class="text-center">
      <div class="mt-2 ml-auto mr-auto">
        <cc-tooltip simple content="Add Skill">
          <v-btn large icon color="secondary" :disabled="newSkill === ''" @click="addSkill">
            <v-icon x-large>cci-accuracy</v-icon>
          </v-btn>
        </cc-tooltip>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'add-custom-skill',
  data: () => ({
    newSkill: '',
    newDesc: '',
    newDetail: '',
  }),
  methods: {
    addSkill() {
      this.$emit('add-custom', { skill: this.newSkill, description: this.newDesc, detail: this.newDetail })
      this.newSkill = ''
      this.newDesc = ''
      this.newDetail = ''
    },
  },
})
</script>
