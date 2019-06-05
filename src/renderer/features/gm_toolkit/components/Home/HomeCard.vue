<template>
    <v-card
        ripple
        :to="to"
        class="home-card"
        :class="`${color}--text text--darken-2`"
    >
        <div class="justify-center pb-0 ">
            <h3 class="headline">
                {{ title }}
            </h3>
        </div>
        <v-icon
            size="96"
            class="py-md-5"
            v-show="$vuetify.breakpoint.mdAndUp"
            :color="color"
            style="opacity: 0.54"
            >{{ icon }}</v-icon
        >
        <div class="pt-0 grey--text text--darken-1">
            {{ text }}
        </div>
    </v-card>
</template>

<script>
export default {
    props: {
        to: { type: String, required: true },
        title: { type: String, required: true },
        icon: { type: String, required: true },
        text: { type: String, required: true },
        color: { type: String, default: 'secondary' },
    }
}
</script>

<style scoped>
    .home-card {
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 1em 2em;
        background-color: transparent !important;
    }

    @media screen and (min-width: 960px) {
        .home-card {
            height: 340px;
        }
    }

</style>
