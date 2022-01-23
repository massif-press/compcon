<template>
  <cc-titled-panel :title="reserve.Name" :icon="icon" :color="color">
    <v-row dense style="min-height: 70px">
      <v-col cols="12" md="auto" dense class="pr-0">
        <v-btn
          v-if="$vuetify.breakpoint.smAndDown"
          :color="color"
          dark
          block
          @click="$emit('click')"
        >
          Add Resource
        </v-btn>
        <cc-tooltip v-else simple inline content="Add Reserve">
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
        <p v-html-safe="reserve.Description" class="flavor-text text--text" />
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
