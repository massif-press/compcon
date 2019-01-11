//TODO: mixin per styling option
<template>
  <div>
    <div v-if="editing">
      <input v-model="tempValue" class="input"/>
      <button @click="disableEditing"> Cancel </button>
      <button @click="saveEdit"> Save </button>
    </div>
    <div v-else>
      <span class='text pointer' @click="enableEditing">{{value}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'editable-text-field',
    props: {
      val: {
        type: String,
        required: true
      }
    },
    data: function () {
      return {
        value: this.val,
        tempValue: null,
        editing: false
      }
    },
    methods: {
      enableEditing: function () {
        this.tempValue = this.value
        this.editing = true
      },
      disableEditing: function () {
        this.tempValue = null
        this.editing = false
      },
      saveEdit: function () {
        // TODO: write to whatever
        this.value = this.tempValue
        this.disableEditing()
      }
    }
  }
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }
  .pointer:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
</style>
