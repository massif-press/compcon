<template>
  <v-card v-if="counter" tile outlined color="primary">
    <v-card-title class="white--text py-2 d-flex">
      <span class="subtitle-2">{{ counter.Name }}</span>
      <span v-if="counterData.custom" class="subtitle-2 font-italic" style="opacity: 0.5">
        &nbsp;[custom]
      </span>
      <v-btn v-if="counterData.custom" class="ml-auto" dark icon x-small @click="$emit('delete')">
        <v-icon small>delete</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="background pb-2">
      <v-row justify="center" class="counterContent">
        <v-col sm="4">
          <v-btn
            fab
            small
            elevation="0"
            color="primary"
            :disabled="counter.Value <= counter.Min"
            @click="counter.Decrement()"
          >
            <v-icon>remove</v-icon>
          </v-btn>
        </v-col>

        <v-col sm="4">
          <v-text-field
            type="number"
            outlined
            elevation="0"
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

        <v-col sm="4" class="d-flex justify-end">
          <v-btn
            fab
            small
            elevation="0"
            color="primary"
            :disabled="counter.Value >= counter.Max"
            @click="counter.Increment()"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-btn elevation="0" color="primary" block small @click="counter.Reset()">
        Reset
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Counter } from '@/class'
import activePilot from '../../mixins/activePilot'
import { getModule } from 'vuex-module-decorators'
import { PilotManagementStore } from '@/store'
import { Pilot } from '@/class'

@Component({
  props: {
    counterData: {
      type: Object,
      required: true,
    },
  },
  mixins: [activePilot],
  watch: {
    counter: {
      handler(val: Counter) {
        ;(this.pilot as Pilot).saveCounter(val.Serialize())
        getModule(PilotManagementStore, this.$store).saveData()
      },
      deep: true,
    },
  },
})
export default class CounterComponent extends Vue {
  public counter: Counter = null

  created() {
    this.counter = new Counter(this.$props.counterData)

    const data = (this as any).pilot.CounterSaveData.find(data => data.id === this.counter.ID)
    if (data) this.counter.LoadData(data)
  }

  public dirty = false
  onInput() {
    this.dirty = true
  }

  onInputEnterOrLeave(e: FocusEvent | InputEvent) {
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
