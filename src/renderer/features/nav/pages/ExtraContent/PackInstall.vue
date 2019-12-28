<template>
  <v-layout class="packInstaller" style="height: 600px;">
    <v-flex style="height: 100%; min-width: 25%; max-width: 25%" class="px-3 py-4">
      <v-file-input
        v-model="value"
        placeholder="Select an .LCP file"
        outlined
        mr2
        accept=".lcp"
        prepend-inner-icon="mdi-package"
        prepend-icon=""
        @change="fileChange($event)"
      />
      <v-btn
        block
        type="flat"
        color="primary"
        :disabled="!contentPack"
        class="mb-2"
        @click="install"
      >
        {{ packAlreadyInstalled ? 'Replace' : 'Install' }}
      </v-btn>
      <p v-if="error" style="color: red">
        {{ error }}
      </p>
      <v-alert
        v-model="packAlreadyInstalled"
        type="info"
        class="transition-swing"
        transition="slide-y-reverse-transition"
      >
        A pack with this same name and author is already installed. It will be replaced by this
        copy.
      </v-alert>
    </v-flex>
    <v-divider vertical class="mx-3" />
    <v-flex class="px-3 py-4">
      <v-fade-transition mode="out-in">
        <div v-if="contentPack" key="pack" style="width: 100%; height: 100%;">
          <pack-info style="width: 100%; height: 100%;" :pack="contentPack" />
        </div>
        <div
          v-else
          key="nopack"
          style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center;"
        >
          <div class="caption font-italic grey--text text--darken-1">No content pack selected.</div>
        </div>
      </v-fade-transition>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import PromisifyFileReader from 'promisify-file-reader'
import { parseContentPack } from '@/io/ContentPackParser'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/features/_shared/store'

import { IContentPack } from '@/interface'

import PackInfo from './PackInfo.vue'


@Component({
  components: { PackInfo }
})
export default class PackInstall extends Vue {
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
    return !!this.contentPack && this.dataStore.packAlreadyInstalled(this.contentPack.id)
  }

  value = null
  async install() {
    await this.dataStore.installContentPack(this.contentPack)
    this.contentPack = null
    this.error = null
    this.value = null
    this.$emit('installed')
  }
}
</script>

<style scoped>
.packInstaller >>> .v-text-field__details {
  display: none;
}
</style>