<template>
  <v-card>
    <v-toolbar density="compact" color="primary">
      <v-toolbar-title class="heading h3">
        <v-icon start icon="mdi-text-account" />
        NPC STATBLOCK
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <!-- <v-row class="px-3 mb-1" justify="end">
        <v-col cols="auto">
          <v-switch v-model="discordEmoji" inset color="accent" density="compact" hide-details>
            <template #label>
              <div>
                Include Pilot NET Discord damage type Emoji
                <div class="text-caption" style="line-height: 8px">
                  (Doesn't work in code block format)
                </div>
              </div>
            </template>
          </v-switch>
        </v-col>
      </v-row> -->

      <v-textarea
        :value="statblock"
        auto-grow
        readonly
        rows="20"
        hide-details
        variant="solo-filled"
        class="flavor-text" />
      <v-tooltip text="Copy stat block to clipboard">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="tonal"
            prepend-icon="mdi-clipboard-text-outline"
            color="accent"
            @click="copy()">
            Copy to Clipboard
          </v-btn>
        </template>
      </v-tooltip>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Statblock } from '@/class';
import { Unit } from '@/classes/npc/unit/Unit';

export default {
  name: 'statblock-dialog',
  props: {
    item: {
      type: Unit,
      required: true,
    },
  },
  data: () => ({
    discordEmoji: false,
  }),
  computed: {
    statblock(): string {
      return Statblock.GenerateNPC(this.item);
    },
  },

  methods: {
    copy() {
      navigator.clipboard
        .writeText(this.statblock)
        .then(() =>
          this.$notify({
            title: 'Statblock Copied to Clipboard',
            text: 'Copy Success',
            data: { icon: 'mdi-clipboard-text-outline' },
          })
        )
        .catch(() =>
          this.$notify({
            title: 'Error',
            text: 'Unable to copy statblock',
            data: { icon: 'mdi-clipboard-text-outline', color: 'error' },
          })
        );
    },
  },
};
</script>
