<template>
  <div style="position: relative">
    <v-img
      :src="src"
      class="pa-2"
      :width="size"
      :class="white ? 'white-emblem' : $vuetify.theme.dark ? 'white-emblem' : 'black-emblem'"
    />
    <div
      v-if="backup"
      :class="`banner ${small ? 'overline' : 'caption'}`"
      :style="`width: ${size}`"
    >
      {{ backup }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'talent-emblem',
  props: {
    url: { type: String, required: true },
    name: { type: String, required: true },
    small: { type: Boolean },
    large: { type: Boolean },
    white: { type: Boolean },
  },
  data: () => ({
    src: '',
    backup: '',
  }),
  computed: {
    exists() {
      var http = new XMLHttpRequest()

      http.open('HEAD', this.url, false)
      http.send()

      return http.status != 404
    },
    size() {
      if (this.large) return '100px'
      if (this.small) return '50px'
      return '45px'
    },
  },
  mounted() {
    if (this.exists) this.src = this.url
    else {
      this.src = '/static/img/talent/GENERIC TALENT.svg'
      this.backup = this.name
    }
  },
})
</script>

<style scoped>
.white-emblem {
  filter: invert(100%);
}

.black-emblem {
  filter: invert(0%);
}

.banner {
  background-color: var(--v-primary-base);
  color: white;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>