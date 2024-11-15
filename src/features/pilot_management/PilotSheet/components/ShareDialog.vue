<template>
  <v-card-text>
    <v-alert variant="tonal" density="compact" border prominent icon="mdi-alert">
      A share code will allow other users with COMP/CON cloud accounts to download a copy of this
      item and subscribe to updates you make. Please be conscientious when updating data that is
      shared with others.
    </v-alert>
    <div v-if="pilot.CloudController.ShareCode">
      <v-row justify="center">
        <v-col cols="auto">
          <div class="text-overline mb-n6">PILOT SHARE CODE</div>
          <b
            class="text-accent"
            style="font-size: 80px; letter-spacing: 15px"
            v-text="
              `${pilot.CloudController.ShareCode.substring(
                0,
                4
              )}&ndash;${pilot.CloudController.ShareCode.substring(4, 8)}`
            " />
          <v-tooltip text="Copy share code to clipboard">
            <template #activator="{ props }">
              <v-btn v-bind="props" icon size="small" variant="text" class="ml-n3" @click="copy()">
                <v-icon>mdi-clipboard-text-outline</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
    </div>
  </v-card-text>
</template>

<script lang="ts">
export default {
  name: 'share-dialog',
  props: {
    pilot: { type: Object, required: true },
  },
  methods: {
    copy() {
      navigator.clipboard.writeText(this.pilot.CloudController.ShareCode);
    },
  },
};
</script>
