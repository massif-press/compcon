<template>
  <v-container fluid>
    <v-row dense align="start">
      <v-col class="mr-4">
        <div class="overline mt-n2 mb-n3">BOND</div>
        <div class="heading h2 my-n2">
          {{ bc.Bond.Name }}
        </div>
      </v-col>
      <v-col cols="auto" class="mx-12">
        <div class="overline mt-n2 mb-n3">XP</div>
        <div>
          <v-icon size="50" color="grey lighten-3" class="mr-n1">mdi-hexagon-outline</v-icon>
          <b class="flavor-text pt-3" v-html="`/8`" />
        </div>
      </v-col>
      <v-col cols="auto">
        <div class="overline mt-n2 mb-n3 ml-n7">STRESS</div>
        <div style="position: relative; width: max-content">
          <v-icon size="50" color="grey lighten-3">mdi-heart-outline</v-icon>
        </div>
      </v-col>
    </v-row>

    <v-row dense align="start" justify="space-between">
      <v-col>
        <div class="overline mt-n5 mb-n1">MAJOR IDEAL</div>
        <div class="text-left caption" v-text="bc.MajorIdeal" />
      </v-col>
      <v-col>
        <div class="overline mt-n5 mb-n1">MINOR IDEAL</div>
        <div class="text-left caption" v-text="bc.MinorIdeal" />
      </v-col>
    </v-row>

    <div v-if="bc.Burdens.length" class="overline mb-n2 mt-n1">BURDENS</div>
    <v-row
      v-for="(b, i) in bc.Burdens"
      :key="`b_${i}`"
      dense
      justify="space-between"
      class="mt-n1 caption"
      style="position: relative; page-break-inside: avoid"
    >
      <v-col>
        <fieldset>
          <legend class="heading ml-1 px-2">{{ b.Title }}</legend>
          <v-row no-gutters class="pb-1">
            <v-col cols="auto" class="mr-4">
              <span class="heading h2 grey--text">&emsp;/{{ b.Segments }}</span>
            </v-col>
            <v-col><div v-html="b.Description" /></v-col>
          </v-row>
        </fieldset>
      </v-col>
    </v-row>

    <div class="overline mb-n2 mt-n1">BOND POWERS</div>
    <v-row dense justify="center" class="mt-n1 caption">
      <v-col
        v-for="(p, i) in bc.BondPowers"
        :key="`pp_${i}`"
        cols="6"
        style="position: relative; page-break-inside: avoid"
      >
        <fieldset>
          <legend class="heading ml-1 px-2">
            {{ p.name }} {{ p.veteran ? '(VETERAN POWER)' : p.master ? '(MASTER POWER)' : '' }}
          </legend>
          <div class="pa-1 mt-n1" v-html-safe="p.description" />
        </fieldset>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'bonds-print',
  props: {
    bc: {
      type: Object,
      required: true,
    },
  },
})
</script>

<style scoped>
.caption {
  font-size: 14px;
}

.icon-overlap {
  position: absolute;
  top: -2px;
  left: 1px;
  width: 100%;
  width: -webkit-fill-available;
  width: -moz-available;
  text-align: center;
}

.p-stat {
  font-size: 34px;
}

fieldset {
  padding: 0 4px;
  height: 100%;
  border-radius: 3px;
  border-color: var(--v-grey-lighten2);
}
</style>
