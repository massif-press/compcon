<template>
  <v-card color="black">
    <v-toolbar flat color="primary" density="compact">
      <v-toolbar-title>
        <span class="heading h3">{{ local.name }}</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-card flat border tile color="blue-grey-darken-4">
            <div class="heading h3 px-1">
              Local
              <v-chip
                v-if="localNewer"
                tile
                color="accent"
                variant="elevated"
                elevation="0"
                size="x-small"
                class="mx-1 mt-n1">
                Newest
              </v-chip>
            </div>
            <div v-if="!local?.id">
              <v-card color="red" variant="tonal" class="pa-1 ma-1 text-caption">
                No local data available
              </v-card>
            </div>
            <div v-for="(value, key) in local" :key="key">
              <v-alert
                v-if="key !== 'cloud'"
                :color="getCardColor(key, 'local')"
                border="start"
                :border-color="getCardColor(key, 'local')"
                variant="tonal"
                class="pa-1 pl-4 ma-1 text-caption">
                {{ key }}:
                <span v-html-safe="compareStrings(value, cloud ? cloud[key] : '')" />
              </v-alert>
            </div>
          </v-card>
          <v-tooltip v-if="local?.id" max-width="600px" location="top">
            <template #activator="{ props }">
              <v-btn
                block
                tile
                color="primary"
                v-bind="props"
                :loading="loading"
                @click="$emit('take-local')">
                Take Local
              </v-btn>
            </template>
            <span>
              Overwrite the cloud data for this item with local data, resolving this conflict and
              marking the item as synced.
              <br />
              This action cannot be undone.
            </span>
          </v-tooltip>
        </v-col>

        <v-col cols="6">
          <v-card flat border tile color="blue-grey-darken-4">
            <div class="heading h3 px-1">
              Cloud
              <v-chip
                v-if="!localNewer"
                tile
                color="accent"
                variant="elevated"
                elevation="0"
                size="x-small"
                class="mx-1 mt-n1">
                Newest
              </v-chip>
            </div>
            <div v-if="!cloud?.id">
              <v-card color="red" variant="tonal" class="pa-1 ma-1 text-caption">
                No cloud data available
              </v-card>
            </div>
            <div v-for="(value, key) in cloud">
              <v-alert
                v-if="key !== 'cloud'"
                :color="getCardColor(key, 'cloud')"
                border="start"
                :border-color="getCardColor(key, 'cloud')"
                variant="tonal"
                class="pa-1 pl-4 ma-1 text-caption">
                {{ key }}:
                <span v-html-safe="compareStrings(value, local ? local[key] : '')" />
              </v-alert>
            </div>
          </v-card>
          <v-tooltip v-if="cloud" max-width="600px" location="top">
            <template #activator="{ props }">
              <v-btn
                block
                tile
                color="primary"
                v-bind="props"
                :loading="loading"
                @click="$emit('take-cloud')">
                Take Cloud
              </v-btn>
            </template>
            <span>
              Overwrite the local version of this item with the version stored in the cloud,
              resolving this conflict and marking the item as synced.
              <br />
              This action cannot be undone.
            </span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn color="accent" variant="text" size="small" @click="$emit('close')">
        Close without resolving
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'DiffViewer',
  props: {
    local: {
      type: Object,
    },
    cloud: {
      type: Object,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    diff: null,
  }),
  emits: ['close', 'take-local', 'take-cloud'],
  computed: {
    localNewer() {
      if (!this.local?.id) return false;
      if (!this.cloud?.id) return true;
      return this.local?.save?.lastModified > this.cloud?.save?.lastModified;
    },
  },
  methods: {
    compareStrings(obj1 = {}, obj2 = {}) {
      const a = JSON.stringify(obj1, null, 2)
        .replace(/<[^>]*>/g, '')
        .split(/\s+/);
      const b = JSON.stringify(obj2, null, 2)
        .replace(/<[^>]*>/g, '')
        .split(/\s+/);

      let aIdx = 0;
      let bIdx = 0;

      let result = [];

      const addedStyle =
        'background-color: rgba(0, 255, 0, 0.2); padding: 0 2px 0 2px; border-radius: 3px; color: #AED581;';
      const removedStyle =
        'background-color: rgba(255, 0, 0, 0.2); padding: 0 2px 0 2px; border-radius: 3px; color: red;';
      const changedStyle =
        'background-color: rgba(255, 255, 0, 0.2); padding: 0 2px 0 2px; border-radius: 3px; color: #FFEB3B;';

      while (aIdx < a.length || bIdx < b.length) {
        if (a[aIdx] === b[bIdx]) {
          result.push(a[aIdx]);
          aIdx++;
          bIdx++;
        } else if (a[aIdx] && !b[bIdx]) {
          result.push(`<span style="${addedStyle}">${a[aIdx]}</span>`);
          aIdx++;
        } else if (b[bIdx] && !a[bIdx]) {
          result.push(`<span style="${removedStyle}">${b[bIdx]}</span>`);
          bIdx++;
        } else if (a[aIdx] !== b[bIdx]) {
          const empties = ['""', '[]', '{}', '{', '[', 'null', 'undefined'];
          if (b[bIdx].length && !empties.includes(b[bIdx]))
            result.push(`<span style="${changedStyle}">${a[aIdx]}</span>`);
          else result.push(`<span style="${addedStyle}">${a[aIdx]}</span>`);
          aIdx++;
          bIdx++;
        }
      }
      return result.join(' ');
    },
    getCardColor(key, source) {
      const newer =
        (this.localNewer && source === 'local') || (!this.localNewer && source === 'cloud');
      const other = source === 'local' ? 'cloud' : 'local';

      if (!this[other]?.id || !Object.keys(this[other]).includes(key))
        return newer ? 'green' : 'red';
      else if (JSON.stringify(this[source][key]) === JSON.stringify(this[other][key]))
        return 'blue-grey';
      else return 'orange';
    },
  },
};
</script>
