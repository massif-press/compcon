<template>
  <v-row dense>
    <v-col>
      <custom-skill-item v-if="custom" :bonus="bonus" :skill="skill" />
      <skill-item v-else :bonus="bonus" :skill="skill" />
    </v-col>
    <v-col cols="auto">
      <div class="mt-4 ml-auto mr-auto">
        <cc-tooltip simple content="Increase Skill Bonus" inline>
          <v-btn large color="primary" icon :disabled="!canAdd" @click="$emit('add')">
            <v-icon x-large>cci-accuracy</v-icon>
          </v-btn>
        </cc-tooltip>
        <cc-tooltip simple content="Decrease Skill Bonus" inline>
          <v-btn large color="primary" icon :disabled="!canRemove" @click="$emit('remove')">
            <v-icon x-large>cci-difficulty</v-icon>
          </v-btn>
        </cc-tooltip>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import SkillItem from './_SkillItem.vue'
import CustomSkillItem from './_CustomSkillItem.vue'

export default Vue.extend({
  name: 'skill-select-item',
  components: { CustomSkillItem, SkillItem },
  props: {
    skill: {
      type: Object,
      required: true,
    },
    custom: {
      type: Boolean,
      required: true,
    },
    canAdd: {
      type: Boolean,
      required: true,
    },
    canRemove: {
      type: Boolean,
      required: true,
    },
    bonus: {
      type: Number,
      required: false,
      default: 0,
    },
  },
})
</script>
