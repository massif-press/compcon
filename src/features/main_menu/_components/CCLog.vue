<template>
  <div id="output-container">
    <v-row no-gutters>
      <v-col cols="auto" class="mr-2">
        <div class="sidebar" />
        <div>
          <img src="../../../assets/ui/sb_l.png" />
        </div>
      </v-col>
      <v-col>
        <p
          id="completed"
          ref="completed"
          class="flavor-text text-disabled text--darken-1 py-0 my-0"></p>
        <p id="output" ref="output" class="flavor-text text-disabled text--darken-1 py-0 my-0"></p>
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
import { markRaw } from 'vue';
import TypeIt from 'typeit';
import GmsStart from './startup_logs/gms';
import MsmcStart from './startup_logs/msmc';
import { HorusStart, HorusChat } from './startup_logs/horus';
import SscStart from './startup_logs/ssc';
import IpsnStart from './startup_logs/ipsn';
import HaStart from './startup_logs/ha';
import GalsimStart from './startup_logs/galsim';

import { UserStore } from '@/stores';
import { UserProfile } from '@/user';

export default {
  name: 'cc-log',
  data: () => ({
    typer: {},
    title: [],
    lock: false,
  }),
  computed: {
    theme(): string {
      return UserStore().User.Theme || 'gms';
    },
  },
  watch: {
    theme(newval, oldval) {
      if (newval !== oldval) this.restart();
    },
  },
  async mounted() {
    this.lock = true;
    this.restart();
  },
  methods: {
    restart() {
      if (this.typer.hasOwnProperty('destroy')) (this.typer as any).destroy(true);
      if ((this.$refs as any).completed.innerHTML) (this.$refs as any).completed.innerHTML = '';
      if ((this.$refs as any).output.innerHTML) (this.$refs as any).output.innerHTML = '';
      this.start();
    },
    async start() {
      await this.$nextTick();
      this.typer = markRaw(
        new TypeIt((this.$refs as any).output, {
          speed: 2,
          nextStringDelay: 5,
          lifeLike: false,
          cursor: false,
          startDelete: false,
          beforeString: () => {
            (this.$refs as any).output?.scrollIntoView({ block: 'end' });
          },
          afterString: () => {
            (this.$refs as any).output?.scrollIntoView({ block: 'end' });
          },
          afterComplete: async () => {
            if (this.theme === 'horus') {
              await HorusChat((this.$refs as any).output);
            } else {
              this.lock = false;
            }
          },
        })
      );

      switch (this.theme) {
        case 'horus':
          await HorusStart(this.typer);
          break;
        case 'msmc':
          await MsmcStart(this.typer);
          break;
        case 'ssc':
          SscStart(this.typer);
          break;
        case 'ipsn':
          IpsnStart(this.typer);
          break;
        case 'ha':
          HaStart(this.typer);
          break;
        case 'galsim':
          GalsimStart(this.typer);
          break;
        default:
          GmsStart(this.typer);
          break;
      }
    },
    print(user: string, response: string) {
      if (this.lock) return;
      this.lock = true;

      (this.typer as any).destroy();

      //collect written strings so TypeIt doesn't erase them
      if ((this.$refs as any).completed.innerHTML)
        (this.$refs as any).completed.innerHTML += '<br>';
      (this.$refs as any).completed.innerHTML += (this.$refs as any).output.innerHTML;
      (this.$refs as any).output.innerHTML = '';

      this.typer = markRaw(
        new TypeIt((this.$refs as any).output, {
          speed: 32,
          lifeLike: true,
          nextStringDelay: 7,
          cursor: false,
          beforeString: () => {
            (this.$refs as any).output?.scrollIntoView({ block: 'end' });
          },
          afterString: () => {
            (this.$refs as any).output?.scrollIntoView({ block: 'end' });
          },
          afterComplete: () => {
            this.lock = false;
          },
        })
      )
        .type(`$ `)
        .type(`<span class="stark-text-text">${user}</span>↵`)
        .pause(100)
        .options({ speed: 3, lifeLike: false })
        .break()
        .type('>')
        .type(
          `//[<span class="text-accent">COMP/CON</span>: <span class="text-stark">${response}</span>]`
        )
        .type(' ')
        .go();
    },
  },
};
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
