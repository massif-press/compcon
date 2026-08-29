<template>
  <v-window-item>
    <cc-heading size="large">inputs</cc-heading>
    <cc-heading line>text field</cc-heading>
    <v-card
      flat
      border
    >
      <v-row justify="center">
        <v-col
          class="text-center"
          align-self="center"
        >
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
              :icon="icon"
            >
              <template
                v-if="showOptions"
                #options
              >
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
              :icon="icon"
            >
              <template
                v-if="showOptions"
                #options
              >
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
              :tooltip="showTooltip ? 'This is a tooltip' : undefined"
            >
              <template
                v-if="showOptions"
                #options
              >
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
        <v-col
          cols="3"
          style="min-width: 500px"
        >
          <v-card flat>
            <v-card-text>
              <v-btn-toggle
                v-model="inputType"
                density="compact"
                hide-details
              >
                <v-btn value="label">label</v-btn>
                <v-btn value="field">field</v-btn>
                <v-btn value="area">area</v-btn>
              </v-btn-toggle>
              <v-text-field
                v-model="label"
                density="compact"
                label="label"
                hide-details
                clearable
              />
              <v-select
                v-model="icon"
                density="compact"
                label="icon"
                hide-details
                :items="icons"
              />
              <v-select
                v-model="color"
                density="compact"
                label="color"
                hide-details
                clearable
                :items="colors"
              />
              <v-select
                v-model="variant"
                density="compact"
                label="variant"
                hide-details
                clearable
                :items="inputType === 'label' ? chipVariants : variants"
              />
              <v-select
                v-model="prependIcon"
                density="compact"
                label="prepend icon"
                hide-details
                clearable
                :items="icons"
              />
              <v-select
                v-model="appendIcon"
                density="compact"
                label="append icon"
                hide-details
                clearable
                :items="icons"
              />
              <v-text-field
                v-model="label"
                density="compact"
                label="label"
                hide-details
                clearable
              />
              <v-row>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showTooltip"
                    density="compact"
                    hide-details
                    label="tooltip"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showOptions"
                    density="compact"
                    hide-details
                    label="options"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-if="inputType !== 'label'"
                    v-model="showClearable"
                    density="compact"
                    hide-details
                    clearable
                    label="clearable"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-if="inputType !== 'label'"
                    v-model="showDetails"
                    density="compact"
                    hide-details
                    clearable
                    label="details"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <cc-heading line>select</cc-heading>
    <v-card
      flat
      border
    >
      <v-row justify="center">
        <v-col
          class="text-center"
          align-self="center"
        >
          <v-card-text>
            <cc-select
              v-model="selectedItem"
              :combobox="selectType === 'combo'"
              :autocomplete="selectType === 'auto'"
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
              ]"
            >
              <template
                v-if="showOptions"
                #options
              >
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
        <v-col
          cols="3"
          style="min-width: 500px"
        >
          <v-card flat>
            <v-card-text>
              <v-btn-toggle
                v-model="selectType"
                density="compact"
                hide-details
              >
                <v-btn value="select">select</v-btn>
                <v-btn value="combo">combobox</v-btn>
                <v-btn value="auto">autocomplete</v-btn>
              </v-btn-toggle>
              <v-text-field
                v-model="label"
                density="compact"
                label="label"
                hide-details
                clearable
              />
              <v-select
                v-model="icon"
                density="compact"
                label="icon"
                hide-details
                :items="icons"
              />
              <v-select
                v-model="color"
                density="compact"
                label="color"
                hide-details
                clearable
                :items="colors"
              />
              <v-select
                v-model="prependIcon"
                density="compact"
                label="prepend icon"
                hide-details
                clearable
                :items="icons"
              />
              <v-select
                v-model="appendIcon"
                density="compact"
                label="append icon"
                hide-details
                clearable
                :items="icons"
              />
              <v-select
                v-model="selectChipVariant"
                density="compact"
                label="chip variant"
                hide-details
                clearable
                :items="chipVariants"
              />
              <v-row dense>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showTooltip"
                    density="compact"
                    hide-details
                    label="tooltip"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showOptions"
                    density="compact"
                    hide-details
                    label="options"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showClearable"
                    density="compact"
                    hide-details
                    clearable
                    label="clearable"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showDetails"
                    density="compact"
                    hide-details
                    clearable
                    label="details"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="multiple"
                    density="compact"
                    hide-details
                    clearable
                    label="multiple"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="lightChip"
                    density="compact"
                    hide-details
                    clearable
                    label="outlined chip color override"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <cc-heading line>numeric</cc-heading>
    <v-card
      flat
      border
    >
      <v-row justify="center">
        <v-col
          class="text-center"
          align-self="center"
        >
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
              :icon="icon"
            >
              <template
                v-if="showOptions"
                #options
              >
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
        <v-col
          cols="3"
          style="min-width: 500px"
        >
          <v-card flat>
            <v-card-text>
              <v-text-field
                v-model="label"
                density="compact"
                label="label"
                hide-details
                clearable
              />
              <v-select
                v-model="icon"
                density="compact"
                label="icon"
                hide-details
                :items="icons"
              />
              <v-select
                v-model="color"
                density="compact"
                label="color"
                hide-details
                clearable
                :items="colors"
              />
              <v-select
                v-model="prependIcon"
                density="compact"
                label="prepend icon"
                hide-details
                clearable
                :items="icons"
              />
              <v-select
                v-model="appendIcon"
                density="compact"
                label="append icon"
                hide-details
                clearable
                :items="icons"
              />
              <v-text-field
                v-model.number="min"
                density="compact"
                label="min"
                hide-details
                type="number"
              />
              <v-text-field
                v-model.number="max"
                density="compact"
                label="max"
                hide-details
                type="number"
              />

              <v-row dense>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showTooltip"
                    density="compact"
                    hide-details
                    label="tooltip"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showOptions"
                    density="compact"
                    hide-details
                    label="options"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showClearable"
                    density="compact"
                    hide-details
                    clearable
                    label="clearable"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showDetails"
                    density="compact"
                    hide-details
                    clearable
                    label="details"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showControls"
                    density="compact"
                    hide-details
                    clearable
                    label="controls"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <cc-heading line>tickbar</cc-heading>
    <v-card
      flat
      border
    >
      <v-row justify="center">
        <v-col
          class="text-center"
          align-self="center"
        >
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
                :controls="showControls"
              >
                <template
                  v-if="showOptions"
                  #options
                >
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
        <v-col
          cols="3"
          style="min-width: 500px"
        >
          <v-card flat>
            <v-card-text>
              <v-text-field
                v-model="label"
                density="compact"
                hide-details
                clearable
                label="label"
              />
              <v-select
                v-model="icon"
                density="compact"
                label="icon"
                hide-details
                :items="icons"
              />
              <v-select
                v-model="color"
                density="compact"
                label="color"
                hide-details
                clearable
                :items="colors"
              />
              <v-select
                v-model="bgColor"
                density="compact"
                label="bg-color"
                hide-details
                clearable
                :items="colors"
              />
              <v-select
                v-model="size"
                density="compact"
                label="size"
                hide-details
                :items="sizes"
              />
              <v-text-field
                v-model.number="ticks"
                density="compact"
                hide-details
                label="length"
              />

              <v-row dense>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showTooltip"
                    density="compact"
                    hide-details
                    label="tooltip"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showOptions"
                    density="compact"
                    hide-details
                    label="options"
                  />
                </v-col>

                <v-col cols="auto">
                  <v-checkbox
                    v-model="showDetails"
                    density="compact"
                    hide-details
                    clearable
                    label="details"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showControls"
                    density="compact"
                    hide-details
                    clearable
                    label="controls"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showDisplay"
                    density="compact"
                    hide-details
                    clearable
                    label="display"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showClearable"
                    density="compact"
                    hide-details
                    clearable
                    label="clearable"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-checkbox
                    v-model="showValTooltips"
                    density="compact"
                    hide-details
                    clearable
                    label="show value tooltips"
                  />
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

<script setup lang="ts">
  import { ref } from 'vue'

  defineOptions({ name: 'ui-test-buttons' })

  const label = ref('')
  const selectedItem = ref('item-1')
  const selectedNumber = ref(50)
  const tickValue = ref(0)
  const inputText = ref('hello world')
  const rteText = ref('<p>hello world</p>')
  const inputType = ref('label')
  const selectType = ref('select')
  const color = ref(undefined)
  const bgColor = ref(undefined)
  const variant = ref(undefined)
  const block = ref(false)
  const prependIcon = ref(undefined)
  const appendIcon = ref(undefined)
  const icon = ref('cc:campaign')
  const showTooltip = ref(false)
  const showOptions = ref(false)
  const showClearable = ref(false)
  const showDetails = ref(false)
  const multiple = ref(false)
  const selectChipVariant = ref(undefined)
  const lightChip = ref(false)
  const showControls = ref(false)
  const showDisplay = ref(true)
  const showValTooltips = ref(false)
  const size = ref('default')
  const icons = ref([
    '',
    'cc:campaign',
    'mdi-alert',
    'cc:pilot',
    'mdi-cog',
    'cc:kinetic',
    'mdi-content-save',
    'cc:encounter',
    'mdi-help',
  ])
  const colors = ref([
    'primary',
    'secondary',
    'accent',
    'damage--heat',
    'damage--energy',
    'exotic',
    'cyan',
  ])
  const variants = ref(['default', 'outlined'])
  const chipVariants = ref(['tonal', 'outlined', 'text'])
  const sizes = ref(['x-small', 'small', 'default', 'large', 'x-large'])
  const min = ref(0)
  const max = ref(100)
  const ticks = ref(6)
</script>
