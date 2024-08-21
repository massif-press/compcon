<template>
  <v-btn-toggle
    v-model="internalValue"
    mandatory
    divided
    variant="plain"
    border
    color="accent"
    density="compact"
    style="width: 100%; height: 30px"
    class="mb-2">
    <v-tooltip v-for="g in options.groups" :text="groupTooltip(g)" location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          :value="g"
          icon
          size="small"
          :style="`width: ${100 / (options.groups.length + 1)}%`">
          <v-icon size="25" :icon="groupIcon(g)" />
        </v-btn>
      </template>
    </v-tooltip>
    <v-tooltip text="No Grouping" location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          value="none"
          size="small"
          icon
          :style="`width: ${100 / (options.groups.length + 1)}%`">
          <v-icon icon="mdi-cancel" />
        </v-btn>
      </template>
    </v-tooltip>
  </v-btn-toggle>
</template>

<script lang="ts">
export default {
  name: 'browser-group-toggle',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  computed: {
    internalValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  emits: ['update:modelValue'],
  methods: {
    groupIcon(i: string) {
      switch (i) {
        case 'source':
          return 'cc:manufacturer';
        case 'lcp':
          return 'cc:content_manager';
        case 'type':
          return 'cc:generic_item';
        case 'license':
          return 'cc:license';
        case 'role':
          return 'cc:role_support';
        case 'featureType':
          return 'cc:npc_feature';
        case 'origin':
          return 'cc:npc_template';
        default:
          return '';
      }
    },
    groupTooltip(i: string) {
      switch (i) {
        case 'source':
          return 'Group by Source';
        case 'lcp':
          return 'Group by LCP';
        case 'license':
          return 'Group by License';
        case 'type':
          return 'Group by Item Subtype';
        case 'role':
          return 'Group by NPC Role';
        case 'featureType':
          return 'Group by Feature Type';
        case 'origin':
          return 'Group by Origin';
        default:
          return '';
      }
    },
  },
};
</script>
