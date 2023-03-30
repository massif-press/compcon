<template>
  <v-dialog v-model="dialog" width="75vw">
    <cc-confirmation
      :content="`Lancer, please confirm deletion of Mech Configuration:
          <span class='text-accent'>
            ${mech.Name} (${mech.Frame.Source}, ${mech.Frame.Name})
          </span>`"
      @confirm="remove()"
    />
  </v-dialog>
</template>

<script lang="ts">
export default {
  name: 'delete-mech-dialog',
  props: {
    mech: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    show() {
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
    remove() {
      this.$emit('delete');
      this.hide();
    },
  },
};
</script>
