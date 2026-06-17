<template>
  <cc-dialog :close-on-click="false"
    :title="reserve.Name"
    :icon="reserve.Icon"
    :color="reserve.Color">
    <template #activator="{ open }">
      <cc-button :color="reserve.Color"
        :style="reserve.Used ? 'opacity: 0.5' : ''"
        :size="small || mobile ? 'small' : undefined"
        block
        :prepend-icon="reserve.Icon"
        @click="open">
        <template v-if="reserve.Used"
          #info>
          <v-icon icon="mdi-circle-off-outline" />
        </template>
        {{ reserve.Name }}
      </cc-button>
    </template>
    <template #toolbar-items="{ close }">
      <v-btn icon
        @click="remove(close)">
        <v-icon icon="mdi-delete" />
      </v-btn>
    </template>
    <div style="position: relative">
      <div style="position: absolute; top:0;right:0">
        <cc-lcp-info :item="reserve" />
      </div>

      <p v-html-safe="reserve.Description"
        class="flavor-text text-text pa-2" />
      <v-card-text v-if="reserve.ID != 'reserve_skill'">
        <v-row align="center"
          dense>
          <v-col>
            <div v-if="reserve.Type === 'Resources'">
              <cc-text-field v-model="reserve.ResourceName"
                color="primary"
                :label="reserve.ResourceLabel"
                variant="outlined" />
            </div>
            <div v-else-if="reserve.Type === 'Mech'">
              <span class="effect-text">{{ reserve.Description }}</span>
            </div>
            <div v-else>
              <div v-if="
                reserve.ID === 'reserve_bombardment' || reserve.ID === 'reserve_extendedharness'
              ">
                <span class="effect-text">{{ reserve.Description }}</span>
                <v-spacer class="pb-4" />
              </div>
              <div v-else>
                <cc-text-field v-model="reserve.ResourceName"
                  color="primary"
                  variant="outlined"
                  :label="reserve.ResourceLabel" />
              </div>
            </div>
          </v-col>
          <v-col v-if="reserve.Type !== 'Project'"
            cols="auto"
            class="ml-auto">
            <cc-switch v-model="reserve.ReserveUsed"
              density="compact"
              inset
              hide-details
              color="success"
              active-color="error"
              :label="$t('ui.fields.used')"
              :tooltip="$t('ui.tooltips.markThisResourceAsUsed')" />
          </v-col>
        </v-row>
        <br />
        <cc-text-area v-model="reserve.Note"
          color="primary"
          :label="$t('common.notes')" />
        <br />

        <cc-text-area v-model="reserve.ResourceCost"
          color="primary"
          :label="$t('ui.fields.costcomplications')"
          clearable />
      </v-card-text>
    </div>
  </cc-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import type { Reserve } from '@/classes/pilot/components/reserves/Reserve'

const { smAndDown: mobile } = useDisplay()

const props = withDefaults(defineProps<{
  reserve: Reserve
  small?: boolean
}>(), {
  small: false,
})

const emit = defineEmits<{ remove: []; update: [reserve: any] }>()

const dialog = ref(false)

function remove(close: () => void) {
  emit('remove');
  dialog.value = false;
  close();
}

function saveAndClose(close: () => void) {
  emit('update', props.reserve);
  close();
}
</script>
