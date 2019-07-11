<template>
    <v-container fluid>
        <!-- Header -->
        <v-layout align-center>
            <h3 class="headline text-xs-left ml-2 grey--text text--darken-1">
                NPCs
            </h3>
            <v-flex ml-auto style="padding: 7px; flex-grow: 0;">
                <add-button text="Create NPC" to="/npc-designer/new" />
            </v-flex>
        </v-layout>
        <v-divider class="mb-3" />
        <v-slide-y-transition
            group
            tag="div"
            class="layout row wrap justify-start"
        >
            <v-flex v-for="npc in npcs" :key="npc.id" xs12 sm6 md3>
                <File
                    :name="npc.name"
                    icon="mdi-account"
                    more
                    :to="`/npc/${npc.id}`"
                    :color="`role--${npc.npcClass.role}`"
                >
                    <template v-slot:extra-icons>
                        <v-menu bottom left>
                            <template v-slot:activator="{ on }">
                                <v-icon
                                    right
                                    class="ml-auto more-icon"
                                    v-on="on"
                                    @click.stop=""
                                >
                                    mdi-dots-vertical
                                </v-icon>
                            </template>

                            <v-list class="more-list">
                                <v-list-tile
                                    v-ripple
                                    :to="`/npc-designer/edit/${npc.id}`"
                                >
                                    <v-list-tile-title>Edit</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile
                                    v-ripple
                                    @click="
                                        deleteDialog = true;
                                        deletingNPCID = npc.id;
                                    "
                                >
                                    <v-list-tile-title>
                                        Delete
                                    </v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </template>
                </File>
            </v-flex>
        </v-slide-y-transition>
        <v-dialog
            v-if="deletingNPCID !== null"
            v-model="deleteDialog"
            persistent
            max-width="290"
        >
            <v-card>
                <v-card-title class="headline"
                    >Delete {{ deletingNPC.name }}?</v-card-title
                >
                <v-card-text>This cannot be undone.</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="secondary"
                        flat
                        @click="deleteNPC(deletingNPCID)"
                        >OK</v-btn
                    >
                    <v-btn
                        color="secondary"
                        flat
                        @click="
                            deleteDialog = false;
                            deletingNPCID = null;
                        "
                        >Cancel</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
// components
import File from "../../components/File.vue";
import AddButton from "../../components/AddButton.vue";
// vuex
import { mapState } from 'vuex';
import NPC from '../../logic/NPC';

export default {
    name: 'npc-designer-list',
    data: () => ({
        deleteDialog: false,
        deletingNPCID: null,
    }),
    components: { File, AddButton },
    computed: {
        ...mapState('npcDesigner', ['npcs']),
        deletingNPC() {
            if (this.deletingNPCID === null) return null;
            else return this.npcs.find(n => n.id === this.deletingNPCID)
        }
    },
    methods: {
        deleteNPC(id) {
            this.$store.commit('npcDesigner/delete', id);
            this.deleteDialog = false;
            this.deletingNPCID = null;
        }
    }
}
</script>

<style>
.file-list > .flex {
    flex-grow: 0;
    padding: 7px !important;
}
.more-list .v-list__tile {
    font-size: 13px !important;
}
</style>
