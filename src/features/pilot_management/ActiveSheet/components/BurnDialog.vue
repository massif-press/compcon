<template>
  <v-dialog v-model="dialog" width="60vw">
    <v-card>
      <v-toolbar flat dense dark color="damage--burn" class="heading h2"
        >Burn</v-toolbar
      >
      <v-card-text class="text-center">
        <div class="heading h3 font-weight-bold stark--text mt-2">
          <span class="subtle--text">FRAME.ALERT::</span>
          mech has been inflicted with
          <span class="damage--burn--text">{{ mech.Burn }} Burn</span>
        </div>
        <p class="my-2 body-text text--text">
          Make an
          <b>ENGINEERING</b>
          check to clear the current Burn , or suffer
          <span class="damage--burn--text">{{ mech.Burn }} Damage</span>
        </p>
        <v-row justify="center" class="text-center mt-4">
          <v-col lg="auto" md="12" class="mt-n5">
            <v-row
              dense
              class="text-center mb-n3"
              justify="start"
              align="start"
            >
              <v-col cols="auto" class="mx-8">
                <div class="overline mb-n2">Engineering Roll</div>
                <div class="heading text--text" style="font-size: 24pt">
                  <v-icon x-large class="mr-n1">mdi-dice-d20-outline</v-icon>
                  + {{ mech.Eng }}
                  <cc-synergy-display
                    location="engineering"
                    :mech="mech"
                    class="d-inline"
                  />
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="auto" class="mr-2">
            <cc-tooltip title="Roll Engineering Check" :content="rollTooltip">
              <v-btn
                icon
                small
                color="accent"
                class="mt-1 mr-n3"
                @click="rollCheck"
              >
                <v-icon large>mdi-dice-multiple</v-icon>
              </v-btn>
            </cc-tooltip>
          </v-col>
          <v-col cols="auto">
            <v-text-field
              v-model="roll"
              type="number"
              label="Engineering Check Result"
              variant="outlined"
              dense
              hide-details
              class="flavor-text"
              style="width: 300px"
            />
          </v-col>
        </v-row>
        <v-row v-if="roll" dense justify="center">
          <v-col cols="6">
            <v-btn
              v-if="roll < 10"
              large
              dark
              tile
              block
              color="damage--burn"
              :disabled="!roll"
              @click="complete()"
            >
              FAILURE
            </v-btn>
            <v-btn
              v-else
              large
              dark
              tile
              block
              color="success"
              :disabled="!roll"
              @click="complete(true)"
            >
              SUCCESS
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { DiceRoller } from '@/class';

export default {
  name: 'burn-dialog',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    roll: null,
    dialog: false,
  }),
  computed: {
    rollTooltip() {
      if (this.roll) return `${this.roll} + ${this.mech.Eng}`;
      return '';
    },
  },
  methods: {
    rollCheck() {
      this.roll = DiceRoller.rollToHit(this.mech.Eng).total;
    },
    show() {
      this.dialog = true;
    },
    complete(success) {
      if (success) {
        this.mech.Pilot.State.ClearBurn();
        this.$emit('complete', null);
      } else {
        const preStruct = this.mech.CurrentStructure;
        const preHP = this.mech.CurrentHP;
        this.mech.Pilot.State.TakeBurn();
        this.$emit('complete', {
          hp: preHP - this.mech.CurrentHP,
          str: preStruct - this.mech.CurrentStructure,
        });
      }
      this.roll = null;
      this.dialog = false;
    },
  },
};
</script>
