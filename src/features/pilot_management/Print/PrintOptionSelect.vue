<template>
  <div>
    <div class="heading h3 text-accent pb-2">{{ title }}</div>
    <v-item-group :mandatory="mandatory" :multiple="multiple">
      <v-row density="compact" justify="space-around" align="center">
        <v-col v-for="i in items">
          <v-item v-slot="{ isSelected, toggle }">
            <v-card
              :color="isSelected ? 'accent' : ''"
              class="d-flex align-center text-center"
              min-width="13vw"
              min-height="100%"
              variant="tonal"
              :ripple="false"
              @click="toggle"
            >
              <v-card-text>
                <v-scroll-y-transition>
                  <div>
                    <v-icon v-if="(i as any).icon" size="60">{{ (i as any).icon }}</v-icon>
                    <br v-if="(i as any).icon" />
                    <div :class="`font-weight-bold ${isSelected && 'text-white'}`">
                      {{ (i as any).title }}
                    </div>
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
export default {
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
};
</script>
