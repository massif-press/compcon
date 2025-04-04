<template>
  <div class="text-black px-2 pb-2">
    <v-row dense align="center">
      <v-col cols="auto">
        <div class="text-overline mt-n2 mb-n2 text-primary">BOND</div>
        <div v-if="blank" style="min-width: 250px">
          <blank-line :height="40" />
        </div>
        <div v-else class="heading h2 my-n2">
          {{ bc.Bond.Name }}
        </div>
      </v-col>

      <v-col class="text-right">
        <div class="text-overline text-primary mt-n2 mb-n3">XP</div>
        <div>
          <v-icon v-for="n in 8" :size="31" color="primary" style="opacity: 0.5" class="mr-n1">
            mdi-hexagon-outline
          </v-icon>
        </div>
      </v-col>
      <v-col class="text-right">
        <div class="text-overline text-primary mt-n2 mb-n3 ml-n7">STRESS</div>
        <div>
          <v-icon v-for="n in 8" :size="31" color="primary" style="opacity: 0.5">
            mdi-heart-outline
          </v-icon>
        </div>
      </v-col>
    </v-row>

    <div v-if="blank" dense class="mb-4">
      <div class="text-overline mt-n2 mb-n2 text-primary">MAJOR IDEAL</div>
      <blank-line :height="24" />
      <div class="text-cc-overline text-primary">MINOR IDEALS</div>
      <blank-line :height="24" class="mt-n2 mb-1" />
      <blank-line :height="24" />
    </div>

    <v-row v-else dense justify="space-between" class="pt-4">
      <v-col v-for="(q, i) in bc.Bond.Questions" v-show="bc.Answers[i]">
        <div class="text-overline mt-n5" style="line-height: 12px">{{ q.question }}</div>
        <div class="text-left caption" v-text="bc.Answers[i]" />
      </v-col>
      <v-col v-if="bc.MinorIdeal">
        <div class="text-overline mt-n5" style="line-height: 12px">MINOR IDEAL</div>
        <div class="text-left caption" v-text="bc.MinorIdeal" />
      </v-col>
    </v-row>

    <div v-if="blank" dense class="mb-4">
      <div class="text-overline mt-n2 mb-n3 text-primary">BURDENS</div>
      <v-row v-for="n in 3" dense>
        <v-col cols="auto"><blank-line v-if="blank" :width="58" :height="58" /></v-col>
        <v-col><blank-line v-if="blank" :height="58" /></v-col>
      </v-row>
    </div>

    <div v-else-if="bc.Burdens.length">
      <div class="text-overline text-primary" style="line-height: 0">BURDENS</div>
      <v-row
        v-for="b in bc.Burdens"
        density="compact"
        justify="space-between"
        class="mt-n1 caption"
        style="position: relative">
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
    </div>

    <div
      v-if="bc.Clocks.length > 0 && !blank"
      class="text-overline text-primary mt-4"
      style="line-height: 0">
      OTHER CLOCKS
    </div>
    <v-row
      v-if="!blank"
      v-for="b in bc.Clocks"
      density="compact"
      justify="space-between"
      class="mt-n1 caption"
      style="position: relative">
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

    <div class="text-overline text-primary mt-4" style="line-height: 0">BOND POWERS</div>
    <div v-if="blank" class="mt-2">
      <v-row dense>
        <v-col v-for="n in 6" :cols="landscape ? 3 : 6">
          <blank-line v-if="blank" :height="landscape ? 120 : 60" />
        </v-col>
        <v-col :cols="landscape ? 3 : 6">
          <div
            class="text-overline text-white bg-grey-lighten-1 text-center"
            :style="
              landscape ? 'width: 270px; line-height: 20px' : 'width: 375px; line-height: 20px'
            ">
            VETERAN POWER
          </div>

          <blank-line v-if="blank" :width="landscape ? 270 : 375" :height="landscape ? 100 : 60" />
        </v-col>
        <v-col :cols="landscape ? 3 : 6">
          <div
            class="text-overline text-white bg-grey-lighten-1 text-center"
            :style="
              landscape ? 'width: 270px; line-height: 20px' : 'width: 375px; line-height: 20px'
            ">
            MASTER POWER
          </div>

          <blank-line v-if="blank" :width="landscape ? 270 : 375" :height="landscape ? 100 : 60" />
        </v-col>
      </v-row>
    </div>
    <v-row v-else dense justify="center" class="mt-n1 caption">
      <v-col v-for="p in bc.BondPowers" cols="6" style="position: relative">
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
import blankLine from '../components/blank/line.vue';

export default {
  name: 'bonds-print',
  components: {
    blankLine,
  },
  props: {
    bc: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  computed: {
    blank() {
      return this.options.content.title === 'Blank';
    },
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
