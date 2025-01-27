<template>
  <v-window-item>
    <cc-heading size="large">panels</cc-heading>

    <cc-heading size="small" line>standard</cc-heading>

    <v-card flat border>
      <v-row justify="center">
        <v-col align-self="center">
          <v-card-text>
            <cc-panel :border="border" :variant="variant">
              <span v-html="loremIpsum" />
            </cc-panel>
          </v-card-text>
        </v-col>
        <v-divider vertical />
        <v-col cols="3" style="min-width: 400px">
          <v-card flat>
            <v-card-text>
              <v-select
                density="compact"
                label="variant"
                hide-details
                clearable
                v-model="variant"
                :items="variants" />
              <v-checkbox density="compact" hide-details v-model="border" label="border" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- <cc-heading size="small" line>expandable</cc-heading>

    <v-card flat border>
      <v-row justify="center">
        <v-col align-self="center">
          <v-card-text>panel component</v-card-text>
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
                v-model="border"
                label="options" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card> -->
  </v-window-item>
</template>

<script lang="ts">
export default {
  name: 'ui-test-panels',
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
    border: false,
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
    variants: ['default', 'flavor', 'fluff', 'admin', 'emphasis', 'subtle'],
    loremIpsum:
      '<p>Lorem ipsum odor amet, consectetuer adipiscing elit. Nisi aliquet venenatis egestas mi dictum. Etiam enim iaculis eleifend eu facilisi mauris vitae dictum. Duis dictum ultrices montes laoreet scelerisque sapien habitant. Fermentum nisi condimentum habitant porta ex platea. Fringilla vel mollis fusce congue ac quisque hac rhoncus. Hac consequat torquent velit parturient proin maecenas mollis nascetur porta. Adipiscing posuere turpis fames aliquet facilisis, hac integer netus. Venenatis nulla aptent accumsan, sed hendrerit fusce varius. Habitant conubia egestas nulla placerat ac montes.</p><p>Nulla sociosqu cras nibh sociosqu nam ex platea platea. Felis adipiscing duis; suspendisse facilisi duis felis iaculis risus malesuada. Cubilia morbi ad dui commodo maximus. Auctor tincidunt condimentum quisque nullam blandit aliquam leo aenean. Hendrerit cras rutrum neque sit, urna volutpat. Erat parturient pellentesque, tempor ultricies aptent gravida. Proin purus magna lacus cras volutpat nascetur nulla mi. Magnis nullam malesuada ac mi imperdiet tempus magnis euismod vel.</p>',
  }),
};
</script>
