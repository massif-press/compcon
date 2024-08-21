<template>
  <v-row no-gutters align="center" :justify="justify">
    <v-col cols="auto">
      <slot />
    </v-col>
    <v-col cols="auto" class="heading h4">
      <div v-text="`: ${modelValue}/${max}`" />
    </v-col>
    <v-col cols="auto">
      <v-fade-transition leave-absolute>
        <v-btn v-if="!inputting" icon size="x-small" variant="plain" @click="startInputting">
          <v-icon :size="size" :color="color">mdi-keyboard</v-icon>
        </v-btn>
        <div v-else class="mb-2 mt-1 ml-2">
          <input
            ref="pipInput"
            v-model="ratingValue"
            class="pipInput"
            @blur="inputting = false"
            @keyup.escape="inputting = false"
            @keyup.enter="inputting = false" />
        </div>
      </v-fade-transition>
    </v-col>
  </v-row>
  <v-row no-gutters align="center" :justify="justify" class="my-n4">
    <v-col cols="auto" class="mx-n1">
      <v-btn icon size="small" variant="plain" @click="$emit('update:modelValue', modelValue - 1)">
        <v-icon :color="color" icon="mdi-minus" />
      </v-btn>
    </v-col>
    <v-col v-if="!maxExceeded" cols="auto">
      <v-rating
        v-model="ratingValue"
        density="compact"
        hover
        :length="max"
        :size="size"
        :empty-icon="emptyIcon"
        :full-icon="fullIcon"
        color="panel"
        :active-color="color" />
    </v-col>
    <div v-else>
      <v-icon :size="size" :color="color" v-html="fullIcon" />
      <div class="flavor-text text-disabled">x</div>
      <div class="heading h3">{{ modelValue }}</div>
    </div>
    <v-col cols="auto" class="mx-n1">
      <v-btn icon small variant="plain" @click="$emit('update:modelValue', modelValue + 1)">
        <v-icon :color="color">mdi-plus</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'tick-bar',
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
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

    size: {
      type: String,
      required: false,
    },

    clearable: {
      type: Boolean,
    },

    max: {
      type: Number,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data: () => ({
    inputting: false,
    myInput: '',
  }),
  computed: {
    ratingValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        let val = isNaN(Number(value)) ? 0 : Number(value);
        this.$emit('update:modelValue', val);
      },
    },
    maxExceeded(): boolean {
      return this.modelValue > this.max;
    },
  },

  methods: {
    startInputting(): void {
      this.inputting = true;
      this.$nextTick(() => {
        (this.$refs as any).pipInput.focus();
        (this.$refs as any).pipInput.select();
      });
    },
  },
};
</script>

<style>
.pipInput {
  height: 22px;
  padding: 2px;
  font-size: 12px;
  margin-bottom: 2px;
  border: 1px solid rgb(var(--v-theme-primary));
  width: fit-content;
  max-width: 30px;
}

.pipInput:focus {
  outline: none;
}
</style>
