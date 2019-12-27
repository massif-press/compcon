<template>
  <div class="px-3 py-4">
    <h3 class="headline">Load Content Package</h3>
    <div style="display: flex;">
      <v-file-input
        v-model="value"
        outlined
        mr2
        accept=".lcp"
        prepend-inner-icon="mdi-package"
        prepend-icon=""
        class="mr-1"
        @change="fileChange($event)"
      />
      <v-btn type="flat" color="primary" :disabled="!contentPack" @click="install">
        {{ packAlreadyInstalled ? 'Replace' : 'Install' }}
      </v-btn>
    </div>
    <p v-if="error" style="color: red">
      {{ error }}
    </p>
    <p v-if="packAlreadyInstalled" style="font-style: italic; font-size: 0.75em">
      A pack with this same name and author is already installed. It will be replaced by this copy.
    </p>
    <div v-if="contentPack">
      <h4>{{ contentPack.info.manifest.name }} {{ contentPack.info.manifest.version }}</h4>
      <i style="font-size: 0.8em">
        By
        <b>{{ contentPack.info.manifest.author }}</b>
      </i>
      <h5>Contains:</h5>
      <ul>
        <li
          v-for="category in [
            'manufacturers',
            'coreBonuses',
            'frames',
            'weapons',
            'systems',
            'mods',
            'pilotGear',
            'talents',
            'tags',
          ]"
          :key="category"
        >
          <b>{{ contentPack.data[category].length }}</b>
          {{ category }}
        </li>
      </ul>
    </div>
    <packs-list />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'

import PromisifyFileReader from 'promisify-file-reader'
import { parseContentPack, IContentPack } from '@/io/ExtraContent'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/features/_shared/store'

import PacksList from './PacksList.vue'

@Component({
  components: { PacksList }
})
export default class ExtraContent extends Vue {

  private dataStore = getModule(CompendiumStore, this.$store)

  contentPack: IContentPack = null
  error: string = null

  async fileChange(file: HTMLInputElement) {
    this.contentPack = null
    this.error = null

    if (!file) return

    const fileData = await PromisifyFileReader.readAsBinaryString(file)
    try {
      this.contentPack = await parseContentPack(fileData)
    } catch (e) {
      this.error = e.message
    }
  }

  get packAlreadyInstalled() {
    return !!this.contentPack && this.dataStore.packAlreadyInstalled(this.contentPack.info.id)
  }

  value = null
  async install() {
    await this.dataStore.installContentPack(this.contentPack)
    this.contentPack = null
    this.error = null
    this.value = null
  }

  deletePack(packID: string) {
    this.dataStore.deleteContentPack(packID)
  }

} 
</script>

<style scoped>
</style>