<template>
  <v-card variant="tonal" tile flat style="position: relative" class="rounded-s-xl">
    <v-card-text class="py-1 px-2">
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
              <span class="d-inline-block ml-2">
                <cc-button
                  v-if="!readonly"
                  size="x-small"
                  variant="text"
                  icon="mdi-circle-edit-outline"
                  @click="editDialog = true" />
              </span>
              <span class="d-inline-block ml-2">
                <v-menu offset-x left>
                  <template #activator="{ props }">
                    <cc-button
                      v-if="!readonly"
                      size="x-small"
                      variant="text"
                      icon="mdi-delete"
                      color="error"
                      v-bind="props" />
                  </template>
                  <v-card>
                    <v-card-text>
                      Do you want to delete this clock? This action cannot be undone.
                    </v-card-text>
                    <v-divider />
                    <v-card-actions>
                      <v-spacer />
                      <cc-button size="small" color="error" @click="$emit('delete')">
                        Confirm Deletion
                      </cc-button>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </span>
            </span>
          </div>

          <v-progress-linear
            v-if="clock.Linear"
            v-model="total"
            background-color="grey lighten-2"
            :height="dense ? size / 6 : size / 2.5"
            :color="color">
            <div class="bg-background text-accent" style="border-radius: 2px">
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
          <div style="position: absolute; right: 12px; top: 10px">
            <cc-button
              variant="outlined"
              icon="mdi-plus"
              @click="
                clock.Increment();
                $emit('change');
              " />
          </div>

          <div style="position: absolute; right: 12px; bottom: 10px">
            <cc-button
              variant="outlined"
              icon="mdi-minus"
              @click="
                clock.Decrement();
                $emit('change');
              " />
          </div>
        </v-col>
        <v-col v-else-if="dense && !readonly" cols="auto" align-self="end">
          <cc-button
            variant="tonal"
            icon="mdi-plus"
            color="accent"
            style="width: 26px; height: 26px"
            class="mr-2"
            @click="
              clock.Increment();
              $emit('change');
            " />
          <cc-button
            variant="tonal"
            icon="mdi-minus"
            color="accent"
            style="width: 26px; height: 26px"
            @click="
              clock.Decrement();
              $emit('change');
            " />
        </v-col>
      </v-row>
    </v-card-text>

    <cc-solo-modal v-model="editDialog" shrink title="clock editor" icon="mdi-clock">
      <v-card>
        <v-card-text class="pa-2">
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
          <v-row align="center" dense justify="space-around">
            <v-col cols="12" md="5">
              <cc-text-field
                v-model="clock.Title"
                label="Title"
                color="panel"
                @change="$emit('change')" />
            </v-col>
            <v-col cols="12" md="3">
              <cc-text-field
                v-model.number="clock.Segments"
                label="Segments"
                type="number"
                color="panel"
                @change="$emit('change')" />
            </v-col>
            <v-col cols="auto">
              <cc-switch
                v-model="clock.Linear"
                label="Linear"
                hide-details
                @change="$emit('change')" />
            </v-col>
            <v-col cols="auto">
              <div>
                <cc-checkbox
                  label="GM Only"
                  v-model="clock.GmOnly"
                  tooltip="Marking a field or item 'GM Only' will hide it from player-facing exports
                        and print output"></cc-checkbox>
              </div>
            </v-col>
          </v-row>
          <cc-text-area
            v-model="clock.Description"
            variant="outlined"
            rows="3"
            color="primary"
            auto-grow
            label="Description"
            class="mx-1 my-4"
            @change="$emit('change')" />
          <cc-text-area
            v-model="clock.Resolution"
            variant="outlined"
            color="primary"
            rows="3"
            auto-grow
            label="Resolution"
            class="mx-1 my-4"
            @change="$emit('change')" />
        </v-card-text>
      </v-card>
    </cc-solo-modal>
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
