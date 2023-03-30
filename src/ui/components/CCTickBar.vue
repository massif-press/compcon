<template>
  <div>
    <v-row
      no-gutters
      align="start"
      :justify="justify"
      :class="`${$vuetify.display.smAndDown ? 'my-n1' : ''}`"
    >
      <v-col v-if="!flipInput" cols="auto">
        <slot />
      </v-col>
      <v-col v-if="!flipInput && !hideValues" cols="auto" class="heading h3">
        <span
          v-if="!hideMax"
          v-html="`: ${current}${hideMax ? '' : `/${max}`}`"
        />
      </v-col>
      <v-col
        v-if="!noInput && !readonly"
        cols="auto"
        :class="!large ? 'mt-n1' : ''"
      >
        <v-fade-transition leave-absolute>
          <v-btn
            v-if="!inputting"
            icon
            small
            class="fade-select"
            @click="startInputting"
          >
            <v-icon :small="small" :color="color">mdi-keyboard</v-icon>
          </v-btn>
          <div v-else style="position: relative">
            <input
              ref="pipinput"
              type="text"
              class="pipinput mx-2"
              :style="`text-align: ${
                flipInput ? 'right' : 'left; position: absolute;'
              }; color: rgb(var(--v-theme-stark))`"
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
        <span
          v-if="!hideMax"
          v-html="`${current}${hideMax ? '' : `/${max}`}`"
        />
      </v-col>
      <v-col v-if="clearable" cols="auto">
        <v-btn icon small @click="$emit('update', 0)">
          <v-icon :color="color">clear</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters align="center" :justify="justify" class="mt-0">
      <v-col v-if="!hideButtons" cols="auto" class="mx-n1">
        <v-btn
          icon
          small
          class="fade-select"
          @click="$emit('update', model - 1)"
        >
          <v-icon :color="color">mdi-minus</v-icon>
        </v-btn>
      </v-col>
      <v-col v-if="!noPips && !maxExceeded" cols="auto">
        <v-rating
          v-model="model"
          :class="`d-inline-block ${$vuetify.display.smAndDown ? 'my-n1' : ''}`"
          density="compact"
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
      </v-col>
      <div v-else-if="maxExceeded">
        <v-icon
          :large="large"
          :small="small"
          :color="color"
          v-html="fullIcon"
        />
        <span class="flavor-text text-subtle">x</span>
        <span class="heading h3">{{ current }}</span>
      </div>
      <v-col v-if="!hideButtons" cols="auto" class="mx-n1">
        <v-btn
          icon
          small
          class="fade-select"
          @click="$emit('update', model + 1)"
        >
          <v-icon :color="color">mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
export default {
  name: 'tick-bar',
  props: {
    label: {
      type: String,
      required: false,
      default: '',
    },
    justify: {
      type: String,
      required: false,
      default: 'start',
    },
    hideButtons: {
      type: Boolean,
    },
    small: {
      type: Boolean,
    },
    large: {
      type: Boolean,
    },
    emptyIcon: {
      type: String,
      required: false,
      default: 'mdi-hexagon-outline',
    },
    fullIcon: {
      type: String,
      required: false,
      default: 'mdi-hexagon',
    },
    color: {
      type: String,
      required: false,
      default: 'accent',
    },
    bgColor: {
      type: String,
      required: false,
      default: 'panel',
    },
    noPips: {
      type: Boolean,
    },
    hideMax: {
      type: Boolean,
    },
    hideValues: {
      type: Boolean,
    },
    readonly: {
      type: Boolean,
    },
    noInput: {
      type: Boolean,
    },
    flipInput: {
      type: Boolean,
    },
    clearable: {
      type: Boolean,
    },
    numberOnly: {
      type: Boolean,
    },
    current: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    model: 0,
    lock: true,
    inputting: false,
    myInput: '',
  }),
  watch: {
    model(val: number): void {
      if (!this.lock && !isNaN(val)) {
        this.$emit('update', val);
      }
    },
  },
  computed: {
    maxExceeded(): boolean {
      return this.current > this.max;
    },
  },
  methods: {
    onInputChange(e): void {
      const newVal = e.target.value;
      if (newVal.match(/^[+-\d]\d*$/) || newVal === '') this.myInput = newVal;
      else e.target.value = this.myInput;
    },
    sendInput(): void {
      const thisInput = this.myInput;
      if (!thisInput.match(/\d/)) return;

      this.inputting = false;

      let preResult = this.current;

      if (thisInput === '') return;
      else if (thisInput.startsWith('+')) {
        preResult += parseInt(thisInput.substr(1));
      } else if (thisInput.startsWith('-')) {
        preResult -= parseInt(thisInput.substr(1));
      } else {
        preResult = parseInt(thisInput);
      }

      this.$emit('update', preResult);
      this.myInput = '';
    },

    cancelInput(): void {
      this.inputting = false;
      this.myInput = '';
    },
    startInputting(): void {
      this.inputting = true;
      this.$nextTick(() => {
        this.pipinput.focus();
      });
    },
  },
  created(): void {
    this.lock = true;
    if (!this.readonly) {
      this.model = this.current > this.max ? this.max : this.current;
    } else this.model = this.max;
  },
  mounted(): void {
    this.$nextTick(() => {
      this.lock = false;
    });
  },
};
</script>

<style>
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

.v-rating--dense .v-icon {
  padding: 0;
  margin-left: -4px;
  margin-right: -4px;
}
</style>
