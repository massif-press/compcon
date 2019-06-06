<template>
    <v-container fluid>
        <!-- Header -->
        <v-layout align-center>
            <h3 class="headline text-xs-left ml-2 grey--text text--darken-1">
                Encounters
            </h3>
            <v-flex ml-auto style="padding: 7px; flex-grow: 0;">
                <add-button text="New Encounter" to="/encounter-builder/new" />
            </v-flex>
        </v-layout>
        <v-divider class="mb-3" />
        <v-slide-y-transition
            group
            tag="div"
            class="layout row wrap justify-start"
        >
            <v-flex
                v-for="encounter in encounters"
                :key="encounter.id"
                xs12
                sm6
                md2
            >
                <File
                    :name="encounter.name"
                    icon="mdi-account-multiple"
                    more
                    :to="`/encounter-builder/${encounter.id}`"
                >
                    <template v-slot:extra-icons>
                        <v-btn
                            icon
                            @click.stop="
                                deletingID = encounter.id;
                                deleteDialog = true;
                            "
                        >
                            <v-icon color="grey darken-1">delete</v-icon>
                        </v-btn>
                    </template>
                </File>
            </v-flex>
        </v-slide-y-transition>
        <v-dialog
            v-model="deleteDialog"
            v-if="deletingID !== null"
            persistent
            max-width="290"
        >
            <v-card>
                <v-card-title class="headline">Delete encounter?</v-card-title>
                <v-card-text>This cannot be undone.</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="secondary"
                        flat
                        @click="
                            deleteEncounter(deletingID);
                            deletingID = null;
                            deleteDialog = false;
                        "
                        >OK</v-btn
                    >
                    <v-btn
                        color="secondary"
                        flat
                        @click.stop="
                            deletingID = null;
                            deleteDialog = false;
                        "
                        >Cancel</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import EncounterBase from '../../logic/EncounterBase';
// components
import File from "../../components/File.vue";
import AddButton from "../../components/AddButton.vue";
import { mapState, mapMutations } from 'vuex';


export default Vue.extend({
    // @encounterBuilder.State encounters!: EncounterBase[];
    // @encounterBuilder.Mutation('delete') deleteEncounter!: (id: string) => void;
    name: 'encounters-list',
    components: { AddButton },
    data: () => ({
        deleteDialog: false,
        deletingID: null as null | string,
    }),
    computed: mapState({ encounters: 'encounterBuilder/encounters' }),
    methods: mapMutations({ deleteEncounter: 'encounterBuilder/delete' }),
});
</script>

<style>
.v-btn--icon .v-icon {
    margin: 0 auto;
}
</style>
