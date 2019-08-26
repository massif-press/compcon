<template>
  <div>
    <v-layout grow-shrink-0 align-center class="text-xs-left text-uppercase body-2">
      <span class="grey--text">
        {{ label || 'LABEL' }}
        <b v-if="labelArray" :style="`color: ${color}`">{{ labelArray[current] }}</b>
        <b v-else :style="`color: ${color}`">{{ current }}/{{ max }}</b>
      </span>
      <v-flex v-if="!noInput" ml-0 class="white--text">
        <v-fade-transition leave-absolute>
          <v-btn flat icon small @click="startInputting" v-if="!inputting">
            <v-icon :color="color">mdi-keyboard</v-icon>
          </v-btn>
          <div v-else>
            <input
              :color="color"
              type="text"
              class="pipinput"
              ref="pipinput"
              :value="myInput"
              @input="onInputChange"
              @keyup.enter="sendInput"
              @blur="cancelInput"
              @keyup.escape="cancelInput"
            />
          </div>
        </v-fade-transition>
      </v-flex>
      <v-flex v-if="clearable" ml-0 class="white--text">
        <v-btn flat icon small @click="$emit('update', 0)">
          <v-icon :color="color">clear</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-rating
      :key="current"
      class="d-inline-block"
      dense
      hover
      v-model="model"
      :length="max"
      :readonly="readonly"
      :small="small"
      :large="large"
      :empty-icon="emptyIcon ? emptyIcon : 'mdi-hexagon-outline'"
      :full-icon="fullIcon ? fullIcon : 'mdi-hexagon'"
      :color="color"
      :background-color="bgColor ? bgColor : 'grey darken-1'"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'tick-bar',
  props: {
    label: String,
    current: Number,
    max: Number,
    small: Boolean,
    large: Boolean,
    emptyIcon: String,
    fullIcon: String,
    color: String,
    bgColor: String,
    readonly: Boolean,
    noInput: Boolean,
    clearable: Boolean,
    labelArray: { required: false },
    rollover: { type: Boolean, default: false },
    rolloverNegative: { type: Boolean, default: false },
  },
  data: () => ({
    model: 0,
    lock: true,
    inputting: false,
    myInput: '',
  }),
  methods: {
    startInputting() {
      this.inputting = true
      this.$nextTick(() => {
        ;(this.$refs.pipinput as HTMLInputElement).focus()
      })
    },
    sendInput() {
      const thisInput = this.myInput
      if (!thisInput.match(/\d/)) return

      this.inputting = false

      let preResult = this.current

      if (thisInput === '') return
      else if (thisInput.startsWith('+')) {
        preResult += parseInt(thisInput.substr(1))
      } else if (thisInput.startsWith('-')) {
        preResult -= parseInt(thisInput.substr(1))
      } else {
        preResult = parseInt(thisInput)
      }

      if (this.rollover && this.rolloverNegative) {
        while (preResult >= this.max) {
          preResult = preResult - this.max
          this.$emit('rollover')
        }
      } else preResult = Math.min(preResult, this.max)

      if (this.rollover && !this.rolloverNegative) {
        while (preResult < 1) {
          preResult = this.max + preResult
          this.$emit('rollover')
        }
      } else {
        preResult = Math.max(0, preResult)
      }

      this.$emit('update', preResult)
      this.myInput = ''
    },
    cancelInput() {
      this.inputting = false
      this.myInput = ''
    },
    onInputChange(e: any) {
      const newVal = e.target.value
      if (newVal.match(/^[+-\d]\d*$/) || newVal === '') this.myInput = newVal
      else e.target.value = this.myInput
    },
  },
  created() {
    this.lock = true
    if (!this.readonly) {
      this.model = this.current > this.max ? this.max : this.current
    } else this.model = this.max
    this.lock = false
  },
  watch: {
    model(val: number) {
      if (!this.lock && !isNaN(val)) {
        this.$emit('update', val)
      }
    },
  },
})
</script>

<style scoped>
.pipbar {
  display: flex;
  flex-wrap: wrap;
}
.pipbar .v-icon {
  padding: 0px 0px !important;
}
.pipbar .v-icon .v-ripple__container {
  width: 32px !important;
  height: 28px !important;
  left: -1px !important;
}
.pipinput {
  height: 28px;
  margin: 6px 8px;
  font-weight: bold;
}
.pipinput:focus {
  outline: none;
}
</style>
