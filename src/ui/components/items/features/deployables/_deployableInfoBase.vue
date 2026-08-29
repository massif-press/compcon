<template>
  <div style="max-width: 100%; overflow-wrap: anywhere">
    <v-row
      justify="center"
      dense
      style="flex-wrap: wrap"
    >
      <cc-statblock-panel
        v-if="deployable.Size"
        :icon="deployable.SizeIcon"
        name="Size"
        inline
        :value="`${deployable.Size === 0.5 ? '½' : deployable.Size}`"
      />
      <cc-statblock-panel
        v-if="deployable.Armor"
        icon="mdi-shield"
        name="Armor"
        inline
        :value="stat('armor')"
      />
      <cc-statblock-panel
        v-if="deployable.MaxHP"
        icon="mdi-heart"
        name="HP"
        inline
        :value="stat('hp')"
      />
      <cc-statblock-panel
        v-if="deployable.Evasion"
        icon="cc:evasion"
        inline
        name="Evasion"
        :value="stat('evasion')"
      />
      <cc-statblock-panel
        v-if="deployable.EDefense"
        icon="cc:edef"
        inline
        name="E-Def"
        :value="stat('edef')"
      />
      <cc-statblock-panel
        v-if="deployable.Heatcap"
        icon="cc:heat"
        inline
        name="Heat Capacity"
        :value="stat('heatcap')"
      />
      <cc-statblock-panel
        v-if="deployable.Sensors"
        icon="cc:sensor"
        inline
        name="Sensor Range"
        :value="stat('sensors')"
      />
      <cc-statblock-panel
        v-if="deployable.TechAttack"
        icon="cc:full_tech"
        inline
        name="Tech Attack"
        :value="stat('techattack')"
      />
      <cc-statblock-panel
        v-if="deployable.Repcap"
        icon="cc:repair"
        inline
        name="Repair Capacity"
        :value="stat('repcap')"
      />
      <cc-statblock-panel
        v-if="deployable.SaveTarget"
        icon="cc:save"
        inline
        name="Save Target"
        :value="stat('save')"
      />
      <cc-statblock-panel
        v-if="deployable.Speed"
        icon="mdi-arrow-right-bold-hexagon-outline"
        inline
        name="Speed"
        :value="stat('speed')"
      />
    </v-row>
    <p
      v-html-safe="deployable.getDetail(tier)"
      class="pa-2"
    />

    <div v-if="deployable.Actions && deployable.Actions.length">
      <v-row
        no-gutters
        justify="center"
      >
        <v-col
          v-for="(a, index) in deployable.Actions"
          :key="`action-${index}`"
          cols="auto"
        >
          <cc-action
            :action="a"
            :panel="$vuetify.display.lgAndUp"
            class="ma-2"
            :tier="tier"
          />
        </v-col>
      </v-row>
    </div>

    <cc-tags
      v-if="deployable.Tags && deployable.Tags.length"
      :tags="deployable.Tags"
    />
  </div>
</template>

<script setup lang="ts">
  import { Deployable } from '@/classes/components/feature/deployable/Deployable'
  import type { DeployableOwner } from '@/classes/components/feature/IFeatureController'

  const props = withDefaults(
    defineProps<{
      deployable: Deployable
      tier?: number
      owner?: DeployableOwner | null
    }>(),
    {
      owner: null,
    }
  )

  function stat(key: string) {
    return props.deployable.getStat(key, props.tier, props.owner)
  }
</script>
