<template>
  <v-card tile>
    <v-row>
      <v-col cols="3">
        <div class="centered text-xs-left pl-3">
          <span class="subheading font-weight-bold">New Custom Skill</span>
        </div>
      </v-col>
      <v-col cols="9">
        <v-text-field v-model="newSkill" box hide-details label="New Skill Trigger" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'add-custom-skill',
})
</script>