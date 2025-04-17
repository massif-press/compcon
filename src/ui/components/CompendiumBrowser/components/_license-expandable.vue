<template>
  <v-expansion-panel v-for="item in items" flat tile :height="mobile ? 50 : 80">
    <v-expansion-panel-title :id="item.ID" class="hover-parent py-0 pr-0 pl-3" hide-actions flat>
      <template #default="{ expanded }">
        <v-row
          :align="mobile ? 'center' : 'start'"
          no-gutters
          style="position: absolute; top: 0; bottom: 0; left: 0; right: 0"
          class="gradient-background py-2"
          :class="{ mobile: mobile, selected: selected?.ID === item.ID }">
          <v-col class="px-2" cols="auto">
            <div class="text-cc-overline">{{ item.Frame.Source }}</div>
            <div class="heading h2 font-weight-bold">
              {{ item.Frame.Name }}
            </div>
          </v-col>
          <v-col cols="auto" md="12" class="px-2 ml-auto">
            <cc-chip
              v-for="f in item.Frame.MechType"
              :size="mobile ? 'x-small' : 'small'"
              bg-color="primary"
              variant="elevated"
              class="ma-1">
              {{ f }}
            </cc-chip>
          </v-col>
        </v-row>
        <div
          class="img"
          :class="expanded && !mobile ? 'img-expanded' : 'img-hover'"
          :style="getBgStyle(item)" />
      </template>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-alert
        v-if="item && item.Prerequisite"
        variant="outlined"
        density="compact"
        class="text-center mx-10 mt-2 mb-n1"
        color="warning">
        <div v-if="item.Prerequisite.cumulative">
          This License requires at least
          {{ item.Prerequisite.min_rank }} cumulative Ranks of
          {{ item.Prerequisite.source }} licenses
        </div>
        <div v-else>
          This License requires at least one other
          {{ item.Prerequisite.source }} License at Rank {{ item.Prerequisite.min_rank }} or above
        </div>
      </v-alert>

      <cc-license-panel
        :license="item"
        :ranked="isRanked"
        :rank="isRanked ? getControllerRank(item) : undefined" />

      <v-row dense>
        <v-col v-if="getControllerRank(item)" cols="12" md="">
          <cc-button
            block
            size="x-small"
            color="error"
            prepend-icon="mdi-minus"
            @click="$emit('remove', item)">
            Remove {{ item.Name }} {{ 'I'.repeat(getControllerRank(item)) }}
          </cc-button>
        </v-col>

        <v-col v-if="getControllerRank(item) < item.Unlocks.length && selectable" cols="12" md="">
          <cc-button
            block
            :disabled="!controller.IsMissingLicenses"
            size="small"
            color="success"
            prepend-icon="mdi-plus"
            @click="$emit('add', item)">
            Unlock {{ item.Name }} {{ 'I'.repeat(getControllerRank(item) + 1) }}
          </cc-button>
        </v-col>
      </v-row>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script>
import { License } from '@/class';

export default {
  name: 'cc-license-expandable',
  props: {
    items: {
      type: Array,
      required: true,
    },
    controller: {
      type: Object,
      required: false,
    },
    selectable: {
      type: Boolean,
    },
    selected: {
      type: Object,
      required: false,
    },
  },
  emits: ['add', 'remove'],
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    isRanked() {
      return !!this.controller;
    },
  },
  methods: {
    getBgStyle(item) {
      let style = `background-image: url('${item.Frame.DefaultImage}');`;
      if (this.mobile)
        style += `height:50px; width:100%; background-position: top ${item.Frame.YPosition}% left calc(50% + 8vw);`;
      else
        style += `height:80px; width:100%; background-position: top ${item.Frame.YPosition}% left calc(50% + 8vw)`;
      return style;
    },
    getControllerRank(item) {
      if (!this.controller) return 0;
      return this.controller.getLicenseRank(item.Name);
    },
  },
};
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(
    to right,
    rgba(var(--v-theme-surface), 1),
    rgba(var(--v-theme-surface), 0.75),
    rgba(var(--v-theme-surface), 0.15),
    rgba(var(--v-theme-surface), 0)
  );
}

.gradient-background.mobile {
  background: linear-gradient(
    to right,
    rgba(var(--v-theme-surface), 1),
    rgba(var(--v-theme-surface), 0.55),
    rgba(var(--v-theme-surface), 1)
  );
}

.img {
  transition: all 0.25s ease-in-out;
}

.img-expanded {
  filter: brightness(115%) saturate(1.1);
}

.selected {
  background: linear-gradient(
    to right,
    rgba(var(--v-theme-primary), 0.5),
    rgba(var(--v-theme-primary), 0.25),
    rgba(var(--v-theme-primary), 0.15),
    rgba(var(--v-theme-primary), 0)
  );
}
</style>
