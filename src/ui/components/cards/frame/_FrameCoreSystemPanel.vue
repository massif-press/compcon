<template>
  <div>
    <span class="heading h2 text-text">{{ cs.Name }}</span>
    <p v-html-safe="cs.Description" class="flavor-text px-3 pb-4" />

    <div v-if="cs.PassiveName">
      <span class="heading sub">PASSIVE {{ cs.PassiveName ? ` - ${cs.PassiveName}` : '' }}</span>
      <div class="light-panel pa-2 clipped mb-2 mx-3">
        <p v-if="cs.PassiveEffect" v-html-safe="cs.PassiveEffect" class="body-text mb-1 px-3" />
        <v-row no-gutters justify="center">
          <v-col cols="auto">
            <cc-action
              v-for="(a, i) in cs.PassiveActions"
              :action="a"
              :panel="$vuetify.display.lgAndUp" />
          </v-col>
        </v-row>
      </div>
    </div>

    <v-row>
      <v-col cols="auto">
        <span class="heading sub">ACTIVE {{ cs.ActiveName ? ` - ${cs.ActiveName}` : '' }}</span>
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
      <div v-html-safe="cs.ActiveEffect" class="body-text mb-1 px-3" />
      <cc-action
        v-for="a in cs.ActiveActions"
        :action="a"
        :panel="$vuetify.display.lgAndUp"
        class="ma-2" />
    </div>

    <div v-if="cs.IntegratedEquipment.length || cs.Deployables.length" class="heading sub">
      CORE INTEGRATED EQUIPMENT
    </div>
    <v-row v-if="cs.IntegratedEquipment.length" no-gutters justify="center">
      <v-col v-for="(x, i) in cs.IntegratedEquipment">
        <cc-integrated-info :item="x" :panel="!mobile" />
      </v-col>
    </v-row>

    <v-row v-if="cs.Deployables.length" no-gutters justify="center">
      <v-col v-for="(d, i) in cs.Deployables" cols="auto">
        <cc-deployable-info :deployable="d" panel class="ma-2" />
      </v-col>
    </v-row>

    <cc-tags :tags="cs.Tags" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'frame-core-system-panel',
  props: {
    cs: {
      type: Object,
      required: true,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
