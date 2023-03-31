<template>
  <editor-base
    :item="npc"
    :isNew="!!newNpc"
    @exit="$emit('exit')"
    @add-new="saveAsNew($event)"
    @save="save()"
    @delete="deleteItem()"
    @copy="dupe()"
  >
    <builder slot="builder" :item="npc" />
    <features v-if="npc.NpcClassController.Class" :item="npc" />
  </editor-base>
</template>

<script lang="ts">
import EditorBase from '../../gm/_components/EditorBase.vue';

import { NpcStore } from '@/stores';
import Features from './features.vue';
import Builder from './builder.vue';
import { Npc } from '@/class';

export default {
  name: 'gm-editor-npc',
  components: { Builder, Features, EditorBase },
  props: {
    id: { type: String, required: true },
  },
  data: () => ({
    newNpc: null,
  }),
  computed: {
    npc() {
      if (this.id === 'new') {
        if (!this.newNpc) this.newNpc = new Npc();
        return this.newNpc;
      }
      return NpcStore().Npcs.find((x) => x.ID === this.id);
    },
  },
  methods: {
    exit() {
      this.$set(this, 'newNpc', null);
      this.$emit('exit');
    },
    saveAsNew() {
      const store = NpcStore();
      store.addNpc(this.npc);
      this.exit();
    },
    save() {
      const store = NpcStore();
      // TODO: check for and ask to update instances on save
      store.saveNpcData();
      this.$emit('exit');
    },
    deleteItem() {
      this.npc.SaveController.delete();
      this.$emit('exit');
    },
    dupe() {
      const store = NpcStore();
      const dupe = Npc.Deserialize(Npc.Serialize(this.npc));
      dupe.RenewID();
      store.addNpc(dupe);
      this.$emit('exit');
    },
  },
};
</script>
