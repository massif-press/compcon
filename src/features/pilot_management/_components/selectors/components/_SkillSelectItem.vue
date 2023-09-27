<template>
  <v-row dense class="pa-0" align="center">
    <v-col class="pa-0">
      <cc-skill-item :bonus="bonus" :skill="skill" />
    </v-col>
    <v-col cols="auto">
      <cc-tooltip simple content="Increase Skill Bonus" inline>
        <v-btn
          size="x-small"
          class="mr-1"
          icon
          variant="plain"
          :disabled="!canAdd"
          @click="$emit('add')"
        >
          <v-icon size="40" color="secondary" class="mt-n1">mdi-plus</v-icon>
        </v-btn>
      </cc-tooltip>
      <cc-tooltip simple content="Decrease Skill Bonus" inline>
        <v-btn size="x-small" icon variant="plain" :disabled="!canRemove" @click="$emit('remove')">
          <v-icon size="40" color="error" class="mt-n1">mdi-minus</v-icon>
        </v-btn>
      </cc-tooltip>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
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
};
</script>
