<template>
  <div>
    {{weapon.weapon_id}}
  </div>
</template>

<script>
export default {
  name: 'mech-weapon-item',
  props: ['weapon']
}
</script>