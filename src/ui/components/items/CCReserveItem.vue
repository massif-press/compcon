<template>
  <v-col cols="3">
    <v-dialog v-model="dialog" width="60vw">
      <template v-slot:activator="{ on }">
        <v-btn large outlined :color="reserve.Color" block v-on="on">
          <v-icon small left :color="reserve.Color">cci-barrage</v-icon>
          <div
            style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px"
          >
            <s v-if="reserve.Used">
              {{ reserve.Name }}
            </s>
            <span v-else>
              {{ reserve.Name }}
            </span>
          </div>
        </v-btn>
      </template>
      <cc-titled-panel
        :title="reserve.Name"
        icon="cci-barrage"
        :color="reserve.Color"
        style="height: 100%"
      >
        <div slot="items">
          <cc-tooltip simple inline content="Delete Reserve">
            <v-btn icon color="error" @click="remove()">
              <v-icon>delete</v-icon>
            </v-btn>
          </cc-tooltip>
          <v-btn icon dark @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </div>
        <p class="flavor-text mx-2 my-1" v-html="reserve.Description" />
        <v-card v-if="reserve.ID != 'reserve_skill'" flat outlined class="px-5">
          <v-card-text>
            <v-row>
              <v-col cols="9">
                <div v-if="reserve.Type === 'Resources'">
                  <v-text-field
                    v-model.lazy="reserve.ResourceName"
                    :label="reserve.ResourceLabel"
                    outlined
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
                      v-model.lazy="reserve.ResourceName"
                      :label="reserve.ResourceLabel"
                    />
                  </div>
                </div>
              </v-col>
              <v-col v-if="reserve.Type !== 'Project'" cols="3" class="text-center">
                <v-switch v-model="reserve.Used" dense inset hide-details color="secondary">
                  <span slot="label" class="stat-text text--text">
                    Used
                    <cc-tooltip
                      simple
                      inline
                      content="Mark this resource as used or unavailable (but not consumed, destroyed or lost)"
                    >
                      <v-icon small>mdi-help-circle-outline</v-icon>
                    </cc-tooltip>
                  </span>
                </v-switch>
              </v-col>
            </v-row>
            <v-textarea v-model.lazy="reserve.Note" auto-grow filled rows="2" label="Notes" />

            <v-textarea
              v-model.lazy="reserve.ResourceCost"
              auto-grow
              filled
              rows="2"
              label="Cost/Complications"
              clearable
            />
          </v-card-text>
        </v-card>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Dismiss</v-btn>
        </v-card-actions>
      </cc-titled-panel>
    </v-dialog>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
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
      this.$emit('remove')
      this.dialog = false
    },
  },
})
</script>
