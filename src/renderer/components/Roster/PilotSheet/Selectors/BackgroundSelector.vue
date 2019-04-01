<template>
  <v-container>
    <v-layout v-for="background in backgrounds" :key="background.id">
      <v-flex>
        <v-card>
          <v-toolbar :color="preSelected === background.id ? 'primary': ''">
          <v-btn fab large bottom right absolute @click="onSelect(background.id)" :color="preSelected === background.id ? 'grey lighten-1': ''">
            <v-icon v-if="preSelected === background.id">check</v-icon>
            <v-icon v-else>add</v-icon>
          </v-btn>
          <v-toolbar-title :class="preSelected === background.id ? 'headline white--text': 'headline'">{{background.name}}</v-toolbar-title>
        </v-toolbar>
          <v-card-title primary-title>
            <span class="subheading grey--text"><b>Example Triggers: {{background.triggers}}</b></span>
          </v-card-title>
          <v-card-text class="pl-3 pr-3 pt-0 pb-2 m-0">
            <p>{{background.description}}</p>
          </v-card-text>
        </v-card>
        <br>
      </v-flex>
    </v-layout>
    <v-divider />
    <v-layout>
      <v-flex>
        <v-card>
          <v-toolbar>
            <v-btn fab large bottom right absolute @click="customBgDialog = true">
              <v-icon>add</v-icon>
            </v-btn>
          <v-dialog width="450" v-model="customBgDialog"> 
            <v-card>
              <v-card-text class="mb-0 pb-0">
                <v-text-field v-model="customBg" box label="Enter Custom Pilot Background"/>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-btn flat color="primary" @click="customBgDialog = false">Cancel</v-btn>
                <v-spacer />
                <v-btn color="success" :disabled="!customBg.length" @click="onCustom">Confirm</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-toolbar-title class="headline">Custom Pilot Background</v-toolbar-title>
        </v-toolbar>
          <v-card-text class="pl-3 pr-3 pt-0 pb-2 m-0">
            <p>&emsp;</p>
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
    props: {
      preSelected: String
    },
    data: () => ({
      backgrounds: [],
      customBgDialog: false,
      customBg: ''
    }),
    methods: {
      onSelect (id) {
        this.$emit('selected', {field: 'background', value: id})
      },
      onCustom () {
        this.customBgDialog = false
        this.$emit('selected', {field: 'custom_background', value: this.customBg})
      }
    },
    created: function () {
      this.backgrounds = this.$store.getters.getItemCollection('Backgrounds')
    }
  }
</script>
