<template>
  <div id="config-sheet" :class="{expanded: open, collapsed : !open}">
   this is the mech mech-sheet<span class="float-right"><div @click="close()"><v-icon name='window-close' scale='2'/></div></span>
   <b-container>
     <b-row>
       <b-col></b-col>
     </b-row>
   </b-container>
  </div>
</template>

<script>
  export default {
    name: 'config-sheet',
    methods: {
      close: function () {
        this.$parent.toggleConfigSheet(false)
      }
    },
    computed: {
      open: function () {
        return this.$parent.configOpen
      }
    }
  }
</script>

<style scoped>
#config-sheet {
  height: 93vh;
  width: 94vw;
  background-color: lightslategray;
  position: absolute;
  top:7.25vh;
  z-index: 2;
  transition: all .6s cubic-bezier(.13,.31,0,1.02);
}

#config-sheet.expanded {
  right: 0;
}

#config-sheet.collapsed {
  right: -95vw;
}

</style>
