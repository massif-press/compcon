<template>
    <v-container fluid>
        <v-layout align-center>
            <h3 class="headline text-xs-left ml-2 grey--text text--darken-1">
                Active Encounters
            </h3>
            <v-flex ml-auto style="padding: 7px; flex-grow: 0;">
                <add-button
                    text="Run New Encounter"
                    to="/encounter-runner/new"
                />
            </v-flex>
        </v-layout>
        <v-divider class="mb-3" />
        <v-slide-y-transition
            group
            tag="div"
            class="layout row wrap justify-start"
        >
            <v-flex
                v-for="encounter in activeEncounters"
                :key="encounter.id"
                xs12
                sm6
                md2
            >
                <File
                    :name="encounter.name"
                    icon="mdi-account-group"
                    more
                    :to="`/encounter-runner/${encounter.id}`"
                    color="orange"
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
import ActiveEncounter from '../../logic/ActiveEncounter'
// components
import File from "../../components/File.vue";
import AddButton from "../../components/AddButton.vue";
import { mapState, mapMutations } from 'vuex';

export default Vue.extend({
    name: 'encounter-runner-list',
    components: { File, AddButton },
    data: () => ({
        deleteDialog: false,
        deletingID: null as string | null,
    }),
    computed: mapState('encounterRunner', ['activeEncounters']),
    methods: mapMutations('encounterRunner', { 'delete': 'deleteEncounter' }),
})
</script>