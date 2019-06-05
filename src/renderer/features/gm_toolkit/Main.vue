<template>
    <v-app id="app" style="padding: 0 !important;">
        <v-toolbar color="primary" dark flat app fixed clipped-left>
            <v-toolbar-side-icon key="back" @click.stop="hitSideIcon">
                <transition name="spin">
                    <v-icon v-if="backButton" key="back">mdi-arrow-left</v-icon>
                    <v-icon v-else-if="!drawer" key="menu">mdi-menu</v-icon>
                    <v-icon v-else key="x">mdi-close</v-icon>
                </transition>
            </v-toolbar-side-icon>
            <v-toolbar-title class="font-weight-light">
                <v-fade-transition mode="out-in">
                    <span :key="$route.name">
                        {{ titles[$route.name] }}
                    </span>
                </v-fade-transition>
            </v-toolbar-title>
        </v-toolbar>
        <v-navigation-drawer
            v-model="drawer"
            app
            clipped
            disable-resize-watcher
        >
            <v-list>
                <v-list-tile to="/" active-class="secondary--text">
                    <v-list-tile-action class="pl-2">
                        <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Home</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider />
                <v-list-tile to="/npc-designer" active-class="secondary--text">
                    <v-list-tile-action class="pl-2">
                        <v-icon>mdi-account-edit</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>NPC Designer</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                    to="/encounter-builder"
                    active-class="secondary--text"
                >
                    <v-list-tile-action class="pl-2">
                        <v-icon>mdi-account-multiple-plus</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Encounter Builder</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                    to="/encounter-runner"
                    active-class="secondary--text"
                >
                    <v-list-tile-action class="pl-2">
                        <v-icon>mdi-account-group</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Encounter Runner</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider />
                <v-list-tile to="/about" active-class="secondary--text">
                    <v-list-tile-action class="pl-2">
                        <v-icon>mdi-information</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>About</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <v-container bg fill-height grid-list-md text-xs-center>
            <v-layout row wrap justify-center>
                <v-flex pa-0>
                    <v-fade-transition mode="out-in">
                        <router-view class="py-5" />
                    </v-fade-transition>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>

<script>
export default {
    data: () => ({
        drawer: false,
        titles: {
            'home': 'NPC Toolkit',
            'npc-designer': 'NPC Designer',
            'home': 'NPC Toolkit',
        }
    }),
    computed: {
        backButton() {
            return !(['home', 'npc-list', 'encounter-builder', 'encounter-runner-list', 'about'].includes(this.$route.name))
        }
    },
    methods: {
        hitSideIcon() {
            if (this.backButton) {
                this.$router.go(-1)
            } else {
                this.drawer = !this.drawer
            }
        }
    },
    watch: {
        backButton() {
            if (this.backButton) this.drawer = false;
        }
    }
}
</script>

<style>
.v-toolbar {
    z-index: 11;
}
.v-card {
  box-shadow: none;
  border: 1px solid !important;
}
.v-dialog .v-card, .v-select-list {
    border: none !important;
}
.spin-enter-active, .spin-leave-active {
  transition: all 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
  position: absolute;
}
.spin-leave-to {
  transform: rotate(-90deg);
}
.spin-enter {
  transform: rotate(90deg);
}
.spin-enter, .spin-leave-to {
  opacity: 0;
}
.grow-shrink-0 > * {
    flex-grow: 0 !important;
    flex-shrink: 0 !important;
}
</style>
