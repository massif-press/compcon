<template>
  <div class="text-black px-2">
    <v-row dense>
      <v-col class="mr-4">
        <div class="text-overline mt-n2 mb-n3 text-grey">BOND</div>
        <div class="heading h2 my-n2">
          {{ bc.Bond.Name }}
        </div>
      </v-col>
      <v-col cols="auto" class="mx-12">
        <div class="text-overline mt-n2 mb-n3">XP</div>
        <div>
          <v-icon size="40" color="grey-lighten-1" class="mr-n1">mdi-hexagon-outline</v-icon>
          <b class="flavor-text pt-3" v-text="'/8'" />
        </div>
      </v-col>
      <v-col cols="auto">
        <div class="text-overline mt-n2 mb-n3 ml-n7">STRESS</div>
        <div style="position: relative; width: max-content">
          <v-icon size="40" color="grey-lighten-1">mdi-heart-outline</v-icon>
        </div>
      </v-col>
    </v-row>

    <v-row dense justify="space-between" class="pt-4">
      <v-col v-for="(q, i) in bc.Bond.Questions" v-show="bc.Answers[i]">
        <div class="text-overline mt-n5" style="line-height: 12px">{{ q.question }}</div>
        <div class="text-left caption" v-text="bc.Answers[i]" />
      </v-col>
      <v-col v-if="bc.MinorIdeal">
        <div class="text-overline mt-n5" style="line-height: 12px">MINOR IDEAL</div>
        <div class="text-left caption" v-text="bc.MinorIdeal" />
      </v-col>
    </v-row>

    <div v-if="bc.Burdens.length" class="text-overline text-grey" style="line-height: 0">
      BURDENS
    </div>
    <v-row
      v-for="b in bc.Burdens"
      density="compact"
      justify="space-between"
      class="mt-n1 caption"
      style="position: relative; page-break-inside: avoid"
    >
      <v-col>
        <fieldset>
          <legend class="heading ml-1 px-2">{{ b.Title }}</legend>
          <v-row no-gutters class="pb-1">
            <v-col cols="auto" class="mr-4">
              <span class="heading h2 text-grey">&emsp;/{{ b.Segments }}</span>
            </v-col>
            <v-col><div v-html="b.Description" /></v-col>
          </v-row>
        </fieldset>
      </v-col>
    </v-row>

    <div v-if="bc.Clocks.length" class="text-overline text-grey mt-4" style="line-height: 0">
      OTHER CLOCKS
    </div>
    <v-row
      v-for="b in bc.Clocks"
      density="compact"
      justify="space-between"
      class="mt-n1 caption"
      style="position: relative; page-break-inside: avoid"
    >
      <v-col>
        <fieldset>
          <legend class="heading ml-1 px-2">{{ b.Title }}</legend>
          <v-row no-gutters class="pb-1">
            <v-col cols="auto" class="mr-4">
              <span class="heading h2 text-grey">&emsp;/{{ b.Segments }}</span>
            </v-col>
            <v-col><div v-html="b.Description" /></v-col>
          </v-row>
        </fieldset>
      </v-col>
    </v-row>

    <div class="text-overline text-grey mt-4" style="line-height: 0">BOND POWERS</div>
    <v-row density="compact" justify="center" class="mt-n1 caption">
      <v-col
        v-for="p in bc.BondPowers"
        cols="6"
        style="position: relative; page-break-inside: avoid"
      >
        <fieldset>
          <legend class="heading ml-1 px-2">
            {{ p.name }}
            {{ p.veteran ? '(VETERAN POWER)' : p.master ? '(MASTER POWER)' : '' }}
          </legend>
          <div class="pa-1 mt-n1" v-html-safe="p.description" />
        </fieldset>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
export default {
  name: 'bonds-print',
  props: {
    bc: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 12px;
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
  border-color: rgb(var(--v-theme-grey-lighten2));
}
</style>
