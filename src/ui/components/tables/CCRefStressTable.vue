<template>
  <v-dialog v-model="dialog" width="75vw">
    <v-card flat tile>
      <v-toolbar color="title-bg clipped-large" dark flat>
        <v-toolbar-title class="heading h1">OVERHEATING</v-toolbar-title>
      </v-toolbar>
      <v-row justify="center">
        <v-col cols="11">
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="2">
                  <span class="heading h3">Roll</span>
                </v-col>
                <v-col cols="3">
                  <span class="heading h3">Result</span>
                </v-col>
                <v-col cols="7">
                  <span class="heading h3">Effect</span>
                </v-col>
              </v-row>
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
                  <span class="body-text text--text">
                    Cooling systems recover and manage to contain the peaking heat levels. However,
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
                  <span class="heading h3">Power Plant Destabilize</span>
                </v-col>
                <v-col cols="7">
                  <span class="body-text text--text">
                    Your mech’s power plant becomes unstable, ejecting jets of plasma. Your mech
                    suffers from the
                    <b>exposed</b>
                    status (taking double damage) until it takes action to remove it.
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
                  <span class="body-text text--text">
                    This result has different outcomes depending on how much reactor stress your
                    mech has remaining.
                    <br />
                    3+ - Your mech immediately suffers from the
                    <b>exposed</b>
                    condition until it takes action to remove it.
                    <br />
                    2 - Your mech must pass a engineering check or suffer a reactor meltdown at the
                    end of 1d6 turns after this one (rolled by the GM). You can reverse it by taking
                    a full action and repeating this check. Even on a successful check, your mech
                    suffers from the
                    <b>exposed</b>
                    condition until it takes action to remove it.
                    <br />
                    1 or lower - Your mech suffers a reactor meltdown at the end of your next turn.
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
                  <span class="body-text text--text">
                    Your reactor goes critical. Your mech will suffer a reactor meltdown at the end
                    of your next turn.
                  </span>
                </v-col>
              </v-row>
              <v-divider class="ma-2" />
              <p class="ma-3 flavor-text">
                Certain overheating results can cause a reactor meltdown. This can be immediate, or
                involve a countdown (in which case update the countdown at the start of your turn.
                The meltdown triggers when specified). When a mech suffers a reactor meltdown, any
                pilot inside immediately dies, the mech is immediately vaporized in a catastrophic
                eruption, annihilating the wreck, and any characters inside a burst 2 area centered
                on the mech must pass an agility save or take 4d6 explosive damage, and half on a
                successful save
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-divider />
      <v-card-actions>
        <v-btn text @click="dialog = false">Dismiss</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ref-stress-table',
  data: () => ({
    dialog: false,
  }),
  methods: {
    show() {
      this.dialog = true
    },
    close() {
      this.dialog = false
    },
  },
})
</script>

<style scoped>
.title-bg {
  background: repeating-linear-gradient(
    45deg,
    rgb(124, 0, 0),
    rgba(124, 0, 0) 20px,
    rgba(30, 30, 30) 20px,
    rgba(30, 30, 30) 40px
  );
}

.die-hover {
  opacity: 0.75;
  transform: all 0.3s;
}

.die-hover:hover {
  opacity: 1;
  background-color: #e3f2fd;
}
</style>
