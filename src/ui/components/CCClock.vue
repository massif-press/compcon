<template>
  <v-card flat outlined>
    <v-card-text class="py-1 px-2 ma-0">
      <v-row v-if="clock.Linear" dense align="center">
        <v-col>
          <v-row dense>
            <v-col cols="12" class="heading h3 text-center">
              {{ clock.Title }}
              <span v-if="!print">
                <v-btn small icon class="fadeSelect" @click="editDialog = true">
                  <v-icon>mdi-circle-edit-outline</v-icon>
                </v-btn>
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
                      Do you want to delete this clock? This action cannot be
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
              </span>
            </v-col>
            <v-col cols="12">
              <v-progress-linear
                background-color="grey lighten-2"
                :height="size / 2.5"
                :value="total"
                :color="color"
              >
                <div class="background accent--text" style="border-radius: 2px">
                  <b v-if="print">&emsp; / {{ clock.Segments }}&nbsp;</b>
                  <b v-else
                    >&nbsp;{{ progress }} / {{ clock.Segments }}&nbsp;</b
                  >
                </div>
              </v-progress-linear>
            </v-col>

            <v-col>
              <div v-if="clock.Description">
                <div class="overline mb-n1">DESCRIPTION</div>
                <div class="ml-2" v-html-safe="clock.Description" />
              </div>
              <div v-if="clock.Resolution">
                <div class="overline mb-n1">RESOLUTION</div>
                <div class="ml-2" v-html-safe="clock.Resolution" />
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-col v-if="!print" cols="auto">
          <v-btn icon @click="clock.Increment()">
            <v-icon large color="accent">cc:accuracy</v-icon>
          </v-btn>
          <br />
          <v-btn icon @click="clock.Decrement()">
            <v-icon large color="accent">cc:difficulty</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-else dense align="center">
        <v-col cols="auto">
          <v-progress-circular
            :size="size"
            :width="size / 5"
            :value="total"
            :color="color"
          >
            <b v-if="print">&emsp;&nbsp; /{{ clock.Segments }}&nbsp;</b>
            <b v-else>{{ progress }} / {{ clock.Segments }}</b>
          </v-progress-circular>
        </v-col>
        <v-col>
          <div class="heading h3">
            {{ clock.Title }}
            <span v-if="!print">
              <v-btn small icon class="fadeSelect" @click="editDialog = true">
                <v-icon>mdi-circle-edit-outline</v-icon>
              </v-btn>
              <v-menu offset-x left>
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
                    Do you want to delete this clock? This action cannot be
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
            </span>
          </div>
          <div v-if="clock.Description">
            <div class="overline mb-n1">DESCRIPTION</div>
            <div class="ml-2" v-html-safe="clock.Description" />
          </div>
          <div v-if="clock.Resolution">
            <div class="overline mb-n1">RESOLUTION</div>
            <div class="ml-2" v-html-safe="clock.Resolution" />
          </div>
        </v-col>
        <v-col v-if="!print" cols="auto">
          <v-btn
            icon
            @click="
              clock.Increment();
              $emit('change');
            "
          >
            <v-icon large color="accent">cc:accuracy</v-icon>
          </v-btn>
          <br />
          <v-btn
            icon
            @click="
              clock.Decrement();
              $emit('change');
            "
          >
            <v-icon large color="accent">cc:difficulty</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-dialog v-model="editDialog" width="70vw">
      <v-card>
        <v-toolbar dense color="primary" class="white--text">
          <span class="heading h3">CLOCK EDITOR</span>
          <v-spacer />
          <v-btn icon class="white--text" @click="editDialog = false">
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
                :color="color"
              >
                <b>{{ progress }} / {{ clock.Segments }}</b>
              </v-progress-linear>
            </div>
            <div v-else dense>
              <v-progress-circular
                :size="size"
                :width="size / 5"
                :value="total"
                :color="color"
              >
                <b>{{ progress }} / {{ clock.Segments }}</b>
              </v-progress-circular>
            </div>
          </div>
          <v-row>
            <v-col>
              <v-text-field
                v-model="clock.Title"
                label="Title"
                @change="$emit('change')"
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="clock.Segments"
                label="Segments"
                number
                @change="$emit('change')"
              />
            </v-col>
            <v-col cols="auto">
              <v-switch
                v-model="clock.Linear"
                label="Linear"
                hide-details
                @change="$emit('change')"
              />
            </v-col>
          </v-row>
          <v-textarea
            v-model="clock.Description"
            variant="outlined"
            rows="3"
            auto-grow
            label="Description"
            class="mx-1 my-2"
            hide-details
            @change="$emit('change')"
          />
          <v-textarea
            v-model="clock.Resolution"
            variant="outlined"
            rows="3"
            auto-grow
            label="Resolution"
            class="ma-1"
            hide-details
            @change="$emit('change')"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'cc-clock',
  props: {
    size: { type: Number, required: false, default: 70 },
    clock: { type: Object, required: true },
    color: { type: String, required: false, default: 'primary' },
    print: { type: Boolean },
    noDelete: { type: Boolean },
  },
  data: () => ({
    editDialog: false,
  }),
  computed: {
    progress() {
      if (this.print) return 0;
      return parseInt(this.clock.Progress);
    },
    total() {
      if (this.print) return 0;
      return (parseInt(this.progress) / parseInt(this.clock.Segments)) * 100;
    },
  },
};
</script>
