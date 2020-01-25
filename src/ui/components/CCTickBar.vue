<template>
  <div>
    <v-row no-gutters align="start" :justify="justify">
      <v-col v-if="!flipInput" cols="auto">
        <slot />
      </v-col>
      <v-col v-if="clearable" cols="auto">
        <v-btn icon small @click="$emit('update', 0)">
          <v-icon :color="color">clear</v-icon>
        </v-btn>
      </v-col>
      <v-col v-if="!noInput && !readonly" cols="auto" :class="!large ? 'mt-n1' : ''">
        <v-fade-transition leave-absolute>
          <v-btn v-if="!inputting" icon small class="fadeSelect" @click="startInputting">
            <v-icon :small="small" :color="color">mdi-keyboard</v-icon>
          </v-btn>
          <div v-else style="position: relative">
            <input
              ref="pipinput"
              :color="color"
              type="text"
              class="pipinput mx-2"
              :style="`text-align: ${flipInput ? 'right' : 'left; position: absolute;'} `"
              :value="myInput"
              @input="onInputChange"
              @keyup.enter="sendInput"
              @blur="cancelInput"
              @keyup.escape="cancelInput"
            />
          </div>
        </v-fade-transition>
      </v-col>
      <v-col v-if="flipInput" cols="auto">
        <slot />
      </v-col>
    </v-row>
    <v-rating
      v-if="!noPips"
      :key="current"
      v-model="model"
      class="d-inline-block"
      dense
      hover
      :length="max"
      :readonly="readonly"
      :small="small"
      :large="large"
      :empty-icon="emptyIcon"
      :full-icon="fullIcon"
      :color="color"
      :background-color="bgColor"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from 'vue-property-decorator'

@Component({ name: 'tick-bar', })
export default class CCTickBar extends Vue {
  created() {
    this.lock = true
    if (!this.readonly) {
      this.model = this.current > this.max ? this.max : this.current
    } else this.model = this.max
    this.lock = false
  }

  @Prop({ type: String, required: false, default: '', })
  label: string

  @Prop({ type: String, required: false, default: 'start', })
  justify: string
  @Prop({ type: Boolean, })
  small?: boolean
  @Prop({ type: Boolean, })
  large?: boolean
  @Prop({ type: String, required: false, default: 'mdi-hexagon-outline', })
  emptyIcon: string
  @Prop({ type: String, required: false, default: 'mdi-hexagon', })
  fullIcon: string
  @Prop({ type: String, required: false, default: 'primary', })
  color: string
  @Prop({ type: String,required: false, default: 'grey lighten-1', })
  bgColor: string
  @Prop({ type: Boolean, })
  noPips?: boolean

  @Prop({ type: Boolean, })
  readonly?: boolean
  @Prop({ type: Boolean, })
  noInput?: boolean
  @Prop({ type: Boolean, })
  flipInput?: boolean
  @Prop({ type: Boolean, })
  clearable?: boolean
  @Prop({ type: Boolean, default: false })
  rollover: boolean
  @Prop({ type: Boolean, default: false })
  rolloverNegative: boolean

  @Prop({ type: Number, required: true, })
  current!: number
  @Prop({ type: Number, required: true, })
  max!: number

  model = 0
  lock = true
  inputting = false
  myInput = ''

  @Watch('model')
  onModelChange(val: number, oldVal: number) {
    if (!this.lock && !isNaN(val)) {
      this.$emit('update', val)
    }
  }

  onInputChange(e) {
    const newVal = e.target.value
    if (newVal.match(/^[+-\d]\d*$/) || newVal === '') this.myInput = newVal
    else e.target.value = this.myInput
  }

  @Ref('pipinput') readonly pipinput: HTMLInputElement
  startInputting() {
    this.inputting = true
    this.$nextTick(() => {
      this.pipinput.focus()
    })
  }

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

    if (this.rolloverNegative) {
      while (preResult > this.max) {
        preResult = preResult - this.max
        this.$emit('rollover')
      }
    } else preResult = Math.min(preResult, this.max)

    if (this.rollover) {
      while (preResult < 1) {
        preResult = this.max + preResult
        this.$emit('rollover')
      }
    } else {
      preResult = Math.max(0, preResult)
    }

    this.$emit('update', preResult)
    this.myInput = ''
  }
  
  cancelInput() {
    this.inputting = false
    this.myInput = ''
  }

}
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
  font-weight: bold;
  width: fit-content;
  margin-top: 2px;
  max-width: 30px;
}
.pipinput:focus {
  outline: none;
}
</style>
