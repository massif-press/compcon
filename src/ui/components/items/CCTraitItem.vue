<template>
  <cc-panel :title-color="color" :title="trait.Name" height="100%">
    <template v-if="trait.Use" #toolbar-items>
      <v-chip
        v-if="trait.Use !== 'Mission'"
        size="small"
        flat
        tile
        prepend-icon="mdi-timer-sync-outline">
        {{ trait.Use }}
      </v-chip>
    </template>
    <p v-html-safe="trait.Description" />
    <cc-action v-for="a in trait.Actions" :action="a" :panel="!mobile" class="my-2" />
    <cc-deployable-info
      v-for="d in trait.Deployables"
      :deployable="d"
      :panel="!mobile"
      class="my-2" />
    <cc-integrated-info v-for="x in trait.Integrated" :item="x" :panel="!mobile" class="my-2" />
  </cc-panel>
</template>

<script lang="ts">
export default {
  name: 'cc-trait-item',
  props: {
    trait: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
