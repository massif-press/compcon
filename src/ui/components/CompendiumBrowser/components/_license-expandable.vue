<template>
  <v-expansion-panel v-for="item in items" flat tile :height="mobile ? 50 : 80">
    <v-expansion-panel-title class="hover-parent py-0 pr-0 pl-3" hide-actions flat>
      <template #default="{ expanded }">
        <v-row
          :align="mobile ? 'center' : 'start'"
          no-gutters
          style="position: absolute; top: 0; bottom: 0; left: 0; right: 0"
          class="gradient-background py-2"
          :class="{ mobile: mobile }">
          <v-col class="px-2" cols="auto">
            <div class="text-cc-overline">{{ (item as License).Frame.Source }}</div>
            <div class="heading h2 font-weight-bold">
              {{ (item as License).Frame.Name }}
            </div>
          </v-col>
          <v-col cols="auto" md="12" class="px-2 ml-auto">
            <cc-chip
              v-for="f in (item as License).Frame.MechType"
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
          :style="getBgStyle(item as License)" />
      </template>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <cc-license-panel :license="item" />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script lang="ts">
import { License } from '@/class';

export default {
  name: 'cc-license-expandable',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
  methods: {
    getBgStyle(item: License) {
      let style = `background-image: url('${item.Frame.DefaultImage}');`;
      if (this.mobile)
        style += `height:50px; width:100%; background-position: top ${item.Frame.YPosition}% left calc(50% + 8vw);`;
      else
        style += `height:80px; width:100%; background-position: top ${item.Frame.YPosition}% left calc(50% + 8vw)`;
      return style;
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
</style>
