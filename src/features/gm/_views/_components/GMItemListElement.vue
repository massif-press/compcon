<template>
  <v-list-item
    border
    :class="`${selectedId === item.ID ? 'bg-primary' : ''} `"
    style="margin-bottom: 2px"
    @click="$emit('open')"
  >
    <template #prepend>
      <v-avatar class="ml-n2 mr-1">
        <v-icon
          v-if="item.NpcClassController?.HasClass"
          size="36"
          :icon="item.NpcClassController.Class.Icon"
        />
        <cc-img
          v-else-if="item.PortraitController.HasImage"
          :aspect-ratio="1"
          :src="item.PortraitController.Image"
        />
        <v-icon
          v-else
          size="36"
          :icon="item.Icon"
        />
      </v-avatar>
    </template>
    <template #title>
      <span class="heading">{{ item.Name }}</span>
      <span
        v-if="item.NpcClassController?.HasClass"
        class="text-cc-overline"
      >
        <cc-slashes class="pl-2" />
        {{ $t('gm.itemCard.tierShort', { tier: item.NpcClassController.Tier }) }} {{ item.NpcClassController.Class.Name }}
      </span>
    </template>
    <template #subtitle>
      <div v-if="item.NpcTemplateController">
        <cc-chip
          v-for="t in item.NpcTemplateController.Templates"
          :key="t.ID"
          size="x-small"
        >
          <v-icon icon="cc:npc_template" />
          {{ t.Name }}
        </cc-chip>
      </div>
    </template>

    <template #append>
      <cc-remote-hover :item="item" />
      <cc-missing-content-hover :item="item" />
      <div
        v-if="item.LcpConfig"
        class="d-inline-block mr-n3"
      >
        <cc-config-tip :actor="item" />
      </div>
      <cc-brew-info
        v-else-if="item.BrewController && !item.BrewController.IsUnableToLoad"
        :controller="item.BrewController"
      />
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IStatContainer } from '@/classes/components/combat/stats/IStatContainer'

const props = withDefaults(defineProps<{
  item: object
  grouping?: string
  sorting?: string
  selectedId?: string
  disabled?: boolean
}>(), {
  grouping: 'None',
  sorting: 'Name',
  disabled: false
})

const emit = defineEmits<{
  'open': []
}>()

const type = computed(() => {
        return props.item.ItemType.charAt(0).toUpperCase() + props.item.ItemType.slice(1)
      })
const missingContent = computed(() => {
        return props.item.BrewController?.IsUnableToLoad
      })
const groupValues = computed(() => {
        if (props.grouping === 'None') return ''

        //check stats
        if ((props.item as IStatContainer).StatController) {
          const stat = (props.item as IStatContainer).StatController.DisplayKeys.find(
            x => x.key === props.grouping || x.title === props.grouping
          )
          if (stat)
            return {
              title: stat.title,
              value: (props.item as IStatContainer).StatController.MaxStats[stat.key],
            }
        }

        // check labels
        if ((props.item as any).NarrativeController) {
          const label = (props.item as any).NarrativeController.Labels.find(
            x => x.title === props.grouping
          )
          if (label) return { title: label.title, value: label.value }
        }

        if (props.item[props.grouping])
          return { title: props.grouping, value: props.item[props.grouping] }

        return ''
      })
const sortValues = computed(() => {
        if (props.sorting === 'Name') return ''
        let out = '' as any
        if (props.item[props.sorting]) out = { title: props.sorting, value: props.item[props.sorting] }
        if (props.item.StatController)
          out = { title: props.sorting, value: props.item.StatController.getMax(props.sorting) }
        if (props.item.NarrativeController)
          out = {
            title: props.sorting,
            value: props.item.NarrativeController.LabelDictionary[props.sorting],
          }
        return out
      })
</script>

<style scoped>
  .disabled {
    background: repeating-linear-gradient(
      45deg,
      rgba(182, 184, 191, 0.3),
      rgba(182, 184, 191, 0.3) 10px,
      rgba(142, 147, 165, 0.3) 10px,
      rgba(142, 147, 165, 0.3) 20px
    );
  }
</style>
