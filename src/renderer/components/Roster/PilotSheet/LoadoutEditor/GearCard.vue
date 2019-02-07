<template>
  <div>
    <b-card>
      <p v-if="itemData.description" v-html="itemData.description" />
      <p v-if="itemData.damage" v-html="`${itemData.damage} Damage // ${itemData.range}`" />
      <p v-if="itemData.armor" v-html="`+ ${itemData.armor} Armor // E-Defense: ${itemData.edef} // Evasion: ${itemData.evasion}`" />
      <p v-if="itemData.speed" v-html="`Speed ${itemData.speed}`" />
      <p v-if="itemData.uses" v-html="`${itemData.uses} Uses`" />
      <p v-if="itemData.effect" v-html="itemData.effect" />
      <p v-html="`Rarity ${itemData.rarity}`" />
  </b-card>
  </div>
</template>

<script>
  export default {
    name: 'gear-card',
    props: ['itemData']
  }
</script>
