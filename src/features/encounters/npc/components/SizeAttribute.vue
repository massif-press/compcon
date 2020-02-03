<template>
  <v-col :cols="cols">
    <v-card tile outlined class="text-center">
      <v-card-title
        :class="`${color} white--text caption pa-1`"
        style="font-weight: bold; max-height: 28px; font-size: 15px!important"
      >
        SIZE
        <v-menu
          v-model="menu"
          :value="editable || (selectable && stats.Sizes.length > 1)"
          right
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-icon
              dark
              small
              class="fadeSelect"
              v-on="on"
              v-html="editable ? 'mdi-circle-edit-outline' : 'mdi-resize'"
            />
          </template>
          <v-card>
            <v-card-text class="pa-2">
              <v-btn
                v-for="i in editable ? allSizes : stats.Sizes"
                :key="`size_${i}`"
                style="width: 80px; height: 80px"
                class="ma-3"
                icon
                color="primary"
                @click="stats.Size = i"
              >
                <v-icon v-if="i === 0.5" size="80">cci-size-half</v-icon>
                <v-icon v-else size="80">cci-size-{{ i }}</v-icon>
              </v-btn>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-card-title>
      <v-card-text class="pa-1 text--text">
        <span class="heading h2">{{ parseFloat(stats.Size) === 0.5 ? '½' : stats.Size }}</span>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'size-attribute',
  props: {
    stats: {
      type: Object,
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
    selectable: {
      type: Boolean,
    },
  },
  data: () => ({
    allSizes: [0.5, 1, 2, 3, 4],
    model: 0,
    menu: false,
  }),
})
</script>
