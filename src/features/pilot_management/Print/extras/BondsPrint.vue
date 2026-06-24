<template>
  <div class="text-black px-2 pb-2">
    <v-row dense
      align="center">
      <v-col cols="auto">
        <div class="text-overline mt-n2 mb-n2 text-primary"><span class="text-uppercase">{{ $t('pm.link.bond') }}</span></div>
        <div v-if="blank"
          style="min-width: 250px">
          <blank-line :height="40" />
        </div>
        <div v-else-if="bc.Bond"
          class="heading h2 my-n2">
          {{ bc.Bond.Name }}
        </div>
      </v-col>

      <v-col class="text-right">
        <div class="text-overline text-primary mt-n2 mb-n3">{{ $t('pm.print.xp') }}</div>
        <div>
          <v-icon v-for="n in 8"
            :key="`xp-${n}`"
            :size="31"
            color="primary"
            style="opacity: 0.5"
            class="mr-n1">
            mdi-hexagon-outline
          </v-icon>
        </div>
      </v-col>
      <v-col class="text-right">
        <div class="text-overline text-primary mt-n2 mb-n3 ml-n7">{{ $t('stats.stress') }}</div>
        <div>
          <v-icon v-for="n in 8"
            :key="`stress-${n}`"
            :size="31"
            color="primary"
            style="opacity: 0.5">
            mdi-heart-outline
          </v-icon>
        </div>
      </v-col>
    </v-row>

    <div v-if="blank"
      dense
      class="mb-4">
      <div class="text-overline mt-n2 mb-n2 text-primary">{{ $t('pm.print.majorIDEAL') }}</div>
      <blank-line :height="24" />
      <div class="text-cc-overline text-primary">{{ $t('ui.bond.minorIdeals') }}</div>
      <blank-line :height="24"
        class="mt-n2 mb-1" />
      <blank-line :height="24" />
    </div>

    <v-row v-else-if="bc.Bond"
      dense
      justify="space-between"
      class="pt-4">
      <v-col v-for="(q, i) in bc.Bond.Questions"
        v-show="bc.Answers[i]"
        :key="`question-${i}`">
        <div class="text-overline mt-n5"
          style="line-height: 12px">{{ q.question }}</div>
        <div class="text-left caption"
          v-text="bc.Answers[i]" />
      </v-col>
      <v-col v-if="bc.MinorIdeal">
        <div class="text-overline mt-n5"
          style="line-height: 12px">{{ $t('pm.sheet.minorIdeal') }}</div>
        <div class="text-left caption"
          v-text="bc.MinorIdeal" />
      </v-col>
    </v-row>

    <div v-if="blank"
      dense
      class="mb-4">
      <div class="text-overline mt-n2 mb-n3 text-primary">{{ $t('pm.print.burdens') }}</div>
      <v-row v-for="n in 3"
        :key="`row-${n}`"
        dense>
        <v-col cols="auto"><blank-line v-if="blank"
            :width="58"
            :height="58" /></v-col>
        <v-col><blank-line v-if="blank"
            :height="58" /></v-col>
      </v-row>
    </div>

    <div v-else-if="bc.Burdens.length">
      <div class="text-overline text-primary"
        style="line-height: 0">{{ $t('pm.print.burdens') }}</div>
      <v-row v-for="(b, index) in bc.Burdens"
        :key="`burden-${index}`"
        density="compact"
        justify="space-between"
        class="mt-n1 caption"
        style="position: relative">
        <v-col>
          <fieldset>
            <legend class="heading ml-1 px-2">{{ b.Title }}</legend>
            <v-row no-gutters
              class="pb-1">
              <v-col cols="auto"
                class="mr-4">
                <span class="heading h2 text-grey">&emsp;/{{ b.Segments }}</span>
              </v-col>
              <v-col>
                <div v-html-safe="b.Description" />
              </v-col>
            </v-row>
          </fieldset>
        </v-col>
      </v-row>
    </div>

    <div v-if="bc.Clocks.length > 0 && !blank"
      class="text-overline text-primary mt-4"
      style="line-height: 0">
      {{ $t('pm.titles.otherClocks') }}
    </div>
    <div v-if="!blank">
      <v-row v-for="(b, index) in bc.Clocks"
        :key="`clock-${index}`"
        density="compact"
        justify="space-between"
        class="mt-n1 caption"
        style="position: relative">
        <v-col>
          <fieldset>
            <legend class="heading ml-1 px-2">{{ b.Title }}</legend>
            <v-row no-gutters
              class="pb-1">
              <v-col cols="auto"
                class="mr-4">
                <span class="heading h2 text-grey">&emsp;/{{ b.Segments }}</span>
              </v-col>
              <v-col>
                <div v-html-safe="b.Description" />
              </v-col>
            </v-row>
          </fieldset>
        </v-col>
      </v-row>
    </div>

    <div class="text-overline text-primary mt-4"
      style="line-height: 8px">{{ $t('ui.bond.bondPowers') }}</div>
    <div v-if="blank"
      class="mt-2">
      <v-row dense>
        <v-col v-for="n in 6"
          :key="`power-${n}`"
          :cols="landscape ? 3 : 6">
          <blank-line v-if="blank"
            :height="landscape ? 120 : 60" />
        </v-col>
        <v-col :cols="landscape ? 3 : 6">
          <div class="text-overline text-white bg-grey-lighten-1 text-center"
            :style="landscape ? 'width: 270px; line-height: 20px' : 'width: 375px; line-height: 20px'
              ">
            {{ $t('ui.bond.veteranPower') }}
          </div>

          <blank-line v-if="blank"
            :width="landscape ? 270 : 375"
            :height="landscape ? 100 : 60" />
        </v-col>
        <v-col :cols="landscape ? 3 : 6">
          <div class="text-overline text-white bg-grey-lighten-1 text-center"
            :style="landscape ? 'width: 270px; line-height: 20px' : 'width: 375px; line-height: 20px'
              ">
            {{ $t('ui.bond.masterPower') }}
          </div>

          <blank-line v-if="blank"
            :width="landscape ? 270 : 375"
            :height="landscape ? 100 : 60" />
        </v-col>
      </v-row>
    </div>
    <v-row v-else
      dense
      justify="center"
      class="mt-n1 caption">
      <v-col v-for="p in bc.BondPowers"
        :key="p.name"
        cols="6"
        style="position: relative">
        <fieldset>
          <legend class="heading ml-1 px-2">
            {{ p.name }}
            {{ p.veteran ? $t('pm.print.veteranPOWER2') : p.master ? '(MASTER POWER)' : '' }}
          </legend>
          <div v-html-safe="p.description"
            class="pa-1 mt-n1" />
        </fieldset>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import blankLine from '../components/blank/line.vue';
import { BondController } from '@/classes/pilot/components/bond/BondController';

const props = defineProps<{
  bc: BondController
  options: any
}>()

const blank = computed(() => {
  return props.options.content.title === 'Blank';
})
const landscape = computed(() => {
  return props.options.orientation === 'landscape';
})
</script>

<style scoped>
@import "@/ui/style/print-common.css";

.icon-overlap {
  position: absolute;
  top: -2px;
  left: 1px;
  width: 100%;
  width: -webkit-fill-available;
  width: -moz-available;
  text-align: center;
}
</style>
