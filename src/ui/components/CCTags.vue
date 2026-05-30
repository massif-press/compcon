<template>
  <div v-for="t in filteredTags"
    v-if="extended && (!mobile || forceExtended)"
    :key="t.ID"
    class="mb-1">
    <cc-extended-tag :tag="t"
      :color="t.IsExotic ? 'exotic' : color" />
  </div>

  <div v-else-if="print">
    <v-chip v-for="t in filteredTags"
      :key="t.ID"
      variant="outlined"
      size="small"
      label
      class="mx-1 mt-n1 my-0">
      {{ t.GetName(bonus, tier) }}
    </v-chip>
  </div>

  <div v-else-if="!extended || mobile">
    <cc-tag v-for="t in filteredTags"
      :key="t.ID"
      :tag="t"
      :size="size ? size : mobile ? 'x-small' : 'small'"
      :density="density"
      :color="color"
      :tier="tier"
      :bonus="bonus" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMobile } from '@/composables/useMobile'
import CCExtendedTag from './CCExtendedTag.vue'
import Tag from '@/classes/Tag'

const props = defineProps({
    size: {
      type: String,
      required: false,
    },
    density: {
      type: String,
      required: false,
    },
    outlined: {
      type: Boolean,
      required: false,
    },
    extended: {
      type: Boolean,
      required: false,
    },
    print: {
      type: Boolean,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
    tags: {
      type: Array,
      required: true,
    },
    bonus: {
      type: Number,
      required: false,
      default: 0,
    },
    tier: {
      type: Number,
      required: false,
      default: 1,
    },
    combat: {
      type: Boolean,
      required: false,
    },
    forceExtended: {
      type: Boolean,
    },
  })

const { mobile, portrait } = useMobile()

const filteredTags = computed(() => {
  const tArr: Tag[] = (props.tags as any[]).filter(x => x) as Tag[]
  if (!tArr || !tArr.length) return []
  if (!tArr.length) return []
  if (props.combat) {
    return (tArr as Tag[]).filter((t: Tag) => t.IsCombatTag)
  }
  return (tArr as Tag[]).sort((a: Tag, b: Tag) => {
    if (a.IsExotic && !b.IsExotic) return -1
    if (!a.IsExotic && b.IsExotic) return 1
    return a.GetName().localeCompare(b.GetName())
  })
})
</script>
