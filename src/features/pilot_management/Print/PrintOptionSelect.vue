<template>
  <div>
    <span class="heading h3 accent--text">{{ title }}</span>
    <v-item-group :mandatory="mandatory" :multiple="multiple">
      <v-row dense justify="space-around" align="center">
        <v-col v-for="i in items" :key="i.text" :cols="multiple && '3'">
          <v-item v-slot:default="{ active, toggle }">
            <v-card
              :color="active ? 'primary' : ''"
              class="d-flex align-center text-center"
              :min-width="!multiple ? '225px' : ''"
              min-height="100%"
              :dark="!multiple"
              :outlined="multiple"
              @click="toggle"
            >
              <v-card-text>
                <v-scroll-y-transition>
                  <div>
                    <v-icon v-if="i.icon" :size="multiple ? 40 : 60">{{ i.icon }}</v-icon>
                    <br v-if="i.icon" />
                    <span :class="`font-weight-bold ${active && 'white--text'}`">{{ i.text }}</span>
                  </div>
                </v-scroll-y-transition>
              </v-card-text>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-item-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'print-option-select',
  props: {
    title: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    mandatory: {
      type: Boolean,
      required: false,
    },
    multiple: {
      type: Boolean,
      required: false,
    },
  },
})
</script>
