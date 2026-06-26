<template>
  <v-row justify="center">
    <v-col>
      <cc-titled-panel :title="$t('pm.titles.newOrganization')"
        icon="mdi-account-group"
        color="reserve">
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="orgName"
              color="accent"
              :label="$t('common.name')"
              variant="outlined"
              hide-details />
          </v-col>
          <v-col cols="6">
            <v-select v-model="orgType"
              :label="$t('common.type')"
              color="accent"
              :items="orgTypes"
              variant="outlined"
              hide-details />
          </v-col>
        </v-row>
        <v-textarea v-model="orgDetails"
          :label="$t('ui.fields.purposeGoalAndOrganizationDetails')"
          color="accent"
          auto-grow
          rows="2"
          filled
          hide-details
          class="mt-2" />
        <br />
        <span class="heading h4">{{ $t('pm.selectors.startWith') }}:</span>
        <v-row justify="center"
          class="mx-4 py-1">
          <v-col class="text-center">
            <v-btn v-if="!orgStart"
              block
              variant="outlined"
              color="secondary"
              @click="orgStart = 'efficiency'">
              {{ $t('pm.selectors.efficiency') }}
              <cc-tooltip simple
                inline
                content="How directly effective your organization is at what it does (a military
                organization with high efficiency would be good at combat, for example).
                <br />Efficiency can be used to perform activities related to your organization’s
                purpose (science, military, etc). You can use these advantages as
                <strong>reserves.</strong>">
                <v-icon size="small"
                  end>mdi-help-circle-outline</v-icon>
              </cc-tooltip>
            </v-btn>
            <div v-else>
              <span class="heading h3">+ {{ orgStart === 'efficiency' ? '2' : '0' }}</span>
              <br />
              <span>{{ $t('ui.org.efficiency') }}</span>
            </div>
          </v-col>
          <v-divider v-show="!$vuetify.display.mdAndDown"
            vertical
            class="mx-5" />
          <v-col cols="12"
            md=""
            class="text-center">
            <v-btn v-if="!orgStart"
              block
              variant="outlined"
              color="secondary"
              @click="orgStart = 'influence'">
              {{ $t('pm.selectors.influence') }}
              <cc-tooltip simple
                inline
                content="Influence is your organization’s size, reach, wealth, and reputation.
                Influence be used to acquire assets, create opportunities, or sway public
                opinion.">
                <v-icon size="small"
                  end>mdi-help-circle-outline</v-icon>
              </cc-tooltip>
            </v-btn>
            <div v-else>
              <span class="heading h3">+ {{ orgStart === 'influence' ? '2' : '0' }}</span>
              <br />
              <span>{{ $t('ui.org.influence') }}</span>
            </div>
          </v-col>
        </v-row>
        <br />
        <v-btn block
          tile
          large
          class="mb-2 mt-n2"
          color="primary"
          :disabled="!orgName || !orgType || !orgStart"
          @click="add()">
          <v-icon start>mdi-plus</v-icon>
          {{ $t('pm.titles.addOrganization') }}
        </v-btn>
      </cc-titled-panel>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { OrgType } from '@/classes/enums'
import Organization from '@/classes/pilot/components/reserves/Organization';

defineOptions({ name: 'CustomReservePanel' })

const emit = defineEmits<{
  'add': [payload: any]
}>()

const orgName = ref('')
const orgType = ref('' as any)
const orgStart = ref('')
const orgDetails = ref('')

const orgTypes = computed(() => {
      return Object.keys(OrgType)
        .map((k) => OrgType[k as string])
        .sort() as OrgType[];
    })

function add() {
      const o = new Organization({
        name: orgName.value,
        purpose: orgType.value,
        efficiency: orgStart.value === 'efficiency' ? 2 : 0,
        influence: orgStart.value === 'influence' ? 2 : 0,
        description: orgDetails.value,
        actions: '',
      });
      clear();
      emit('add', o);
    }
function clear() {
      orgName.value = '';
      orgType.value = '';
      orgStart.value = '';
      orgDetails.value = '';
    }
</script>
