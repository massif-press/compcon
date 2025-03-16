<template>
  <v-card variant="outlined" color="error" class="py-1" :max-width="width" style="font-size: 13px">
    <v-row
      v-if="!controller.OtherError"
      v-for="b in controller.Brews"
      dense
      align="center"
      class="ml-1">
      <v-col cols="auto">
        <v-tooltip location="top" open-delay="300" max-width="300">
          <template #activator="{ props }">
            <span v-bind="props">
              <v-icon v-if="b.Status === 'MISSING'" color="error" icon="mdi-alert-rhombus" />
              <v-icon
                v-else-if="b.Status === 'OFF'"
                color="warning"
                icon="mdi-power-plug-off-outline" />
              <v-icon
                v-else-if="b.Status === 'OLD'"
                color="accent"
                icon="mdi-clock-alert-outline" />
              <v-icon v-else color="success" icon="mdi-check-bold" />
            </span>
          </template>
          <span v-if="b.Status === 'MISSING'">
            The {{ b.LcpName }} Lancer Content Pack is not installed. Non-instanced Pilots and NPCs
            that include content from this LCP cannot be accessed until the required LCP is
            installed or the missing data is removed via the Manage Content menu.
          </span>
          <span v-else-if="b.Status === 'OFF'">
            The {{ b.LcpName }} Lancer Content Pack is installed but is currently disabled.
            Non-instanced Pilots and NPCs that include content from this LCP cannot be accessed
            until the required LCP is activated via the Manage Content menu.
          </span>
          <span v-else-if="b.Status === 'OLD'">
            This item requires a version of the {{ b.LcpName }} Lancer Content Pack newer than the
            one that is currently installed.
          </span>
          <span v-else>The {{ b.LcpName }} Lancer Content Pack is installed and active.</span>
        </v-tooltip>
      </v-col>
      <v-col cols="auto">
        {{ b.LcpName }}
      </v-col>
      <v-col cols="auto"><cc-slashes /></v-col>

      <v-col cols="auto">
        {{ b.LcpVersion }}
      </v-col>
      <v-col v-if="b.Status === 'MISSING' && b.Website" cols="auto" class="ml-2">
        <v-btn
          size="x-small"
          :href="b.Website"
          target="_blank"
          rel="noopener noreferrer"
          variant="tonal"
          color="error">
          <v-icon icon="mdi-open-in-new" start />
          Download LCP
        </v-btn>
      </v-col>
      <v-col v-else-if="b.Status === 'OLD' && b.Website" cols="auto" class="ml-6">
        <v-btn
          size="x-small"
          :href="b.Website"
          target="_blank"
          rel="noopener noreferrer"
          flat
          tile
          color="secondary">
          <v-icon icon="mdi-open-in-new" start />
          Update LCP
        </v-btn>
      </v-col>
    </v-row>
    <p v-if="controller.OtherError" class="text-center">
      COMP/CON encountered an error while loading this item.
      <br />
      Please check the error log in the "Log" tab of the Options menu for more information
    </p>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'cc-brew-info',
  props: {
    controller: {
      type: Object,
      required: true,
    },
    width: {
      type: String,
      default: '100%',
    },
  },
};
</script>
