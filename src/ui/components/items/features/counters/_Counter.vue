<template>
  <v-card v-if="counter" tile outlined color="primary" width="200px" min-width="200px">
    <v-card-title class="white--text py-2 d-flex">
      <span class="subtitle-2">{{ counter.Name }}</span>
      <v-spacer />
      <cc-tooltip simple content="Reset Counter">
        <v-btn class="fadeSelect" dark icon x-small @click="counter.Reset()">
          <v-icon small>mdi-reload</v-icon>
        </v-btn>
      </cc-tooltip>

      <cc-tooltip v-if="counterData.custom" simple content="Delete Counter">
        <v-btn class="fadeSelect ml-1" dark icon x-small @click="$emit('delete')">
          <v-icon small>delete</v-icon>
        </v-btn>
      </cc-tooltip>
    </v-card-title>
    <v-card-text class="background pb-0">
      <v-row justify="center" class="counterContent">
        <v-col cols="auto">
          <v-btn
            small
            icon
            color="accent"
            :disabled="counter.Value <= counter.Min"
            @click="counter.Decrement()"
          >
            <v-icon>remove</v-icon>
          </v-btn>
        </v-col>

        <v-col>
          <v-text-field
            type="number"
            outlined
            dense
            class="counterValue"
            :class="{
              dirty,
            }"
            :value="counter.Value"
            @blur="onInputEnterOrLeave($event)"
            @keypress.enter="onInputEnterOrLeave($event)"
            @input="onInput"
          />
        </v-col>

        <v-col cols="auto">
          <v-btn
            small
            icon
            elevation="0"
            color="accent"
            :disabled="counter.Value >= counter.Max"
            @click="counter.Increment()"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Counter } from '@/class'

@Component({
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
        this.$emit('update', val)
      },
      deep: true,
    },
  },
})
export default class CounterComponent extends Vue {
  public counter: Counter = null

  created(): void {
    this.counter = new Counter(this.$props.counterData)

    const data = this.$props.saveData.find(data => data.id === this.counter.ID)
    if (data) this.counter.LoadData(data)
  }

  public dirty = false
  onInput(): void {
    this.dirty = true
  }

  onInputEnterOrLeave(e: FocusEvent | InputEvent): void {
    const element = e.target as HTMLInputElement

    const val = parseInt(element.value)
    this.counter.Set(val)
    element.value = this.counter.Value.toString()
    this.dirty = false
  }
}
</script>

<style scoped>
.counterValue.dirty >>> input {
  color: var(--v-primary-base) !important;
  transition: color 300ms ease-in-out !important;
}

.counterValue >>> input {
  font-size: 1.5em;
  text-align: center;
  -moz-appearance: textfield;
}

.counterValue >>> input::-webkit-outer-spin-button,
.counterValue >>> input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.counterValue >>> .v-input__slot {
  margin-bottom: 0 !important;
}

.counterValue >>> .v-text-field__details {
  display: none !important;
}

.counterContent {
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
