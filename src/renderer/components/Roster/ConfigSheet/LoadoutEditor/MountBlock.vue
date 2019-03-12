<template>
  <div>
    <v-card class="mb-2 pr-5 pl-0 pb-4" color="grey darken-2">
      <span class="mount-title pl-3 pr-3">{{mount.mount_type}} Mount</span>
      <v-card-text class="bordered ml-3 pt-4">
        <div v-if="mount.mount_type === 'Main/Aux'">
          <mech-weapon-item empty item-type="Main"/>
          <mech-weapon-item empty item-type="Auxiliary"/>
        </div>
        <div v-else-if="mount.mount_type === 'Aux/Aux'">
          <mech-weapon-item empty item-type="Auxiliary"/>
          <mech-weapon-item empty item-type="Auxiliary"/>
        </div>
        <div v-else-if="mount.mount_type === 'Flex'">
          <mech-weapon-item empty item-type="Main / Aux"/>
        </div>
        <div v-else>
          <mech-weapon-item empty :item-type="mount.mount_type"/>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import MechWeaponItem from './MechWeaponItem'

export default {
  name: 'mount-block',
  props: {
    mount: Object
  },
  components: { MechWeaponItem }
}
</script>

<style>
  .mount-title {
    position: relative;
    top: 15px;
    left: 30px;
    background-color: #616161;
    font-size: 20px;
    letter-spacing: 3px;
    padding: 0;
  }
  .bordered {
    border: solid 2px #424242; 
  }
</style>
