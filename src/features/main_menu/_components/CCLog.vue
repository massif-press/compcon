<template>
  <div id="output-container">
    <v-row no-gutters>
      <v-col cols="auto"
        class="mr-2">
        <div class="sidebar" />
        <div>
          <img src="../../../assets/ui/sb_l.png" />
        </div>
      </v-col>
      <v-col>
        <p id="completed"
          ref="completed"
          class="flavor-text text-disabled text--darken-1 py-0 my-0"></p>
        <p id="output"
          ref="output"
          class="flavor-text text-disabled text--darken-1 py-0 my-0"></p>
      </v-col>
      <v-col cols="auto"
        class="ml-2">
        <div class="sidebar" />
        <div>
          <img class="ml-n2"
            src="../../../assets/ui/sb_r.png" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue'
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

defineOptions({ name: 'cc-log' })

const completed = ref<any>(null)
const output = ref<any>(null)

const typer = ref({})
const title = ref([])
const lock = ref(false)

const theme = computed(() => {
      return UserStore().User.Theme || 'gms';
    })

function restart() {
      if (typer.value.hasOwnProperty('destroy')) (typer.value as any).destroy(true);
      if (completed.value.innerHTML) completed.value.innerHTML = '';
      if (output.value.innerHTML) output.value.innerHTML = '';
      start();
    }
async function start() {
      await nextTick();
      typer.value = markRaw(
        new TypeIt(output.value, {
          speed: 2,
          nextStringDelay: 5,
          lifeLike: false,
          cursor: false,
          startDelete: false,
          beforeString: () => {
            output.value?.scrollIntoView({ block: 'end' });
          },
          afterString: () => {
            output.value?.scrollIntoView({ block: 'end' });
          },
          afterComplete: async () => {
            if (theme.value === 'horus') {
              await HorusChat(output.value);
            } else {
              lock.value = false;
            }
          },
        })
      );

      switch (theme.value) {
        case 'horus':
          await HorusStart(typer.value);
          break;
        case 'msmc':
          await MsmcStart(typer.value);
          break;
        case 'ssc':
          SscStart(typer.value);
          break;
        case 'ipsn':
          IpsnStart(typer.value);
          break;
        case 'ha':
          HaStart(typer.value);
          break;
        case 'galsim':
          GalsimStart(typer.value);
          break;
        default:
          GmsStart(typer.value);
          break;
      }
    }
function print(user: string, response: string) {
      if (lock.value) return;
      lock.value = true;

      (typer.value as any).destroy();

      //collect written strings so TypeIt doesn't erase them
      if (completed.value.innerHTML)
        completed.value.innerHTML += '<br>';
      completed.value.innerHTML += output.value.innerHTML;
      output.value.innerHTML = '';

      typer.value = markRaw(
        new TypeIt(output.value, {
          speed: 32,
          lifeLike: true,
          nextStringDelay: 7,
          cursor: false,
          beforeString: () => {
            output.value?.scrollIntoView({ block: 'end' });
          },
          afterString: () => {
            output.value?.scrollIntoView({ block: 'end' });
          },
          afterComplete: () => {
            lock.value = false;
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
    }

onMounted(() => {
lock.value = true;
    restart();
})

defineExpose({ print, restart })
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
