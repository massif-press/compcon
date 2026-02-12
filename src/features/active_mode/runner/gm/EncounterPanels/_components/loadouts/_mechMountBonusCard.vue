<template>
  <div style="position: relative">
    <cc-alert variant="outlined"
      border-color="primary"
      color="text"
      :icon="expanded && 'cc:weapon_profile'"
      :title="expanded && bonus.Name"
      class="mb-2">
      <v-card-text class="pa-0">
        <v-row dense>
          <v-col v-if="!expanded"
            cols="auto">
            <v-tooltip location="top"
              :text="bonus.Name">
              <template #activator="{ props }">
                <v-icon v-bind="props"
                  size="25"
                  color="primary"
                  class="mt-n1"
                  icon="cc:weapon_profile" />
              </template>
            </v-tooltip>
          </v-col>
          <v-col>
            <span v-html-safe="bonus.MountedEffect"
              class=text-text />
          </v-col>
        </v-row>

        <cc-combat-action-chip v-for="a in bonus.Actions"
          v-if="!expanded"
          :action="a"
          :owner="owner"
          class="mt-1"
          :encounter="encounter">
          <template #icon>
            <v-tooltip location="top"
              text="Equipment Action">
              <template #activator="{ props }">
                <v-icon v-bind="props"
                  icon="cc:system" />
              </template>
            </v-tooltip>
          </template>
        </cc-combat-action-chip>

        <deploy-button v-for="d in bonus.Deployables"
          v-if="!expanded"
          :deployable="d"
          :actor="mech"
          @deploy="$emit('deploy', d)" />
      </v-card-text>


    </cc-alert>
    <div style="position: absolute; right: -5px; bottom: -4px"
      class="fade-select">
      <v-tooltip max-width="300"
        location="top">
        <template #activator="{ props }">
          <v-icon v-bind="props"
            icon="mdi-alert-outline"
            size="16"
            color="warning" />
        </template>
        Mount bonus effects on weapon attacks are
        <strong class="text-accent"><u>NOT</u></strong>
        automatically enforced by COMP/CON. Please ensure you manually apply any relevant
        effects during gameplay.
      </v-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'mech-mount-bonus-card',
  components: {},
  props: {
    bonus: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
    owner: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
    expanded: {
      type: Boolean,
    },
  },
  emits: ['deploy'],
  computed: {
    mobile(): boolean {
      return this.$vuetify.display.smAndDown;
    },
  },
};
</script>
