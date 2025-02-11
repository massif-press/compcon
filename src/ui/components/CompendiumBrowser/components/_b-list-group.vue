<template>
  <v-list-group :value="groupValue" color="accent" class="pt-0">
    <template v-slot:activator="{ props }">
      <v-list-item tile v-bind="props">
        <template #title>
          <div v-if="manufacturer">
            <cc-logo
              v-if="manufacturer.LogoIsExternal"
              :source="manufacturer"
              size="small"
              class="pt-3 mb-n1 mr-2" />
            <v-icon
              v-else
              size="30"
              :icon="manufacturer.Icon"
              :color="manufacturer.GetColor($vuetify.theme.current.dark)"
              start />
            <span class="text-button">
              <b>
                {{ mName }}
              </b>
            </span>
          </div>
          <div v-else-if="role">
            <v-icon size="30" :icon="roleIcon()" start class="mt-n1" />
            <span class="text-button">
              <b>{{ role }}</b>
            </span>
          </div>
          <div v-else-if="feature">
            <v-icon size="30" :icon="featureIcon()" start class="mt-n1" />
            <span class="text-button">
              <b>{{ feature }}</b>
            </span>
          </div>
          <div v-else>
            <span class="text-button">
              <b>{{ collection }}</b>
            </span>
          </div>
        </template>
      </v-list-item>
    </template>
    <slot />
  </v-list-group>
</template>

<script lang="ts">
export default {
  name: 'browser-list-item',
  emits: ['clicked', 'equip'],
  props: {
    parent: {
      type: String,
      required: false,
    },
    collection: {
      type: [String, Object],
      required: true,
    },
    manufacturer: {
      type: Object,
      required: false,
    },
    role: {
      type: String,
      required: false,
    },
    feature: {
      type: String,
      required: false,
    },
  },
  computed: {
    groupValue(): string {
      if (this.parent) return `${this.parent}_${this.collection}`;
      return this.collection.toString();
    },
    mName(): string {
      if (this.collection.toLowerCase() === 'exotic') return 'Exotic';
      const name = this.manufacturer?.Name || 'Other';
      if (name === 'err') return 'Other';
      return name;
    },
  },
  methods: {
    roleIcon(): string {
      if (!this.role) return '';
      if (this.role.toLowerCase() === 'biological') return 'mdi-heart-pulse';
      return `cc:role_${this.role.toLowerCase()}`;
    },
    featureIcon(): string {
      if (!this.feature) return '';
      if (this.feature.toLowerCase() === 'tech') return 'mdi-chart-donut-variant';
      return `cc:${this.feature.toLowerCase()}`;
    },
  },
};
</script>
