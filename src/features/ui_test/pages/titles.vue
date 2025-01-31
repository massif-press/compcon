<template>
  <v-window-item>
    <cc-heading size="large">Titles</cc-heading>

    <cc-heading size="small" line>heading</cc-heading>

    <v-card flat border>
      <v-row justify="center">
        <v-col align-self="center">
          <v-card-text>
            <cc-heading
              :color="color"
              :size="size"
              :icon="icon"
              :density="density"
              :line="line"
              :filled="filled">
              <span class="heading h3">heading component</span>
              subtitle
            </cc-heading>
          </v-card-text>
        </v-col>
        <v-divider vertical />
        <v-col cols="3" style="min-width: 400px">
          <v-card flat>
            <v-card-text>
              <v-select
                v-model="color"
                :items="colors"
                label="color"
                hide-details
                density="compact"
                clearable
                @click:clear="color = ''" />
              <v-select
                v-model="density"
                :items="densities"
                label="density"
                hide-details
                density="compact"
                clearable
                @click:clear="density = ''" />
              <v-checkbox v-model="line" label="line" hide-details density="compact" />
              <v-checkbox v-model="filled" label="filled" hide-details density="compact" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <cc-heading size="small" line>banner</cc-heading>

    <v-card flat border>
      <v-row justify="center">
        <v-col align-self="center">
          <v-card-text>banner component</v-card-text>
        </v-col>
        <v-divider vertical />
        <v-col cols="3" style="min-width: 400px">
          <v-card flat>
            <v-card-text></v-card-text>
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
    headingType: 'minor',
    color: '',
    size: '',
    density: '',
    line: false,
    filled: false,
    icon: 'cc:campaign',
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
    densities: ['default', 'compact', 'comfortable'],
  }),
};
</script>
