<template>
  <div>
    <fieldset>
      <legend class="heading h4 ml-1 px-2 py-1 text-primary">SYSTEMS</legend>
      <div v-for="n in extraSystemSpace ? 8 : 6"
        :key="`sys-${n}`"
        class="no-print-break">
        <v-row dense>
          <v-col>
            <div class="caption text-grey">SYSTEM</div>
            <blank-line :height="lineHeight" />
          </v-col>
          <v-col cols="1">
            <div class="caption text-grey">USES</div>
            <blank-line :height="lineHeight" />
          </v-col>
          <v-col cols="1">
            <div class="caption text-grey">SP COST</div>
            <blank-line :height="lineHeight" />
          </v-col>
        </v-row>
        <blank-line :height="slotHeight"
          class="my-2" />
      </div>
    </fieldset>
  </div>
</template>

<script lang="ts">
import BlankLine from './blank/line.vue';

export default {
  name: 'PrintBlankSystems',
  components: { BlankLine },
  props: {
    extraSystemSpace: { type: Boolean, default: false },
    lineHeight: { type: Number, default: 28 },
    slotHeight: { type: Number, default: 80 },
  },
};
</script>
