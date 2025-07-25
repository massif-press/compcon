<template>
  <v-col cols="auto" class="pa-0" @click="$emit('clicked')">
    <v-menu open-on-hover bottom offset-y open-delay="100">
      <template #activator="{ props }">
        <div style="position: relative" class="pa-1 mx-n2" v-bind="props">
          <talent-emblem :talent="talent" size="small" />
          <div
            v-if="rank"
            class="bg-primary flavor-text text-center"
            style="font-size: 12px; position: absolute; bottom: 0; right: 0; padding: 0px 3px">
            {{ 'I'.repeat(Number(rank)) }}
          </div>
        </div>
      </template>
      <v-card flat tile max-width="400px">
        <v-toolbar flat density="compact" tile color="primary" height="20px">
          <div class="heading h3 px-4">
            {{ talent.Name }}
          </div>
        </v-toolbar>
        <v-card-text v-if="rank" class="pa-2">
          <div v-for="n in rank">
            <b>{{ talent.Rank(n).Name }}</b>
            <cc-slashes class="px-2" />
            <span class="text-cc-overline text-disabled">RANK {{ 'I'.repeat(Number(n)) }}</span>
            <talent-rank-contents :talent-rank="talent.Rank(n)" />
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-col>
</template>

<script lang="ts">
import TalentEmblem from './_TalentEmblem.vue';
import TalentRankContents from './_TalentRankContents.vue';

export default {
  name: 'talent-micro',
  components: { TalentEmblem, TalentRankContents },
  props: {
    talent: { type: Object, required: true },
    rank: { type: [Number, String], required: false, default: null },
  },
};
</script>
