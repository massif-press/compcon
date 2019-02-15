<template>
  <v-container>
    <v-layout v-for="background in backgrounds" :key="background.id">
      <v-flex>
        <v-card>
          <v-toolbar :color="preSelected === background.id ? 'blue darken-3': ''">
          <v-btn fab large bottom right absolute @click="onSelect(background.id)" :color="preSelected === background.id ? 'cyan highlight-2': ''">
            <v-icon v-if="preSelected === background.id">check</v-icon>
            <v-icon v-else>add</v-icon>
          </v-btn>
          <v-toolbar-title :class="preSelected === background.id ? 'headline white--text': 'headline'">{{background.name}}</v-toolbar-title>
        </v-toolbar>
          <v-card-title primary-title>
            <div>
              <span class="subheading grey--text"><b>Suggested Skills: {{split(background.skills)}}</b></span>
            </div>
          </v-card-title>
          <v-card-text>
          <p>{{background.description}}</p>
          </v-card-text>
        </v-card>
        <br>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'background-selecor',
    props: [ 'preSelected' ],
    data: () => ({
      backgrounds: []
    }),
    methods: {
      split: function (arr) {
        var o = ''
        for (let i = 0; i < arr.length; i++) {
          o += arr[i].toString()
          if (i < arr.length - 1) o += ', '
        }
        return o
      },
      onSelect (id) {
        this.$emit('selected', {field: 'background', value: id})
      }
    },
    mounted: function () {
      this.backgrounds = this.$store.getters.getItemCollection('Backgrounds')
    }
  }
</script>
