<template>
  <v-dialog v-model="dialog" width="75vw">
    <v-card flat tile>
      <v-toolbar color="title-bg clipped-large" dark flat>
        <v-toolbar-title class="heading h1">{{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-row justify="center">
        <v-col cols="11">
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="2">
                  <span class="heading h3">Roll</span>
                </v-col>
                <v-col cols="3">
                  <span class="heading h3">Result</span>
                </v-col>
                <v-col cols="7">
                  <span class="heading h3">Effect</span>
                </v-col>
              </v-row>
              <slot />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-divider />
      <v-card-actions>
        <v-btn text @click="dialog = false">Dismiss</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string
}>()

const dialog = ref(false)

function show() {
      dialog.value = true;
    }
function close() {
      dialog.value = false;
    }
</script>

<style scoped>
.title-bg {
  background: repeating-linear-gradient(
    45deg,
    rgb(124, 0, 0),
    rgba(124, 0, 0) 20px,
    rgba(30, 30, 30) 20px,
    rgba(30, 30, 30) 40px
  );
}

.die-hover {
  opacity: 0.75;
  transform: all 0.3s;
}

.die-hover:hover {
  opacity: 1;
  background-color: #e3f2fd;
}
</style>
