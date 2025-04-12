<template>
  <div class="text-black pa-2">
    <v-row dense align="start">
      <v-col class="mr-4 mt-n2" cols="auto">
        <div class="heading h2">
          {{ item.Name }}
        </div>
        <div class="text-caption mt-n2">
          <span v-if="item.Title">{{ item.Title }}</span>
          <cc-slashes v-if="item.Title && item.Alias" class="px-1" />
          <span v-if="item.Alias">({{ item.Alias }})</span>
        </div>
      </v-col>
      <v-col cols="auto ml-auto">
        <v-chip v-if="item.Pronouns" label size="small" class="mx-1">
          {{ item.Pronouns }}
        </v-chip>
        <v-chip v-if="item.FactionType" label size="small" class="mx-1">
          {{ item.FactionType }}
        </v-chip>
      </v-col>
    </v-row>

    <v-row dense class="no-print-break">
      <v-col>
        <div v-if="item.Description" class="pl-3" v-html-safe="item.Description" />
      </v-col>
      <v-col cols="4" v-if="options.include.some((x) => x.title === 'Include Image')">
        <div
          :style="`background-image: url('${item.Portrait}');`"
          style="height: 300px; width: 100%; background-position: top 0%; background-size: cover" />
      </v-col>
    </v-row>
  </div>

  <fieldset v-if="item.NarrativeController.Relationships.length > 0" class="mb-1 mx-1 pa-1">
    <legend
      class="text-overline text-primary px-1"
      style="line-height: 14px; border: 1px solid grey; border-radius: 3px">
      Relationships
    </legend>
    <div v-for="r in item.NarrativeController.Relationships" class="pl-2 no-print-break">
      <b v-text="r.name" />
      <v-chip class="mx-2" size="x-small">{{ r.relationship }}</v-chip>
      <div v-html-safe="r.notes" class="pl-2" />
    </div>
  </fieldset>

  <div class="mt-n3">
    <fieldset
      v-if="
        options.include.some((x) => x.title === 'Additional Detail') &&
        item.NarrativeController.TextItems.length
      "
      class="mx-1 my-2 px-3">
      <div v-for="t in item.NarrativeController.TextItems">
        <div class="font-weight-bold mb-n2 no-print-break" v-text="t.header" />
        <div v-html-safe="t.body" class="pl-2" />
      </div>
    </fieldset>

    <div
      v-if="
        options.include.some((x) => x.title === 'Clocks') && item.NarrativeController.Clocks.length
      "
      class="mx-1 my-2">
      <v-card
        v-for="c in item.NarrativeController.Clocks"
        variant="outlined"
        class="text-caption px-2 pb-1 no-print-break">
        <div class="font-weight-bold text-caption" v-text="c.Title" />
        <v-row no-gutters>
          <v-col v-for="n in c.Segments" class="px-1">
            <blank-line :height="20" />
          </v-col>
        </v-row>
        <div v-if="c.Description" class="font-weight-bold text-caption" v-text="'Description'" />
        <div v-html-safe="c.Description" class="pl-2" />
        <div v-if="c.Resolution" class="font-weight-bold text-caption" v-text="'Resolution'" />
        <div v-html-safe="c.Resolution" class="pl-2" />
      </v-card>
    </div>

    <div
      v-if="
        options.include.some((x) => x.title === 'Tables') && item.NarrativeController.Tables.length
      "
      class="mx-1 my-2">
      <v-card
        v-for="t in item.NarrativeController.Tables"
        variant="outlined"
        class="text-caption px-2 no-print-break">
        <div class="font-weight-bold text-caption" v-text="t.Title" />
        <div v-html-safe="t.Description" class="pl-2" />
        <v-row dense v-for="r in t.Results">
          <v-col cols="auto">
            <b>{{ r.min }}-{{ r.max }}</b>
          </v-col>
          <v-col>{{ r.result }}</v-col>
        </v-row>
      </v-card>
    </div>

    <fieldset
      v-if="options.include.some((x) => x.title === 'Append Lined Section')"
      class="mx-1 my-2 px-3 no-print-break">
      <div class="mb-4"><notes :rows="16" lined /></div>
    </fieldset>

    <fieldset
      v-if="options.include.some((x) => x.title === 'Append Unlined Section')"
      class="mx-1 my-2 px-3 no-print-break">
      <div class="mb-4"><notes :rows="16" /></div>
    </fieldset>
  </div>
</template>

<script lang="ts">
import BlankLine from '@/features/gm/npc_roster/print/components/blank/line.vue';
import Notes from '@/features/gm/npc_roster/print/components/blank/notes.vue';

export default {
  name: 'item-print',
  components: {
    BlankLine,
    Notes,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  computed: {
    landscape() {
      return this.options.orientation === 'landscape';
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
}

.p-stat {
  font-size: 34px;
}

fieldset {
  padding: 0 4px;
  height: 100%;
  border-radius: 3px;
  border-color: rgb(var(--v-theme-grey-lighten2));
}
</style>
