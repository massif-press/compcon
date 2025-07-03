<template>
  <cc-panel
    color="primary"
    style="position: relative"
    class="text-center"
    height="94px"
    width="200px"
    density="compact">
    <transition name="fade">
      <v-card-text class="pa-0" v-if="creating">
        <v-text-field
          ref="nameField"
          v-model="name"
          placeholder="Counter name"
          density="compact"
          hide-details
          variant="solo"
          flat
          tile
          @keypress.esc="cancel"
          @keypress.enter="create" />
        <v-row no-gutters class="mt-2">
          <v-col>
            <v-btn block flat tile height="20px" variant="text" @click="cancel">CANCEL</v-btn>
          </v-col>
          <v-col>
            <v-btn block flat tile height="20px" variant="text" :disabled="!name" @click="create">
              Add
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-btn
        v-else
        block
        flat
        tile
        stacked
        variant="text"
        style="height: 100%"
        @click="startCreating">
        <div class="py-1">
          <v-icon icon="mdi-plus" size="x-large" />
          <div>Add Custom Counter</div>
        </div>
      </v-btn>
    </transition>
  </cc-panel>
</template>

<script lang="ts">
export default {
  name: 'NewCounter',
  data: () => ({
    creating: false,
    name: '',
  }),
  methods: {
    async startCreating(): Promise<void> {
      this.creating = true;
      await this.$nextTick();
      (this.$refs.nameField as any as any).focus();
    },

    cancel(): void {
      this.name = '';
      this.creating = false;
    },

    create(): void {
      if (!this.name) return;
      this.$emit('create', this.name);
      this.name = '';
      this.creating = false;
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease-in-out;
  position: absolute;
  width: 100%;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
