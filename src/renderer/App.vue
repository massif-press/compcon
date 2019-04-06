<template>
    <v-app id="app">
        <router-view></router-view>
    </v-app>
</template>

<script>
import Vue from "vue";

console.log("hell2");

export default {
    name: "compcon",
    components: {},
    created() {
        console.log("hell");
    }
};
</script>

<style>
html {
    scroll-behavior: smooth;
}
</style>

