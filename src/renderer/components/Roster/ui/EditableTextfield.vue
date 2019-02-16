<template>
  <div id="label-container"
    v-on-clickaway="away"
    :attr = "attr">

    <div v-if="isEditing">
      <span>{{description}}</span>
      <b-form-group>
          <v-layout>
            <b-form-textarea
              :value="val"
              v-model="newVal"
              rows=5 
              no-resize
              style="margin:0 15px 0 15px" />
          </v-layout>
          <v-layout>
            <v-flex>
              <v-btn size="sm" class="float-right" @click="save()"><b-icon name="save"/> </v-btn>
              <v-btn size="sm" class="float-right" @click="cancel()"><b-icon name="ban"/> </v-btn>
            </v-flex>
          </v-layout>
      </b-form-group>    
    </div>

    <div v-else>
      <v-layout>
        <v-flex class='highlight' @click="edit(true)">
          <div v-if="val">
            <span style="white-space: pre-wrap;">{{ val }}</span>
          </div>
          <div v-else>
            <span class="text-muted" style="white-space: pre-wrap;">Click to add</span>
          </div>
        </v-flex>
      </v-layout>
    </div>

  </div>
</template>

<script>
  import { mixin as clickaway } from 'vue-clickaway'

  export default {
    name: 'editable-textfield',
    mixins: [ clickaway ],
    props: ['attr', 'val', 'description'],
    data: () => ({
      isEditing: false,
      newVal: ''
    }),
    methods: {
      edit: function (isEdit) {
        this.isEditing = isEdit
      },
      cancel: function () {
        this.isEditing = false
        this.newVal = this.val
      },
      save: function () {
        this.$store.dispatch('editPilot', {
          attr: this.attr,
          val: this.newVal
        })
        this.isEditing = false
      },
      away: function () {
        this.cancel()
      }
    }
  }
</script>

<style scoped>
  .highlight:hover {
    background-color: aqua;
    cursor: pointer;
  }
</style>