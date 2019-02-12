<template>
  <b-container>
    <b-form-row v-for="background in backgrounds" :key="background.id">
      <b-col cols=auto> 
        <b-btn variant="outline-primary" style="height:100%;" @click="onSelect(background.id)"><v-icon name="check" /></b-btn>
        </b-col>
      <b-col>
        <b-card :title="background.name" :sub-title="'Example Skills: ' + split(background.skills)">
          <p class='card-text'>{{background.description}}</p>
        </b-card>
      </b-col>
    </b-form-row>
  </b-container>
</template>

<script>
  export default {
    name: 'background-selecor',
    computed: {
      backgrounds: function () {
        return this.$store.getters.getItemCollection('Backgrounds')
      }
    },
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
    }
  }
</script>
