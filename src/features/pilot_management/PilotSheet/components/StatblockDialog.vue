<template>
  <cc-solo-dialog
    ref="dialog"
    icon="mdi-text-account"
    large
    no-confirm
    title="Generate Statblock"
    @close="clearSelected()"
  >
    <v-card-text>
      <v-row class="px-3">
        <v-col>
          <v-radio-group v-model="genRadios" inline mandatory>
            <v-radio label="Full" class="pr-12" value="full"></v-radio>
            <v-radio label="Pilot Only" class="pr-12" value="pilotBuild"></v-radio>
            <v-radio label="Mech Only" class="pr-12" value="mechBuild"></v-radio>
          </v-radio-group>
        </v-col>
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
      </v-row>

      <v-expand-transition>
        <v-select
          v-model="mechSelect"
          v-if="genRadios != 'pilotBuild'"
          :items="pilot.Mechs"
          placeholder="N/A"
          density="compact"
          item-title="Name"
          item-value="ID"
          label="Select Mech"
          variant="outlined"
          class="mb-4"
          hide-details
        />
      </v-expand-transition>

      <v-textarea
        :value="statblock"
        auto-grow
        readonly
        rows="20"
        variant="solo-filled"
        class="flavor-text"
      />
      <cc-tooltip simple inline content="Copy stat block to clipboard">
        <v-btn
          class="mt-n4"
          prepend-icon="mdi-clipboard-text-outline"
          color="accent"
          @click="copy()"
        >
          Copy to Clipboard
        </v-btn>
      </cc-tooltip>
    </v-card-text>
  </cc-solo-dialog>
</template>

<script lang="ts">
import { Mech, Pilot, Statblock } from '@/class';
import CCSoloDialog from '@/ui/components/CCSoloDialog.vue';

export default {
  name: 'statblock-dialog',
  props: {
    pilot: {
      type: Pilot,
      required: true,
    },
    mechID: {
      type: String,
      required: false,
    },
  },
  components: {
    CCSoloDialog,
  },
  data: () => ({
    selected_mech: null as any,
    discordEmoji: false,
    genRadios: 'pilotBuild',
  }),
  mounted() {
    if (this.mechSelect == null) {
      this.genRadios = 'pilotBuild';
    }
  },
  computed: {
    defaultMechID() {
      if (this.$route.name == 'mech-sheet') {
        return this.mechID;
      } else return this.pilot.Mechs[this.pilot.Mechs.length - 1]?.ID;
    },
    mechSelect() {
      return this.selected_mech ?? this.defaultMechID;
    },
    mech() {
      return this.mechSelect ? this.pilot.Mechs.find((x) => x.ID === this.mechSelect) : null;
    },
    statblock() {
      if (this.genRadios != 'mechBuild') {
        return Statblock.Generate(this.pilot, this.mech as Mech, this.discordEmoji, this.genRadios);
      } else
        return Statblock.GenerateBuildSummary(this.pilot, this.mech as Mech, this.discordEmoji);
    },
  },

  watch: {
    mechSelect() {
      this.selected_mech = this.mechSelect;
    },
  },
  methods: {
    clearSelected() {
      this.selected_mech = null;
    },
    show() {
      (this.$refs.dialog as any).show();
    },
    hide() {
      (this.$refs.dialog as any).hide();
    },
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
            text: 'Unable to copy statblocik',
            data: { icon: 'mdi-clipboard-text-outline', color: 'error' },
          })
        );
    },
  },
};
</script>
