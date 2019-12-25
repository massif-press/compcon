<template>
  <div>
    <h3 class="headline">Load Content Package</h3>
    <div style="display: flex;">
      <v-file-input ref="fileInput" mr2 accept=".lcp" @change="fileChange($event)" />
      <v-btn type="flat" color="primary" :disabled="!contentPack" @click="save">
        {{ packAlreadyAdded ? 'Replace' : 'Save' }}
      </v-btn>
    </div>
    <p v-if="error" style="color: red">
      {{ error }}
    </p>
    <p v-if="packAlreadyAdded" style="font-style: italic; font-size: 0.75em">
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
    <h3>Packs currently installed:</h3>
    <ul>
      <li v-for="pack in currentPacks" :key="pack.id">
        {{ pack.manifest.name }} {{ pack.manifest.version }}
        <v-btn icon color="primary" @click="deletePack(pack.id)"><v-icon>delete</v-icon></v-btn>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'

import PromisifyFileReader from 'promisify-file-reader';
import { parseContentPack, IContentPack } from './io/ExtraContent';
import { getModule } from 'vuex-module-decorators';
import { CompendiumStore } from './features/_shared/store';

@Component
export default class BrewTest extends Vue {

  private dataStore = getModule(CompendiumStore, this.$store)

  contentPack: IContentPack = null
  error: string = null

  get currentPacks() {
    return this.dataStore.ContentPacks
  }

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

  get packAlreadyAdded() {
    if (!this.contentPack) return false
    const { id } = this.contentPack.info
    return this.currentPacks.map(pak => pak.id).includes(id)
  }

  async save() {
    if (this.packAlreadyAdded) await this.dataStore.replaceContentPack(this.contentPack)
    else await this.dataStore.addContentPack(this.contentPack)
    this.contentPack = null
    this.error = null
    const inputEl = this.$refs.fileInput as HTMLFormElement
    inputEl.reset()
  }

  deletePack(packID: string) {
    this.dataStore.deleteContentPack(packID)
  }

} 
</script>

<style scoped>
div {
  padding: 10px;
}
</style>