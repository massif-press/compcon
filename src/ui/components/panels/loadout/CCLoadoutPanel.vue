<template>
  <div>
    <v-toolbar :color="color" flat :height="mobile ? 22 : 36">
      <v-menu offset-y top>
        <template #activator="{ props }">
          <v-btn size="small" icon variant="plain" v-bind="props">
            <v-icon icon="mdi-menu" />
          </v-btn>
        </template>
        <v-list density="compact">
          <div class="text-overline px-3">Available Loadouts</div>
          <v-list-item
            v-for="l in loadouts"
            :title="(l as Loadout).Name"
            @click="$emit('set-active', l)" />
          <v-divider v-if="!readonly" />
          <v-list-item
            v-if="!readonly"
            prepend-icon="mdi-plus"
            title="Add New Loadout"
            @click="$emit('add-loadout')" />
        </v-list>
      </v-menu>
      <cc-short-string-editor
        :readonly="readonly"
        :placeholder="activeLoadout.Name"
        min-width="250px"
        @set="activeLoadout.Name = $event">
        <span class="heading h3">{{ activeLoadout.Name }}</span>
      </cc-short-string-editor>
      <v-spacer />
      <v-btn
        v-if="!readonly && loadouts.length > 1"
        size="small"
        variant="plain"
        icon
        @click="$emit('remove-loadout')">
        <v-icon icon="mdi-delete" />
      </v-btn>
    </v-toolbar>
    <v-card flat tile variant="outlined" :color="color">
      <v-card-text :class="mobile && 'px-0'">
        <slot />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Loadout } from '@/class';

export default {
  name: 'cc-loadout-panel',
  props: {
    loadouts: {
      type: Array,
      required: true,
    },
    activeLoadout: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    readonly: {
      type: Boolean,
    },
  },
  data: () => ({
    confirmMenu: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
  methods: {
    removeConfirm() {
      this.confirmMenu = false;
      this.$emit('remove-loadout');
    },
  },
};
</script>
