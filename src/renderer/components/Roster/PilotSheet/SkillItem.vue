<template>
  <v-card>
    <v-layout justify-space-between>
      <v-flex xs3>&emsp;
          <v-chip dark color="primary" small >
            +<b>{{skill.bonus}}</b>
          </v-chip>

        <h5 class="center-align">&nbsp;{{skillData.trigger}}</h5>
        </v-flex>
      <v-flex>&emsp;<span class="center-align">{{skillData.description}}</span></v-flex>
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

