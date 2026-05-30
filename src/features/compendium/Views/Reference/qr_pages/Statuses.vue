<template>
  <v-container class="pb-12">
    <h1 id="statuses"
      class="heading">Statuses</h1>
    <cc-masonry-grid :items="statuses">
      <template #default="{ item }">
        <status-card :status="item" />
      </template>
    </cc-masonry-grid>

    <h1 id="conditions"
      class="heading">Conditions</h1>
    <cc-masonry-grid :items="conditions">
      <template #default="{ item }">
        <status-card :status="item" />
      </template>
    </cc-masonry-grid>
  </v-container>
  <v-footer border
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
import _scrollTo from '@/util/scrollTo';
import * as _ from 'lodash-es';
import { CompendiumStore } from '@/stores';
import { Status } from '@/classes/Status';
import StatusCard from '../_components/StatusCard.vue';

const _display = useDisplay()

defineOptions({ name: 'ActionEconomy' })

const props = defineProps<{
  isModal?: boolean
}>()

const content = ref(['statuses', 'conditions'])

const widescreen = computed(() => {
      return _display.xlAndUp.value;
    })
const statuses = computed(() => {
      return _.sortBy(
        CompendiumStore().Statuses.filter((s: Status) => s && s.StatusType !== 'Condition'),
        'Name'
      );
    })
const conditions = computed(() => {
      return _.sortBy(
        CompendiumStore().Statuses.filter((s: Status) => s && s.StatusType === 'Condition'),
        'Name'
      );
    })

function scrollTo(item: any) {
  const el = document.getElementById(`${item.replace(/\W/g, '')}`)
  if (el) _scrollTo(el, props.isModal)
}
</script>
