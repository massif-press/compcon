<template>
  <v-col
    cols="auto"
    class="pa-0"
    @click="$emit('clicked')"
  >
    <cc-tooltip max-width="400px">
      <template #activator="{ props }">
        <div
          style="position: relative"
          class="pa-1 mx-n2"
          v-bind="props"
        >
          <talent-emblem
            :talent="talent"
            size="small"
            :dark="dark"
          />
          <div
            v-if="rank"
            class="bg-primary flavor-text text-center"
            style="font-size: 12px; position: absolute; bottom: 0; right: 0; padding: 0px 3px"
          >
            {{ 'I'.repeat(Number(rank)) }}
          </div>
        </div>
      </template>
      <div>
        <div class="heading h3">{{ talent.Name }}</div>
        <v-divider class="my-1" />
        <div v-if="rank">
          <div
            v-for="n in rank"
            :key="`rank-${n}`"
          >
            <b>{{ talent.Rank(Number(n)).Name }}</b>
            <cc-slashes class="px-2" />
            <span class="text-cc-overline text-disabled">
              {{ $t('common.rank') }} {{ 'I'.repeat(Number(n)) }}
            </span>
            <talent-rank-contents :talent-rank="talent.Rank(Number(n))" />
          </div>
        </div>
      </div>
    </cc-tooltip>
  </v-col>
</template>

<script setup lang="ts">
  import type { Talent } from '@/classes/pilot/components/talent/Talent'
  import TalentEmblem from './_TalentEmblem.vue'
  import TalentRankContents from './_TalentRankContents.vue'

  const props = withDefaults(
    defineProps<{
      talent: Talent
      rank?: number | string
      dark?: boolean
    }>(),
    {
      rank: undefined,
      dark: false,
    }
  )

  const emit = defineEmits<{
    clicked: []
  }>()
</script>
