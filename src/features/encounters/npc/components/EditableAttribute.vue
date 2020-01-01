<template>
  <v-col :cols="cols">
    <v-card tile outlined class="text-center">
      <v-card-title
        :class="`${color} white--text caption pa-1`"
        style="font-weight: bold; max-height: 20px; font-size: 15px!important"
      >
        {{ attr }}
        <v-icon v-if="editable && !editMode" dark small class="fadeSelect" @click="editMode = true">
          mdi-circle-edit-outline
        </v-icon>
      </v-card-title>
      <v-card-text class="pa-1 text--text">
        <v-text-field
          v-if="editMode"
          v-model="model"
          solo
          outlined
          filled
          dense
          hide-details
          autofocus
          type="number"
          @input="$emit('set', parseInt(model))"
          @blur="editMode = false"
          @keyup.enter="editMode = false"
          @focus="$event.target.select()"
        />
        <span v-else class="heading h2">{{ val }}</span>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'editable-attribute',
  props: {
    attr: {
      type: String,
      required: true,
    },
    val: {
      type: [String, Number],
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    cols: {
      type: [String, Number],
      required: false,
      default: '',
    },
    editable: {
      type: Boolean,
    },
  },
  data: () => ({
    model: 0,
    editMode: false,
  }),
  watch: {
    val() {
      this.model = this.val
    },
  },
})
</script>
