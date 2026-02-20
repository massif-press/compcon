<template>
  <v-card color="panel"
    class="top-element"
    flat
    tile>
    <v-row dense
      justify="center"
      align="center">
      <v-col cols="auto"
        class="heading">
        <v-tooltip :text="title.toUpperCase()">
          <template #activator="{ props }">
            <v-icon v-if="icon"
              :icon="icon"
              class="mt-n1 mx-1"
              :color="color"
              v-bind="props" />
          </template>
        </v-tooltip>
        <span v-if=!portrait>{{ title }}</span>
      </v-col>

      <v-col cols="auto"
        class="ml-auto">
        <v-row no-gutters
          align="center">
          <v-col cols="auto">
            <v-btn icon
              flat
              tile
              size="30"
              class="mx-2"
              variant="text"
              @click="setVal(internalValue - 1)">
              <v-icon size="x-large"
                icon="mdi-minus" />
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-text-field :model-value.number="internalValue"
              variant="outlined"
              type="number"
              tile
              hide-details
              autofocus
              density="compact"
              width="80"
              hide-spin-buttons
              @focus="$event.target.select()"
              @update:model-value="setVal(Number($event))" />
          </v-col>
          <v-col cols="auto">
            <v-btn icon
              flat
              tile
              size="30"
              class="mx-2"
              variant="text"
              @click="setVal(internalValue + 1)">
              <v-icon size="x-large"
                icon="mdi-plus" />
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto">
        <v-menu>
          <template #activator="{ props }">
            <v-btn icon
              flat
              tile
              size="30"
              class="mx-2 fade-select"
              variant="text"
              v-bind="props">
              <v-icon icon="mdi-cog" />
            </v-btn>
          </template>
          <v-list density="compact"
            border>
            <v-list-item prepend-icon="mdi-reload"
              @click="setVal(baseValue)">
              <v-list-item-title>Reset to Base Value</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon=mdi-cancel
              @click="setVal(0)">
              <v-list-item-title>Clear</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'stat-mini-panel',
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
    baseValue: {
      type: Number,
      default: 0,
    },
    simple: {
      type: Boolean,
    },
  },
  data() {
    return {
      internalValue: this.modelValue || 0,
    };
  },
  emits: ['click', 'update:model-value'],
  watch: {
    modelValue(val) {
      this.internalValue = val;
    },
    internalValue(val) {
      this.$emit('update:model-value', val);
    },
  },
  computed: {
    portrait() {
      return this.$vuetify.display.xs;
    },
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
  methods: {
    setVal(val) {
      this.$emit('update:model-value', val);
    },
  },
};
</script>

<style scoped>
.top-element>>>.v-input--horizontal .v-input__prepend {
  margin-inline-end: 0px !important;
}

.top-element>>>.v-input--horizontal .v-input__append {
  margin-inline-start: 0px !important;
}

.top-element>>>.v-field__input {
  min-height: auto !important;
  height: 32px;
}
</style>
