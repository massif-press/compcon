<template>
    <v-container fluid>
        <v-layout align-center>
            <h3 class="headline text-xs-left ml-2 grey--text text--darken-1">
                Choose encounter to run
            </h3>
            <v-flex ml-auto style="padding: 7px; flex-grow: 0;">
                <!-- <add-button text="New Encounter" to="/encounter-runner/new" /> -->
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
                md4
            >
                <File
                    :name="encounter.name"
                    icon="mdi-account-group"
                    more
                    @click.native="onRunEncounter(encounter)"
                >
                    <template v-slot:extra-icons> </template>
                </File>
            </v-flex>
        </v-slide-y-transition>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import EncounterBase from '../../logic/EncounterBase';
import { namespace } from 'vuex-class';
// components
import File from "../../components/File.vue";
import ActiveEncounter from '../../logic/ActiveEncounter';

const encounterBuilder = namespace('encounterBuilder')
const encounterRunner = namespace('encounterRunner')

@Component({
    components: { File }
})
export default class EncounterRunnerList extends Vue {
    @encounterBuilder.State encounters!: EncounterBase[];
    @encounterRunner.Action('runEncounter') runEncounter!: (enc: EncounterBase) => Promise<ActiveEncounter>;

    onRunEncounter(enc: EncounterBase) {
        this.runEncounter(enc).then(activeEnc => this.$router.replace(`/encounter-runner/${activeEnc.id}`));
    }
}
</script>