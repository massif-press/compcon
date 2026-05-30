<template>
  <v-list-group :value="groupValue"
    color="accent"
    class="pt-0"
    style="--indent-padding: 6px;">
    <template #activator="{ props }">
      <v-list-item tile
        v-bind="props">
        <template #title>
          <div v-if="manufacturer">
            <cc-logo v-if="manufacturer.LogoIsExternal"
              :source="manufacturer"
              size="small"
              class="pt-3 mb-n1 mr-2" />
            <v-icon v-else
              size="30"
              :icon="manufacturer.Icon"
              :color="manufacturer?.GetColor($vuetify.theme.current.dark) || 'panel'"
              start />
            <span class="text-button">
              <b>
                {{ mName }}
              </b>
            </span>
          </div>
          <div v-else-if="role">
            <v-icon size="30"
              :icon="roleIcon()"
              start
              class="mt-n1" />
            <span class="text-button">
              <b>{{ role }}</b>
            </span>
          </div>
          <div v-else-if="feature">
            <v-icon size="30"
              :icon="featureIcon()"
              start
              class="mt-n1" />
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

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'BrowserListItem' })

const props = defineProps<{
  parent?: string
  collection: string | object
  manufacturer?: object
  role?: string
  feature?: string
}>()

const emit = defineEmits<{
  'clicked': []
  'equip': []
}>()

const groupValue = computed(() => {
      if (props.parent) return `${props.parent}_${props.collection}`;
      return props.collection.toString();
    })
const mName = computed(() => {
      if (props.collection?.toLowerCase() === 'exotic') return 'Exotic';
      const name = props.manufacturer?.Name || 'Other';
      if (name === 'err') return 'Other';
      return name;
    })

function roleIcon() {
      if (!props.role) return '';
      if (props.role.toLowerCase() === 'biological') return 'mdi-heart-pulse';
      return `cc:role_${props.role.toLowerCase()}`;
    }
function featureIcon() {
      if (!props.feature) return '';
      if (props.feature.toLowerCase() === 'tech') return 'mdi-chart-donut-variant';
      return `cc:${props.feature.toLowerCase()}`;
    }
</script>
