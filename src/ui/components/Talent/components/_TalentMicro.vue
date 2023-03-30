<template>
  <v-col cols="auto" class="pa-2" @click="$emit('clicked')">
    <v-menu open-on-hover bottom offset-y open-delay="100">
      <template v-slot:activator="{ props }">
        <div style="position: relative" class="pa-1 mx-n2" v-bind="props">
          <talent-emblem :url="talent.Image" :name="talent.Name" small />
        </div>
      </template>
      <v-card>
        <v-toolbar flat density="compact" tile color="primary">
          <span class="heading h3 text-white">
            {{ talent.Name }}
            <span v-if="rank" class="flavor-text text-white">
              <cc-slashes />
              RANK {{ 'I'.repeat(parseInt(rank)) }}
            </span>
          </span>
          <span v-if="talent.InLcp" class="heading h3 text-white ml-3">{{
            talent.LcpName
          }}</span>
        </v-toolbar>
      </v-card>
    </v-menu>
  </v-col>
</template>

<script lang="ts">
import TalentEmblem from './_TalentEmblem.vue';
export default {
  name: 'talent-micro',
  components: { TalentEmblem },
  props: {
    talent: { type: Object, required: true },
    rank: { type: [Number, String], required: false, default: null },
  },
};
</script>
