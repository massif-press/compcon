<template>
  <c-card-base
    :item="item"
    :small="small"
    :hover="hover"
    :equipped="equipped"
    :highlighted="highlighted"
    @equip="$emit('equip', $event)">
    yessir
  </c-card-base>
</template>

<script lang="ts">
import CCardBase from './_cCardBase.vue';
export default {
  name: 'weapon-card-content',
  components: { CCardBase },
  props: {
    item: { type: Object, required: true },
    small: { type: Boolean },
    hover: { type: Boolean },
    equipped: { type: Boolean },
    highlighted: { type: Boolean },
  },
};
</script>
