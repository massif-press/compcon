<template>
  <div id="mech-sheet" class="collapsed">
   this is the mech mech-sheet
  </div>
</template>

<script>
  export default {
    name: 'mech-sheet'
  }
</script>

<style scoped>
#mech-sheet {
  height: 93vh;
  width: 94vw;
  background-color: lightslategray;
  position: absolute;
  top:7.25vh;
  z-index: 2;
  transition: all .6s cubic-bezier(.13,.31,0,1.02);
}

#mech-sheet.expanded {
  right: 0;
}

#mech-sheet.collapsed {
  right: -95vw;
}

</style>
