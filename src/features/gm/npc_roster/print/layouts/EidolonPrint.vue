<template>
  <div class="text-black pa-2">
    <v-row dense align="start">
      <v-col class="mr-4 mt-n2" cols="auto">
        <div class="heading h2">
          {{ npc.Name }}
        </div>
        <div class="my-n2">
          <div class="text-caption">
            Tier {{ npc.Tier }}
            <cc-slashes />
            Class {{ npc.Class }}
          </div>
        </div>
      </v-col>
      <v-col cols="auto ml-auto">
        <v-chip label size="small" :prepend-icon="npc.TagIcon" class="mx-1">EIDOLON</v-chip>
      </v-col>
    </v-row>
    <div v-if="options.include.includes('gm summary')" class="text-caption mt-1 pl-3">
      {{ npc.GmDescription }}
    </div>

    <v-row dense>
      <v-col>
        <div v-if="npc.Description" class="mt-1 pl-3" v-html-safe="npc.Description" />
      </v-col>
      <v-col cols="4" v-if="options.include.includes('include image')">
        <div
          :style="`background-image: url('${npc.Portrait}');`"
          style="height: 300px; width: 100%; background-position: top 0%; background-size: cover" />
      </v-col>
    </v-row>

    <fieldset class="mx-1 pa-1 mb-2">
      <legend
        class="text-overline text-primary px-1"
        style="line-height: 14px; border: 1px solid grey; border-radius: 3px">
        Persistent Traits
      </legend>
      <div v-for="t in persistentTraits">
        <b class="text-caption font-weight-bold">
          <v-icon size="small" icon="cc:trait" class="mt-n1" />
          {{ t.name }}
        </b>
        <div v-html-safe="t.detail" class="pl-3 caption" />
      </div>
    </fieldset>

    <fieldset class="mx-1 pa-1 mb-2" v-for="l in npc.Layers">
      <legend
        class="text-overline text-primary px-1"
        style="line-height: 14px; border: 1px solid grey; border-radius: 3px">
        LAYER
        <cc-slashes />
        {{ l.Layer.Name }}
      </legend>
      <div>
        <div v-html-safe="l.Description" class="pl-3 caption" />
        <print-npc-stats :item="l" :bonuses="l.FeatureController.Bonuses" :tier="npc.Tier" />
        <div v-html-safe="l.Layer.Rules" class="pl-3 caption" />
        <div
          v-for="(f, i) in l.Layer.Features.filter((x) => !x.HideActive)"
          class="mt-1 pl-3 caption">
          <npc-feature-print :feature="f" :tier="npc.Tier" />
          <v-divider v-if="i + 1 < l.Layer.Features.length" class="mt-1" />
        </div>
      </div>

      <v-divider />
      <v-chip size="small" class="mt-1">
        <b>New Shards: {{ l.Layer.Shards.Count }}</b>
      </v-chip>
      <div v-html-safe="l.Layer.Shards.Detail" class="pl-3 caption" />
      <print-npc-stats :item="l.Layer.Shards" :bonuses="[]" :tier="npc.Tier" hide-zero />
      <div
        v-for="(f, i) in l.Layer.Shards.Features.filter((x) => !x.HideActive)"
        class="mt-1 pl-3 caption">
        <npc-feature-print :feature="f" :tier="npc.Tier" />
        <v-divider v-if="i + 1 < l.Layer.Shards.Features.length" class="mt-1" />
      </div>
    </fieldset>

    <div v-if="options.include.includes('gm notes') && npc.Note.length" class="mb-1 mt-3">
      <div class="text-overline text-primary" style="line-height: 0">GM NOTES</div>
      <div v-html-safe="npc.Note" class="mt-1 pl-3 caption" />
    </div>
  </div>

  <div class="mt-n3">
    <fieldset
      v-if="
        options.include.includes('additional detail') && npc.NarrativeController.TextItems.length
      "
      class="mx-1 my-2 px-3">
      <div v-for="t in npc.NarrativeController.TextItems">
        <div class="font-weight-bold mb-n2" v-text="t.header" />
        <div v-html-safe="t.body" class="pl-2" />
      </div>
    </fieldset>

    <div
      v-if="options.include.includes('clocks') && npc.NarrativeController.Clocks.length"
      class="mx-1 my-2">
      <v-card
        v-for="c in npc.NarrativeController.Clocks"
        variant="outlined"
        class="text-caption px-2 pb-1">
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
      v-if="options.include.includes('tables') && npc.NarrativeController.Tables.length"
      class="mx-1 my-2">
      <v-card
        v-for="t in npc.NarrativeController.Tables"
        variant="outlined"
        class="text-caption px-2">
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

    <fieldset v-if="options.include.includes('append lined section')" class="mx-1 my-2 px-3">
      <div class="mb-4"><notes :rows="16" lined /></div>
    </fieldset>

    <fieldset v-if="options.include.includes('append unlined section')" class="mx-1 my-2 px-3">
      <div class="mb-4"><notes :rows="16" /></div>
    </fieldset>
  </div>
</template>

<script lang="ts">
import blankLine from '../components/blank/line.vue';
import notes from '../components/blank/notes.vue';
import NpcFeaturePrint from './components/NpcFeaturePrint.vue';
import PrintNpcStats from './components/PrintNpcStats.vue';
import persistent_traits from '@/classes/npc/eidolon/persistent_traits.json';

export default {
  name: 'npc-print',
  components: {
    blankLine,
    notes,
    NpcFeaturePrint,
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
    persistentTraits() {
      return persistent_traits;
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
