<template>
  <div style="height: 200px;">
    <div id="header-container">
      <v-row dense class="pt-9 ml-2" style="width: 97vw">
        <v-col cols="10">
          <v-row dense style="height: 60px;">
            <v-col dense cols="auto">
              <span class="overline lh">callsign</span>
              <br />
              <span
                class="heading h1"
                style="line-height: 18px; letter-spacing: 10px"
              >{{ pilot.Callsign }}</span>
            </v-col>
            <v-col cols="auto" class="ml-auto text-center mt-2">
              <span class="overline">license level</span>
              <br />
              <span class="heading h1" style="line-height: 40px; font-size: 80px">{{ pilot.Level }}</span>
              <br />
              <v-icon
                large
                dark
                class="fadeSelect ml-4"
                @click="''"
              >mdi-arrow-up-bold-hexagon-outline</v-icon>
              <v-icon small dark class="fadeSelect mt-2" @click="''">mdi-circle-edit-outline</v-icon>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="auto" class="mr-3">
              <span class="overline lh">name</span>
              <br />
              <span style="display: block" class="stat-text white--text mt-n2">{{ pilot.Name }}</span>
            </v-col>
            <v-col v-if="pilot.Background" cols="auto" class="mr-3">
              <span class="overline lh">background</span>
              <br />
              <span
                style="display: block"
                class="stat-text white--text mt-n2"
              >{{ pilot.Background }}</span>
            </v-col>
            <v-col v-if="pilot.Background" cols="auto" class="mr-3">
              <span class="overline lh">rm-4://(IDENT)</span>
              <br />
              <span style="display: block" class="stat-text white--text mt-n2">{{ pilot.ID }}</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row id="stat-row" dense>
        <v-col cols="2" offset="1" class="unskew">
          <v-icon>mdi-heart</v-icon>
          <span>10</span>
        </v-col>
        <v-col cols="2" class="unskew">
          <v-icon>mdi-heart</v-icon>
          <span>10</span>
        </v-col>
        <v-col cols="2" class="unskew">
          <v-icon>mdi-heart</v-icon>
          <span>10</span>
        </v-col>
        <v-col cols="2" class="unskew">
          <v-icon>mdi-heart</v-icon>
          <span>10</span>
        </v-col>
        <v-col cols="2" class="unskew">
          <v-icon>mdi-heart</v-icon>
          <span>10</span>
        </v-col>
      </v-row>
      <div id="image-bg" />
      <div id="image" class="border">
        <!-- TODO: no data image -->
        <!-- <v-img v-if="pilot.Portrait" :src="pilot.Portrait" aspect-ratio="1" /> -->
        <v-img src="https://via.placeholder.com/550" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'pilot-header',
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
})
</script>

<style scoped>
#header-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: var(--v-primary-base);
  color: white;
  z-index: 2;
}
#stat-row {
  transform: skew(0.65rad);
  background-color: #fafafa;
  color: var(--v-text-base);
  z-index: 10;
  width: 75vw;
  margin-left: -20px;
}
.unskew {
  transform: skew(-0.65rad);
}
#image {
  position: absolute;
  top: 60px;
  right: 20px;
  width: 200px;
  height: 200px;
  z-index: 3;
}
#image-bg {
  position: absolute;
  top: 60px;
  right: 0px;
  width: 235px;
  height: 215px;
  background-color: var(--v-primary-base);
  z-index: 0;
}
.lh {
  line-height: 10px !important;
}
</style>