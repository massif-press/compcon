<template>
  <v-dialog max-width="900px">
    <template #activator="{ props }">
      <cc-button
        block
        size="small"
        color="primary"
        class="mt-2"
        prepend-icon="mdi-cube-scan"
        @click="props.onClick($event)">
        Scan
      </cc-button>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar height="40" color="primary" class="text-center">
          <div class="heading h3 mt-1">
            <v-icon icon="mdi-cube-scan" class="mt-n1 ml-2" start />
            Scan
          </div>
          <v-spacer />
          <v-btn icon @click="isActive.value = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-textarea
            :value="statblock"
            auto-grow
            readonly
            rows="15"
            hide-details
            variant="outlined"
            class="flavor-text" />
          <div class="d-flex justify-end mt-4">
            <cc-button prepend-icon="mdi-clipboard-text-outline" color="accent" @click="copy()">
              Copy to Clipboard
            </cc-button>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
import { CompendiumStore } from '@/stores';
import { Statblock } from '@/class';

export default {
  name: 'DamageMenu',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    statblock() {
      return Statblock.ScanNpc(this.item, this.narrativeElements);
    },
  },

  methods: {
    copy() {
      navigator.clipboard
        .writeText(this.statblock)
        .then(() =>
          this.$notify({
            title: 'Statblock Copied to Clipboard',
            text: 'Copy Success',
            data: { icon: 'mdi-clipboard-text-outline' },
          })
        )
        .catch(() =>
          this.$notify({
            title: 'Error',
            text: 'Unable to copy statblock',
            data: { icon: 'mdi-clipboard-text-outline', color: 'error' },
          })
        );
    },
  },
};
</script>
