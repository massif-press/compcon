<template>
  <div class="text-black pa-2">
    <v-row dense align="start">
      <v-col class="mr-4 mt-n2" cols="auto">
        <div class="heading h2">
          {{ npc.Name }}
        </div>
      </v-col>
      <v-col cols="auto ml-auto">
        <v-chip label size="small" :prepend-icon="npc.TagIcon" class="mx-1">
          {{ npc.Tag }}
        </v-chip>
      </v-col>
    </v-row>
    <div v-if="options.include.some((x) => x.title === 'GM Notes')" class="text-caption mt-1 pl-3">
      {{ npc.GmDescription }}
    </div>

    <v-row dense class="no-print-break">
      <v-col>
        <print-npc-stats :item="npc" :bonuses="[]" :tier="1" />
        <div v-if="npc.Description" class="mt-1 pl-3" v-html-safe="npc.Description" />
      </v-col>
      <v-col cols="4" v-if="options.include.some((x) => x.title === 'Include Image')">
        <div
          :style="`background-image: url('${npc.Portrait}');`"
          style="height: 300px; width: 100%; background-position: top 0%; background-size: cover" />
      </v-col>
    </v-row>

    <div
      v-if="options.include.some((x) => x.title === 'GM Notes') && npc.Note.length"
      class="mb-1 mt-3 no-print-break">
      <div class="text-overline text-primary" style="line-height: 0">GM NOTES</div>
      <div v-html-safe="npc.Note" class="mt-1 pl-3 caption" />
    </div>
  </div>

  <div class="mt-n3">
    <fieldset
      v-if="
        options.include.some((x) => x.title === 'Additional Detail') &&
        npc.NarrativeController.TextItems.length
      "
      class="mx-1 my-2 px-3 no-print-break">
      <div v-for="t in npc.NarrativeController.TextItems">
        <div class="font-weight-bold mb-n2" v-text="t.header" />
        <div v-html-safe="t.body" class="pl-2" />
      </div>
    </fieldset>

    <div
      v-if="
        options.include.some((x) => x.title === 'Clocks') && npc.NarrativeController.Clocks.length
      "
      class="mx-1 my-2">
      <v-card
        v-for="c in npc.NarrativeController.Clocks"
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
        options.include.some((x) => x.title === 'Tables') && npc.NarrativeController.Tables.length
      "
      class="mx-1 my-2">
      <v-card
        v-for="t in npc.NarrativeController.Tables"
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
import blankLine from '../components/blank/line.vue';
import notes from '../components/blank/notes.vue';
import PrintAction from './components/PrintAction.vue';
import PrintDeployable from './components/PrintDeployable.vue';
import PrintNpcStats from './components/PrintNpcStats.vue';

export default {
  name: 'npc-print',
  components: {
    blankLine,
    notes,
    PrintAction,
    PrintDeployable,
    PrintNpcStats,
  },
  props: {
    npc: {
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
  methods: {
    showTag(id) {
      const hiddenTags = ['tg_hidden', 'tg_unique', 'tg_set_damage_type'];
      return !hiddenTags.includes(id);
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
