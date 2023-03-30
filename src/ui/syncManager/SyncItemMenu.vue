<template>
  <v-menu v-model="menu" offset-y>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-icon icon="mdi-dots-vertical" />
      </v-btn>
    </template>
    <v-list tile>
      <v-list-item two-line :disabled="synced" @click="$emit('sync')">
        <v-list-item-avatar>
          <v-icon v-if="noCloud" color="accent">mdi-cloud-upload</v-icon>
          <v-icon v-else-if="noLocal" color="accent">mdi-cloud-download</v-icon>
          <v-icon v-else-if="!synced" color="accent">mdi-sync</v-icon>
          <v-icon v-else color="success">mdi-check-bold</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-bold"
            v-text="synced ? 'Item Synced' : 'Sync to Latest'"
          />
          <v-list-item-subtitle
            v-if="noCloud"
            v-text="`Upload item to cloud`"
          />
          <v-list-item-subtitle
            v-else-if="noLocal"
            v-text="`Download item from cloud`"
          />
          <v-list-item-subtitle
            v-else-if="!synced"
            v-text="
              `Update ${local ? 'cloud' : 'local'} data to latest version`
            "
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-if="!synced && item.hasRecords"
        two-line
        @click="$emit('overwrite-local')"
      >
        <v-list-item-avatar>
          <v-icon color="accent">mdi-cloud-download</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-bold"
            v-text="'Overwrite Local'"
          />
          <v-list-item-subtitle
            v-text="`Replace local data with the version stored in the cloud`"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-if="!synced && item.hasRecords"
        two-line
        @click="$emit('overwrite-cloud')"
      >
        <v-list-item-avatar>
          <v-icon color="accent">mdi-cloud-upload</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-bold"
            v-text="'Overwrite Cloud'"
          />
          <v-list-item-subtitle
            v-text="`Replace cloud data with the version stored locally`"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line v-if="item.deleted" @click="$emit('undelete')">
        <v-list-item-avatar>
          <v-icon color="accent">mdi-backup-restore</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold" v-text="'Restore Item'" />
          <v-list-item-subtitle v-text="`Restore and reactivate this item.`" />
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        two-line
        v-if="item.deleted"
        @click="$emit('delete-forever')"
      >
        <v-list-item-avatar>
          <v-icon color="error">mdi-delete-forever</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-bold"
            v-text="'Delete Forever'"
          />
          <v-list-item-subtitle>
            Permanently delete this item
            <b class="text-error">This action cannot be undone!</b>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        two-line
        v-else-if="!item.missingContent"
        @click="$emit('delete')"
      >
        <v-list-item-avatar>
          <v-icon color="accent">mdi-delete</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold" v-text="'Delete'" />
          <v-list-item-subtitle
            v-text="
              `Delete this item. Deleted items are permanently erased after 60 days.`
            "
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line v-else @click="$emit('delete-forever')">
        <v-list-item-avatar>
          <v-icon color="accent">mdi-cloud-off-outline</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-bold"
            v-text="'Delete Cloud Record'"
          />
          <v-list-item-subtitle
            v-text="
              `Erase cloud data for this item. Local unloadable data can be erased in the Content Manager`
            "
          />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
export default {
  name: 'sync-item-menu',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    menu: false,
  }),
  computed: {
    local() {
      return this.item.latest === 'local';
    },
    noCloud() {
      return !this.item.lastModifiedCloud;
    },
    noLocal() {
      return !this.item.lastModifiedLocal;
    },
    hasRecords() {
      return this.item.lastModifiedLocal && this.item.lastModifiedCloud;
    },
    synced() {
      return (
        !!this.item.lastModifiedCloud &&
        !!this.item.lastModifiedLocal &&
        this.item.lastModifiedCloud === this.item.lastModifiedLocal
      );
    },
  },
};
</script>
