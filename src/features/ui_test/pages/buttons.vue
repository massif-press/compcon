<template>
  <v-window-item>
    <cc-heading size="large">buttons</cc-heading>
    <cc-heading line>standard</cc-heading>
    <v-card
      flat
      border
    >
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
                  :block="block && buttonType === 'std'"
                  :tooltip="showTooltip ? 'This is a tooltip' : undefined"
                  :prepend-icon="prependIcon"
                  :append-icon="appendIcon"
                >
                  {{ label }}
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
                  <template
                    v-if="subtitle"
                    #subtitle
                  >
                    {{ infotext }}
                  </template>
                  <template
                    v-if="infotext"
                    #info
                  >
                    {{ subtitle }}
                  </template>
                </cc-button>
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
        <v-divider vertical />
        <v-col
          cols="3"
          style="min-width: 400px"
        >
          <v-card flat>
            <v-card-text>
              <v-btn-toggle
                v-model="buttonType"
                density="compact"
                hide-details
                @update:model-value="block = false"
              >
                <v-btn value="std">standard</v-btn>
                <v-btn value="stk">stacked</v-btn>
                <v-btn value="icn">icon</v-btn>
              </v-btn-toggle>
              <v-text-field
                v-model="label"
                density="compact"
                label="label"
                hide-details
                clearable
              />
              <v-text-field
                v-if="buttonType === 'std' && block"
                v-model="subtitle"
                density="compact"
                label="subtitle"
                hide-details
                clearable
              />
              <v-text-field
                v-if="buttonType === 'std' && block"
                v-model="infotext"
                density="compact"
                label="info text"
                hide-details
                clearable
              />
              <v-text-field
                v-model="label"
                density="compact"
                label="label"
                hide-details
                clearable
              />
              <v-select
                v-if="buttonType === 'icn'"
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
                :items="colors"
              />
              <v-select
                v-model="size"
                density="compact"
                label="size"
                hide-details
                :items="sizes"
              />
              <v-select
                v-model="variant"
                density="compact"
                label="variant"
                hide-details
                :items="['default', 'outlined', 'tonal', 'text']"
              />
              <v-select
                v-if="buttonType !== 'icn'"
                v-model="prependIcon"
                density="compact"
                label="prepend icon"
                hide-details
                :items="['', ...icons]"
              />
              <v-select
                v-if="buttonType === 'std'"
                v-model="appendIcon"
                density="compact"
                label="append icon"
                hide-details
                :items="['', ...icons]"
              />
              <v-checkbox
                v-if="buttonType === 'std'"
                v-model="block"
                density="compact"
                hide-details
                label="block"
              />
              <v-checkbox
                v-if="buttonType === 'std'"
                v-model="showTooltip"
                density="compact"
                hide-details
                label="tooltip"
              />
              <v-checkbox
                v-if="buttonType !== 'icn'"
                v-model="showOptions"
                density="compact"
                hide-details
                label="options"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <cc-heading line>toggles</cc-heading>
    <v-card
      flat
      border
    >
      <v-row justify="center">
        <v-col align-self="center">
          <v-card-text>
            <v-row justify="center">
              <v-col :cols="block ? '' : 'auto'">
                <cc-switch
                  v-if="toggleType === 'swi'"
                  v-model="toggle"
                  :label="toggleLabel"
                  :color="toggleColor"
                  :active-color="toggleActiveColor"
                  :bg-color="bgColor"
                  :size="size"
                  :variant="variant"
                  :tooltip="showTooltip ? 'This is a tooltip' : undefined"
                  :prepend-icon="prependIcon"
                  :on-icon="onIcon"
                  :off-icon="offIcon"
                />
                <cc-checkbox
                  v-else-if="toggleType === 'chk'"
                  v-model="toggle"
                  :label="toggleLabel"
                  :color="toggleColor"
                  :active-color="toggleActiveColor"
                  :bg-color="bgColor"
                  :size="size"
                  :variant="variant"
                  :tooltip="showTooltip ? 'This is a tooltip' : undefined"
                  :prepend-icon="prependIcon"
                  :on-icon="onIcon"
                  :off-icon="offIcon"
                />
                <CCRadio
                  v-else-if="toggleType === 'rad'"
                  v-model="toggle"
                  :label="toggleLabel"
                  :color="toggleColor"
                  :active-color="toggleActiveColor"
                  :bg-color="bgColor"
                  :size="size"
                  :variant="variant"
                  :tooltip="showTooltip ? 'This is a tooltip' : undefined"
                  :prepend-icon="prependIcon"
                  :on-icon="onIcon"
                  :off-icon="offIcon"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
        <v-divider vertical />
        <v-col
          cols="3"
          style="min-width: 400px"
        >
          <v-card flat>
            <v-card-text>
              <v-btn-toggle
                v-model="toggleType"
                density="compact"
                hide-details
                @update:model-value="block = false"
              >
                <v-btn value="swi">switch</v-btn>
                <v-btn value="chk">checkbox</v-btn>
                <v-btn value="rad">radio</v-btn>
              </v-btn-toggle>

              <v-text-field
                v-model="toggleLabel"
                density="compact"
                label="label"
                hide-details
                clearable
              />

              <v-select
                v-model="bgColor"
                density="compact"
                label="background color"
                hide-details
                clearable
                :items="colors"
              />
              <v-select
                v-model="toggleActiveColor"
                density="compact"
                label="active color"
                hide-details
                clearable
                :items="colors"
              />
              <v-select
                v-model="toggleColor"
                density="compact"
                label="inactive color"
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
              <v-select
                v-model="prependIcon"
                density="compact"
                label="prepend icon"
                hide-details
                clearable
                :items="icons"
              />
              <v-select
                v-if="toggleType === 'swi' || toggleType === 'chk'"
                v-model="onIcon"
                density="compact"
                label="on icon"
                hide-details
                clearable
                :items="icons"
              />
              <v-select
                v-if="toggleType === 'swi' || toggleType === 'chk'"
                v-model="offIcon"
                density="compact"
                label="off icon"
                hide-details
                clearable
                :items="icons"
              />

              <v-checkbox
                v-model="showTooltip"
                density="compact"
                hide-details
                label="tooltip"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-window-item>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import CCRadio from '@/ui/components/buttons/CCRadio.vue'

  defineOptions({ name: 'ui-test-buttons' })

  const toggle = ref(false)
  const label = ref('button text')
  const toggleLabel = ref('')
  const subtitle = ref('subtitle')
  const infotext = ref('details')
  const buttonType = ref('std')
  const color = ref('primary')
  const size = ref('default')
  const variant = ref('default')
  const block = ref(false)
  const prependIcon = ref('')
  const appendIcon = ref('')
  const icon = ref('cc:campaign')
  const showTooltip = ref(false)
  const showOptions = ref(false)
  const toggleType = ref('swi')
  const bgColor = ref('panel')
  const toggleActiveColor = ref('success')
  const toggleColor = ref('error')
  const onIcon = ref('')
  const offIcon = ref('')
  const icons = ref([
    'cc:campaign',
    'mdi-alert',
    'cc:pilot',
    'mdi-cog',
    'cc:kinetic',
    'mdi-content-save',
    'cc:encounter',
    'mdi-help',
    'mdi-cancel',
    'cc:monist',
  ])
  const colors = ref([
    'primary',
    'secondary',
    'accent',
    'damage--heat',
    'damage--energy',
    'exotic',
    'cyan',
    'panel',
    'overcharge',
    'success',
    'warning',
    'error',
  ])
  const sizes = ref(['default', 'x-small', 'small', 'large', 'x-large', 'xx-large'])
</script>
