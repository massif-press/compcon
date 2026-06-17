<template>
  <v-row dense
    align="center">
    <v-col>
      <div>
        <cc-text-field v-model="newSkill"
          variant="outlined"
          color="primary"
          density="compact"
          hide-details
          :label="$t('classes.newSkillTrigger')" />
        <cc-text-area v-model="newDesc"
          class="my-2"
          :label="$t('common.description')" />
        <cc-text-area v-model="newDetail"
          class="my-2"
          :label="$t('common.detail')" />
      </div>
    </v-col>
    <v-col cols="auto"
      md="1"
      class="text-center">
      <div class="mt-2 ml-auto mr-auto">
        <v-tooltip :text="$t('pm.tooltips.addSkill')">
          <template #activator="{ props: activatorProps }">
            <cc-button v-bind="activatorProps"
              size="large"
              icon="mdi-plus"
              variant="outlined"
              color="success"
              :disabled="newSkill === '' || !canAdd"
              @click="addSkill" />
          </template>
        </v-tooltip>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CustomSkill from '@/classes/pilot/components/skill/CustomSkill';
import { Pilot } from '@/classes/pilot/Pilot'

const props = defineProps<{
  pilot: Pilot
}>()

const emit = defineEmits<{
  'add-custom': { skill: string; description: string; detail: string }
}>()

const newSkill = ref('')
const newDesc = ref('')
const newDetail = ref('')

const canAdd = computed(() => {
  const custSkill = new CustomSkill(newSkill.value, newDesc.value, newDetail.value);
  return props.pilot.SkillsController.CanAddSkill(custSkill);
})

function addSkill() {
  emit('add-custom', {
    skill: newSkill.value,
    description: newDesc.value,
    detail: newDetail.value,
  });
  newSkill.value = '';
  newDesc.value = '';
  newDetail.value = '';
}
</script>
