<template>
  <cc-panel v-if="counter" color="primary" min-width="200px" class="text-center" density="compact">
    <div class="d-flex align-center justify-space-between mt-n2">
      <div class="heading h3">
        {{ counter.Name }}
      </div>
      <v-spacer />
      <v-tooltip text="Reset Counter" location="top" open-delay="400">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            icon
            size="x-small"
            class="ml-2 mr-n2 fade-select"
            @click="counter.Reset()">
            <v-icon size="22">mdi-reload</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip v-if="counterData.custom" text="Delete Counter">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" icon size="x-small" @click="$emit('delete')">
            <v-icon size="22">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </div>
    <v-card-text class="py-1 px-0">
      <v-row justify="center" align="center" class="counterContent" no-gutters>
        <v-col cols="auto" class="mr-2">
          <v-btn
            icon
            variant="text"
            size="x-small"
            :disabled="counter.Value <= counter.Min"
            @click="counter.Decrement()">
            <v-icon size="30" icon="mdi-minus" />
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-text-field
            type="number"
            variant="outlined"
            density="compact"
            hide-details
            class="counterValue"
            :class="{
              dirty,
            }"
            :value="counter.Value"
            max-width="90px"
            @blur="onInputEnterOrLeave($event)"
            @keypress.enter="onInputEnterOrLeave($event)"
            @input="onInput" />
        </v-col>

        <v-col cols="auto" class="ml-2">
          <v-btn
            icon
            variant="text"
            size="x-small"
            :disabled="counter.Value >= counter.Max"
            @click="counter.Increment()">
            <v-icon size="30" icon="mdi-plus" />
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </cc-panel>
</template>

<script lang="ts">
import { Counter } from '@/class';
import { ICounterData } from '@/interface';

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
    counter: null as any,
    dirty: false,
  }),
  created(): void {
    this.counter = new Counter(this.counterData as ICounterData);

    const data = this.saveData.find((data: any) => data.id === this.counter.ID);
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
