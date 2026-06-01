<template>
  <div class="pa-2 mt-3">
    <div class="text-overline text-primary" style="line-height: 15px">SKILL TRIGGER DETAIL</div>
    <v-row dense>
      <v-col v-for="t in triggers" :key="t.ID" style="min-width: 16vw" class="no-print-break">
        <v-card variant="outlined" class="pa-1" color="grey" style="height: 100%">
          <div class="caption heading text-black">
            <v-icon icon="cc:skill" class="mt-n1" />
            {{ t.Name }}
          </div>
          <div class="caption text-black">
            {{ t.Description }}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { Pilot } from '@/classes/pilot/Pilot'
import { computed } from 'vue'
import { CompendiumStore } from '@/stores';

defineOptions({ name: 'tag-info-print' })

const props = defineProps<{
  pilot: Pilot
}>()

const triggers = computed(() => {
      return CompendiumStore().Skills.filter((s) =>
        props.pilot.SkillsController.Skills.some((x) => x.Skill.ID === s.ID)
      );
    })
</script>

<style scoped>
@import '@/ui/style/print-common.css';
</style>
