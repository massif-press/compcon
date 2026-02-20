<template>
  <v-col :cols="cols">
    <fieldset>
      <legend class="font-weight-bold caption text-primary px-2 text-center">{{ title }}</legend>
      <div v-if="showUpperSection"
        style="min-width: 12vw">
        <blank-line :height="60" />
      </div>
      <blank-line v-else
        :height="60" />

      <v-row v-if="showMaxLabel"
        dense
        align="center"
        class="mb-n2">
        <v-col><v-divider /></v-col>
        <v-col cols="auto"><span class="text-primary caption">{{ maxLabel }}</span></v-col>
        <v-col><v-divider /></v-col>
      </v-row>

      <div v-if="!blank && showValue"
        class="text-center heading h3"
        v-text="value" />
      <blank-line v-else-if="showValue"
        :height="26"
        :class="marginClass" />
    </fieldset>
  </v-col>
</template>

<script>
export default {
  name: 'PrintHpBlock',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: null
    },
    maxLabel: {
      type: String,
      default: ''
    },
    cols: {
      type: [String, Number],
      default: 4
    },
    blank: {
      type: Boolean,
      default: false
    },
    showUpperSection: {
      type: Boolean,
      default: true
    },
    showMaxLabel: {
      type: Boolean,
      default: true
    },
    showValue: {
      type: Boolean,
      default: true
    },
    marginClass: {
      type: String,
      default: 'mb-1'
    }
  }
}
</script>