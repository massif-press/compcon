<template>
  <cc-alert
    icon="mdi-battery-high"
    :title="cs.Name"
    class="mb-2"
    :color="color"
    icon-color="lime"
    prominent
    variant="tonal">
    <template #title>
      <span class="heading h2 text-stark">
        {{ cs.Name }}
      </span>
      <cc-dialog
        v-if="terse"
        icon="mdi-battery-high"
        :color="color"
        :title="`${frame.Name} Core System`">
        <template #activator="{ open }">
          <v-icon
            icon="mdi-information-slab-box-outline"
            size="small"
            class="fade-select mt-n2"
            end
            @click="open" />
        </template>
        <p v-html-safe="cs.Description" class="flavor-text pa-3" />
      </cc-dialog>
    </template>

    <p v-if="!terse" v-html-safe="cs.Description" class="flavor-text px-3 mb-3" />

    <!-- TODO: these must accept data actions -->
    <v-row dense v-if="cs.PassiveName">
      <v-col cols="auto">
        <span class="heading h3 text-accent">
          <v-chip color="primary" flat tile size="small" variant="elevated" class="mr-1">
            PASSIVE
          </v-chip>
          {{ cs.PassiveName || '' }}
        </span>
      </v-col>
    </v-row>
    <div class="light-panel pa-2 clipped mb-2 mx-3">
      <p v-if="cs.PassiveEffect" v-html-safe="cs.PassiveEffect" class="text-text mb-1 px-3" />
      <v-row no-gutters justify="center">
        <v-col cols="auto">
          <cc-action
            v-for="(a, i) in cs.PassiveActions"
            :action="a"
            :panel="$vuetify.display.lgAndUp" />
        </v-col>
      </v-row>
    </div>

    <v-row dense>
      <v-col cols="auto">
        <span class="heading h3 text-accent">
          <v-chip color="lime" flat tile size="small" variant="elevated" class="mr-1">
            ACTIVE
          </v-chip>
          {{ cs.ActiveName || '' }}
        </span>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <cc-chip
          size="small"
          variant="elevated"
          :bgColor="`action--${cs.Activation.toLowerCase()}`">
          {{ cs.Activation.toUpperCase() }}
        </cc-chip>
      </v-col>
    </v-row>
    <div class="light-panel pa-2 clipped mx-3 mt-1">
      <div v-html-safe="cs.ActiveEffect" class="text-text mb-1 px-3" />
      <cc-action
        v-for="a in cs.ActiveActions"
        :action="a"
        :panel="$vuetify.display.lgAndUp"
        class="ma-2" />
    </div>

    <div
      v-if="cs.IntegratedEquipment.length || cs.Deployables.length"
      class="heading h3 text-accent">
      CORE INTEGRATED EQUIPMENT
    </div>
    <v-row v-if="cs.IntegratedEquipment.length" no-gutters justify="center">
      <v-col v-for="x in cs.IntegratedEquipment">
        <cc-integrated-info :item="x" :panel="!terse && !mobile" />
      </v-col>
    </v-row>

    <v-row v-if="cs.Deployables.length" no-gutters justify="center">
      <v-col v-for="(d, i) in cs.Deployables" cols="auto">
        <cc-deployable-info :deployable="d" panel class="ma-2" />
      </v-col>
    </v-row>

    <cc-tags :tags="cs.Tags" />
  </cc-alert>
</template>

<script lang="ts">
export default {
  name: 'core-system-panel',
  props: {
    frame: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      default: 'panel',
    },
    terse: {
      type: Boolean,
    },
  },
  computed: {
    cs() {
      return this.frame.CoreSystem;
    },
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
