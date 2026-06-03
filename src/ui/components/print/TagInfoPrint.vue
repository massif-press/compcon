<template>
  <tag-info-display :tags="tags" />
</template>

<script setup lang="ts">
import type { Mech } from '@/classes/mech/Mech'
import type { Pilot } from '@/classes/pilot/Pilot'
import { computed } from 'vue'
import * as _ from 'lodash-es'
import { Eidolon } from '@/classes/npc/eidolon/Eidolon'
import { NpcFeature } from '@/classes/npc/feature/NpcFeature'
import { Unit } from '@/classes/npc/unit/Unit'
import type { Npc } from '@/classes/npc/Npc'
import Tag from '@/classes/Tag'
import TagInfoDisplay from '@/ui/components/print/TagInfoDisplay.vue'

defineOptions({ name: 'tag-info-print' })

const props = defineProps<{
  pilot?: Pilot
  mech?: Mech
  npcs?: Npc[]
  allTags?: Tag[]
}>()

const tags = computed(() => {
  if (props.npcs) {
    let features = [] as NpcFeature[]
    props.npcs.forEach((npc: any) => {
      if ((npc as Unit).NpcFeatureController)
        features = features.concat((npc as Unit).NpcFeatureController.Features)
      if ((npc as Eidolon).Layers) {
        ;(npc as Eidolon).Layers.forEach((layer) => {
          if (layer.Layer.Features.length) features = features.concat(layer.Layer.Features)
          if (layer.Layer.Shards && layer.Layer.Shards.Features.length)
            features = features.concat(layer.Layer.Shards.Features)
        })
      }
    })
    features = features.filter((x) => !x.IsHidden)
    return _.uniqBy(features.flatMap((f) => f.Tags), 'ID')
  }

  if (props.pilot) {
    let arr = [] as any[]
    arr = (props.pilot as any).Loadout.Items.flatMap((x: any) => x.Tags)
    if (props.mech)
      arr = [
        ...arr,
        ...(props.mech as any).MechLoadoutController.ActiveLoadout.Equipment.flatMap((x: any) => x.Tags),
      ]
    return _.uniqBy(arr, 'ID')
  }

  return (props.allTags ?? []).filter((x) => !x.IsHidden).sort((a, b) => a.Name.localeCompare(b.Name))
})
</script>
