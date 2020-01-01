<template>
  <v-row dense class="pa-0">
    <v-col class="pa-0">
      <cc-skill-item :bonus="bonus" :skill="skill" />
    </v-col>
    <v-col cols="auto">
      <div class="ml-auto mr-auto">
        <cc-tooltip simple content="Increase Skill Bonus" inline>
          <v-btn large color="secondary" icon :disabled="!canAdd" @click="$emit('add')">
            <v-icon x-large>cci-accuracy</v-icon>
          </v-btn>
        </cc-tooltip>
        <cc-tooltip simple content="Decrease Skill Bonus" inline>
          <v-btn large color="error" icon :disabled="!canRemove" @click="$emit('remove')">
            <v-icon x-large>cci-difficulty</v-icon>
          </v-btn>
        </cc-tooltip>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'skill-select-item',
  props: {
    skill: {
      type: Object,
      required: true,
    },
    canAdd: {
      type: Boolean,
      required: true,
    },
    canRemove: {
      type: Boolean,
      required: true,
    },
    bonus: {
      type: Number,
      required: false,
      default: 0,
    },
  },
})
</script>
