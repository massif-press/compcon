<template>
  <div class="parent" style="height: 100%">
    <div :class="`bg-${color} tail`" class="d-inline-block mr-1" />
    <v-menu :close-on-content-click="false">
      <template #activator="{ props }">
        <v-card
          class="cc-panel-clip-small d-inline-block"
          color="panel"
          flat
          tile
          height="100%"
          variant="elevated"
          min-width="100px"
          v-bind="!boolean && props"
          @click="boolean ? $emit('click') : null">
          <v-row no-gutters justify="center" align="center" style="height: 100%">
            <v-col cols="auto" class="heading" style="font-size: 36px">
              <v-icon
                v-if="icon"
                :icon="icon"
                :color="color"
                :class="boolean ? 'mr-1' : 'mt-n2 mr-2'"
                :size="boolean ? 60 : 40" />
              <span v-if="!boolean" class="mr-2">{{ modelValue }}</span>
            </v-col>
          </v-row>
        </v-card>
      </template>
      <v-card>
        <v-toolbar height="24" :color="color">
          <div class="heading h3">
            <v-icon :icon="icon" size="22" class="mt-n1 ml-2 mr-1" />
            {{ title }}
          </div>
        </v-toolbar>
        <v-card-text>
          <v-row dense>
            <v-col cols="auto">
              <v-btn
                icon
                flat
                tile
                size="x-small"
                variant="text"
                @input="$emit('update:modelValue', modelValue - 1)">
                <v-icon size="x-large" icon="mdi-minus" />
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-text-field
                variant="outlined"
                type="number"
                tile
                hide-details
                autofocus
                density="compact"
                width="100"
                @focus="$event.target.select()"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)" />
            </v-col>
            <v-col cols="auto">
              <v-btn
                icon
                flat
                tile
                size="x-small"
                variant="text"
                @input="$emit('update:modelValue', modelValue + 1)">
                <v-icon size="x-large" icon="mdi-plus" />
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="my-2" />
          <v-row dense>
            <v-col>
              <v-btn flat tile block size="x-small" color="primary" @click="$emit('reset')">
                Reset
              </v-btn>
            </v-col>
            <v-col>
              <v-btn flat tile block size="x-small" color="primary" @click="$emit('clear')">
                Clear
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-menu>
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
  emits: ['click', 'update:modelValue'],
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
