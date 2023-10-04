<template>
  <div>
    <v-toolbar :color="color" flat density="compact">
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
            @click="$emit('set-active', l)"
          />
          <v-divider />
          <v-list-item
            prepend-icon="mdi-plus"
            title="Add New Loadout"
            @click="$emit('add-loadout')"
          />
        </v-list>
      </v-menu>
      <cc-short-string-editor :placeholder="activeLoadout.Name" @set="activeLoadout.Name = $event">
        <span class="heading h3">{{ activeLoadout.Name }}</span>
      </cc-short-string-editor>
    </v-toolbar>
    <v-card flat variant="outlined" class="rounded-0" :color="color">
      <v-card-text>
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
  },
  data: () => ({
    confirmMenu: false,
  }),
  methods: {
    removeConfirm() {
      this.confirmMenu = false;
      this.$emit('remove-loadout');
    },
  },
};
</script>
