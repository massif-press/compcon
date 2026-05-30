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
          label="New Skill Trigger" />
        <cc-text-area v-model="newDesc"
          class="my-2"
          label="Description" />
        <cc-text-area v-model="newDetail"
          class="my-2"
          label="Detail" />
      </div>
    </v-col>
    <v-col cols="auto"
      md="1"
      class="text-center">
      <div class="mt-2 ml-auto mr-auto">
        <v-tooltip text="Add Skill">
          <template #activator="{ props }">
            <cc-button v-bind="props"
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
  'add-custom': []
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
