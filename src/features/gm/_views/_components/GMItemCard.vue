<template>
  <gm-list-item-base v-if="list"
    :item="item"
    :big="big"
    :odd="odd"
    :grouping="groupValues"
    :sorting="sortValues"
    @open="$emit('open', item)">
    <template #title>
      <template v-if="type === 'Character'">
        <div>
          <cc-remote-hover :item="item"
            color="accent" />
          {{ item.Name }}
          <span class="text-caption text-uppercase text-disabled">
            <cc-slashes class="mx-1" />
            {{ item.Pronouns }}
          </span>
        </div>
        <div class="pl-1 text-body-2">
          <i>{{ item.Title }}</i>
        </div>
      </template>
      <template v-else-if="type === 'Doodad'">
        <cc-remote-hover :item="item"
          color="accent" />
        {{ item.Name }}
      </template>
      <template v-else-if="type === 'Eidolon'">
        <cc-missing-content-hover :item="item" />
        <cc-remote-hover :item="item"
          color="accent" />
        {{ item.Name }}&mdash; {{ $t('gm.itemCard.tierShort', { tier: item.Tier }) }}
        <cc-slashes />
        {{ $t('gm.itemCard.classLabel', { class: item.Class }) }}
      </template>
      <template v-else-if="type === 'Faction'">
        <div>
          <cc-remote-hover :item="item"
            color="accent" />
          {{ item.Name }}
          <span class="text-caption text-uppercase text-disabled">
            <cc-slashes class="mx-1" />
            {{ item.FactionType }}
          </span>
        </div>
      </template>
      <template v-else-if="type === 'Location'">
        <cc-remote-hover :item="item"
          color="accent" />
        {{ item.Name }}
      </template>
      <template v-else-if="type === 'Unit'">
        <cc-missing-content-hover :item="item" />
        <cc-remote-hover :item="item"
          color="accent" />
        {{ item.Name }}
        <span v-if="item.NpcClassController.Class">
          &mdash; {{ $t('gm.itemCard.tierShort', { tier: item.NpcClassController.Tier }) }} {{ item.NpcClassController.Class.Name }}
        </span>
        <span class="px-4">
          <v-chip v-for="t in item.NpcTemplateController.Templates"
            :key="t.ID"
            size="x-small"
            variant="plain"
            label
            color="primary"
            class="mr-3 mt-n1">
            <v-icon icon="cc:npc_template"
              start />
            {{ t.Name }}
          </v-chip>
        </span>
      </template>
    </template>

    <template v-if="type === 'Doodad'">
      <div class="text-caption">
        <stat-chips :stat-controller="item.StatController" />
      </div>
    </template>
    <template v-else-if="type === 'Eidolon'">
      <v-chip v-if="!item.BrewController.IsUnableToLoad"
        v-for="l in item.Layers"
        :key="l.ID"
        label
        prepend-icon="mdi-layers"
        class="mx-1 my-1">
        {{ l.Layer?.Name || 'Unknown' }}
      </v-chip>
    </template>
    <template v-else-if="type === 'Unit'">
      <div class="text-caption pt-1">
        <stat-chips :stat-controller="item.StatController"
          :bonuses="item.FeatureController.Bonuses" />
      </div>
    </template>
  </gm-list-item-base>

  <gm-card-base v-else
    :item="item"
    :big="big"
    :odd="odd"
    :grouping="groupValues"
    :sorting="sortValues"
    @open="$emit('open', item)">
    <template v-if="type === 'Character'">
      {{ item.Title }}
      <br v-if="item.Title" />
      <i class="text-caption">({{ item.Pronouns }})</i>
    </template>
    <template v-else-if="type === 'Eidolon'">
      <div>
        {{ $t('gm.itemCard.tierShort', { tier: item.Tier }) }}
        <cc-slashes />
        {{ $t('gm.itemCard.classLabel', { class: item.Class }) }}
      </div>
      <v-chip v-for="l in item.Layers"
        :key="l.ID"
        size="x-small"
        label
        prepend-icon="mdi-layers"
        class="mx-1 my-1">
        {{ l.Layer.Name }}
      </v-chip>
    </template>
    <template v-else-if="type === 'Faction'">
      {{ item.FactionType }}
    </template>
    <template v-else-if="type === 'Unit'">
      <div v-if="item.NpcClassController.Class"
        class="my-1">
        {{ $t('gm.itemCard.tierShort', { tier: item.NpcClassController.Tier }) }} {{ item.NpcClassController.Class.Name }}
      </div>
      <div class="my-1">
        <v-chip v-for="t in item.NpcTemplateController.Templates"
          :key="t.ID"
          size="x-small"
          variant="plain"
          label
          flat
          color="primary"
          class="mr-2">
          <v-icon icon="cc:npc_template"
            start />
          {{ t.Name }}
        </v-chip>
      </div>
    </template>
  </gm-card-base>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import GmCardBase from './gmItemCards/_GMCardBase.vue'
import GmListItemBase from './gmItemCards/_GMListItemBase.vue'
import StatChips from './gmItemCards/_subcomponents/statChips.vue'
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer'

defineOptions({ name: 'gm-item-card' })

const props = withDefaults(defineProps<{
  item: object
  big?: boolean
  list?: boolean
  odd?: boolean
  grouping?: string
  sorting?: string
}>(), {
  odd: false,
  grouping: 'None',
  sorting: 'Name'
})

const emit = defineEmits<{
  'open': []
}>()

const type = computed(() =>
  (props.item as any).ItemType.charAt(0).toUpperCase() + (props.item as any).ItemType.slice(1)
)

const groupValues = computed(() => {
  if (props.grouping === 'None') return ''
  if ((props.item as IStatContainer).StatController) {
    const stat = (props.item as IStatContainer).StatController.DisplayKeys.find(
      (x) => x.key === props.grouping || x.title === props.grouping
    )
    if (stat)
      return {
        title: stat.title,
        value: (props.item as IStatContainer).StatController.MaxStats[stat.key],
      }
  }
  if ((props.item as any).NarrativeController) {
    const label = (props.item as any).NarrativeController.Labels.find(
      (x: any) => x.title === props.grouping
    )
    if (label) return { title: label.title, value: label.value }
  }
  if ((props.item as any)[props.grouping])
    return { title: props.grouping, value: (props.item as any)[props.grouping] }
  return ''
})

const sortValues = computed(() => {
  if (props.sorting === 'Name') return ''
  let out = '' as any
  if ((props.item as any)[props.sorting])
    out = { title: props.sorting, value: (props.item as any)[props.sorting] }
  if ((props.item as any).StatController)
    out = { title: props.sorting, value: (props.item as any).StatController.getMax(props.sorting) }
  if ((props.item as any).NarrativeController)
    out = {
      title: props.sorting,
      value: (props.item as any).NarrativeController.LabelDictionary[props.sorting],
    }
  return out
})
</script>
