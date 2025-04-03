<template>
  <v-row align="center" no-gutters justify="end" :style="mobile && 'margin-top: -12px'">
    <v-col cols="auto">
      <cc-range-element v-if="item.Range" small :range="range" />
      <cc-slashes v-if="item.Range && item.Damage" class="pr-1" />
      <cc-damage-element
        v-if="item.Damage"
        small
        :damage="damage"
        :type-override="item.DamageTypeOverride" />
    </v-col>
    <v-col v-if="item && item.SP" cols="auto" class="pl-3">
      <cc-slashes />
      {{ item.SP }}
      <span style="font-size: 13px; margin-left: -4px">SP</span>
    </v-col>
    <v-col cols="auto" v-if="!readonly">
      <div class="ml-2" style="border-left: 1px solid rgba(155, 155, 155, 0.3)">
        <v-btn
          v-if="item"
          size="x-small"
          icon
          tile
          variant="plain"
          color="error"
          @click.stop="$emit('remove')">
          <v-icon size="20" icon="mdi-delete" />
        </v-btn>
        <v-btn size="x-small" icon tile variant="plain" @click.stop="$emit('swap')">
          <v-icon size="20" :icon="item ? 'mdi-swap-vertical-variant' : 'mdi-add'" />
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'weapon-slot-card',
  props: {
    item: {
      type: Object,
      required: true,
    },
    range: {
      type: Array,
      required: false,
    },
    damage: {
      type: Array,
      required: false,
    },
    readonly: {
      type: Boolean,
    },
  },
  emits: ['remove', 'swap'],
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
