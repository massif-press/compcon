<template>
  <cc-solo-dialog
    ref="dialog"
    icon="mdi-text-subject"
    large
    no-confirm
    title="Generate Statblock"
    @close="clearSelected()"
  >
    <v-card-text>
      <v-select
        v-model="mechSelect"
        :items="pilot.Mechs"
        placeholder="N/A"
        item-text="Name"
        item-value="ID"
        label="Select Mech"
        variant="outlined"
        hide-details
      />
      <v-radio-group v-model="genRadios" row mandatory label="Generate:">
        <v-radio label="Mech Build" value="mechBuild"></v-radio>
        <v-radio label="Pilot" value="pilotBuild"></v-radio>
        <v-radio label="Full" value="full"></v-radio>
      </v-radio-group>
      <v-checkbox
        v-model="discordEmoji"
        label="Include Pilot NET Discord damage type Emoji (Doesn't work in code block format)"
      />
      <v-textarea
        :value="statblock"
        auto-grow
        readonly
        variant="outlined"
        filled
        class="flavor-text"
      />
      <cc-tooltip simple inline content="Copy stat block to clipboard">
        <v-btn class="mt-n4" color="accent" @click="copy()">
          <v-icon>mdi-clipboard-text-outline</v-icon>
          Copy to Clipboard
        </v-btn>
      </cc-tooltip>
    </v-card-text>
  </cc-solo-dialog>
</template>

<script lang="ts">
import { Pilot, Statblock } from '@/class';
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
    selected_mech: null,
    discordEmoji: false,
    genRadios: 'mechBuild',
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
      } else
        return (
          this.pilot.ActiveMech?.ID ??
          this.pilot.Mechs[this.pilot.Mechs.length - 1]?.ID ??
          ''
        );
    },
    mechSelect() {
      return this.selected_mech ?? this.defaultMechID;
    },
    mech() {
      return this.mechSelect
        ? this.pilot.Mechs.find((x) => x.ID === this.mechSelect)
        : null;
    },
    statblock() {
      if (this.genRadios != 'mechBuild') {
        return Statblock.Generate(
          this.pilot,
          this.mech,
          this.discordEmoji,
          this.genRadios
        );
      } else
        return Statblock.GenerateBuildSummary(
          this.pilot,
          this.mech,
          this.discordEmoji
        );
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
          this.$notify('Stat block copied to clipboard.', 'confirmation')
        )
        .catch(() => this.$notifyError('Unable to copy stat block'));
    },
  },
};
</script>
