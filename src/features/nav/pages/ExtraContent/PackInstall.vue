<template>
  <v-layout class="packInstaller" style="min-height: 300px;">
    <v-flex style="height: 100%; min-width: 25%; max-width: 25%" class="px-3 py-4">
      <v-file-input
        v-model="value"
        placeholder="Select an .LCP file"
        outlined
        mr2
        accept=".lcp"
        prepend-inner-icon="mdi-package"
        prepend-icon
        @change="fileChange($event)"
      />
      <v-btn
        block
        type="flat"
        :disabled="!contentPack || installing"
        :color="done ? 'success' : 'primary'"
        class="mb-2"
        @click="install"
      >
        <v-fade-transition mode="out-in">
          <svg
            v-show="done"
            class="check"
            xmlns="http://www.w3.org/2000/svg"
            width="32px"
            height="32px"
            viewBox="0 0 154 154"
          >
            <polyline
              points="43.5,77.8 63.7,97.9 112.2,49.4 "
              style="stroke: white; fill: none; stroke-width: 12px"
            />
          </svg>
        </v-fade-transition>
        <span v-show="!done">{{ packAlreadyInstalled ? 'Replace' : 'Install' }}</span>
      </v-btn>
      <p v-if="error" style="color: red">{{ error }}</p>
      <v-alert
        :value="packAlreadyInstalled && !(installing || done)"
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
        <div v-if="contentPack" key="pack">
          <pack-info :pack="contentPack" />
        </div>
        <div
          v-else
          key="nopack"
          style="display: flex; width: 100%; height: 200px; align-items: center; justify-content: center;"
        >
          <div class="heading h3 font-italic subtle--text text--darken-1">
            No content pack selected.
          </div>
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
import { CompendiumStore } from '@/store'

import { IContentPack } from '@/interface'

import PackInfo from './PackInfo.vue'

@Component({
  components: { PackInfo },
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

  public value = null
  public installing = false
  public done = false

  async install() {
    if (this.done || this.installing) return
    this.installing = true
    this.contentPack.active = true
    await this.dataStore.installContentPack(this.contentPack)
    this.installing = false

    this.done = true
    setTimeout(() => {
      this.$emit('installed')
      this.contentPack = null
      this.error = null
      this.value = null
      this.done = false
    }, 500)
  }
}
</script>

<style scoped>
.packInstaller >>> .v-btn {
  transition: background-color 500ms cubic-bezier(0.165, 0.84, 0.44, 1);
}

.check {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: dash 750ms cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
  /* animation-iteration-count: infinite; */
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
