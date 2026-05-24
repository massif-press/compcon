<template>
  <div class="top-element"
    style="position: relative">
    <div :style="`background-color: ${mech.Frame.ManufacturerColor}`"
      class="pip" />
    <v-card id="pc-wrapper"
      variant="outlined"
      style="clip-path: polygon(18px 0, 100% 0, 100% 100%, 0 100%, 0 18px)"
      :color="mech.Frame.ManufacturerColor"
      @click="$emit('go', mech)">
      <v-card tile
        :color="mech.Frame.ManufacturerColor"
        style="
          position: absolute;
          z-index: 5;
          clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px);
        "
        class="clipped-square-invert"
        :min-width="`${portraitWidth}px`"
        min-height="100%">
        <div id="interior"
          class="clipped-square-invert">
          <cc-img :src="mech.Portrait"
            position="top center"
            height="100%"
            cover />
        </div>
      </v-card>
      <div style="width: 100%">
        <slot :content-margin="portraitWidth - 1" />
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MechListItemBase',
  props: {
    mech: { type: Object, required: true },
    portraitWidth: { type: Number, default: 138 },
  },
  emits: ['go'],
};
</script>

<style scoped>
#pc-wrapper {
  position: relative;
  min-height: 138px;
  min-width: 100%;
  cursor: pointer;
  margin-bottom: 12px;
  border-radius: 0;
}

#interior {
  position: absolute;
  top: 2px;
  left: 2px;
  bottom: 2px;
  right: 2px;
  background-color: rgb(var(--v-theme-light-panel));
}

.pip {
  width: 15px;
  height: 15px;
  position: absolute;
  top: 0px;
  left: 0px;
  opacity: 1;
  clip-path: polygon(0 50%, 50% 0, 100% 0, 0% 100%);
  transition: all 0.2s ease-in-out;
}

.top-element:hover .pip {
  filter: brightness(1.2) saturate(150%) hue-rotate(20deg);
  background-color: rgb(var(--v-theme-success)) !important;
}
</style>
