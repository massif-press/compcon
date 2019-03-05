<template>
  <v-card>
    <v-layout>
      <v-flex xs3>&emsp;
          <v-chip dark color="primary" small >
            +<b>{{skill.bonus}}</b>
          </v-chip>

        <h5 class="center-align">&nbsp;{{skillData.trigger}}</h5>
        </v-flex>
      <v-flex xs9>
        <v-expansion-panel class="pa-0 ma-0">
          <v-expansion-panel-content expand-icon="search">
            <template v-slot:header>
              <div><span class="center-align subheading font-weight-bold">{{skillData.description}}</span></div>
            </template>
            <v-card flat class="ma-0 pa-0" width="60vw">
              <v-card-text class="mt-0 mb-0 pt-0 pb-2 blockquote">{{skillData.detail}}</v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: 'skill-item',
  props: [
    'skill',
    'skillData'
  ],
  methods: {
    chipColor: function (skill) {
      if ((skill.specialty && skill.flaw)) return ''
      if (skill.specialty) return 'green'
      else if (skill.flaw) return 'red'
      else return 'primary'
    }
  }
}
</script>

<style scoped>
  .center-align {
    min-height: 55px;
    display: inline-flex;
    align-items: center;
  }
</style>

