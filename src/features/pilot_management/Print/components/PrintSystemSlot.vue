<template>
  <div class="no-print-break">
    <!-- Blank system slot -->
    <div v-if="blank">
      <v-row dense>
        <v-col>
          <div class="caption text-grey">SYSTEM</div>
          <blank-line :height="28" />
        </v-col>
        <v-col cols="1">
          <div class="caption text-grey">USES</div>
          <blank-line :height="28" />
        </v-col>
        <v-col cols="1">
          <div class="caption text-grey">SP COST</div>
          <blank-line :height="28" />
        </v-col>
      </v-row>
      <blank-line :height="80"
        class="my-2" />
    </div>

    <!-- Populated system slot -->
    <v-card v-else
      variant="outlined"
      class="pa-1 my-1 no-print-break"
      style="position: relative; border-color: rgba(0, 0, 0, 0.2)">
      <v-row>
        <v-col cols="auto">
          <v-icon icon="cc:system"
            class="mt-n1"
            start />
          <b class="heading h4"
            style="line-height: 0">{{ system.Name }}</b>
        </v-col>
        <v-col cols="auto">
          <span class="text-overline"
            style="line-height: 0">{{ system.Source }} {{ system.Type }}</span>
        </v-col>
        <v-col v-if="system.Uses"
          cols="auto"
          class="ml-auto">
          <v-icon v-for="n in system.getTotalUses(mech?.LimitedBonus || 0)"
            size="small"
            color="primary">
            mdi-hexagon-outline
          </v-icon>
        </v-col>
      </v-row>
      <div class="pl-7">
        <p v-if="system.Effect"
          class="caption mb-n1"
          v-html-safe="system.Effect" />
        <print-action :actions="system.Actions" />
        <print-deployable :deployables="system.Deployables" />
        <tag-block v-if="options"
          :tags="system.Tags"
          :options="options"
          mech />
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'PrintSystemSlot',
  props: {
    system: {
      type: Object,
      default: null
    },
    mech: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    },
    blank: {
      type: Boolean,
      default: false
    }
  }
}
</script>