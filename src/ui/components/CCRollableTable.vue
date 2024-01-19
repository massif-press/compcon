<template>
  <v-card variant="tonal">
    <!-- <v-row v-if="print" density="compact" align="center" justify="space-between">
        <v-col class="heading h3">{{ table.Title }}</v-col>
        <v-col cols="auto" class="heading h4">
          Roll {{ table.Mult }}D{{ table.Die }}
        </v-col>
      </v-row> -->
    <v-toolbar density="compact" class="pl-3">
      <div style="min-width: 200px">
        <cc-short-string-editor
          justify="start"
          :placeholder="table.Title"
          @set="table.Title = $event">
          <span class="heading h3">{{ table.Title }}</span>
        </cc-short-string-editor>
      </div>
      <div>
        <v-checkbox-btn v-model="table.GmOnly" hide-details>
          <template #label>
            GM Only
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-icon
                  class="fade-select"
                  size="x-small"
                  end
                  icon="mdi-information-outline"
                  v-bind="props" />
              </template>
              <div>
                Marking a field or item "GM Only" will hide it from player-facing exports and print
                output
              </div>
            </v-tooltip>
          </template>
        </v-checkbox-btn>
      </div>
      <v-spacer />
      <div class="heading pl-3 pr-6">Roll</div>
      <v-select
        v-model="table.Mult"
        density="compact"
        hide-details
        style="max-width: 70px"
        :items="mults" />
      <div class="heading px-1">D</div>
      <v-select
        v-model="table.Die"
        density="compact"
        hide-details
        style="max-width: 70px"
        :items="dice" />
      <div class="heading pl-3 pr-1">Step</div>
      <v-text-field
        v-model="step"
        type="number"
        style="max-width: 60px"
        density="compact"
        hide-details />
      <v-spacer />

      <v-menu offset-x bottom>
        <template #activator="{ props }">
          <v-btn size="small" variant="tonal" v-bind="props">
            <v-icon start>mdi-reload</v-icon>
            Rebuild
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            Do you want to rebuild this table? This will clear out the current data. This action
            cannot be undone.
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn small color="error" @click="generate">Confirm Rebuild</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-menu v-if="!noDelete" offset-x left>
        <template #activator="{ props }">
          <v-btn small icon color="error" variant="plain" v-bind="props">
            <v-icon icon="mdi-delete" />
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            Do you want to delete this table? This action cannot be undone.
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn small color="error" @click="$emit('delete')">Confirm Deletion</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-toolbar>

    <v-card-text class="pa-2">
      <v-table class="my-2 px-1">
        <tr
          v-for="(r, i) in table.Results"
          :class="`${print ? 'py-2' : ''} ${i % 2 !== 0 ? 'light-panel' : ''}`">
          <td class="text-center heading h4" style="width: 75px">
            <span v-if="r.min === r.max">{{ r.max }}</span>
            <span v-else>{{ r.min }} - {{ r.max }}</span>
          </td>
          <td>
            <v-textarea
              v-if="!print"
              v-model="r.result"
              density="compact"
              hide-details
              rows="2"
              variant="outlined"
              auto-grow
              class="my-1" />
            <p v-else class="mb-0" v-html-safe="r.result" />
          </td>
        </tr>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'cc-rollable-table',
  props: {
    table: { type: Object, required: true },
    color: { type: String, required: false, default: 'primary' },
    print: { type: Boolean },
    noDelete: { type: Boolean },
  },
  data: () => ({
    editDialog: false,
    step: 2,
    dice: [2, 3, 6, 8, 10, 12, 20],
    mults: [1, 2, 3, 4, 5],
  }),
  computed: {},
  watch: {
    step() {
      if (this.step < 1) this.step = 1;
    },
  },
  methods: {
    generate() {
      this.table.setArray(parseInt(this.step as any));
    },
  },
};
</script>
