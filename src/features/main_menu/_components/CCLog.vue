<template>
  <div id="output-container">
    <v-row no-gutters>
      <v-col cols="auto" class="mr-2">
        <!-- <v-divider vertical /> -->
        <div class="sidebar" />
        <div>
          <img src="../../../assets/ui/sb_l.png" />
        </div>
      </v-col>
      <v-col>
        <p
          id="completed"
          ref="completed"
          class="flavor-text subtle--text text--darken-1 py-0 my-0"
        ></p>
        <p id="output" ref="output" class="flavor-text subtle--text text--darken-1 py-0 my-0">
        </p>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <div class="sidebar" />
        <div>
          <img class="ml-n2" src="../../../assets/ui/sb_r.png" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TypeIt from 'typeit'
import GmsStart from './startup_logs/gms'
import MsmcStart from './startup_logs/msmc'
import SscStart from './startup_logs/ssc'
import IpsnStart from './startup_logs/ipsn'
import HaStart from './startup_logs/ha'
import GalsimStart from './startup_logs/galsim'
import { HorusStart, HorusChat } from './startup_logs/horus'
import { getModule } from 'vuex-module-decorators'
import { UserStore } from '@/store'
import { UserProfile } from '@/user'

export default Vue.extend({
  name: 'cc-log',
  data: () => ({
    typer: {},
    text: [],
    lock: false,
  }),
  computed: {
    profile(): UserProfile {
      const store = getModule(UserStore, this.$store)
      return store.UserProfile
    },
    theme(): string {
      return this.profile.Theme
    },
  },
  watch: {
    theme(newval, oldval) {
      if (newval !== oldval) this.restart()
    },
  },
  async mounted() {
    this.lock = true
    this.restart()
  },
  methods: {
    restart() {
      if (this.typer.hasOwnProperty('destroy')) this.typer.destroy(true)
      if (this.$refs.completed.innerHTML) this.$refs.completed.innerHTML = ''
      if (this.$refs.output.innerHTML) this.$refs.output.innerHTML = ''
      this.start()
    },
    async start() {
      await Vue.nextTick()
      this.typer = new TypeIt(this.$refs.output, {
        speed: 2,
        nextStringDelay: 5,
        lifeLike: false,
        cursor: false,
        startDelete: false,
        beforeString: () => {
          this.$refs.output?.scrollIntoView({ block: 'end' })
        },
        afterString: () => {
          this.$refs.output?.scrollIntoView({ block: 'end' })
        },
        afterComplete: () => {
          if (this.profile.Theme === 'horus') {
            HorusChat(this.$refs.output)
          } else {
            this.lock = false
          }
        },
      })

      switch (this.profile.Theme) {
        case 'horus':
          // this.typer.go()
          HorusStart(this.typer)
          // HorusChat(this.typer)
          break
        case 'msmc':
          MsmcStart(this.typer)
        case 'ssc':
          SscStart(this.typer)
        case 'ipsn':
          IpsnStart(this.typer)
        case 'ha':
          HaStart(this.typer)
        case 'galsim':
          GalsimStart(this.typer) 
        default:
          GmsStart(this.typer)
          break
      }
    },
    print(user: string, response: string) {
      if (this.lock) return
      this.lock = true

      this.typer.destroy()

      //collect written strings so TypeIt doesn't erase them
      if (this.$refs.completed.innerHTML) this.$refs.completed.innerHTML += '<br>'
      this.$refs.completed.innerHTML += this.$refs.output.innerHTML
      this.$refs.output.innerHTML = ''

      this.typer = new TypeIt(this.$refs.output, {
        speed: 32,
        lifeLike: true,
        nextStringDelay: 7,
        cursor: false,
        beforeString: () => {
          this.$refs.output?.scrollIntoView({ block: 'end' })
        },
        afterString: () => {
          this.$refs.output?.scrollIntoView({ block: 'end' })
        },
        afterComplete: () => {
          this.lock = false
        },
      })
        .type(`$ `)
        .type(`<span class="stark-text--text">${user}</span>↵`)
        .pause(100)
        .options({ speed: 3, lifeLike: false })
        .break()
        .type('>')
        .type(
          `//[<span class="accent--text">COMP/CON</span>: <span class="stark--text">${response}</span>]`
        )
        .type(' ')
        .go()
    },
  },
})
</script>

<style scoped>
#output-container {
  position: absolute;
  height: 90vh;
  overflow-y: scroll;
  overflow-x: hidden;
  width: calc(100vw - 665px);
  top: 0;
  right: 0;
  margin-right: 8px;
  z-index: 1;
}

.sidebar {
  align-self: stretch;
  display: inline-flex;
  height: inherit;
  min-height: calc(100% - 24px);
  max-height: calc(100% - 24px);
  max-width: 16px;
  width: 16px;
  background: url(../../../assets/ui/scale_1.png);
  vertical-align: text-bottom;
}
</style>
