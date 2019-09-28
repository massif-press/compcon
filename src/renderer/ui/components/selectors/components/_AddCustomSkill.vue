<template>
  <v-row dense>
    <v-col cols="2">
      <div class="centered text-left pl-3">
        <span class="subheading font-weight-bold">New Custom Skill</span>
      </div>
    </v-col>
    <v-col cols="8" class="ml-12">
      <v-text-field v-model="newSkill" outlined hide-details label="New Skill Trigger" />
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
  }),
  methods: {
    addSkill() {
      this.$emit('add-custom', this.newSkill)
      this.newSkill = ''
    },
  },
})
</script>