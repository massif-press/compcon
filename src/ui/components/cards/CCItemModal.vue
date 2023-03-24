<template>
  <div>
    <cc-dialog
      ref="dialog"
      no-confirm
      :color="item.Color"
      :large="$vuetify.display.mdAndUp"
      :fullscreen="$vuetify.display.smAndDown"
      :small-btn="smallBtn"
    >
      <span slot="button" class="white--text" style="width: 100%">
        <v-icon :left="!smallBtn">{{ item.Icon }}</v-icon>
        {{ truncate(item.Name) }} {{ item.ItemType === 'Frame' ? 'FRAME' : '' }}
      </span>

      <span slot="title">
        <v-icon start large dark>{{ item.Icon }}</v-icon>
        {{ item.Name }}
      </span>

      <v-btn
        v-if="$vuetify.display.smAndDown"
        slot="title-items"
        dark
        icon
        @click="$refs.dialog.confirm()"
      >
        <v-icon large left>close</v-icon>
      </v-btn>

      <v-chip
        v-if="$vuetify.display.lgAndUp"
        slot="title-items"
        color="white"
        class="stat-text mt-4 mr-6"
        variant="outlined"
        label
      >
        {{ item.Source || '' }} {{ $_.startCase(item.ItemType) }}
      </v-chip>

      <cc-item-card :item="item" />
    </cc-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CCItemModal',
  props: {
    item: {
      type: Object,
      required: true,
    },
    smallBtn: {
      type: Boolean,
      required: false,
    },
  },
  methods: {
    truncate(str): string {
      if (str.length > 26) return str.substring(0, 24) + '…';
      return str;
    },
  },
};
</script>
