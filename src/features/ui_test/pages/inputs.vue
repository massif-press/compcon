<template>
  <v-window-item>
    <cc-heading size="large">inputs</cc-heading>
    <cc-heading line>text field</cc-heading>
    <v-card flat border>
      <v-row justify="center">
        <v-col class="text-center" align-self="center">
          <v-card-text>
            <cc-text-field
              v-if="inputType === 'field'"
              v-model="inputText"
              :color="color"
              :variant="variant"
              :block="block"
              :label="label"
              :tooltip="showTooltip ? 'This is a tooltip' : undefined"
              :prepend-inner-icon="prependIcon"
              :append-inner-icon="appendIcon"
              :clearable="showClearable"
              :details="
                showDetails ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' : undefined
              "
              :icon="icon">
              <template v-if="showOptions" #options>
                <v-list>
                  <v-list-item title="Example" />
                  <v-list-item title="Example" />
                  <v-list-item title="Example" />
                </v-list>
              </template>
            </cc-text-field>

            <cc-text-area
              v-if="inputType === 'area'"
              v-model="inputText"
              :color="color"
              :variant="variant"
              :block="block"
              :label="label"
              :tooltip="showTooltip ? 'This is a tooltip' : undefined"
              :prepend-inner-icon="prependIcon"
              :append-inner-icon="appendIcon"
              :clearable="showClearable"
              :details="
                showDetails ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' : undefined
              "
              :icon="icon">
              <template v-if="showOptions" #options>
                <v-list>
                  <v-list-item title="Example" />
                  <v-list-item title="Example" />
                  <v-list-item title="Example" />
                </v-list>
              </template>
            </cc-text-area>
            <cc-text-label
              v-if="inputType === 'label'"
              v-model="inputText"
              :label="label"
              :prepend-icon="prependIcon"
              :append-icon="appendIcon"
              :color="color"
              :variant="variant"
              :tooltip="showTooltip ? 'This is a tooltip' : undefined">
              <template v-if="showOptions" #options>
                <v-list>
                  <v-list-item title="Example" />
                  <v-list-item title="Example" />
                  <v-list-item title="Example" />
                </v-list>
              </template>
            </cc-text-label>
          </v-card-text>
        </v-col>
        <v-divider vertical />
        <v-col cols="3" style="min-width: 500px">
          <v-card flat>
            <v-card-text>
              <v-btn-toggle v-model="inputType" density="compact" hide-details>
                <v-btn value="label">label</v-btn>
                <v-btn value="field">field</v-btn>
                <v-btn value="area">area</v-btn>
              </v-btn-toggle>
              <v-text-field
                density="compact"
                label="label"
                hide-details
                v-model="label"
                clearable />
              <v-select density="compact" label="icon" hide-details v-model="icon" :items="icons" />
              <v-select
                density="compact"
                label="color"
                hide-details
                clearable
                v-model="color"
                :items="colors" />
              <v-select
                density="compact"
                label="variant"
                hide-details
                clearable
                v-model="variant"
                :items="inputType === 'label' ? chipVariants : variants" />
              <v-select
                density="compact"
                label="prepend icon"
                hide-details
                clearable
                v-model="prependIcon"
                :items="icons" />
              <v-select
                density="compact"
                label="append icon"
                hide-details
                clearable
                v-model="appendIcon"
                :items="icons" />
              <v-text-field
                density="compact"
                label="label"
                hide-details
                v-model="label"
                clearable />
              <v-row>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    v-model="showTooltip"
                    label="tooltip" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    v-model="showOptions"
                    label="options" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-if="inputType !== 'label'"
                    density="compact"
                    hide-details
                    clearable
                    v-model="showClearable"
                    label="clearable" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-if="inputType !== 'label'"
                    density="compact"
                    hide-details
                    clearable
                    v-model="showDetails"
                    label="details" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <cc-heading line>select</cc-heading>
    <v-card flat border>
      <v-row justify="center">
        <v-col class="text-center" align-self="center">
          <v-card-text>
            <cc-select
              :combobox="selectType === 'combo'"
              :autocomplete="selectType === 'auto'"
              v-model="selectedItem"
              :color="color"
              :label="label"
              :tooltip="showTooltip ? 'This is a tooltip' : undefined"
              :prepend-inner-icon="prependIcon"
              :append-inner-icon="appendIcon"
              :clearable="showClearable"
              :multiple="multiple"
              :chip-variant="selectChipVariant"
              :details="
                showDetails ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' : undefined
              "
              :icon="icon"
              :light-chip="lightChip"
              :items="[
                { title: 'Item 1', value: 'item-1' },
                { title: 'Item 2', value: 'item-2' },
                { title: 'Item 3', value: 'item-3' },
              ]">
              <template v-if="showOptions" #options>
                <v-list>
                  <v-list-item title="Example" />
                  <v-list-item title="Example" />
                  <v-list-item title="Example" />
                </v-list>
              </template>
            </cc-select>
          </v-card-text>
        </v-col>
        <v-divider vertical />
        <v-col cols="3" style="min-width: 500px">
          <v-card flat>
            <v-card-text>
              <v-btn-toggle v-model="selectType" density="compact" hide-details>
                <v-btn value="select">select</v-btn>
                <v-btn value="combo">combobox</v-btn>
                <v-btn value="auto">autocomplete</v-btn>
              </v-btn-toggle>
              <v-text-field
                density="compact"
                label="label"
                hide-details
                v-model="label"
                clearable />
              <v-select density="compact" label="icon" hide-details v-model="icon" :items="icons" />
              <v-select
                density="compact"
                label="color"
                hide-details
                clearable
                v-model="color"
                :items="colors" />
              <v-select
                density="compact"
                label="prepend icon"
                hide-details
                clearable
                v-model="prependIcon"
                :items="icons" />
              <v-select
                density="compact"
                label="append icon"
                hide-details
                clearable
                v-model="appendIcon"
                :items="icons" />
              <v-select
                density="compact"
                label="chip variant"
                hide-details
                clearable
                v-model="selectChipVariant"
                :items="chipVariants" />
              <v-row dense>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    v-model="showTooltip"
                    label="tooltip" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    v-model="showOptions"
                    label="options" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    clearable
                    v-model="showClearable"
                    label="clearable" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    clearable
                    v-model="showDetails"
                    label="details" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    clearable
                    v-model="multiple"
                    label="multiple" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    clearable
                    v-model="lightChip"
                    label="outlined chip color override" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <cc-heading line>numeric</cc-heading>
    <v-card flat border>
      <v-row justify="center">
        <v-col class="text-center" align-self="center">
          <v-card-text>
            <cc-number-field
              v-model.number="selectedNumber"
              :min="min"
              :max="max"
              :color="color"
              :label="label"
              :tooltip="showTooltip ? 'This is a tooltip' : undefined"
              :prepend-inner-icon="prependIcon"
              :append-inner-icon="appendIcon"
              :clearable="showClearable"
              :details="
                showDetails ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' : undefined
              "
              :controls="showControls"
              :icon="icon">
              <template v-if="showOptions" #options>
                <v-list>
                  <v-list-item title="Example" />
                  <v-list-item title="Example" />
                  <v-list-item title="Example" />
                </v-list>
              </template>
            </cc-number-field>
          </v-card-text>
        </v-col>
        <v-divider vertical />
        <v-col cols="3" style="min-width: 500px">
          <v-card flat>
            <v-card-text>
              <v-text-field
                density="compact"
                label="label"
                hide-details
                v-model="label"
                clearable />
              <v-select density="compact" label="icon" hide-details v-model="icon" :items="icons" />
              <v-select
                density="compact"
                label="color"
                hide-details
                clearable
                v-model="color"
                :items="colors" />
              <v-select
                density="compact"
                label="prepend icon"
                hide-details
                clearable
                v-model="prependIcon"
                :items="icons" />
              <v-select
                density="compact"
                label="append icon"
                hide-details
                clearable
                v-model="appendIcon"
                :items="icons" />
              <v-text-field
                density="compact"
                label="min"
                hide-details
                v-model.number="min"
                type="number" />
              <v-text-field
                density="compact"
                label="max"
                hide-details
                v-model.number="max"
                type="number" />

              <v-row dense>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    v-model="showTooltip"
                    label="tooltip" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    v-model="showOptions"
                    label="options" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    clearable
                    v-model="showClearable"
                    label="clearable" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    clearable
                    v-model="showDetails"
                    label="details" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    clearable
                    v-model="showControls"
                    label="controls" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <cc-heading line>tickbar</cc-heading>
    <v-card flat border>
      <v-row justify="center">
        <v-col class="text-center" align-self="center">
          <v-card-text>
            <v-row justify="center">
              <cc-tickbar
                v-model="tickValue"
                :color="color"
                :bg-color="bgColor"
                :icon="icon"
                :size="size"
                :ticks="ticks"
                :label="label"
                :display="showDisplay"
                :tooltip="showTooltip ? 'This is a tooltip' : undefined"
                :clearable="showClearable"
                :value-tooltips="showValTooltips"
                :details="
                  showDetails
                    ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
                    : undefined
                "
                :controls="showControls">
                <template v-if="showOptions" #options>
                  <v-list>
                    <v-list-item title="Example" />
                    <v-list-item title="Example" />
                    <v-list-item title="Example" />
                  </v-list>
                </template>
              </cc-tickbar>
            </v-row>
          </v-card-text>
        </v-col>
        <v-divider vertical />
        <v-col cols="3" style="min-width: 500px">
          <v-card flat>
            <v-card-text>
              <v-text-field
                density="compact"
                hide-details
                v-model="label"
                clearable
                label="label" />
              <v-select density="compact" label="icon" hide-details v-model="icon" :items="icons" />
              <v-select
                density="compact"
                label="color"
                hide-details
                clearable
                v-model="color"
                :items="colors" />
              <v-select
                density="compact"
                label="bg-color"
                hide-details
                clearable
                v-model="bgColor"
                :items="colors" />
              <v-select density="compact" label="size" hide-details v-model="size" :items="sizes" />
              <v-text-field density="compact" hide-details v-model.number="ticks" label="length" />

              <v-row dense>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    v-model="showTooltip"
                    label="tooltip" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    v-model="showOptions"
                    label="options" />
                </v-col>

                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    clearable
                    v-model="showDetails"
                    label="details" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    clearable
                    v-model="showControls"
                    label="controls" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    clearable
                    v-model="showDisplay"
                    label="display" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    clearable
                    v-model="showClearable"
                    label="clearable" />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    density="compact"
                    hide-details
                    clearable
                    v-model="showValTooltips"
                    label="show value tooltips" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <cc-heading line>rich text editor</cc-heading>
    <cc-rich-text-area v-model="rteText" />
  </v-window-item>
</template>

<script lang="ts">
export default {
  name: 'ui-test-buttons',
  data: () => ({
    label: '',
    selectedItem: 'item-1',
    selectedNumber: 50,
    tickValue: 0,
    inputText: 'hello world',
    rteText: '<p>hello world</p>',
    inputType: 'label',
    selectType: 'select',
    color: undefined,
    bgColor: undefined,
    variant: undefined,
    block: false,
    prependIcon: undefined,
    appendIcon: undefined,
    icon: 'cc:campaign',
    showTooltip: false,
    showOptions: false,
    showClearable: false,
    showDetails: false,
    multiple: false,
    selectChipVariant: undefined,
    lightChip: false,
    showControls: false,
    showDisplay: true,
    showValTooltips: false,
    size: 'default',
    icons: [
      '',
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
    variants: ['default', 'outlined'],
    chipVariants: ['tonal', 'outlined', 'text'],
    sizes: ['x-small', 'small', 'default', 'large', 'x-large'],
    min: 0,
    max: 100,
    ticks: 6,
  }),
};
</script>
