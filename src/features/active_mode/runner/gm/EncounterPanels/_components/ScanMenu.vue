<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <cc-button block
        size="small"
        color="primary"
        class="mt-2"
        prepend-icon="mdi-cube-scan"
        @click="props.onClick($event)">
        {{ $t('active.scan.scan') }}
      </cc-button>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar height="40"
          color="primary"
          class="text-center">
          <div class="heading h3 mt-1">
            <v-icon icon="mdi-cube-scan"
              class="mt-n1 ml-2"
              start />
            {{ $t('active.scan.scan') }}
          </div>
          <v-spacer />
          <v-btn icon
            @click="isActive.value = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <cc-switch v-model="includeFeatureDetails"
            label="include Feature Details"
            color="primary" />
          <v-textarea :value="statblock"
            auto-grow
            readonly
            rows="15"
            hide-details
            variant="outlined"
            class="flavor-text" />
          <div class="d-flex justify-end mt-4">
            <cc-button prepend-icon="mdi-clipboard-text-outline"
              color="accent"
              @click="copy()">
              {{ $t('active.scan.copyClipboard') }}
            </cc-button>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { notify } from '@/util/notify'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import * as _ from 'lodash-es';
import Statblock from '@/classes/Statblock'
import { Unit } from '@/classes/npc/unit/Unit';

defineOptions({ name: 'DamageMenu' })

const props = defineProps<{
  item: object
}>()

const includeFeatureDetails = ref(false)

const statblock = computed(() => {
      return Statblock.ScanNpc(props.item as Unit, includeFeatureDetails.value);
    })

function copy() {
      navigator.clipboard
        .writeText(statblock.value)
        .then(() =>
          notify({
            title: t('active.statblock.copiedTitle'),
            text: t('active.statblock.copiedText'),
            data: { icon: 'mdi-clipboard-text-outline' },
          })
        )
        .catch(() =>
          notify({
            title: t('active.statblock.errorTitle'),
            text: t('active.statblock.errorText'),
            data: { icon: 'mdi-clipboard-text-outline', color: 'error' },
          })
        );
    }
</script>
