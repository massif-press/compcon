<template>
  <cc-panel :title-color="color"
    :title="trait.Name"
    height="100%">
    <template v-if="trait.Use"
      #toolbar-items>
      <v-chip v-if="trait.Use !== 'Mission'"
        size="small"
        flat
        tile
        prepend-icon="mdi-timer-sync-outline">
        {{ trait.Use }}
      </v-chip>
    </template>
    <p v-html-safe="trait.Description" />
    <div v-if="!combat">
      <cc-action v-for="(a, index) in trait.Actions"
        :key="`action-${index}`"
        :action="a"
        :panel="!mobile"
        class="my-2" />
      <cc-deployable-info v-for="(d, index) in trait.Deployables"
        :key="`deployable-${index}`"
        :deployable="d"
        :panel="!mobile"
        :owner="mech"
        class="my-2" />
      <cc-integrated-info v-for="(x, index) in trait.Integrated"
        :key="`integrated-${index}`"
        :item="x"
        :panel="!mobile"
        class="my-2" />
    </div>
    <slot name="combat" />
  </cc-panel>
</template>

<script lang="ts">
import { useMobile } from '@/mixins/useMobile';
export default {
  name: 'CcTraitItem',
  mixins: [useMobile],
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
    combat: {
      type: Boolean,
    },
    mech: {
      type: Object,
      required: false,
      default: null,
    },
  },
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
