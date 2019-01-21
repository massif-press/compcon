<template>
  <div id="label-container"
    v-on-clickaway="away"
    :attr = "attr">

    <div v-if="isEditing">
      <span>{{description}}</span>
      <b-form-group>
          <b-row>
            <b-form-textarea
              :value="val"
              v-model="newVal"
              rows=5 
              no-resize
              style="margin:0 15px 0 15px" />
          </b-row>
          <b-row>
            <b-col>
              <b-btn size="sm" class="float-right" @click="save()"><v-icon name="save"/> </b-btn>
              <b-btn size="sm" class="float-right" @click="cancel()"><v-icon name="ban"/> </b-btn>
            </b-col>
          </b-row>
      </b-form-group>    
    </div>

    <div v-else>
      <b-row>
        <b-col class='highlight' @click="edit(true)">
          <span style="white-space: pre-wrap;">{{ val }}</span>
        </b-col>
      </b-row>
    </div>

  </div>
</template>

<script>
  import { mixin as clickaway } from 'vue-clickaway'

  export default {
    name: 'editable-textfield',
    mixins: [ clickaway ],
    props: ['attr', 'val', 'id', 'description'],
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
          id: this.id,
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