<template>
  <v-card-text :class="mobile && 'px-0'">
    <cc-alert prominent icon="mdi-alert">
      A share code will allow other users with COMP/CON cloud accounts to download a copy of this
      item and subscribe to updates you make. Please be conscientious when updating data that is
      shared with others.
    </cc-alert>
    <div v-if="pilot.CloudController.ShareCode" :class="mobile && 'text-center'">
      <v-row justify="center">
        <v-col cols="auto">
          <div class="text-cc-overline mt-4">PILOT SHARE CODE</div>
          <b
            class="text-accent"
            style="font-size: calc(30px + 2vw)"
            v-text="
              `${pilot.CloudController.ShareCode.substring(
                0,
                4
              )}&ndash;${pilot.CloudController.ShareCode.substring(4, 8)}`
            " />
          <v-tooltip text="Copy share code to clipboard">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                size="small"
                variant="text"
                class="ml-n3"
                @click.stop="copy()">
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
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
  methods: {
    copy() {
      navigator.clipboard.writeText(this.pilot.CloudController.ShareCode);
    },
  },
};
</script>
