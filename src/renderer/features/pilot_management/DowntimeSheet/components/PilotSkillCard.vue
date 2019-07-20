<template>
  <v-flex xs4>
    <div class="ma-1">
      <v-toolbar dark dense style="background-color: #616161">
        <v-chip small dark color="primary">
          <v-avatar class="mr-0">
            <v-icon>add</v-icon>
          </v-avatar>
          <b class="font-weight-bold" style="font-size: 16px">{{pSkill.Bonus}}</b>
        </v-chip>
        <v-toolbar-title>{{ pSkill.Skill.Name }}</v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-dialog width="50vw">
            <template v-slot:activator="{ on }">
              <v-btn absolute right style="right: 0; top: 0" icon flat dark v-on="on">
                <v-icon dark>mdi-information-outline</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="major-title primary white--text">{{ pSkill.Skill.Name }}</v-card-title>
              <v-card-text>
                <p class="effect-text" v-html="pSkill.Skill.Description" />
                <p class="fluff-text" v-html="pSkill.Skill.Detail" />
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-toolbar-items>
      </v-toolbar>
    </div>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'pilot-skill-card',
  props: {
    pSkill: Object,
  },
})
</script>
