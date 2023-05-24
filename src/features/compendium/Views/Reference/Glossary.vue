<template>
  <sidebar-array-view
    title="GLOSSARY"
    :array="glossary"
    name-key="name"
    description-key="description"
  />
</template>

<script lang="ts">
import _ from 'lodash';
import SidebarArrayView from '../../components/SidebarArrayView.vue';
import { glossary } from '@massif/lancer-data';

export default {
  name: 'glossary',
  components: { SidebarArrayView },
  computed: {
    glossary() {
      return _.sortBy(glossary, [(x) => x.name]);
    },
  },
};
</script>
