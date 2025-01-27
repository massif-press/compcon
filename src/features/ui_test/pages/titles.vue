<template>
  <v-window-item>
    <cc-heading size="large">Titles</cc-heading>

    <cc-heading size="small" line>headings</cc-heading>

    <v-card flat border>
      <v-row justify="center">
        <v-col align-self="center">
          <v-card-text>title component</v-card-text>
        </v-col>
        <v-divider vertical />
        <v-col cols="3" style="min-width: 400px">
          <v-card flat>
            <v-card-text>
              <v-btn-toggle
                v-model="buttonType"
                density="compact"
                hide-details
                @update:model-value="block = false">
                <v-btn value="std">standard</v-btn>
                <v-btn value="stk">emphasis</v-btn>
                <v-btn value="icn">alert</v-btn>
              </v-btn-toggle>
              <v-text-field
                density="compact"
                label="label"
                hide-details
                v-model="label"
                clearable />
              <v-text-field
                v-if="buttonType === 'std' && block"
                density="compact"
                label="subtitle"
                hide-details
                v-model="subtitle"
                clearable />
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

    <cc-heading size="small" line>banners</cc-heading>

    <v-card flat border>
      <v-row justify="center">
        <v-col align-self="center">
          <v-card-text>banner component</v-card-text>
        </v-col>
        <v-divider vertical />
        <v-col cols="3" style="min-width: 400px">
          <v-card flat>
            <v-card-text>
              <v-btn-toggle
                v-model="buttonType"
                density="compact"
                hide-details
                @update:model-value="block = false">
                <v-btn value="std">standalone</v-btn>
                <v-btn value="std">banner</v-btn>
                <v-btn value="stk">stacked</v-btn>
              </v-btn-toggle>
              <v-text-field
                density="compact"
                label="label"
                hide-details
                v-model="label"
                clearable />
              <v-text-field
                v-if="buttonType === 'std' && block"
                density="compact"
                label="subtitle"
                hide-details
                v-model="subtitle"
                clearable />
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
  name: 'ui-test-titles',
  data: () => ({
    label: 'button text',
    subtitle: 'subtitle',
    infotext: 'info text',
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
