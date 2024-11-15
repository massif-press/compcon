<template>
  <v-tooltip v-if="missingContent && simple" location="top" max-width="300px">
    <template #activator="{ props }">
      <v-icon v-bind="props" :color="color" size="small">mdi-alert-rhombus</v-icon>
    </template>
    <div class="text-center">
      <div class="font-weight-bold" style="letter-spacing: 3px">MISSING CONTENT</div>
      <v-divider />
      <i class="text-caption">
        This {{ itemType }} is missing necessary LCP data. COMP/CON will not be able to load this
        {{ itemType }} until the missing content is added.
      </i>
    </div>
  </v-tooltip>
  <v-menu v-else-if="missingContent" open-on-hover max-width="450px">
    <template #activator="{ props }">
      <v-icon v-bind="props" color="accent" icon="mdi-alert-rhombus" />
    </template>
    <v-card>
      <v-alert density="compact" color="error" class="rounded-b-0">
        Missing Content Detected
      </v-alert>
      <div v-if="controller && controller.NonfunctionalBrews.length" class="pa-1">
        <cc-missing-content-list :controller="controller" :width="width" />
      </div>
      <v-card-text v-else class="text-caption">
        <span v-if="itemType.toLowerCase === 'eidolon'">
          Eidolons require the installation of the Content Pack provided with
          <strong>No Room for a Wallflower Act 1</strong>
        </span>
        <span v-else>
          COMP/CON is unable to load NPC data without the installation of the NPC Content Pack
          provided with the paid (GM) version of the
          <strong>Lancer Core Book</strong>
        </span>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'cc-brew-info',
  props: {
    item: {
      type: Object,
    },
    simple: {
      type: Boolean,
    },
    width: {
      type: String,
      default: '100%',
    },
    color: {
      type: String,
      default: '',
    },
  },
  computed: {
    controller() {
      return this.item && this.item.BrewController;
    },
    missingContent() {
      return this.controller && this.controller.IsUnableToLoad;
    },
    itemType() {
      return (this.item as any).ItemType.toLowerCase() || 'item';
    },
  },
};
</script>
