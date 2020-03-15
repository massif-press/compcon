<template>
  <div style="max-height: 550px; overflow-y: scroll">
    <h2 class="heading accent--text mb-3">Recent Errors</h2>
    <v-expansion-panels>
      <v-expansion-panel v-for="(error, i) in errors" :key="i">
        <v-expansion-panel-header>
          <div class="flavor-text font-small text--text">
            <span class="flavor-text error--text font-big">{{ error.message }}</span>
            - {{ dateFormat(error.time) }}
            <span v-if="error.component">
              at
              <span class="secondary--text">[{{ error.component }}]</span>
            </span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <h5 class="error--text">STACK TRACE</h5>
          <pre class="flavor-text error--text stack" @copy="onCopy($event, error)">{{
            error.stack
          }}</pre>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getModule } from 'vuex-module-decorators'
import { NavStore } from '@/store'

@Component
export default class OptionsLog extends Vue {
  get errors() {
    return getModule(NavStore, this.$store).Errors
  }

  dateFormat(date: Date) {
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
  }

  onCopy(e, error) {
    console.log('oncopy fired');
    const text = '```\n' + (error.component ? `Vue error at [${error.component}]\n` : '') + window.getSelection().toString() + '```'
    e.clipboardData.setData('text/plain', text);
    e.preventDefault();
  }


}
</script>

<style scoped>
.font-small {
  font-size: 12px;
}

.stack {
  font-size: 14px;
  user-select: all;
  border: 1px solid var(--v-subtle-darken2);
  border-radius: 4px;
  padding: 10px;
  margin: 3px 0;
}
</style>