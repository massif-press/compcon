<template>
  <cc-dialog :close-on-click="false"
    :title="org.Name"
    icon="cc:squad"
    color="mdi-account-group">
    <template #activator="{ open }">
      <cc-button color="reserve"
        :style="org.Used ? 'opacity: 0.5' : ''"
        :size="small || mobile ? 'small' : undefined"
        block
        prepend-icon="mdi-account-group"
        @click="open">
        <template v-if="org.Used"
          #info>
          <v-icon icon="mdi-circle-off-outline" />
        </template>
        {{ org.Name }}
      </cc-button>
    </template>
    <template #toolbar-items="{ close }">
      <v-btn icon
        @click="remove(close)">
        <v-icon icon="mdi-delete" />
      </v-btn>
    </template>
    <v-card-text>
      <v-row class="mb-1">
        <v-col cols="6">
          <v-text-field v-model="org.Name"
            label="Organization Name"
            variant="outlined"
            hide-details />
        </v-col>
        <v-col cols="6">
          <v-select v-model="org.Purpose"
            label="Organization Type"
            :items="orgTypes"
            variant="outlined"
            hide-details />
        </v-col>
      </v-row>
      <v-textarea v-model="org.Description"
        label="Purpose, goal, and organization details"
        auto-grow
        rows="2"
        filled
        hide-details />
      <br />
      <v-row dense
        justify="space-around">
        <v-col cols="auto">
          <v-btn icon
            variant="plain"
            :disabled="org.Efficiency === 0"
            @click="org.Efficiency -= 2">
            <v-icon size="large"
              color="accent"
              icon="mdi-minus" />
          </v-btn>
        </v-col>
        <v-col class="text-center"
          cols="auto">
          <div>
            <span class="heading h2 text-accent">+ {{ org.Efficiency }}</span>
            <br />
            <span>
              Organization Efficiency
              <cc-tooltip simple
                inline
                content="How directly effective your organization is at what it does (a military
                organization with high efficiency would be good at combat, for example).
                <br />Efficiency can be used to perform activities related to your organization's
                purpose (science, military, etc). You can use these advantages as
                <strong>reserves.</strong>">
                <v-icon size="small">mdi-help-circle-outline</v-icon>
              </cc-tooltip>
            </span>
          </div>
        </v-col>
        <v-col cols="auto">
          <v-btn icon
            variant="plain"
            :disabled="org.Efficiency === 6"
            @click="org.Efficiency += 2">
            <v-icon size="large"
              color="accent"
              icon="mdi-plus" />
          </v-btn>
        </v-col>
        <v-col cols="1" />
        <v-col cols="auto">
          <v-btn icon
            variant="plain"
            :disabled="org.Influence === 0"
            @click="org.Influence -= 2">
            <v-icon size="large"
              color="accent"
              icon="mdi-minus" />
          </v-btn>
        </v-col>
        <v-col class="text-center"
          cols="auto">
          <div>
            <span class="heading h2 text-accent">+ {{ org.Influence }}</span>
            <br />
            <span>
              Organization Influence
              <cc-tooltip simple
                inline
                content="Influence is your organization's size, reach, wealth, and reputation.
                Influence be used to acquire assets, create opportunities, or sway public
                opinion.">
                <v-icon size="small">mdi-help-circle-outline</v-icon>
              </cc-tooltip>
            </span>
          </div>
        </v-col>
        <v-col cols="auto">
          <v-btn icon
            variant="plain"
            :disabled="org.Influence === 6"
            @click="org.Influence += 2">
            <v-icon size="large"
              color="accent"
              icon="mdi-plus" />
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </cc-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import Organization from '@/classes/pilot/components/reserves/Organization'
import { OrgType } from '@/classes/enums'

const { smAndDown: mobile } = useDisplay()

const props = withDefaults(defineProps<{
  org: Organization
  small?: boolean
}>(), {
  small: false,
})

const emit = defineEmits<{ remove: []; update: [org: any] }>()

const dialog = ref(false)

const orgTypes = computed(() => {
  return Object.keys(OrgType)
    .map((k) => OrgType[k as string])
    .sort() as OrgType[];
})

function remove(close: () => void) {
  emit('remove');
  dialog.value = false;
  close();
}

function saveAndClose(close: () => void) {
  emit('update', props.org);
  close();
}
</script>
