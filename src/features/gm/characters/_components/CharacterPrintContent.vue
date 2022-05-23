<template>
  <div>
    <div>
      <v-card flat light tile class="print-main px-6 py-3">
        <v-row dense justify="space-between" align="start">
          <v-col>
            <span class="heading h3">{{ item.Name }}</span>
          </v-col>
          <v-col cols="auto">
            <v-chip v-for="(l, i) in item.Labels" :key="l + i" small outlined label v-html="l" />
          </v-col>
        </v-row>

        <div v-if="item.NarrativeController.TextItems.length">
          <v-row v-for="(s, i) in item.Sections" :key="`section_${i}`" dense>
            <v-col>
              <v-row no-gutters justify="space-between">
                <v-col cols="auto">
                  <div class="heading h3">
                    {{ s.header }}
                  </div>
                </v-col>
                <v-col cols="auto"></v-col>
              </v-row>
              <v-col cols="12">
                <p v-html-safe="s.body" />
              </v-col>
            </v-col>
          </v-row>
        </div>
        <cc-clock
          v-for="(c, i) in item.NarrativeController.Clocks"
          :key="`${item.Name}_clock_${i}`"
          :clock="c"
          class="mx-1 my-2"
          print
        />
        <div v-if="item.NarrativeController.Tables.length">
          <cc-rollable-table
            v-for="(t, i) in item.Tables"
            :key="`${item.Name}_table_${i}`"
            :table="t"
            class="mx-1 my-2"
            print
          />
        </div>
        <div v-if="item.Notes">
          <v-divider class="my-2" />
          <div class="caption">GM NOTES</div>
          <p v-html-safe="item.Notes" />
        </div>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'npc-print-content',
  props: { item: { type: Object, required: true } },
})
</script>

<style scoped>
.caption {
  font-size: 14px;
}

.small-header {
  font-weight: bold;
  line-height: 0px;
  margin-bottom: -6px;
}

fieldset {
  padding: 0 4px;
  height: 100%;
  border-radius: 3px;
  border-color: var(--v-grey-lighten2);
}

@media print {
  .no-print,
  .no-print * {
    display: none !important;
  }

  .print-main {
    margin-top: -40px !important;
  }

  .print-main * {
    font-size-adjust: 0.5;
  }
}
</style>
