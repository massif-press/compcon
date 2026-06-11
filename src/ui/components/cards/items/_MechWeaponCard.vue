<template>
  <equipment-card-base :item="item"
    :notes="notes">
    <div v-show="item.Profiles.length > 1">
      <v-chip-group v-model="tab"
        mandatory
        column
        class="my-2"
        @click.stop>
        <v-chip v-for="(p, index) in item.Profiles"
          :key="p.Name"
          :value="index"
          size="small"
          filter>
          <b>{{ p.Name }}</b>
        </v-chip>
      </v-chip-group>
    </div>

    <v-row align="center"
      justify="space-around">
      <v-col cols="auto">
        <cc-range-element :range="item.Profiles[tab].Range || []" />
      </v-col>
      <v-col cols="auto">
        <cc-damage-element :damage="item.Profiles[tab].Damage || []"
          :type-override="item.DamageTypeOverride" />
      </v-col>
      <v-col v-if="item.SP"
        cols="auto">
        <v-divider vertical
          class="mx-4 py-8" />
      </v-col>
      <v-col v-if="item.SP"
        cols="auto"
        class="text-center">
        <div class="heading"
          style="font-size: 24pt">
          {{ item.SP }}
          <v-icon icon="cc:system_point"
            size="30"
            class="mt-n2 ml-n1" />
        </div>
        <div class="text-cc-overline mt-n2">{{ $t('ui.card.systemPoints', { plural: item.SP > 1 ? 'S' : '' }) }}</div>
      </v-col>

      <v-col cols="12"
        sm="auto"
        :class="portrait ? 'text-center' : 'ml-auto text-right'">
        <div class="heading h2">{{ item.Size }} {{ item.WeaponTypes.join('/') }}</div>
        <div v-if="item.Source"
          class="flavor-text text-disabled">{{ item.LicenseString }}</div>

      </v-col>
    </v-row>

    <on-element v-for="action in ['hit', 'crit', 'attack']"
      :key="`on-${action}`"
      :profile="item.Profiles[tab]"
      :action="action" />

    <template v-if="item.Profiles.length > 1"
      #profile>
      <div>
        <div v-if="item.Profiles[tab].Effect"
          class="panel clipped pa-2">
          <v-row dense
            align="end">
            <v-col cols="auto"><v-icon size="large"
                icon="cc:weapon" /></v-col>
            <v-col>
              <div class="heading">{{ item.Profiles[tab].Name }}</div>
            </v-col>
          </v-row>
          <p v-html-safe="item.Profiles[tab].Effect"
            class="px-2" />
        </div>
      </div>

      <div v-if="item.Profiles[tab].Actions.length">
        <div class="text-cc-overline text-disabled">//{{ $t('ui.card.profileActions') }}</div>
        <v-row no-gutters
          justify="center">
          <v-col v-for="(a, index) in item.Profiles[tab].Actions"
            :key="`action-${index}`"
            cols="auto">
            <cc-action :action="a"
              :panel="$vuetify.display.lgAndUp"
              class="ma-2" />
          </v-col>
        </v-row>
      </div>

      <div v-if="item.Profiles[tab].Deployables.length">
        <div class="text-cc-overline text-disabled">//{{ $t('ui.card.profileDeployables') }}</div>
        <v-row no-gutters
          justify="center">
          <v-col v-for="(d, i) in item.Profiles[tab].Deployables"
            :key="`deployable-${i}`"
            cols="auto">
            <cc-deployable-info :deployable="d"
              :panel="$vuetify.display.lgAndUp"
              :name-override="item.Name"
              class="ma-2" />
          </v-col>
        </v-row>
      </div>
      <div v-if="item.Profiles[tab].Tags.length">
        <div class="text-cc-overline mb-n1 text-disabled">//{{ $t('ui.card.profileTags') }}</div>
        <cc-tags :tags="item.Profiles[tab].Tags"
          extended />
      </div>
    </template>
  </equipment-card-base>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import EquipmentCardBase from './_EquipmentCardBase.vue'
import { MechWeapon } from '@/classes/mech/components/equipment/MechWeapon'
import OnElement from './_components/OnElement.vue'

const { xs } = useDisplay()

const props = defineProps<{
  item: MechWeapon
  notes?: boolean
  charts?: boolean
}>()

const tab = ref(0)

const portrait = computed(() => xs.value)

watch(() => props.item, () => {
  tab.value = 0
})
</script>
