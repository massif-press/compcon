<template>
  <div class="printable">
    <v-card
      tile
      flat
      :class="orientation"
      class="print-card"
      style="margin-left: auto; margin-right: auto">
      <slot />
      <v-bottom-navigation fixed grow horizontal color="primary" class="no-print pa-2">
        <v-btn stacked @click="router.go(-1)">
          <span>{{ $t('common.closePreview') }}</span>
          <v-icon icon="mdi-close" />
        </v-btn>
        <slot name="selector" />
        <v-spacer />
        <cc-modal title="Print Options" icon="mdi-cog">
          <template #activator="{ open }">
            <v-btn @click="open">
              <span>{{ $t('ui.print.options') }}</span>
              <v-icon icon="mdi-cog" />
            </v-btn>
          </template>
          <slot name="options-dialog" />
        </cc-modal>
        <v-btn @click="print()">
          <span>{{ $t('common.print') }}</span>
          <v-icon icon="mdi-printer" />
        </v-btn>
      </v-bottom-navigation>
    </v-card>
    <div class="no-print" style="min-height: 70px !important" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{ orientation?: string }>()

const router = useRouter()

function print() {
  window.print()
}
</script>

<style>
.v-application .caption {
  line-height: normal !important;
}
</style>

<style scoped>
.Portrait {
  background-color: white !important;
  width: 210mm;
}

.Landscape {
  background-color: white !important;
  width: 297mm;
}

.print-card {
  background-color: white;
  color: black;
  margin-top: 16px;
}

@page {
  margin: 0;
  padding: 0;
}

@media print {
  @page {
    size: portrait;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0;
    padding: 0;
    color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
    background-color: white !important;
    overflow: visible;
  }

  .print-card {
    margin: 0;
    padding: 0;
    width: 100% !important;
    overflow: visible;
  }

  .printable {
    width: 100% !important;
    max-width: 100% !important;
    background-color: white;
    margin: 0 !important;
    padding: 0 !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
    overflow: visible;
  }
}
</style>
