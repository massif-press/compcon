<template>
  <v-chip label variant="elevated" :color="color" class="ma-1"
    ><b>{{ item.name }}</b
    ><cc-slashes class="px-1" />{{ item.relationship }}

    <v-menu open-on-hover activator="parent">
      <v-card style="min-width: 50vw" variant="elevated">
        <v-toolbar density="compact" class="pl-4 pr-2" :color="color"
          ><span class="heading h3">{{ item.name }}</span
          ><v-spacer /><i class="text-body-2">{{ item.relationship }}</i>
          <v-spacer />
          <v-btn icon variant="tonal" size="30"
            ><v-icon size="25" icon="mdi-arrow-expand" @click="dialog = true" /></v-btn
        ></v-toolbar>
        <v-divider />
        <v-card-text>
          <v-row dense>
            <v-col v-if="linkItem" cols="auto">
              <v-avatar size="64" class="mr-2">
                <v-img :src="linkItem.Portrait" />
              </v-avatar>
            </v-col>
            <v-col>
              <p v-html-safe="item.note" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-menu>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        TODO: readonly collection item content panel
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-chip>
</template>

<script lang="ts">
import { CollectionItem } from '@/classes/narrative/CollectionItem';
import { NarrativeStore } from '@/stores';

// id: string;
// name: string;
// relationship: string;
// note: string;

export default {
  name: 'cc-relationship-item',
  props: {
    item: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      default: 'primary',
    },
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    linkItem(): CollectionItem | null {
      return NarrativeStore().getItemByID(this.item.id);
    },
  },
};
</script>
