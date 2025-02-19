<template>
  <cc-dialog
    :close-on-click="false"
    :title="reserve.Name"
    :icon="reserve.Icon"
    :color="reserve.Color">
    <template #activator="{ open }">
      <cc-button
        :color="reserve.Color"
        :style="reserve.Used ? 'opacity: 0.5' : ''"
        :size="mobile ? 'small' : undefined"
        block
        :prepend-icon="reserve.Icon"
        @click="open">
        <template #info v-if="reserve.Used">
          <v-icon icon="mdi-circle-off-outline" />
        </template>
        {{ reserve.Name }}
      </cc-button>
    </template>
    <template #toolbar-items="{ close }">
      <v-btn icon @click="remove()">
        <v-icon icon="mdi-delete" />
      </v-btn>
      <v-btn icon @click="close">
        <v-icon icon="mdi-close" />
      </v-btn>
    </template>
    <p v-html-safe="reserve.Description" class="flavor-text text-text pa-2" />
    <v-card-text v-if="reserve.ID != 'reserve_skill'">
      <v-row align="center" dense>
        <v-col>
          <div v-if="reserve.Type === 'Resources'">
            <cc-text-field
              v-model="reserve.ResourceName"
              color="primary"
              :label="reserve.ResourceLabel"
              variant="outlined" />
          </div>
          <div v-else-if="reserve.Type === 'Mech'">
            <span class="effect-text">{{ reserve.Description }}</span>
          </div>
          <div v-else>
            <div
              v-if="
                reserve.ID === 'reserve_bombardment' || reserve.ID === 'reserve_extendedharness'
              ">
              <span class="effect-text">{{ reserve.Description }}</span>
              <v-spacer class="pb-4" />
            </div>
            <div v-else>
              <cc-text-field
                v-model="reserve.ResourceName"
                color="primary"
                variant="outlined"
                :label="reserve.ResourceLabel" />
            </div>
          </div>
        </v-col>
        <v-col v-if="reserve.Type !== 'Project'" cols="auto" class="ml-auto">
          <cc-switch
            v-model="reserve.Used"
            density="compact"
            inset
            hide-details
            color="success"
            active-color="error"
            label="Used"
            tooltip="Mark this resource as used or unavailable (but not consumed, destroyed or lost)"></cc-switch>
        </v-col>
      </v-row>
      <br />
      <cc-text-area v-model="reserve.Note" color="primary" label="Notes" />
      <br />

      <cc-text-area
        v-model="reserve.ResourceCost"
        color="primary"
        label="Cost/Complications"
        clearable />
    </v-card-text>
  </cc-dialog>
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
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
  methods: {
    remove() {
      this.$emit('remove');
      this.dialog = false;
    },
  },
};
</script>
