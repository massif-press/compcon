<template>
  <div id="output-container">
    <p id="output" class="flavor-text" />
    <div id="overlay" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import typeit from 'typeit'

export default Vue.extend({
  name: 'cc-log',
  data: () => ({
    typeit: {},
    text: [
      'COMPANION/CONCIERGE UNIT INITIALIZING',
      'GMS COMP/CON Unit Mk XI Rev 9.4.1',
      '5016.8.22 General Massive Systems // Please Operate Responsibly',
      'Initializing semantic manifold ... done',
      'Initializing logic gradients ... done',
      '&emsp;&emsp;1.0255EB FREE (3.6EB TOTAL)',
      'KERNEL supported CPUs:',
      '&emsp;&emsp;GMS MISSISSIPPI Series (MkII+)',
      '&emsp;&emsp;IPS-N HighSeas 9+',
      '&emsp;&emsp;SSC Premier IV-XIV',
      '&emsp;&emsp;HA DOMINANCE line/all',
      '&emsp;&emsp;[WN UNKNOWN UNKNOWN UNKNOWN UNKNOWN UNKNOWN UNKN]',
      'Establishing encrypted link (A06::DISCORDANT BREATH) ... done',
      'AM-LI in unprivileged domain disabled',
      'Frame not present or invalid',
      'No sensory bridge found // manual input mode enabled',
      '>//[COMP/CON: <span class="black--text">Welcome, Lancer. Input Command.</span>]',
    ],
  }),
  mounted() {
    this.typeit = new typeit('#output', {
      speed: 12,
      nextStringDelay: 25,
      cursorChar: '_',
      startDelete: false,
      strings: this.text,
    }).go()
  },
  methods: {
    print(user: string, response: string) {
      this.typeit.freeze()

      this.typeit = new typeit('#output', {
        speed: 32,
        lifeLike: true,
        startDelete: false,
        cursorChar: '_',
      })
        .options({ speed: 32, lifeLike: true })
        .type(`$ <span class="success--text">${user}</span>↵`)
        .pause(100)
        .options({ speed: 5, lifeLike: false })
        .type(`<br>>//[COMP/CON: <span class="black--text">${response}</span>]`)
        .go()
    },
  },
})
</script>

<style scoped>
#output {
  position: absolute;
  bottom: 0;
  left: 12px;
  height: 150;
  width: 70vw;
  min-width: 700px;
  overflow: hidden;
  z-index: 2;
  color: var(--v-panel-border-base);
}
#output-container {
  position: absolute;
  height: 250px;
  width: 75vw;
  min-width: 700px;
  top: 0;
  left: 0;
  background: var(--v-panel-base);
  border-bottom: 5px double var(--v-panel-border-base);
  border-right: 5px double var(--v-panel-border-base);
  border-radius: 2px;
  z-index: 1;
}
#overlay {
  position: absolute;
  height: 200px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background: red; */
  background: linear-gradient(var(--v-panel-base) 50%, rgba(0, 0, 0, 0) 100%);
  z-index: 5;
}
</style>
