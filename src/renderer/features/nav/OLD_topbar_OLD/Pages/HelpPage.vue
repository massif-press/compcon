<template>
  <div>
    <p>Under Construction</p>
    <v-divider class="my-3" />
    <h1 class="display-1">Keyboard navigation</h1>
    <ul>
      <li class="my-1">
        <span class="keyboard-shortcut">g</span>
        <span class="keyboard-shortcut">r</span>
        – go to pilot roster
      </li>
      <li class="my-1">
        <span class="keyboard-shortcut">g</span>
        <span class="keyboard-shortcut">h</span>
        – go to mech hangar
      </li>
      <li class="my-1">
        <span class="keyboard-shortcut">g</span>
        <span class="keyboard-shortcut">c</span>
        – go to compendium
      </li>
      <li class="my-1">
        in compendium –
        <span class="keyboard-shortcut">ctrl + f</span>
        – search
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { remote } from 'electron'
export default Vue.extend({
  name: 'help-page',
  methods: {
    open(link: string) {
      remote.shell.openExternal(link)
    },
  },
})
</script>
