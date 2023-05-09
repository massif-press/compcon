<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y>
    <template #activator="{ props }">
      <v-icon size="18" icon :dark="dark" class="fade-select" v-bind="props">
        mdi-circle-edit-outline
      </v-icon>
    </template>

    <v-card tile min-width="50vw">
      <v-card-text class="pa-2">
        <slot />
      </v-card-text>
      <v-divider />
      <v-card-actions class="px-2 py-1">
        <v-btn text @click="menu = false">Cancel</v-btn>
        <cc-btn class="ml-auto" color="success" text @click="save()">Save</cc-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'cc-string-edit',
  props: {
    dark: {
      type: Boolean,
      required: false,
    },
  },
  data: () => ({
    menu: false,
  }),
  methods: {
    save() {
      this.$emit('save');
      this.menu = false;
    },
  },
};
</script>
