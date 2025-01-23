<template>
  <v-window-item>
    <cc-heading size="large">buttons</cc-heading>

    <v-card flat border>
      <v-row justify="center">
        <v-col align-self="center">
          <v-card-text>
            <v-row justify="center">
              <v-col :cols="block ? '' : 'auto'">
                <cc-button
                  :icon="buttonType === 'icn' ? icon : undefined"
                  :stacked="buttonType === 'stk' ? true : false"
                  :color="color"
                  :size="size"
                  :variant="variant"
                  :block="block && buttonType !== 'stk'"
                  :tooltip="showTooltip ? 'This is a tooltip' : undefined"
                  :prepend-icon="prependIcon"
                  :append-icon="appendIcon">
                  {{ label }}
                  <template v-if="showOptions" #options>
                    <v-list>
                      <v-list-item title="Example" />
                      <v-list-item title="Example" />
                      <v-list-item title="Example" />
                    </v-list>
                  </template>
                </cc-button>
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
        <v-divider vertical />
        <v-col cols="3" style="min-width: 400px">
          <v-card flat>
            <v-card-text>
              <v-btn-toggle v-model="buttonType" density="compact" hide-details>
                <v-btn value="std">standard</v-btn>
                <v-btn value="stk">stacked</v-btn>
                <v-btn value="icn">icon</v-btn>
              </v-btn-toggle>
              <v-text-field
                density="compact"
                label="label"
                hide-details
                v-model="label"
                clearable />
              <v-select
                v-if="buttonType === 'icn'"
                density="compact"
                label="icon"
                hide-details
                v-model="icon"
                :items="icons" />
              <v-select
                density="compact"
                label="color"
                hide-details
                v-model="color"
                :items="colors" />
              <v-select density="compact" label="size" hide-details v-model="size" :items="sizes" />
              <v-select
                density="compact"
                label="variant"
                hide-details
                v-model="variant"
                :items="['default', 'outlined', 'tonal', 'text']" />
              <v-select
                v-if="buttonType !== 'icn'"
                density="compact"
                label="prepend icon"
                hide-details
                v-model="prependIcon"
                :items="['', ...icons]" />
              <v-select
                v-if="buttonType === 'std'"
                density="compact"
                label="append icon"
                hide-details
                v-model="appendIcon"
                :items="['', ...icons]" />
              <v-checkbox
                v-if="buttonType === 'std'"
                density="compact"
                hide-details
                v-model="block"
                label="block" />
              <v-checkbox
                v-if="buttonType === 'std'"
                density="compact"
                hide-details
                v-model="showTooltip"
                label="tooltip" />
              <v-checkbox
                v-if="buttonType !== 'icn'"
                density="compact"
                hide-details
                v-model="showOptions"
                label="options" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-window-item>
</template>

<script lang="ts">
export default {
  name: 'ui-test-buttons',
  data: () => ({
    label: 'button text',
    buttonType: 'std',
    color: 'primary',
    size: 'default',
    variant: 'default',
    block: false,
    prependIcon: '',
    appendIcon: '',
    icon: 'cc:campaign',
    showTooltip: false,
    showOptions: false,
    icons: [
      'cc:campaign',
      'mdi-alert',
      'cc:pilot',
      'mdi-cog',
      'cc:kinetic',
      'mdi-content-save',
      'cc:encounter',
      'mdi-help',
    ],
    colors: ['primary', 'secondary', 'accent', 'damage--heat', 'damage--energy', 'exotic', 'cyan'],
    sizes: ['default', 'x-small', 'small', 'large', 'x-large', 'xx-large'],
  }),
};
</script>
