<template>
  <v-col cols="4">
    <v-dialog v-model="dialog" width="60vw">
      <template #activator="{ props }">
        <v-btn size="large" variant="outlined" color="stark" block v-bind="props">
          <v-icon start color="stark">{{ reserve.Icon }}</v-icon>
          <s v-if="reserve.Used">
            {{ reserve.Name }}
          </s>
          <span v-else>
            {{ reserve.Name }}
          </span>
        </v-btn>
      </template>
      <cc-titled-panel :title="reserve.Name" :icon="reserve.Icon" :color="reserve.Color">
        <template #items>
          <v-btn icon variant="plain" color="error" @click="remove()">
            <v-icon icon="mdi-delete" />
          </v-btn>
          <v-btn icon variant="plain" @click="dialog = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </template>
        <div v-html-safe="reserve.Description" class="flavor-text mb-4" />
        <v-card v-if="reserve.ID != 'reserve_skill'" flat variant="outlined">
          <v-card-text>
            <v-row align="center">
              <v-col cols="9">
                <div v-if="reserve.Type === 'Resources'">
                  <v-text-field
                    v-model="reserve.ResourceName"
                    hide-details
                    :label="reserve.ResourceLabel"
                    variant="outlined"
                  />
                </div>
                <div v-else-if="reserve.Type === 'Mech'">
                  <span class="effect-text">{{ reserve.Description }}</span>
                </div>
                <div v-else>
                  <div
                    v-if="
                      reserve.ID === 'reserve_bombardment' ||
                      reserve.ID === 'reserve_extendedharness'
                    "
                  >
                    <span class="effect-text">{{ reserve.Description }}</span>
                    <v-spacer class="pb-4" />
                  </div>
                  <div v-else>
                    <v-text-field
                      v-model="reserve.ResourceName"
                      hide-details
                      :label="reserve.ResourceLabel"
                    />
                  </div>
                </div>
              </v-col>
              <v-col v-if="reserve.Type !== 'Project'" cols="3" class="text-center">
                <v-switch
                  v-model="reserve.Used"
                  density="compact"
                  inset
                  hide-details
                  color="secondary"
                >
                  <template #label class="stat-text text-text">
                    Used
                    <cc-tooltip
                      simple
                      inline
                      content="Mark this resource as used or unavailable (but not consumed, destroyed or lost)"
                    >
                      <v-icon size="small" end>mdi-help-circle-outline</v-icon>
                    </cc-tooltip>
                  </template>
                </v-switch>
              </v-col>
            </v-row>

            <v-textarea
              v-model="reserve.Note"
              auto-grow
              filled
              rows="2"
              label="Notes"
              class="mt-4"
            />

            <v-textarea
              v-model="reserve.ResourceCost"
              auto-grow
              filled
              rows="2"
              label="Cost/Complications"
              clearable
            />
          </v-card-text>
        </v-card>
      </cc-titled-panel>
    </v-dialog>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'cc-reserve-item',
  props: {
    reserve: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    remove() {
      this.$emit('remove');
      this.dialog = false;
    },
  },
};
</script>
