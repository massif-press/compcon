<template>
  <v-list>
    <v-tooltip>
      <template #activator="{ props }">
        <v-list-item v-bind="!expanded && props" @click="$emit('open-dice-roller')">
          <template #prepend>
            <v-icon icon="mdi-dice-d20-outline" />
          </template>
          Dice Roller
        </v-list-item>
      </template>
      Dice Roller
    </v-tooltip>
    <v-tooltip>
      <template #activator="{ props }">
        <v-list-item v-bind="!expanded && props" @click="$emit('open-table-index')">
          <template #prepend>
            <v-icon icon="mdi-table-multiple" />
          </template>
          Rollable Tables
        </v-list-item>
      </template>
      Rollable Tables
    </v-tooltip>
    <v-divider class="my-2" />
    <v-tooltip>
      <template #activator="{ props }">
        <v-list-item
          v-bind="!expanded && props"
          :class="getBgClass('encounter-info')"
          @click="selectPanel('encounter-info')">
          <template #prepend>
            <v-icon icon="cc:encounter" />
          </template>
          Encounter Info
        </v-list-item>
      </template>
      Encounter Info
    </v-tooltip>
    <v-tooltip>
      <template #activator="{ props }">
        <v-list-item
          v-bind="!expanded && props"
          :class="getBgClass('gm-notes')"
          @click="selectPanel('gm-notes')">
          <template #prepend>
            <v-icon icon="mdi-card-text-outline" />
          </template>
          GM Notes
        </v-list-item>
      </template>
      GM Notes
    </v-tooltip>
    <v-divider class="my-2" />
    <v-tooltip max-width="300">
      <template #activator="{ props }">
        <v-list-item
          v-bind="!expanded && props"
          :class="getBgClass('reference-tag')"
          @click="selectPanel('reference-tag')">
          <template #prepend>
            <v-icon icon="mdi-tag" />
          </template>
          Tag Reference
        </v-list-item>
      </template>
      List tags present on characters or equipment in this encounter
    </v-tooltip>
    <v-tooltip>
      <template #activator="{ props }">
        <v-list-item
          v-bind="!expanded && props"
          :class="getBgClass('quick-reference')"
          @click="selectPanel('quick-reference')">
          <template #prepend>
            <v-icon icon="mdi-format-list-group" />
          </template>
          Combat Quick Reference
        </v-list-item>
      </template>
      Combat Quick Reference
    </v-tooltip>
    <v-divider class="my-2" />
    <v-tooltip>
      <template #activator="{ props }">
        <v-list-item
          v-bind="!expanded && props"
          :class="getBgClass('options')"
          @click="selectPanel('options')">
          <template #prepend>
            <v-icon icon="mdi-cog" />
          </template>
          Settings & Overrides
        </v-list-item>
      </template>
      Settings & Overrides
    </v-tooltip>
  </v-list>
  <div style="height: 50px" />
</template>

<script>
import GmDiceRoller from './GmDiceRoller.vue';
import RollableTableIndex from './RollableTableIndex.vue';
export default {
  name: 'gm-encounter-tool-palette',
  components: {
    GmDiceRoller,
    RollableTableIndex,
  },
  props: {
    expanded: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: String,
      default: '',
    },
  },
  emits: ['select-panel', 'open-dice-roller', 'open-table-index'],
  methods: {
    selectPanel(panel) {
      this.$emit('select-panel', panel);
    },
    getBgClass(panel) {
      return this.selected === panel ? 'bg-primary' : '';
    },
  },
};
</script>
