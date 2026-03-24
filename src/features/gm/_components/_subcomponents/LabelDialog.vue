<template>
  <cc-solo-dialog ref="dialog"
    title="Set GM Label"
    :close-on-click="false"
    max-width="500px">

    <v-tabs v-model="labelTab" grow density="compact">
      <v-tab value="set">Set</v-tab>
      <v-tab value="delete">Delete</v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="labelTab">
        <v-window-item value="set">
          <div class="text-caption">
            This will add <b>or overwrite</b> the label value for all selected items.
          </div>
          <v-row class="mt-2">
            <v-col>
              <v-combobox v-model="kvpKey"
                :items="allLabels"
                item-title="title"
                item-value="key"
                label="Label"
                hide-details
                :menu-props="{ retainFocus: false }" />
            </v-col>
            <v-col>
              <v-text-field v-model="kvpValue" label="Value" hide-details />
            </v-col>
          </v-row>
        </v-window-item>
        <v-window-item value="delete">
          <div class="text-caption">
            This will <b>delete</b> the label value for all selected items.
          </div>
          <v-row class="mt-2">
            <v-col>
              <v-select v-model="kvpKey"
                :items="selectedLabels"
                item-title="title"
                item-value="key"
                label="Label"
                hide-details />
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn variant="text" @click="close">Cancel</v-btn>
      <v-spacer />
      <v-btn variant="tonal"
        :color="labelTab === 'set' ? 'accent' : 'error'"
        :disabled="!kvpKey"
        @click="confirm">
        {{ labelTab }}
      </v-btn>
    </v-card-actions>
  </cc-solo-dialog>
</template>

<script lang="ts">
export default {
  name: 'LabelDialog',
  props: {
    allLabels: { type: Array, default: () => [] },
    selectedLabels: { type: Array, default: () => [] },
  },
  emits: ['confirm'],
  data: () => ({
    labelTab: 'set' as 'set' | 'delete',
    kvpKey: '' as any,
    kvpValue: '',
  }),
  methods: {
    open() {
      this.kvpKey = '';
      this.kvpValue = '';
      this.labelTab = 'set';
      (this.$refs.dialog as any).open();
    },
    close() {
      (this.$refs.dialog as any).close();
    },
    confirm() {
      this.$emit('confirm', {
        key: this.kvpKey,
        value: this.kvpValue,
        op: this.labelTab,
      });
      this.close();
    },
  },
};
</script>
