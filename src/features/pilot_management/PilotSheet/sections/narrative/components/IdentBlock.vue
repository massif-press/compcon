<template>
  <v-row dense
    class="stat-text text-center mb-2"
    :justify="mobile ? 'start' : 'space-between'"
    align="center">
    <v-col cols="12"
      sm="6"
      md="3"
      :class="mobile && 'd-flex justify-start'">
      <cc-text-label v-model="pilot.Callsign"
        :readonly="pilot.IsRemote"
        :label="$t('common.callsign')" />
    </v-col>
    <v-col cols="12"
      sm="6"
      md="3"
      :class="mobile && 'd-flex justify-start'">
      <cc-text-label v-model="pilot.Name"
        :readonly="pilot.IsRemote"
        :label="$t('common.name')" />
    </v-col>
    <v-col cols="12"
      sm="6"
      md="3"
      :class="mobile && 'd-flex justify-start'">
      <cc-text-label v-model="pilot.PlayerName"
        :readonly="pilot.IsRemote"
        :label="$t('common.player')" />
    </v-col>
    <v-col cols="12"
      sm="6"
      md="3"
      :class="mobile && 'd-flex justify-start'">
      <cc-text-label v-model="pilot.Background"
        :readonly="pilot.IsRemote"
        :label="$t('common.background')">
        <template #append>
          <background-selector v-if="!pilot.IsRemote"
            small
            @select="pilot.Background = $event" />
        </template>
      </cc-text-label>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Pilot } from '@/classes/pilot/Pilot'
import BackgroundSelector from '../../../../_components/selectors/BackgroundSelector.vue';
import { useDisplay } from 'vuetify';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineOptions({ name: 'ident-block' })

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = defineProps<{
  pilot: Pilot
}>()

const pilotStatuses = ref([
      { title: t('pm.titles.active'), value: 'ACTIVE' },
      { title: t('pm.titles.inactive'), value: 'INACTIVE' },
      { title: t('pm.titles.retired'), value: 'RET' },
      { title: t('pm.titles.missingInAction'), value: 'MIA' },
      { title: t('pm.titles.killedInAction'), value: 'KIA' },
      { title: t('pm.titles.unknown'), value: 'UNKNOWN' },
    ])
const noteColor = ref('')
const notification = ref('')

const statusColor = computed(() => {
      switch (props.pilot.Status.toLowerCase()) {
        case 'active':
          return 'success';
        case 'mia':
        case 'kia':
          return 'error';
        default:
          return 'text';
      }
    })
</script>
