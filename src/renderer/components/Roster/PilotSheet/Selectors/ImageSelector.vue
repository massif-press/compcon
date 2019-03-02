<template>
<v-container>
<v-tabs v-model="tabController">
  <v-tab>Pilot Portrait</v-tab>
  <v-tab>Pilot Avatar</v-tab>
  <v-tab-item>
    <v-card flat>
        <v-container grid-list-sm fluid>
          <v-layout row justify-space-between wrap fill-height align-center>
            <v-flex v-for="i in portraits" :key="i" xs3> 
              <div :class="`justify-center pa-1 ${i === preselectPortrait ? 'preselected' : 'clickable'}`" @click="assignPortrait(i)">
                <v-img :src="require(`@/assets/img/portraits/${i}`)" position="top" /> 
              </div>
            </v-flex>
          </v-layout>
        </v-container>   
    </v-card>
  </v-tab-item>
    <v-tab-item>
    <v-card flat>
        <v-container grid-list-sm fluid>
          <v-layout row justify-space-between wrap fill-height align-center>
            <v-flex v-for="i in avatars" :key="i" xs3> 
              <div :class="`justify-center pa-1 ${i === preselectAvatar ? 'preselected' : 'clickable'}`" @click="assignAvatar(i)">
                <v-img :src="require(`@/assets/img/avatars/${i}`)" position="top" /> 
              </div>
            </v-flex>
          </v-layout>
        </v-container>   
    </v-card>
  </v-tab-item>
  </v-tabs>
  </v-container>
</template>

<script>
  import io from '@/store/data_io'

  export default {
    name: 'image-selector',
    props: [
      'preselectPortrait', 'preselectAvatar'
    ],
    data: () => ({
      tabController: null,
      done: false,
      portraits: [],
      avatars: []
    }),
    methods: {
      assignPortrait: function (src) {
        this.$emit('assign-portrait', src)
        this.tabController = 1
      },
      assignAvatar: function (src) {
        this.$emit('assign-avatar', src)
        window.scrollTo(0, document.body.scrollHeight)
      }
    },
    mounted: function () {
      this.portraits = io.getImages('portraits')
      this.avatars = io.getImages('avatars')
    }

  }
</script>

<style scoped>
  .clickable {
    cursor: pointer!important;
  }
  .clickable:hover {
    background-color: #0D47A1;
  }
  .preselected {
    background-color: #81D4FA;
  }
</style>
