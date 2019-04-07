<template>
    <v-app id="app">
        <router-view></router-view>
    </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "compcon",
    components: {}
});
</script>

<style>
html {
    scroll-behavior: smooth;
}
</style>

