<template>
  <v-card flat
    tile>
    <equipment-destroyed-overlay :destroyed="item.Destroyed" />
    <v-row align="center"
      no-gutters
      justify="end"
      class="pr-1"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <v-col :class="mobile ? 'text-cc-overline line-short' : 'heading h3 text-uppercase'">
        <div class="mt-n2 pl-1">
          {{ item.Name }}
          <span class="text-cc-overline text-disabled">
            <cc-slashes class="mx-1" />
            Pilot Armor
          </span>
        </div>
      </v-col>

      <v-col cols="auto">
        <v-icon size="18"
          class="mt-n1"
          icon="mdi-shield"
          end />
        <span class="heading h4"> {{ item.ArmorString }} </span>
        <v-icon size="19"
          class="mt-n1"
          end
          icon="mdi-heart" />
        <span class="heading h4"> {{ item.HpString }} </span>
        <v-icon size="small"
          class="mt-n1"
          end
          icon="cc:edef" />
        <span class="heading h4"> {{ item.EdefString }} </span>
        <v-icon size="small"
          class="mt-n1"
          end
          icon="cc:evasion" />
        <span class="heading h4"> {{ item.EvasionString }} </span>
        <v-icon size="small"
          end
          icon="mdi-arrow-right-bold-hexagon-outline" />
        <span class="heading h4"> {{ item.SpeedString }} </span>
      </v-col>
    </v-row>

    <div class="pa-0"
      style="position: relative"
      :style="item.Used ? 'opacity: 0.4' : ''">
      <v-card-text class="pa-0">
        <equipment-flavor-description :description="item.FlavorDescription" />

        <div v-if="item">
          <div v-if="item.Effect">
            <p v-html-safe="item.Effect"
              class="mb-1 px-2" />
          </div>

          <equipment-actions-deployables :item="item"
            :actor="pilot"
            :owner="owner"
            :encounter="encounter"
            action-icon="cc:weapon"
            @deploy="$emit('deploy', $event)" />

          <v-row dense
            align="center">
            <v-col cols="auto">
              <cc-tags v-if="item.Tags"
                combat
                :tags="item.Tags"
                color="pilot"
                :bonus="pilot.LimitedBonus" />
            </v-col>
            <v-col cols="auto"
              class="ml-auto mr-4">
              <cc-bonus v-for="(b, index) in item.Bonuses"
                :key="`bonus-${index}`"
                :bonus="b"
                chip />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </div>
  </v-card>
</template>

<script lang="ts">
import DestroyedOverlay from './_DestroyedOverlay.vue'
import FlavorDescription from './_FlavorDescription.vue'
import ActionsDeployables from './_ActionsDeployables.vue'
import { useMobile } from '@/mixins/useMobile'

export default {
  name: 'PilotArmorCombatCard',
  components: {
    EquipmentDestroyedOverlay: DestroyedOverlay,
    EquipmentFlavorDescription: FlavorDescription,
    EquipmentActionsDeployables: ActionsDeployables,
  },
  mixins: [useMobile],
  props: {
    item: {
      type: Object,
      required: true,
    },
    pilot: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
    owner: {
      type: Object,
      required: true,
    },
  },
  emits: ['deploy'],
}
</script>

<style scoped>
.line-short {
  line-height: 0;
}
</style>
