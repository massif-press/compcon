<template>
  <v-card variant="tonal" :class="dense ? 'rounded-0' : ''">
    <v-card-text :class="dense ? 'ma-0 py-1' : 'px-2 pb-3 py-0 ma-0'">
      <v-row :dense="dense" :align="clock.Linear ? 'start' : 'center'">
        <v-col v-if="!clock.Linear" cols="auto">
          <v-progress-circular
            v-model="total"
            :size="dense ? size / 2 : size"
            :width="dense ? size / 20 : size / 5"
            :color="color">
            <b v-if="print">&emsp;&nbsp; /{{ clock.Segments }}&nbsp;</b>
            <b v-else>{{ progress }} / {{ clock.Segments }}</b>
          </v-progress-circular>
        </v-col>
        <v-col>
          <div :class="`heading ${dense ? 'h3' : 'h2'}`">
            {{ clock.Title }}
            <span v-if="!print">
              <v-btn v-if="!readonly" size="small" icon variant="plain" @click="editDialog = true">
                <v-icon icon="mdi-circle-edit-outline" />
              </v-btn>
              <v-menu offset-x left>
                <template #activator="{ props }">
                  <v-btn
                    v-if="!readonly"
                    size="small"
                    icon
                    color="error"
                    variant="plain"
                    v-bind="props">
                    <v-icon icon="mdi-delete" />
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text>
                    Do you want to delete this clock? This action cannot be undone.
                  </v-card-text>
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn size="small" color="error" @click="$emit('delete')">
                      Confirm Deletion
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </span>
          </div>

          <v-progress-linear
            v-if="clock.Linear"
            background-color="grey lighten-2"
            :height="dense ? size / 6 : size / 2.5"
            :value="total"
            :color="color">
            <div class="background text-accent" style="border-radius: 2px">
              <b v-if="print">&emsp; / {{ clock.Segments }}&nbsp;</b>
              <b v-else>&nbsp;{{ progress }} / {{ clock.Segments }}&nbsp;</b>
            </div>
          </v-progress-linear>
          <div v-if="clock.Description">
            <div class="text-caption mb-n1">DESCRIPTION</div>
            <div class="ml-2" v-html-safe="clock.Description" />
          </div>
          <div v-if="clock.Resolution">
            <div class="text-caption mb-n1">RESOLUTION</div>
            <div class="ml-2" v-html-safe="clock.Resolution" />
          </div>
        </v-col>
        <v-col v-if="!print && !dense && !readonly" cols="auto">
          <v-btn
            size="x-large"
            variant="plain"
            icon
            @click="
              clock.Increment();
              $emit('change');
            ">
            <v-icon size="50" color="accent">mdi-plus</v-icon>
          </v-btn>
          <br />
          <v-btn
            size="x-large"
            variant="plain"
            icon
            @click="
              clock.Decrement();
              $emit('change');
            ">
            <v-icon size="50" color="accent">mdi-minus</v-icon>
          </v-btn>
        </v-col>
        <v-col v-else-if="dense && !readonly" cols="auto" align-self="end">
          <v-btn
            variant="tonal"
            icon
            color="accent"
            style="width: 26px; height: 26px"
            class="mr-2"
            @click="
              clock.Increment();
              $emit('change');
            ">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            variant="tonal"
            icon
            color="accent"
            style="width: 26px; height: 26px"
            @click="
              clock.Decrement();
              $emit('change');
            ">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-dialog v-model="editDialog" width="70vw">
      <v-card>
        <v-toolbar density="compact" color="primary" class="text-white">
          <v-toolbar-title class="heading h3">CLOCK EDITOR</v-toolbar-title>
          <v-spacer />
          <v-btn icon class="text-white" @click="editDialog = false">
            <v-icon large>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div class="text-center ma-2">
            <div v-if="clock.Linear">
              <v-progress-linear
                background-color="grey lighten-2"
                :height="size / 3"
                :value="total"
                :color="color">
                <b>{{ progress }} / {{ clock.Segments }}</b>
              </v-progress-linear>
            </div>
            <div v-else density="compact">
              <v-progress-circular :size="size" :width="size / 5" :value="total" :color="color">
                <b>{{ progress }} / {{ clock.Segments }}</b>
              </v-progress-circular>
            </div>
          </div>
          <v-row align="center">
            <v-col>
              <v-text-field
                v-model="clock.Title"
                label="Title"
                hide-details
                @change="$emit('change')" />
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="clock.Segments"
                label="Segments"
                number
                hide-details
                @change="$emit('change')" />
            </v-col>
            <v-col cols="auto">
              <v-switch
                v-model="clock.Linear"
                label="Linear"
                hide-details
                @change="$emit('change')" />
            </v-col>
            <v-col cols="auto">
              <div>
                <v-checkbox-btn v-model="clock.GmOnly" hide-details>
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
                        Marking a field or item "GM Only" will hide it from player-facing exports
                        and print output
                      </div>
                    </v-tooltip>
                  </template>
                </v-checkbox-btn>
              </div>
            </v-col>
          </v-row>
          <v-textarea
            v-model="clock.Description"
            variant="outlined"
            rows="3"
            auto-grow
            label="Description"
            class="mx-1 my-4"
            hide-details
            @change="$emit('change')" />
          <v-textarea
            v-model="clock.Resolution"
            variant="outlined"
            rows="3"
            auto-grow
            label="Resolution"
            class="mx-1 my-4"
            hide-details
            @change="$emit('change')" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'cc-clock',
  props: {
    size: { type: Number, required: false, default: 100 },
    clock: { type: Object, required: true },
    color: { type: String, required: false, default: 'accent' },
    print: { type: Boolean },
    noDelete: { type: Boolean },
    readonly: { type: Boolean },
    density: { type: String, default: '' },
  },
  data: () => ({
    editDialog: false,
  }),
  computed: {
    dense() {
      return this.density === 'compact';
    },
    progress() {
      if (this.print) return 0;
      return parseInt(this.clock.Progress);
    },
    total() {
      if (this.print) return 0;
      return (parseInt(this.progress as any) / parseInt(this.clock.Segments)) * 100;
    },
  },
};
</script>
