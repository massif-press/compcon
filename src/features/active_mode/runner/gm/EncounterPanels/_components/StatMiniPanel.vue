<template>
  <div class="parent" style="height: 100%">
    <div :class="`bg-${color} tail`" class="d-inline-block mr-1" />
    <v-card
      class="cc-panel-clip-small d-inline-block"
      color="panel"
      flat
      tile
      height="100%"
      variant="elevated"
      min-width="100px"
      @click="$emit('click')">
      <!-- <v-toolbar
        flat
        density="compact"
        color="surface"
        class="ma-0 pa-0"
        style="height: 17px; opacity: 0.5">
        <div class="px-2 text-cc-overline" style="padding-top: 2px">
          <span v-if="title" v-text="title" />
        </div>
      </v-toolbar> -->
      <v-row no-gutters justify="center" align="center" style="height: 100%">
        <v-col cols="auto" class="heading" style="font-size: 36px">
          <v-icon
            v-if="icon"
            :icon="icon"
            :color="color"
            :class="boolean ? 'mr-1' : 'mt-n2 mr-1'"
            :size="boolean ? 60 : 40" />
          <span v-if="!boolean" class="mr-2">{{ modelValue }}</span>
        </v-col>
      </v-row>
    </v-card>
    <span :class="`light ${`bg-${color}`}`" />
  </div>
</template>

<script>
export default {
  name: 'cc-panel',
  props: {
    modelValue: {
      type: Number,
    },
    title: {
      type: String,
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
    },
    boolean: {
      type: Boolean,
    },
  },
  emits: ['click'],
};
</script>

<style scoped>
.cc-panel-clip-small {
  clip-path: polygon(0% 0%, 100% 0%, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0% 100%);
}

.light {
  bottom: 0px;
  right: 0px;
  position: absolute;
  clip-path: polygon(50% 100%, 100% 50%, 100% 0, 0 100%);
  border-top-left-radius: 1px;
  transition: filter 0.2s ease-in-out;
  width: 13.5px;
  height: 13.5px;
}

.parent {
  position: relative;
}

.parent:deep(.v-toolbar__content) {
  height: fit-content !important;
}

.parent:hover .light {
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}

.tail {
  display: inline-block;
  width: 3px;
  height: 100%;
  margin-left: 3px;
  z-index: 1;
  transition: all 0.2s ease-in-out;
}

.parent:hover .tail {
  opacity: 1;
  filter: brightness(2) saturate(200%) hue-rotate(20deg);
}
</style>
