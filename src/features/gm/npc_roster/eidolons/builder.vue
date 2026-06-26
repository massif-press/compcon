<template>
  <v-row dense class="heading mech" style="min-width: 30vw; line-height: 1em" align="center">
    <v-col cols="auto">
      <v-icon size="70" icon="cc:monist" class="mt-n2" />
    </v-col>
    <v-col>
      <cc-short-string-editor
        large
        :readonly="readonly"
        justify="start"
        :placeholder="item.Name"
        @set="item.Name = $event">
        <div class="heading-block">
          {{ item.Name }}
        </div>
      </cc-short-string-editor>
    </v-col>
    <v-col cols="auto">
      <div class="pr-12 heading h3 text-center" style="line-height: 1.2em">
        {{ $t('common.tierN', { n: item.Tier }) }}
        <v-divider />
        <span>{{ $t('gm.eidolonPrint.classLabel', { class: item.Class }) }}</span>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Eidolon } from '@/classes/npc/eidolon/Eidolon'
defineOptions({ name: 'eidolon-builder-content' })

const props = withDefaults(defineProps<{
  item: Eidolon
  readonly?: boolean
}>(), {
  readonly: false
})
</script>
