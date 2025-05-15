<template>
  <v-card variant="tonal">
    <v-toolbar density="compact" class="pl-3">
      <div style="min-width: 200px">
        <cc-short-string-editor
          v-if="!readonly"
          justify="start"
          :placeholder="table.Title"
          @set="table.Title = $event">
          <span class="heading h3">{{ table.Title }}</span>
        </cc-short-string-editor>
        <div v-else class="heading h3">{{ table.Title }}</div>
      </div>
      <div v-if="!dense && !readonly">
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
      <v-row no-gutters v-if="!readonly" align="center">
        <v-col cols="auto" v-if="!dense" class="heading pl-3 pr-3">Roll</v-col>

        <v-col cols="auto">
          <v-menu>
            <template #activator="{ props }">
              <v-btn icon v-bind="props" variant="tonal" size="x-small" class="mt-n1">
                <span class="heading h3">{{ table.Mult || '#' }}</span>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <v-btn
                  v-for="n in 5"
                  icon
                  variant="tonal"
                  color="accent"
                  size="x-small"
                  class="mx-2"
                  @click="table.Mult = n">
                  <span class="heading h3">{{ n }}</span>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>

        <v-col cols="auto" class="heading" style="margin: 0px 2px 0 2px">D</v-col>
        <v-col cols="auto">
          <v-menu>
            <template #activator="{ props }">
              <v-btn icon v-bind="props" variant="tonal" size="x-small" class="mt-n1">
                <span class="heading h3">{{ table.Die || '#' }}</span>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <v-btn
                  v-for="n in dice"
                  icon
                  variant="tonal"
                  color="accent"
                  size="x-small"
                  class="mx-2"
                  @click="table.Die = n">
                  <span class="heading h3">{{ n }}</span>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
        <v-spacer />
        <v-col cols="auto" class="heading pl-3 pr-1">Step</v-col>
        <v-col cols="auto">
          <v-text-field
            v-model="step"
            type="number"
            variant="outlined"
            style="max-width: 60px"
            density="compact"
            class=""
            hide-details />
        </v-col>

        <v-spacer />
        <v-col cols="auto">
          <v-menu offset-x bottom>
            <template #activator="{ props }">
              <v-btn size="small" :icon="dense" variant="tonal" v-bind="props">
                <v-icon :start="!dense">mdi-reload</v-icon>
                <span v-if="!dense">Rebuild</span>
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
        </v-col>
        <v-col cols="auto" v-if="!noDelete">
          <v-menu offset-x left>
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
        </v-col>
      </v-row>
    </v-toolbar>

    <v-table class="pr-3 py-1 rounded-0">
      <tr
        v-for="(r, i) in table.Results"
        :class="`${print ? 'py-2' : ''} ${i % 2 !== 0 ? 'light-panel' : ''}`">
        <td class="text-center heading h4" style="width: 75px">
          <span v-if="r.min === r.max">{{ r.max }}</span>
          <span v-else>{{ r.min }} - {{ r.max }}</span>
        </td>
        <td>
          <v-textarea
            v-if="!print && !readonly"
            v-model="r.result"
            density="compact"
            hide-details
            rows="2"
            variant="outlined"
            auto-grow
            class="my-1" />
          <v-card v-else variant="plain" class="mb-1" :class="dense ? 'pa-1' : 'pa-2'">
            <p v-html-safe="r.result" />
          </v-card>
        </td>
      </tr>
    </v-table>
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
    readonly: { type: Boolean },
    density: { type: String, default: '' },
  },
  data: () => ({
    editDialog: false,
    step: 2,
    dice: [2, 3, 6, 8, 10, 12, 20],
    mults: [1, 2, 3, 4, 5],
  }),
  computed: {
    dense() {
      return this.density === 'compact';
    },
  },
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
