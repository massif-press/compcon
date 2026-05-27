<template>
  <ref-roll-table-base ref="base" title="STRUCTURE DAMAGE">
    <v-divider class="ma-2" />
    <v-row>
      <v-col cols="2">
        <v-icon large>mdi-dice-5</v-icon>
        <v-icon large>mdi-minus</v-icon>
        <v-icon large>mdi-dice-6</v-icon>
      </v-col>
      <v-col cols="3">
        <span class="heading h3">Glancing Blow</span>
      </v-col>
      <v-col cols="7">
        <span class="body-text text-text">
          Emergency systems kick in and stabilize your mech. However,
          your mech is
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
        <span class="heading h3">System Trauma</span>
      </v-col>
      <v-col cols="7">
        <span class="body-text text-text">
          Parts of your mech are torn off by the damage. Roll a d6. On
          a 1-3, all the weapons on one mount are destroyed. On a 4-6,
          a system is destroyed. You choose what's destroyed, but
          systems or weapons with the limited tag and no charges left
          are not valid. If there's nothing left of one result, it
          becomes the other. If there's absolutely nothing left to
          destroy, this result becomes DIRECT HIT instead.
        </span>
      </v-col>
    </v-row>
    <v-divider class="ma-2" />
    <v-row>
      <v-col cols="2">
        <v-icon large>mdi-dice-1</v-icon>
      </v-col>
      <v-col cols="3">
        <span class="heading h3">Direct Hit</span>
      </v-col>
      <v-col cols="7">
        <span class="body-text text-text">
          This result has different outcomes depending on how much
          structure your mech has remaining.
          <br />
          3+ - Your mech is
          <b>stunned</b>
          until the end of your next turn.
          <br />
          2 - Your mech must pass a
          <b>hull</b>
          check or be
          <b>destroyed.</b>
          Even on a successful check, your mech is
          <b>stunned</b>
          until the end of your next turn.
          <br />
          1 or lower - Your mech is
          <b>destroyed</b>
          .
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
        <span class="heading h3">Crushing Hit</span>
      </v-col>
      <v-col cols="7">
        <span class="body-text text-text">
          Your mech is damaged beyond repair and is
          <b>destroyed</b>
          . You can still exit it as normal.
        </span>
      </v-col>
    </v-row>
  </ref-roll-table-base>
</template>

<script lang="ts">
import RefRollTableBase from './_RefRollTableBase.vue';

export default {
  name: 'ref-structure-table',
  components: { RefRollTableBase },
  methods: {
    show() {
      (this.$refs.base as any).show();
    },
    close() {
      (this.$refs.base as any).close();
    },
  },
};
</script>
