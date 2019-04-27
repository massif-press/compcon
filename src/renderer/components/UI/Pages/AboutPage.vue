<template>
  <div>
    <h2 class="headline">COMP/CON</h2>
    <p>A digital toolkit for 
      <a flat color="primary" class="ma-0 pa-1" @click="open('https://massif-press.itch.io/lancer-core-book')">Massif Press' LANCER Tabletop RPG.</a>
    </p>
    <p>More information about LANCER can be found at The official 
      <a flat color="primary" class="ma-0 pa-1" @click="open('https://twitter.com/Lancer_RPG')">LANCER Twitter</a>, 
      the <a flat color="primary" class="ma-0 pa-1" @click="open('https://www.reddit.com/r/LancerRPG/')">LANCER subreddit</a>, 
      and the <a flat color="primary" class="ma-0 pa-1" @click="open('https://discord.gg/hQyBzmK')">LANCER Discord Server</a>.
    <br>
    <p>This is a piece of open source software under the GNU Public License — feel free to contribute via the GitHub repository or yell at me directly on Twitter at <a flat color="primary" class="ma-0 pa-1" @click="open('https://twitter.com/jarena2')">@jarena2</a>. COMP/CON is now and will always be free, but if you want to support development of this software monetarily, please consider paying (what you want) for it.</p>
    <br>
    <p class="text-xs-center"><v-btn flat outline color="primary" @click="open('https://github.com/jarena3/compcon/wiki/Roadmap')">Project Roadmap</v-btn> &emsp;&mdash;&emsp;
    <v-btn flat color="primary" outline @click="open('https://github.com/jarena3/compcon/wiki/Getting-Started')">Contributor's Guide</v-btn> &emsp;&mdash;&emsp;
    <v-btn flat color="primary" outline @click="open('https://beeftime.itch.io/compcon')">itch.io page</v-btn>
    </p>
    <br>
    <h2 class="headline">Thanks</h2>
    <p><a flat color="primary" class="ma-0 pa-1" @click="open('https://twitter.com/hellwife0')">Ari</a> for contributing the time and code to help track down bugs and bad compendium data<br>
    As well as everyone who helped by submitting a bug report or alerting me of an issue on the Discord.</p>
    <h2 class="headline">Attributions</h2>

    <p>The frame name generator contains many names lifted from the <a flat color="primary" class="ma-0 pa-1" @click="open('https://twitter.com/cultureshipname')">Culture Ship Name Twitter account</a><br>

    <p>This project was generated with <a flat color="primary" class="ma-0 pa-1" @click="open('https://github.com/SimulatedGREG/electron-vue')">electron-vue</a>using vue-cli.</p>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { remote } from 'electron'
  export default Vue.extend({
    name: 'about-page',
    methods: {
      open (link: string) {
        remote.shell.openExternal(link)
      },
    } 
  })
</script>
