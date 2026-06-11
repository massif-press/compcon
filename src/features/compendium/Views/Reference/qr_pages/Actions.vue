<template>
  <v-container class="pb-12">
    <v-row dense>
      <v-col>
        <div class="heading h1">{{ $t('compendium.reference.actions') }}</div>
      </v-col>
      <v-col v-if="!mobile"
        cols="auto">
        <cc-switch v-model="expanded"
          label="Show Full" />
      </v-col>
    </v-row>

    <cc-masonry-grid :items="bothActions">
      <template #default="{ item }">
        <action-card :action="item"
          :clickable="!expanded" />
      </template>
    </cc-masonry-grid>

    <h1 id="mechactions"
      class="heading mt-3">
      {{ $t('compendium.reference.mechActions') }}
    </h1>

    <cc-masonry-grid :items="mechActions">
      <template #default="{ item }">
        <action-card :action="item"
          :clickable="!expanded" />
      </template>
    </cc-masonry-grid>

    <h1 id="pilotactions"
      class="heading mt-3">
      {{ $t('compendium.reference.pilotActions') }}
    </h1>
    <cc-masonry-grid :items="pilotActions">
      <template #default="{ item }">
        <action-card :action="item"
          :clickable="!expanded" />
      </template>
    </cc-masonry-grid>

    <h1 id="downtimeactions"
      class="heading mt-3">
      {{ $t('compendium.categories.downtimeActions') }}
    </h1>
    <cc-masonry-grid :items="downtimeActions">
      <template #default="{ item }">
        <cc-dense-card :item="item" />
      </template>
    </cc-masonry-grid>
  </v-container>

  <v-footer v-if="!isModal"
    border
    app
    class="py-0 bg-primary">
    <v-tabs density="compact"
      center-active
      grow>
      <v-tab v-for="item in content"
        :key="item"
        @click="scrollTo(item)"
        v-text="item" />
    </v-tabs>
  </v-footer>
  <v-btn size="x-small"
    icon
    color="primary"
    variant="plain"
    style="position: fixed; bottom: 35px; right: 0; margin: 8px; z-index: 999"
    @click="scrollTo(content[0])">
    <v-icon size="30">mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import ActionCard from '../_components/ActionCard.vue'
import _scrollTo from '@/util/scrollTo'
import { CompendiumStore } from '@/stores'

const _display = useDisplay()

defineOptions({ name: 'ActionEconomy' })

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = defineProps<{
  isModal?: boolean
}>()

const content = ref(['mech actions', 'pilot actions', 'downtime actions'])
const actionTypes = ref([
      { action: 'move', icon: 'mdi-arrow-right-bold-hexagon-outline' },
      { action: 'overcharge', icon: 'cc:overcharge' },
      { action: 'reaction', icon: 'cc:reaction' },
      { action: 'free', icon: 'cc:free' },
    ])
const pilotOnlyActions = ref(['act_fight', 'act_jockey', 'act_reload', 'act_mount', 'act_search_pilot'])
const mechOnlyActions = ref(['act_grapple', 'act_ram', 'act_skirmish', 'act_barrage', 'act_improvised_attack', 'act_stabilize', 'act_boot_up', 'act_stabilize', 'act_dismount', 'act_eject', 'act_self_destruct', 'act_shut_down', 'act_overcharge', 'act_brace', 'act_quick_tech', 'act_full_tech', 'act_lock_on', 'act_bolster', 'act_scan', 'act_search'])
const widescreen = computed(() => _display.lgAndUp.value)
const expanded = ref(widescreen.value)

const allActions = computed(() => {
      return CompendiumStore().Actions.filter(a => a && !a.Hidden && !a.ID.includes('_npc'))
    })
const bothActions = computed(() => {
      return allActions.value.filter(a => a && !a.IsDowntimeAction && !pilotOnlyActions.value.includes(a.ID) && !mechOnlyActions.value.includes(a.ID) && !a.ID.includes('jockey_') && !a.ID.includes('_inv_'))
    })
const mechActions = computed(() => {
      return allActions.value.filter(a => a && mechOnlyActions.value.includes(a.ID))
    })
const pilotActions = computed(() => {
      return allActions.value.filter(a => a && pilotOnlyActions.value.includes(a.ID))
    })
const downtimeActions = computed(() => {
      return CompendiumStore().DowntimeActions
    })

function scrollTo(item: any) {
  const el = document.getElementById(`${item.replace(/\W/g, '')}`)
  if (el) _scrollTo(el, props.isModal)
}
</script>
