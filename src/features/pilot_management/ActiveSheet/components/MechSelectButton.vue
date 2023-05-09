<template>
  <v-menu offset-y>
    <template #activator="{ props }">
      <v-btn variant="outlined" small color="secondary" v-bind="props">Change Mech</v-btn>
    </template>
    <v-list two-line subheader>
      <div class="heading h2 text-white primary py-0 px-2">Available Mechs</div>
      <v-list-item v-for="mech in mechs" @click="$emit('select', mech)">
        <v-list-item-icon class="ma-0 mr-2 mt-3">
          <cc-logo size="large" :source="mech.Frame.Manufacturer" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <span :class="mech.Destroyed ? 'text-decoration-line-through text--disabled' : ''">
              {{ mech.Name }}
            </span>
          </v-list-item-title>
          <v-list-item-subtitle>{{ mech.Frame.Source }} {{ mech.Frame.Name }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'mech-select-button',
  props: {
    mechs: {
      type: Array,
      required: true,
    },
  },
};
</script>
