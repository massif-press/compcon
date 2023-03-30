<template>
  <cc-titled-panel :title="bond.Name" density="compact">
    <span slot="items" class="flavor-text text-white" v-html="bond.LcpName" />
    <slot name="button" />
    <v-row class="text-text">
      <v-col>
        <div class="text-overline mb-n1 font-weight-bold">MAJOR IDEALS</div>
        <ul>
          <li v-for="(s, i) in bond.MajorIdeals" v-text="s" />
        </ul>
      </v-col>
      <v-col>
        <div class="text-overline mb-n1 font-weight-bold">MINOR IDEALS</div>
        <ul>
          <li v-for="(s, i) in bond.MinorIdeals" v-text="s" />
        </ul>
      </v-col>
    </v-row>
    <v-row class="text-text">
      <v-col v-for="(q, i) in bond.Questions">
        <div class="text-overline mb-n1 font-weight-bold" v-text="q.question" />
        <ul>
          <li v-for="(o, j) in q.options" v-text="o" />
        </ul>
      </v-col>
    </v-row>
    <v-divider class="my-4" />
    <div class="heading h3 my-3">BOND POWERS</div>
    <v-row class="mb-3 px-6">
      <v-col xl="6" sm="12" v-for="(p, i) in bond.Powers">
        <v-card
          variant="outlined"
          class="pa-2"
          style="background-color: rgb(var(--v-theme-background-darken-2))"
        >
          <v-row no-gutters>
            <v-col>
              <div
                v-if="p.veteran"
                class="heading h4 text-accent"
                v-text="`${p.name} (Veteran Power)`"
              />
              <div
                v-else-if="p.master"
                class="heading h4 text-exotic"
                v-text="`${p.name} (Master Power)`"
              />
              <div v-else class="heading h4" v-text="p.name" />
            </v-col>
            <v-col v-if="p.frequency" cols="auto">
              <v-chip
                v-if="p.frequency"
                small
                color="primary"
                v-text="p.frequency"
              />
            </v-col>
          </v-row>
          <div v-if="p.prerequisite" class="caption pa-2 text--disabled">
            <i v-text="p.prerequisite" />
          </div>
          <div class="px-2" v-html-safe="p.description" />
        </v-card>
      </v-col>
    </v-row>
  </cc-titled-panel>
</template>

<script lang="ts">
export default {
  name: 'cc-bond-info',
  props: { bond: { type: Object, required: true } },
};
</script>
