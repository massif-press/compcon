<template>
  <v-col :cols="cols" style="cursor: pointer; position: relative; height: 100%">
    <v-hover>
      <template v-slot="{ isHovering, props }">
        <v-card v-bind="props" flat variant="tonal" :to="to">
          <v-img
            class="ts"
            :src="`https://d2c79xe1p61csc.cloudfront.net/other/${img}.jpg`"
            cover
            :height="maxHeight"
            :style="`opacity: ${isHovering ? '.9' : '.4'}`" />
          <v-card
            :color="isHovering ? 'rgba(18, 18, 18, 0.95)' : 'rgba(38, 49, 68, 0.75)'"
            rounded="lg"
            elevation="0"
            style="position: absolute; bottom: 8px; left: 24px; right: 24px">
            <v-card-text class="py-2 text-center heading h3">
              <div
                class="ts"
                :class="[isHovering ? 'text-white' : 'text-grey-lighten-1', !mobile && 'pb-2']">
                {{ name }}
              </div>
              <v-divider v-if="!mobile" class="py-1" />
              <div
                v-if="!mobile"
                class="flavor-text ts"
                :class="isHovering ? 'text-white' : 'text-grey-lighten-1'">
                {{ description }}
              </div>
            </v-card-text>
          </v-card>
        </v-card>
      </template>
    </v-hover>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'gm-landing-card',
  props: {
    to: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    cols: { type: [String, Number], required: false, default: '' },
    img: { type: String, required: true },
    maxHeight: { type: [String, Number], required: false, default: '' },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>

<style scoped>
.ts {
  transition: opacity 0.4s;
}
</style>
