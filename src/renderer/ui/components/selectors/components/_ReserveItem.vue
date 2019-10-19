<template>
  <cc-titled-panel :title="reserve.Name" :icon="icon" :color="color">
    <v-row dense style="min-height: 70px">
      <v-col cols="auto" dense class="pr-0">
        <cc-tooltip simple inline content="Add Reserve">
          <v-btn
            block
            icon
            min-height="calc(100% - 8px)"
            class="pa-0 mr-6 fadeSelect"
            :color="color"
            @click="$emit('click')"
          >
            <v-icon size="80">cci-accuracy</v-icon>
          </v-btn>
        </cc-tooltip>
      </v-col>
      <v-col class="pl-0 ml-2">
        <p class="flavor-text text--text" v-html="reserve.Description" />
      </v-col>
    </v-row>
  </cc-titled-panel>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'reserve-item',
  props: {
    reserve: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    icon: {
      type: String,
      required: false,
      default: 'cci-barrage',
    },
  },
})
</script>
