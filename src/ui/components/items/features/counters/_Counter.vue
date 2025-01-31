<template>
  <v-card
    v-if="counter"
    tile
    variant="outlined"
    color="primary"
    :width="!$vuetify.display.mdAndDown ? '225px' : '100%'"
    :min-width="!$vuetify.display.mdAndDown ? '225px' : '100%'"
    :height="!$vuetify.display.mdAndDown ? '100%' : ''">
    <v-toolbar density="compact" flat color="primary" class="text-white">
      <div :class="!$vuetify.display.mdAndDown ? 'heading h3' : 'heading h4'">
        {{ counter.Name }}
      </div>
      <v-spacer />
      <cc-tooltip simple content="Reset Counter">
        <v-btn variant="plain" dark icon x-small @click="counter.Reset()">
          <v-icon small>mdi-reload</v-icon>
        </v-btn>
      </cc-tooltip>

      <cc-tooltip v-if="counterData.custom" simple content="Delete Counter">
        <v-btn class="fade-select ml-1" dark icon x-small @click="$emit('delete')">
          <v-icon small>delete</v-icon>
        </v-btn>
      </cc-tooltip>
    </v-toolbar>
    <v-card-text class="background py-1">
      <v-row justify="center" align="center" class="counterContent">
        <v-col cols="auto">
          <v-btn
            small
            icon
            color="accent"
            :disabled="counter.Value <= counter.Min"
            @click="counter.Decrement()">
            <v-icon icon="remove" />
          </v-btn>
        </v-col>

        <v-col>
          <v-text-field
            type="number"
            variant="outlined"
            density="compact"
            class="counterValue"
            :class="{
              dirty,
            }"
            :value="counter.Value"
            @blur="onInputEnterOrLeave($event)"
            @keypress.enter="onInputEnterOrLeave($event)"
            @input="onInput" />
        </v-col>

        <v-col cols="auto">
          <v-btn
            small
            icon
            elevation="0"
            color="accent"
            :disabled="counter.Value >= counter.Max"
            @click="counter.Increment()">
            <v-icon icon="add" />
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Counter } from '@/class';

export default {
  name: 'Counter',
  props: {
    counterData: {
      type: Object,
      required: true,
    },
    saveData: {
      type: Array,
      required: true,
    },
  },
  watch: {
    counter: {
      handler(val: Counter) {
        this.$emit('update', val);
      },
      deep: true,
    },
  },
  data: () => ({
    counter: null as Counter,
    dirty: false,
  }),
  created(): void {
    this.counter = new Counter(this.$props.counterData);

    const data = this.$props.saveData.find((data) => data.id === this.counter.ID);
    if (data) this.counter.LoadData(data);
  },
  methods: {
    onInput(): void {
      this.dirty = true;
    },

    onInputEnterOrLeave(e: FocusEvent | InputEvent): void {
      const element = e.target as HTMLInputElement;

      const val = parseInt(element.value);
      this.counter.Set(val);
      element.value = this.counter.Value.toString();
      this.dirty = false;
    },
  },
};
</script>

<style scoped>
.counterValue.dirty :deep(input) {
  color: rgb(var(--v-theme-primary)) !important;
  transition: color 300ms ease-in-out !important;
}

.counterValue :deep(input) {
  font-size: 1.2em;
  text-align: center;
  -moz-appearance: textfield;
}

.counterValue :deep(input::-webkit-outer-spin-button),
.counterValue :deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
}

.counterValue :deep(.v-input__slot) {
  margin-bottom: 0 !important;
}

.counterValue :deep(.v-text-field__details) {
  display: none !important;
}

.counterContent {
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
