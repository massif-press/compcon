<template>
  <v-window-item>
    <cc-heading size="large">buttons</cc-heading>

    <v-card flat border>
      <v-row justify="center">
        <v-col class="text-center" align-self="center">
          <v-card-text>
            <cc-button
              :icon="buttonType === 'icn' ? icon : undefined"
              :stacked="buttonType === 'stk' ? true : false"
              :color="color"
              :size="size"
              :variant="variant"
              :block="block"
              :tooltip="showTooltip ? 'This is a tooltip' : undefined"
              :prepend-icon="prependIcon"
              :append-icon="appendIcon">
              primary
              <template v-if="showOptions" #options>
                <v-list>
                  <v-list-item title="Example" />
                  <v-list-item title="Example" />
                  <v-list-item title="Example" />
                </v-list>
              </template>
            </cc-button>
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
                :items="['', 'mdi-alert', 'mdi-cog', 'mdi-content-save']" />
              <v-select
                v-if="buttonType === 'std'"
                density="compact"
                label="append icon"
                hide-details
                v-model="appendIcon"
                :items="['', 'mdi-alert', 'mdi-cog', 'mdi-content-save']" />
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

    <cc-heading size="small" class="mt-4">example buttons</cc-heading>
    <v-row align="center" justify="space-around">
      <v-col cols="auto">
        <cc-button size="x-small">Lorem ipsum</cc-button>
      </v-col>
      <v-col cols="auto">
        <cc-button color="secondary" variant="tonal" prepend-icon="cc:pilot">
          dolor sit amet
        </cc-button>
      </v-col>
      <v-col cols="auto">
        <cc-button color="error" variant="text">quis nostrum</cc-button>
      </v-col>
      <v-col cols="auto">
        <cc-button size="large" color="exotic" append-icon="cc:kinetic">
          consectetur
          <template #options>
            <v-list>
              <v-list-item title="adipiscing" subtitle="dolor sit amet" />
              <v-list-item title="tempor" subtitle="incididunt ut labore" />
              <v-list-item title="et dolore" subtitle="magna aliqua. Ut" />
            </v-list>
          </template>
        </cc-button>
      </v-col>
      <v-col cols="auto">
        <cc-button
          size="x-large"
          color="accent"
          variant="outlined"
          tooltip="ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit">
          Ut enim
        </cc-button>
      </v-col>
    </v-row>
    <br />

    <cc-button color="accent" block size="x-small" class="my-3">
      beatae vitae dicta sunt explicabo
    </cc-button>

    <cc-button color="success" options-icon="cc:encounter" block class="my-3">
      Nemo enim ipsam
      <template #subtitle>voluptatem quia voluptas sit aspernatur aut odit aut fugit</template>
      <template #info>sed quia consequuntur</template>
      <template #options>
        <v-card max-width="300px">
          <v-card-text>
            magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
            dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed
          </v-card-text>
        </v-card>
      </template>
    </cc-button>

    <cc-button
      block
      variant="outlined"
      color="accent"
      prepend-icon="mdi-alert"
      size="xx-large"
      class="my-3">
      exercitationem ullam
      <template #subtitle>
        laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem
      </template>
      <template #info>vel eum</template>
    </cc-button>

    <v-row>
      <v-col cols="auto" v-for="i in 3">
        <cc-button :icon="icons[i]" :size="sizes[i]" :color="colors[i]" class="my-3" />
      </v-col>
      <v-col cols="auto" v-for="i in 3">
        <cc-button
          variant="tonal"
          :icon="icons[i + 2]"
          :size="sizes[i + 2]"
          :color="colors[i + 2]"
          class="my-3" />
      </v-col>
      <v-col cols="auto" v-for="i in 3">
        <cc-button
          variant="text"
          :icon="icons[i + 4]"
          :size="sizes[i + 1]"
          :color="colors[i + 4]"
          class="my-3" />
      </v-col>
    </v-row>
  </v-window-item>
</template>

<script lang="ts">
export default {
  name: 'ui-test-buttons',
  data: () => ({
    buttonType: 'std',
    color: 'primary',
    size: 'default',
    variant: 'default',
    block: false,
    prependIcon: '',
    appendIcon: '',
    icon: 'cc:campaign',
    showTooltip: true,
    showOptions: true,
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
