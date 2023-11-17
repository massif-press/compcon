<template>
  <card>
    <div class="caption text-center mt-n1" style="letter-spacing: 3px; font-size: 10px">
      {{ header }} // <b>DEPLOYABLE</b>
    </div>
    <v-row dense align="center">
      <v-col cols="auto" class="text-center heading caption my-1">
        {{ deployable.Name }}
      </v-col>
      <v-col><v-divider /></v-col>
    </v-row>
    <div class="caption">
      <div class="text-center mb-2">
        <v-chip size="small" class="heading" color="primary"
          ><b>{{ (deployable as any).name }}</b></v-chip
        >
      </div>

      <v-row justify="center" dense class="text-center heading">
        <v-col v-if="(deployable as any).size">
          <v-card variant="tonal" class="pa-1">
            <b>Size:</b> <br />
            {{ getSize }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).armor">
          <v-card variant="tonal" class="pa-1">
            <b>Armor:</b> <br />
            {{ (deployable as any).armor }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).hp || (deployable as any).size">
          <v-card variant="tonal" class="pa-1">
            <b>HP:</b> <br />
            {{
              (deployable as any).hp
                ? (deployable as any).hp.toString().replace(/[{}]/gim, '')
                : parseFloat((deployable as any).size || 0.5) * 10
            }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).size">
          <v-card variant="tonal" class="pa-1">
            <b>Evasion:</b> <br />
            {{ (deployable as any).evasion || 10 }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).edef">
          <v-card variant="tonal" class="pa-1">
            <b>E-Def:</b> <br />
            {{ (deployable as any).edef }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).heatcap">
          <v-card variant="tonal" class="pa-1">
            <b>Heat Cap.:</b> <br />
            {{ (deployable as any).heatcap }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).sensor">
          <v-card variant="tonal" class="pa-1">
            <b>Sensors:</b> <br />
            {{ (deployable as any).sensor }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).techattack">
          <v-card variant="tonal" class="pa-1">
            <b>Tech Atk:</b> <br />
            {{ (deployable as any).techattack }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).repcap">
          <v-card variant="tonal" class="pa-1">
            <b>Repair Cap.:</b> <br />
            {{ (deployable as any).repcap }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).save">
          <v-card variant="tonal" class="pa-1">
            <b>Save:</b> <br />
            {{ (deployable as any).save }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).speed">
          <v-card variant="tonal" class="pa-1">
            <b>Speed:</b> <br />
            {{ (deployable as any).speed }}
          </v-card>
        </v-col>
      </v-row>

      <v-divider class="my-2" />

      <div class="mt-1" v-html="(deployable as any).detail" />

      <action-internal v-for="action in actions" :action="action" />
    </div>
    <div style="position: absolute; bottom: 1px; right: 1px">
      <v-icon v-for="a in actions" :icon="a.Icon" :color="a.Color" size="40" />
      <v-icon icon="cc:drone" color="primary" size="40" />
    </div>
  </card>
</template>

<script lang="ts">
import { Action } from '@/classes/Action';
import Card from './PrintCard.vue';
import ActionInternal from './_actionInternal.vue';

export default {
  name: 'print-deployable',
  components: {
    Card,
    ActionInternal,
  },
  props: {
    deployable: {
      type: Object,
      required: true,
    },
    header: {
      type: String,
      required: true,
    },
  },
  computed: {
    getSize(): string {
      return this.deployable.size === 0.5 ? '½' : this.deployable.size;
    },
    actions() {
      return this.deployable.actions ? this.deployable.actions.map((x) => new Action(x)) : [];
    },
  },
};
</script>

<style scoped>
.caption {
  font-size: 11px;
}
</style>
