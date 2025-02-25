<template>
  <v-row no-gutters align="center">
    <v-col>
      <cc-skill-item :bonus="bonus" :skill="skill" />
    </v-col>
    <v-col cols="auto" class="py-2">
      <span class="px-2">
        <v-tooltip location="top" text="Increase Skill Bonus">
          <template #activator="{ props }">
            <cc-button
              v-bind="props"
              icon="mdi-plus"
              size="small"
              color="success"
              variant="outlined"
              :disabled="!canAdd"
              @click="$emit('add')" />
          </template>
        </v-tooltip>
      </span>
      <div v-if="mobile" class="my-2" />
      <span class="px-2">
        <v-tooltip location="top" text="Decrease Skill Bonus">
          <template #activator="{ props }">
            <cc-button
              v-bind="props"
              icon="mdi-minus"
              size="small"
              color="error"
              variant="outlined"
              :disabled="!canRemove"
              @click="$emit('remove')" />
          </template>
        </v-tooltip>
      </span>
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
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
