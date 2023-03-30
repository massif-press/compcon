<template>
  <div>
    <v-row density="compact">
      <v-col cols="12" class="mt-2">
        <span class="overline"
          >{{ mech.MechLoadoutController.ActiveLoadout.Name }} Loadout</span
        >
        <v-btn
          small
          right
          icon
          class="fade-select"
          @click="showLoadout = !showLoadout"
        >
          <v-icon
            small
            v-html="showLoadout ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
          />
        </v-btn>
      </v-col>
      <v-scroll-y-reverse-transition mode="out-in">
        <cc-active-mech-loadout v-if="showLoadout" :mech="mech" :rest="rest" />
      </v-scroll-y-reverse-transition>
    </v-row>
  </div>
</template>

<script lang="ts">
export default {
  name: 'active-mode-loadout',
  props: {
    mech: {
      type: Object,
      required: true,
    },
    rest: {
      type: Boolean,
    },
  },
  data: () => ({
    showLoadout: true,
  }),
};
</script>
