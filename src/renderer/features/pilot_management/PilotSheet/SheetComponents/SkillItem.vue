<template>
  <v-card>
    <v-layout v-if="skill.err">
      <v-card-text class="text-xs-center pa-1">
        <span class="subheading grey--text">// MISSING DATA //</span>
      </v-card-text>
    </v-layout>

    <v-layout v-else>
      <v-flex xs3>
        <div class="centered text-xs-left pl-3">
          <v-chip v-if="pilotSkill" dark color="primary" small outline>
            +
            <b>{{ pilotSkill.Bonus }}</b>
          </v-chip>
          <span class="subheading font-weight-bold">{{ skill.Trigger }}</span>
        </div>
      </v-flex>
      <v-flex xs9>
        <v-expansion-panel class="pa-0 ma-0">
          <v-expansion-panel-content expand-icon="search">
            <template v-slot:header>
              <div>
                <span class="center-align effect-text">
                  {{ skill.Description }}
                </span>
              </div>
            </template>
            <v-card flat class="ma-0 pa-0" width="100%">
              <v-card-text class="mt-0 mb-0 pt-0 pb-2 fluff-text">
                {{ skill.Detail }}
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { PilotSkill, Skill } from '@/class'
export default {
  name: 'skill-item',
  props: {
    pilotSkill: PilotSkill,
    skill: Skill,
  },
}
</script>
