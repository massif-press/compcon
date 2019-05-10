<template>
    <div id="wrapper">
        <v-container fluid>
            <v-layout>
                <v-flex>
                    <h1 class="display-4">COMP/CON</h1>
                </v-flex>
            </v-layout>
            <v-layout>
                <v-flex>
                    <h3 class="display-1 grey--text">&emsp; A digital toolset for the LANCER TTRPG</h3>
                </v-flex>
            </v-layout>
        </v-container>

        <v-container>
            <v-layout style="height: 100%" align-v="center" class="mt-5">
                <v-flex>
                    <v-btn block color="primary" large to="/pilot_management">Pilot Roster</v-btn>
                </v-flex>
                <v-flex>
                    <v-btn block color="primary" large to="/compendium">COMPENDIUM</v-btn>
                </v-flex>
                <v-flex>
                    <v-tooltip bottom>
                        <v-btn slot="activator" block large :to="'/mods'" disabled>Mod Editor</v-btn>
                        <span>WIP</span>
                    </v-tooltip>
                </v-flex>
                <v-flex>
                    <v-tooltip bottom>
                        <v-btn slot="activator" block large :to="'/gm'" disabled>GM Toolkit</v-btn>
                        <span>WIP</span>
                    </v-tooltip>
                </v-flex>
            </v-layout>

            <v-divider/>
            <v-layout>
                <v-flex>
                    <v-card>
                        <v-card-title class="title">
                            Update MM/DD/YYYY
                            <span class="caption">(v0.2.1)</span>
                        </v-card-title>
                        <v-card-text>notes, links, etc</v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>

        <v-footer fixed>
            <span href="#">&emsp;v. {{ ver }}</span>
            <v-spacer/>
            <v-btn flat small disabled>About</v-btn>
            <v-btn flat small disabled>Help</v-btn>
            <v-btn color="warning" small disabled>Support This Project</v-btn>
        </v-footer>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "landing-page",
    data: () => ({
        ver: "0"
    }),
    created: function() {
        const packageVersion = process.env.npm_package_version;
        if (packageVersion) this.ver = packageVersion;
    }
});
</script>

<style scoped>
#wrapper {
    width: 100%;
    height: 100vh;

    background: radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, 0.9) 100%
    );
}
</style>

<style>
body {
    overflow: hidden;
}
/* width */
::-webkit-scrollbar {
    width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0);
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #888;
}
</style>