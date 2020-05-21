<template>
  <div>
    <v-row no-gutters align="start" :justify="justify">
      <v-col v-if="!flipInput" cols="auto">
        <slot />
      </v-col>
      <v-col v-if="!flipInput && !hideValues" cols="auto" class="heading h3">
        <span v-if="!hideMax" v-html="`: ${current}${hideMax ? '' : `/${max}`}`" />
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
      <v-col v-if="flipInput && !hideValues" cols="auto" class="heading h3">
        <span v-if="!hideMax" v-html="`${current}${hideMax ? '' : `/${max}`}`" />
      </v-col>
      <v-col v-if="clearable" cols="auto">
        <v-btn icon small @click="$emit('update', 0)">
          <v-icon :color="color">clear</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-rating
      v-if="!noPips && !maxExceeded"
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
    <div v-else-if="maxExceeded">
      <v-icon :large="large" :small="small" :color="color" v-html="fullIcon" />
      <span class="flavor-text subtle--text">x</span>
      <span class="heading h3">{{ current }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from 'vue-property-decorator'

@Component({ name: 'tick-bar' })
export default class CCTickBar extends Vue {
  created(): void {
    this.lock = true
    if (!this.readonly) {
      this.model = this.current > this.max ? this.max : this.current
    } else this.model = this.max
  }

  mounted(): void {
    this.$nextTick(() => {
      this.lock = false
    })
  }

  @Prop({ type: String, required: false, default: '' })
  readonly label: string

  @Prop({ type: String, required: false, default: 'start' })
  readonly justify: string
  @Prop({ type: Boolean })
  readonly small?: boolean
  @Prop({ type: Boolean })
  readonly large?: boolean
  @Prop({ type: String, required: false, default: 'mdi-hexagon-outline' })
  readonly emptyIcon: string
  @Prop({ type: String, required: false, default: 'mdi-hexagon' })
  readonly fullIcon: string
  @Prop({ type: String, required: false, default: 'accent' })
  readonly color: string
  @Prop({ type: String, required: false, default: 'panel' })
  readonly bgColor: string
  @Prop({ type: Boolean })
  readonly noPips?: boolean
  @Prop({ type: Boolean })
  readonly hideMax?: boolean
  @Prop({ type: Boolean })
  readonly hideValues?: boolean

  @Prop({ type: Boolean })
  readonly readonly?: boolean
  @Prop({ type: Boolean })
  readonly noInput?: boolean
  @Prop({ type: Boolean })
  readonly flipInput?: boolean
  @Prop({ type: Boolean })
  readonly clearable?: boolean
  @Prop({ type: Boolean })
  readonly numberOnly?: boolean

  @Prop({ type: Number, required: true })
  readonly current!: number
  @Prop({ type: Number, required: true })
  readonly max!: number
  @Prop({ type: [Number, String], required: false })
  readonly maxLength?: number

  model = 0
  lock = true
  inputting = false
  myInput = ''

  @Watch('model')
  onModelChange(val: number): void {
    if (!this.lock && !isNaN(val)) {
      this.$emit('update', val)
    }
  }

  onInputChange(e): void {
    const newVal = e.target.value
    if (newVal.match(/^[+-\d]\d*$/) || newVal === '') this.myInput = newVal
    else e.target.value = this.myInput
  }

  @Ref('pipinput') readonly pipinput: HTMLInputElement
  startInputting(): void {
    this.inputting = true
    this.$nextTick(() => {
      this.pipinput.focus()
    })
  }

  get maxExceeded(): boolean {
    if (this.numberOnly) return true
    if (!this.maxLength) return false
    return this.max > this.maxLength
  }

  sendInput(): void {
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

    this.$emit('update', preResult)
    this.myInput = ''
  }

  cancelInput(): void {
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
