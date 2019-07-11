<template>
    <v-card
        class="primary--text"
        style="max-height: 250px; overflow-y: hidden; cursor: default;"
        height="100%"
    >
        <v-card-title :class="`primary white--text`" class="feature-name">
            {{ feature.name }}
        </v-card-title>
        <v-card-text class="primary--text" style="overflow-y: hidden;">
            {{ feature.description }}
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: 'feature-card',
    props: { feature: { type: Object, required: true } }
}
</script>

<style scoped>
.feature-name {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    text-transform: uppercase;
    font-size: 0.9em;
    padding: 0.8em;
    justify-content: center;
    white-space: nowrap;
}
</style>
