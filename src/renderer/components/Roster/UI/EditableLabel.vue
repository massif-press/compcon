<template>
  <div id="label-container"
    v-on-clickaway="away"
    :attr = "attr">

    <div v-if="isEditing">
      <b-form-group 
        id="fieldset" 
        :description="description" 
        :invalid-feedback="invalidFeedback"
        :valid-feedback="validFeedback"
        :state="state" >
        <b-input-group>
          <b-form-input
          :placeholder="val"
          v-model="newVal"
          :state="state" ></b-form-input>
            <b-input-group-append>
              <b-btn @click="save()"><v-icon name="save"/> </b-btn>
              <b-btn @click="cancel()"><v-icon name="ban"/> </b-btn>
            </b-input-group-append>
          </b-input-group>
      </b-form-group>    
    </div>

    <div v-else>
      <div class='highlight' @click="edit(true)">
        {{ val }}
      </div>
    </div>

  </div>
</template>

<script>
  import { mixin as clickaway } from 'vue-clickaway'

  export default {
    name: 'editable-label',
    mixins: [ clickaway ],
    props: ['attr', 'val', 'id', 'description', 'invalidText', 'validText'],
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
        this.newVal = ''
      },
      save: function () {
        console.log(this.attr, this.val, this.newVal)
        if (this.state) {
          this.$store.dispatch('editPilot', {
            id: this.id,
            attr: this.attr,
            val: this.newVal
          })
        }
        this.cancel()
      },
      away: function () {
        this.cancel()
      }
    },
    computed: {
      state () {
        return this.newVal.length > 0
      },
      invalidFeedback () {
        if (this.newVal.length) {
          return ''
        } else {
          return this.invalidText || ''
        }
      },
      validFeedback () {
        return this.state === true ? this.validText : ''
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