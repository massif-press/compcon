<template>
  <v-list>
    <div v-if="pilot">
      <v-tooltip>
        <template #activator="{ props }">
          <v-list-item v-bind="!expanded && props"
            :class="getBgClass('pc')"
            @click="selectPanel('pc')">
            <template #prepend>
              <v-icon icon="cc:pilot" />
            </template>
            Pilot Sheet
          </v-list-item>
        </template>
        Pilot Sheet
      </v-tooltip>
      <v-tooltip>
        <template #activator="{ props }">
          <v-list-item v-bind="!expanded && props"
            :class="getBgClass('deployables')"
            @click="selectPanel('deployables')">
            <template #prepend>
              <v-icon icon="cc:drone" />
            </template>
            Deployables
          </v-list-item>
        </template>
        Deployables
      </v-tooltip>
      <v-divider class="my-2" />
    </div>
    <v-tooltip>
      <template #activator="{ props }">
        <v-list-item v-bind="!expanded && props"
          @click="$emit('open-dice-roller')">
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
        <v-list-item v-bind="!expanded && props"
          @click="$emit('open-table-index')">
          <template #prepend>
            <v-icon icon="mdi-table-multiple" />
          </template>
          Rollable Tables
        </v-list-item>
      </template>
      Rollable Tables
    </v-tooltip>
    <v-divider class="my-2" />
    <v-tooltip v-if="!pilot">
      <template #activator="{ props }">
        <v-list-item v-bind="!expanded && props"
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
        <v-list-item v-bind="!expanded && props"
          :class="getBgClass('notes')"
          @click="selectPanel('notes')">
          <template #prepend>
            <v-icon icon="mdi-card-text-outline" />
          </template>
          Notes
        </v-list-item>
      </template>
      Notes
    </v-tooltip>
    <v-divider class="my-2" />
    <v-tooltip max-width="300">
      <template #activator="{ props }">
        <v-list-item v-bind="!expanded && props"
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
        <v-list-item v-bind="!expanded && props"
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
        <v-list-item v-bind="!expanded && props"
          :class="getBgClass('options')"
          @click="selectPanel('options')">
          <template #prepend>
            <v-icon icon="mdi-cog" />
          </template>
          Settings
        </v-list-item>
      </template>
      Settings
    </v-tooltip>
  </v-list>
  <div style="height: 50px" />
</template>

<script>
export default {
  name: 'gm-tool-palette',
  props: {
    expanded: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: String,
      default: '',
    },
    pilot: {
      type: Boolean
    }
  },
  emits: ['select-panel', 'open-dice-roller', 'open-table-index'],
  methods: {
    selectPanel(panel) {
      if (this.selected === panel) return;
      this.$emit('select-panel', panel);
    },
    getBgClass(panel) {
      return this.selected === panel ? 'bg-primary' : '';
    },
  },
};
</script>
