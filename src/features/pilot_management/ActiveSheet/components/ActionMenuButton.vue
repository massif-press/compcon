<template>
  <v-menu offset-y top>
    <template v-slot:activator="{ props }">
      <v-btn
        class="mx-1"
        :small="$vuetify.display.lgAndUp"
        :x-small="$vuetify.display.smAndDown"
        dark
        :fab="$vuetify.display.lgAndUp || $vuetify.display.smAndDown"
        elevation="0"
        :color="
          available && (baseActions.length || itemActions.length)
            ? color
            : 'grey darken-2'
        "
        v-bind="props"
      >
        <slot name="icon" />
        <span
          v-if="$vuetify.display.md"
          class="pl-2"
          v-html="title.replace(' ACTIONS', '')"
        />
      </v-btn>
    </template>
    <div>
      <v-toolbar
        density="compact"
        flat
        class="heading h3"
        style="min-width: 80px"
      >
        {{ title }}
        <v-spacer />
        <v-btn
          :small="$vuetify.display.lgAndUp"
          :x-small="$vuetify.display.smAndDown"
          icon
          color="accent"
          class="ml-4"
          @click="$emit('open-menu')"
        >
          <v-icon icon="mdi-open-in-new" />
        </v-btn>
      </v-toolbar>
      <v-list class="px-2 py-3" density="compact" color="panel">
        <v-list-item
          v-for="(a, i) in baseActions"
          v-show="allowed.includes(a.ID)"
          @click="$emit('open-dialog', a)"
        >
          <v-list-item-title class="text-button">
            <v-icon start :style="!available && !a.Used ? 'opacity:0.3' : ''">
              {{ a.Used ? 'mdi-check-circle' : a.Icon }}
            </v-icon>
            {{ a.Name }}
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="baseActions.length > 0 && itemActions.length > 0" />
        <v-list-item
          v-for="(a, i) in itemActions"
          v-show="allowed.includes(a.ID)"
          @click="$emit('open-dialog', a)"
        >
          <v-list-item-title class="text-button">
            <v-icon start :style="!available && !a.Used ? 'opacity:0.3' : ''">
              {{ a.Used ? 'mdi-check-circle' : a.Icon }}
            </v-icon>
            {{ a.Name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'action-menu-button',
  props: {
    title: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    actions: {
      type: Array,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
    available: {
      type: Boolean,
    },
  },
  computed: {
    baseActions() {
      return this.actions.filter((x) => !x.IsItemAction);
    },
    itemActions() {
      return this.actions.filter((x) => x.IsItemAction);
    },
    allowed() {
      return this.mech.Pilot.State.AvailableActions;
    },
  },
};
</script>
