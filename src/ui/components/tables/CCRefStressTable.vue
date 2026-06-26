<template>
  <ref-roll-table-base ref="base" :title="$t('ui.titles.overheating')">
    <v-divider class="ma-2" />
    <v-row>
      <v-col cols="2">
        <v-icon large>mdi-dice-5</v-icon>
        <v-icon large>mdi-minus</v-icon>
        <v-icon large>mdi-dice-6</v-icon>
      </v-col>
      <v-col cols="3">
        <span class="heading h3">Emergency Shunt</span>
      </v-col>
      <v-col cols="7">
        <span class="body-text text-text">
          Cooling systems recover and manage to contain the peaking
          heat levels. However, your mech is
          <b>impaired</b>
          until the end of your next turn.
        </span>
      </v-col>
    </v-row>
    <v-divider class="ma-2" />
    <v-row>
      <v-col cols="2">
        <v-icon large>mdi-dice-2</v-icon>
        <v-icon large>mdi-minus</v-icon>
        <v-icon large>mdi-dice-4</v-icon>
      </v-col>
      <v-col cols="3">
        <span class="heading h3">Power Plant Destabilize</span>
      </v-col>
      <v-col cols="7">
        <span class="body-text text-text">
          Your mech's power plant becomes unstable, ejecting jets of
          plasma. Your mech suffers from the
          <b>exposed</b>
          status (taking double damage) until it takes action to
          remove it.
        </span>
      </v-col>
    </v-row>
    <v-divider class="ma-2" />
    <v-row>
      <v-col cols="2">
        <v-icon large>mdi-dice-1</v-icon>
      </v-col>
      <v-col cols="3">
        <span class="heading h3">Meltdown</span>
      </v-col>
      <v-col cols="7">
        <span class="body-text text-text">
          This result has different outcomes depending on how much
          reactor stress your mech has remaining.
          <br />
          3+ - Your mech becomes EXPOSED
          <br />
          2 - Roll an ENGINEERING check. On a success, your mech is
          EXPOSED; on a failure, it suffers a reactor meltdown after
          1d6 of your turns (rolled by the GM). A reactor meltdown can
          be prevented by retrying the ENGINEERING check as a free
          action
          <br />
          1 or lower - Your mech suffers a reactor meltdown at the end
          of your next turn.
        </span>
      </v-col>
    </v-row>
    <v-divider class="ma-2" />
    <v-row>
      <v-col cols="2">
        <v-icon large>mdi-dice-1</v-icon>
        <v-icon large>mdi-dice-1</v-icon>
      </v-col>
      <v-col cols="3">
        <span class="heading h3">Irreversible Meltdown</span>
      </v-col>
      <v-col cols="7">
        <span class="body-text text-text">
          Your reactor goes critical. Your mech will suffer a reactor
          meltdown at the end of your next turn.
        </span>
      </v-col>
    </v-row>
    <v-divider class="ma-2" />
    <p class="ma-3 flavor-text">
      Certain overheating results can cause a reactor meltdown. This
      can be immediate, or involve a countdown (in which case update
      the countdown at the start of your turn. The meltdown triggers
      when specified). When a mech suffers a reactor meltdown, any
      pilot inside immediately dies, the mech is immediately vaporized
      in a catastrophic eruption, annihilating the wreck, and any
      characters inside a burst 2 area centered on the mech must pass
      an agility save or take 4d6 explosive damage, and half on a
      successful save
    </p>
  </ref-roll-table-base>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RefRollTableBase from './_RefRollTableBase.vue';

defineOptions({ name: 'ref-stress-table' })

const base = ref<any>(null)

function show() {
      (base.value as any).show();
    }
function close() {
      (base.value as any).close();
    }
</script>
