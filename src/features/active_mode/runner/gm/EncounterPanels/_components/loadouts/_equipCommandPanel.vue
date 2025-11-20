<template>
  <v-row no-gutters class="bg-panel" align="center">
    <v-col v-if="canDealDamage && isFeature">
      <attack-menu :item="item" :controller="controller" :encounter="encounter" />
    </v-col>
    <v-spacer />

    <v-col cols="auto">
      <v-tooltip location="top" text="Toggle Used">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            size="x-small"
            height="26"
            tile
            variant="text"
            :class="item.Used ? 'bg-success' : 'bg-primary'"
            @click="use()">
            <v-icon
              size="x-large"
              :icon="item.Used ? 'mdi-checkbox-marked-circle-outline' : 'mdi-circle-double'" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>

    <v-col v-if="item.MaxUses" class="px-2 ml-1" cols="auto">
      <v-icon
        v-for="n in item.MaxUses"
        :key="n"
        :icon="n > item.Uses ? 'mdi-hexagon-outline' : 'mdi-hexagon'"
        :disabled="item.Destroyed"
        @click="setUses(n)"
        class="mr-1" />
    </v-col>

    <v-col v-if="item.MaxUses" cols="auto" class="ml-1">
      <v-tooltip location="top" text="Reset Uses">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            size="x-small"
            tile
            height="26"
            variant="text"
            :disabled="item.Destroyed"
            @click="item.Uses = 0">
            <v-icon icon="mdi-reload" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>

    <v-col v-if="!isFeature" cols="auto" class="ml-1" style="z-index: 4">
      <v-tooltip location="top" text="Toggle Destroyed">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            size="x-small"
            tile
            height="26"
            variant="text"
            :class="item.Destroyed ? 'bg-success' : 'bg-primary'"
            :disabled="item.IsIndestructible"
            @click="item.Destroyed = !item.Destroyed">
            <v-icon size="x-large" :icon="item.Destroyed ? 'mdi-wrench' : 'mdi-cube-off'" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>

    <v-col v-if="item.Recharge" cols="auto" class="ml-1">
      <v-tooltip location="top" :text="`Force Recharge (Recharges on: ${item.Recharge}+)`">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            size="x-small"
            tile
            height="26"
            variant="text"
            :disabled="!item.Used"
            :class="item.Used ? 'bg-primary' : ''"
            @click="item.Used = !item.Used">
            <v-icon icon="mdi-reload" />
          </v-btn>
        </template>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script>
import AttackMenu from '../AttackMenu.vue';

export default {
  name: 'EquipCommandPanel',
  components: {
    AttackMenu,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    controller: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isFeature() {
      if (!this.item?.ItemType) return false;
      return this.item.ItemType.toLowerCase().includes('npc');
    },
    canDealDamage() {
      return !!this.item.Damage;
    },
  },
  methods: {
    setUses(n) {
      if (this.item.Uses === 1 && n === 1) {
        this.item.Uses = 0;
      } else if (this.item.MaxUses && n <= this.item.MaxUses) {
        this.item.Uses = n;
      }
    },
    use() {
      if (!this.item.Used && this.item.Uses < this.item.MaxUses) {
        this.item.Uses++;
      } else if (this.item.Used && this.item.Uses > 0) {
        this.item.Uses--;
      }
      this.item.Used = !this.item.Used;
    },
  },
};
</script>
