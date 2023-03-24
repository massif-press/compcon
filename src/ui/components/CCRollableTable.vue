<template>
  <v-card flat>
    <v-alert
      variant="outlined"
      style="border-width: 3px !important"
      class="pa-2"
      :color="color"
    >
      <v-card-text class="pa-0 ma-0">
        <v-row v-if="print" dense align="center" justify="space-between">
          <v-col class="heading h3">{{ table.Title }}</v-col>
          <v-col cols="auto" class="heading h4 grey--text">
            Roll {{ table.Mult }}D{{ table.Die }}
          </v-col>
        </v-row>
        <v-row v-else dense align="center">
          <v-col class="heading h3">
            <cc-short-string-editor @set="table.Title = $event">
              {{ table.Title }}
            </cc-short-string-editor>
          </v-col>
          <v-col cols="auto" class="ml-auto">
            <span class="heading h3 grey--text">Roll</span>
          </v-col>
          <v-col cols="auto" class="mt-n2">
            <v-select
              v-model="table.Mult"
              dense
              hide-details
              style="width: 50px"
              :items="mults"
            />
          </v-col>
          <v-col cols="auto">
            <span class="heading h3 grey--text">D</span>
          </v-col>
          <v-col cols="auto" class="mt-n2">
            <v-select
              v-model="table.Die"
              dense
              hide-details
              style="width: 50px"
              :items="dice"
            />
          </v-col>
          <v-col cols="auto" class="heading h4 grey--text">Step</v-col>
          <v-col cols="1" class="mt-n2">
            <v-text-field
              v-model="step"
              type="number"
              style="width: 50px"
              dense
              hide-details
            />
          </v-col>
          <v-col cols="auto">
            <v-menu offset-x bottom>
              <template v-slot:activator="{ props }">
                <v-btn small color="primary" class="fadeSelect" v-bind="props">
                  <v-icon start>mdi-reload</v-icon>
                  Rebuild table
                </v-btn>
              </template>
              <v-card>
                <v-card-text>
                  Do you want to rebuild this table? This will clear out the
                  current data. This action cannot be undone.
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-spacer />
                  <v-btn small color="error" @click="generate"
                    >Confirm Rebuild</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
          <v-col cols="auto">
            <v-menu v-if="!noDelete" offset-x left>
              <template v-slot:activator="{ props }">
                <v-btn
                  small
                  icon
                  color="error"
                  class="fadeSelect"
                  v-bind="props"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-text>
                  Do you want to delete this table? This action cannot be
                  undone.
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-spacer />
                  <v-btn small color="error" @click="$emit('delete')"
                    >Confirm Deletion</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
        <v-simple-table class="my-2 px-1">
          <tr
            v-for="(r, i) in table.Results"
            :key="`table_item_${i}`"
            :class="`${print ? 'py-2' : ''} ${
              i % 2 !== 0 ? 'light-panel' : ''
            }`"
          >
            <td class="text-center heading h4" style="width: 75px">
              <span v-if="r.min === r.max">{{ r.max }}</span>
              <span v-else>{{ r.min }} - {{ r.max }}</span>
            </td>
            <td>
              <v-textarea
                v-if="!print"
                v-model="r.result"
                dense
                hide-details
                rows="2"
                variant="outlined"
                auto-grow
                class="my-1"
              />
              <p v-else class="mb-0" v-html-safe="r.result" />
            </td>
          </tr>
        </v-simple-table>
      </v-card-text>
    </v-alert>
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
      this.table.setArray(parseInt(this.step));
    },
  },
};
</script>
