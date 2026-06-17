<template>
  <card>
    <div class="caption text-center mt-n1"
      style="letter-spacing: 3px; font-size: 10px">
      {{ header }} //
      <b>{{ $t('pm.print.deployable') }}</b>
    </div>
    <v-row dense
      align="center">
      <v-col cols="auto"
        class="text-center heading caption my-1">
        {{ deployable.name }}
      </v-col>
      <v-col><v-divider /></v-col>
    </v-row>
    <div class="caption">
      <div class="text-center mb-2">
        <v-chip size="small"
          class="heading"
          color="primary">
          <b>{{ (deployable as any).Name }}</b>
        </v-chip>
      </div>

      <v-row justify="center"
        dense
        class="text-center heading">
        <v-col v-if="(deployable as any).Size">
          <v-card variant="tonal"
            class="pa-1">
            <b>{{ $t('stats.size') }}:</b>
            <br />
            {{ getSize }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).Armor">
          <v-card variant="tonal"
            class="pa-1">
            <b>{{ $t('pm.print.armor') }}</b>
            <br />
            {{ (deployable as any).Armor }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).MaxHP || (deployable as any).Size">
          <v-card variant="tonal"
            class="pa-1">
            <b>{{ $t('stats.hp') }}:</b>
            <br />
            {{
              (deployable as any).MaxHP
                ? (deployable as any).MaxHP.toString().replace(/[{}]/gim, '')
                : parseFloat((deployable as any).Size || 0.5) * 10
            }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).Size">
          <v-card variant="tonal"
            class="pa-1">
            <b>{{ $t('stats.evasion') }}:</b>
            <br />
            {{ (deployable as any).evasion || 10 }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).EDefense">
          <v-card variant="tonal"
            class="pa-1">
            <b>{{ $t('stats.edef') }}:</b>
            <br />
            {{ (deployable as any).EDefense }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).Heatcap">
          <v-card variant="tonal"
            class="pa-1">
            <b>{{ $t('pm.print.heatCap') }}</b>
            <br />
            {{ (deployable as any).Heatcap }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).Sensors">
          <v-card variant="tonal"
            class="pa-1">
            <b>{{ $t('stats.sensors') }}:</b>
            <br />
            {{ (deployable as any).Sensors }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).TechAttack">
          <v-card variant="tonal"
            class="pa-1">
            <b>{{ $t('pm.print.techAtk') }}</b>
            <br />
            {{ (deployable as any).TechAttack }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).Repcap">
          <v-card variant="tonal"
            class="pa-1">
            <b>{{ $t('active.titles.repairCap') }}:</b>
            <br />
            {{ (deployable as any).Repcap }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).Save">
          <v-card variant="tonal"
            class="pa-1">
            <b>{{ $t('stats.save') }}:</b>
            <br />
            {{ (deployable as any).Save }}
          </v-card>
        </v-col>
        <v-col v-if="(deployable as any).Speed">
          <v-card variant="tonal"
            class="pa-1">
            <b>{{ $t('stats.speed') }}:</b>
            <br />
            {{ (deployable as any).Speed }}
          </v-card>
        </v-col>
      </v-row>

      <v-divider class="my-2" />

      <div v-html-safe="(deployable as any).Detail"
        class="mt-1" />

      <action-internal v-for="action in actions"
        :key="action.ID"
        :action="action" />
    </div>
    <div style="position: absolute; bottom: 1px; right: 1px">
      <v-icon v-for="a in actions"
        :key="a.ID"
        :icon="a.Icon"
        :color="a.Color"
        Size="40" />
      <v-icon icon="cc:drone"
        color="primary"
        Size="40" />
    </div>
  </card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Action } from '@/classes/Action';
import Card from './PrintCard.vue';
import ActionInternal from './_actionInternal.vue';
import { IDeployableData } from '@/classes/components/feature/deployable/Deployable';

defineOptions({ name: 'PrintDeployable' })

const props = defineProps<{
  deployable: IDeployableData
  header: string
}>()

const getSize = computed(() => {
  return props.deployable.size === 0.5 ? '½' : props.deployable.size;
})
const actions = computed(() => {
  return props.deployable.actions ? props.deployable.actions.map((x) => new Action(x)) : [];
})
</script>

<style scoped>
.caption {
  font-size: 11px;
}
</style>
