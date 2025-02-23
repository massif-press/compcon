<template>
  <equipment-card-base :item="item" :notes="notes">
    <div v-show="item.Profiles.length > 1">
      <v-tabs bg-color="primary" grow height="24px" density="compact" class="my-2">
        <v-tab v-for="(p, index) in item.Profiles" @click.stop="tab = index" :key="p.Name">
          <b>{{ p.Name }}</b>
        </v-tab>
      </v-tabs>
    </div>

    <v-row dense align="center" justify="space-around">
      <v-col cols="auto">
        <cc-range-element :range="item.Profiles[tab].Range" />
      </v-col>
      <v-col cols="auto" :offset="portrait && item.Range.length && item.Damage.length ? 0 : 1">
        <cc-damage-element
          :damage="item.Profiles[tab].Damage"
          :type-override="item.Profiles[tab].DamageTypeOverride" />
      </v-col>
      <v-col v-if="item.SP" cols="auto">
        <v-divider vertical class="px-4 py-8" />
      </v-col>
      <v-col v-if="item.SP" cols="auto" class="text-center">
        <div class="heading h2 mb-n2">
          {{ item.SP }}
          <v-icon icon="cc:system_point" class="mt-n2 ml-n2" />
        </div>
        <span class="text-overline">SYSTEM POINT{{ item.SP > 1 ? 'S' : '' }}</span>
      </v-col>

      <v-col cols="12" sm="auto" :class="portrait ? 'text-center' : 'ml-auto text-right'">
        <div class="heading h2">{{ item.Size }} {{ item.WeaponType }}</div>
        <div v-if="item.Source" class="flavor-text text-disabled">// {{ item.LicenseString }}</div>
        <div v-if="item.InLcp" class="flavor-text text-disabled">
          {{ item.LcpName }}
        </div>
      </v-col>
    </v-row>

    <on-element
      v-for="action in ['hit', 'crit', 'attack']"
      :profile="item.Profiles[tab]"
      :action="action" />

    <template v-if="item.Profiles.length > 1" #profile>
      <div>
        <div v-if="item.Profiles[tab].Effect" class="panel clipped pa-2">
          <v-row dense align="end">
            <v-col cols="auto"><v-icon size="large" icon="cc:weapon" /></v-col>
            <v-col>
              <div class="heading">{{ item.Profiles[tab].Name }}</div>
            </v-col>
          </v-row>
          <p v-html-safe="item.Profiles[tab].Effect" class="px-2" />
        </div>
      </div>

      <div v-if="item.Profiles[tab].Actions.length">
        <div class="text-cc-overline text-disabled">//PROFILE ACTIONS</div>
        <v-row no-gutters justify="center">
          <v-col v-for="a in item.Profiles[tab].Actions" cols="auto">
            <cc-action :action="a" :panel="$vuetify.display.lgAndUp" class="ma-2" />
          </v-col>
        </v-row>
      </div>

      <div v-if="item.Profiles[tab].Deployables.length">
        <div class="text-cc-overline text-disabled">//PROFILE DEPLOYABLES</div>
        <v-row no-gutters justify="center">
          <v-col v-for="(d, i) in item.Profiles[tab].Deployables" cols="auto">
            <cc-deployable-info
              :deployable="d"
              :panel="$vuetify.display.lgAndUp"
              :name-override="item.Name"
              class="ma-2" />
          </v-col>
        </v-row>
      </div>
      <div v-if="item.Profiles[tab].Tags.length">
        <div class="text-cc-overline mb-n1 text-disabled">//PROFILE TAGS</div>
        <cc-tags :tags="item.Profiles[tab].Tags" extended />
      </div>
    </template>
  </equipment-card-base>
</template>

<script lang="ts">
import EquipmentCardBase from './_EquipmentCardBase.vue';
import OnElement from './_components/OnElement.vue';

export default {
  name: 'cc-mech-weapon-card',
  components: { EquipmentCardBase, OnElement },
  props: {
    item: { type: Object, required: true },
    notes: Boolean,
    charts: Boolean,
  },
  watch: {
    item() {
      this.tab = 0;
    },
  },
  data: () => ({
    tab: 0,
  }),
  computed: {
    portrait(): boolean {
      return this.$vuetify.display.xs;
    },
  },
};
</script>
