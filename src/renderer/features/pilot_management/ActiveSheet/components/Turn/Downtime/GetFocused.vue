<template>
  <div>
    <v-card-text>
      <v-layout row wrap class="text-xs-center">
        <v-flex xs12 class="effect-text">
          <p
            class="pt-2 pb-0 ma-0"
          >You focus on increasing your own skills, training, and self-improvement. You might practice, learn, meditate, or call on a teacher.</p>
          <v-divider class="ma-2" />
          <v-card>
            <v-tabs v-model="tabs" dark color="primary" slider-color="yellow" grow>
              <v-tab>New Custom Skill</v-tab>
              <v-tab :disabled="!customSkills.length">Improve Custom Skill</v-tab>
              <v-tab-item>
                <v-card-text>
                  <v-layout row>
                    <v-flex shrink>
                      <v-chip large color="primary" dark class="title" style="margin-top: 12px">
                        <span class="title">+2</span>
                      </v-chip>
                    </v-flex>
                    <v-flex>
                      <v-text-field
                        v-model="newSkill"
                        outline
                        label="New Skill Trigger"
                        style="width: 600px"
                      />
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-tab-item>
              <v-tab-item>
                <v-card-text>
                  <v-radio-group v-model="improve" class="ml-4 mr-4">
                    <v-radio
                      v-for="s in customSkills"
                      class="black--text minor-title"
                      :key="s.Skill.Name"
                      :value="s.Skill.Name"
                      :label="`${s.Skill.Name} (+${s.Bonus})`"
                      :disabled="s.Bonus >= 6"
                    />
                  </v-radio-group>
                </v-card-text>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn flat @click="close()">cancel</v-btn>
      <v-spacer />
      <v-btn
        large
        color="primary"
        @click="tabs === 0 ? addSkill() : improveSkill()"
        :disabled="(tabs === 0 && !newSkill) || (tabs === 1 && !improve)"
      >{{tabs === 0 ? 'Add Skill': 'Improve Skill'}}</v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Reserve, CustomSkill } from '@/class'
export default Vue.extend({
  name: 'get-focused',
  props: {
    pilot: Object,
  },
  data: () => ({
    tabs: 0,
    newSkill: '',
    improve: '',
  }),
  computed: {
    customSkills() {
      return this.pilot.Skills.filter(x => x.IsCustom)
    },
  },
  methods: {
    addSkill() {
      this.pilot.AddSkill(new CustomSkill(this.newSkill))
      this.close()
    },
    improveSkill() {
      this.pilot.Skills.find(x => x.Skill.Name === this.improve).Increment()
      this.close()
    },
    close() {
      this.tabs = 0
      this.newSkill = ''
      this.improve = ''
      this.$emit('close')
    },
  },
})
</script>
