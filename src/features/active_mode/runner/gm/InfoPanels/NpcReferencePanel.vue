<template>
  <v-card>
    <div class="heading h2 pa-2">{{ $t('active.toolPalette.npcRef') }}</div>
    <cc-switch v-model="expanded"
      :label="$t('compendium.fields.showFull')" />

    <v-card-text>
      <cc-masonry-grid :items="allActions">
        <template #default="{ item }">
          <action-card :action="item"
            :clickable="!expanded" />
        </template>
      </cc-masonry-grid>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CompendiumStore } from '@/stores'
import ActionCard from '@/features/compendium/Views/Reference/_components/ActionCard.vue'

const expanded = ref(false)

const npcActions = ref(['act_boost', 'act_grapple_npc', 'act_hide', 'act_skirmish', 'act_ram_npc', 'act_barrage', 'act_improvised_attack_npc', 'act_stabilize_npc', 'act_quick_tech', 'act_full_tech', 'act_lock_on', 'act_search', 'act_overwatch_npc'])

const allActions = computed(() => {
  return CompendiumStore().Actions.filter(a => a && npcActions.value.includes(a.ID))
})
</script>
