<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y>
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        flat
        tile
        block
        size="small"
        color="accent"
        height="26px"
        class="ml-n1"
        prepend-icon="mdi-plus-circle-multiple"
        >Generate Instance</v-btn
      >
    </template>
    <v-card border>
      <v-toolbar
        class="heading h3 px-3"
        dense
        height="40px"
        flat
        color="primary"
      >
        Deploy {{ deployable.Name }}</v-toolbar
      >
      <v-divider />
      <v-card-text class="pa-3">
        <div class="mb-2">
          This will generate a new instance of
          <strong>{{ deployable.Name }}</strong> for
          <strong>{{
            actor.Parent ? actor.Parent.Callsign : actor.Name
          }}</strong
          >.
        </div>
        <v-row class="mt-2">
          <v-btn size="small" text @click="menu = false">Cancel</v-btn>
          <v-spacer />
          <v-btn
            size="small"
            flat
            tile
            variant="elevated"
            color="primary"
            @click="deploy"
            >generate</v-btn
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'deploy-button',
  props: {
    deployable: {
      type: Object,
      required: true,
    },
    actor: {
      type: Object,
      required: true,
    },
  },
  emits: ['deploy'],
  data: () => ({
    menu: false,
  }),
  methods: {
    deploy() {
      this.$emit('deploy', this.deployable);
      this.menu = false;
    },
  },
};
</script>
