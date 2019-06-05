<template>
    <div class="recharge d-flex align-center justify-content-end ">
        <div @click.stop>
            <v-checkbox
                color="secondary"
                :value="charged"
                @click.stop="charged = !charged"
            />
        </div>
        <div class="mx-1 caption">
            {{ charged ? 'Charged' : 'Charging' }} ({{ value }}+)
        </div>
        <v-fab-transition>
            <v-icon key="charged" color="primary" v-if="charged"
                >mdi-history</v-icon
            >
            <v-btn
                class="mx-0"
                icon
                small
                v-else
                key="recharging"
                @click.stop="roll"
            >
                <v-icon
                    ref="die"
                    :class="{ failed: failedAnim }"
                    @animationend="failedAnim = false"
                    color="primary"
                    >mdi-dice-d6</v-icon
                >
            </v-btn>
        </v-fab-transition>
        <span
            class="last"
            :class="{ floating: floating }"
            @animationend="floating = false"
            >{{ last }}{{ !failed ? '!' : '' }}</span
        >
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'recharge',
    data: () => ({
        charged: false,
        failed: false,
        failedAnim: false,
        last: 0,
        floating: false,
    }),
    props: { value: { type: Number, required: true }, digital: { type: Boolean, default: true } },
    mounted() {
        this.charged = this.digital
    },
    methods: {
        roll() {
            this.failed = false;
            const result = Math.floor(Math.random() * 6) + 1;
            if (result >= this.value) {
                this.charged = true;
            } else {
                this.$nextTick(() => {this.failed = true; this.failedAnim = true;})
            }
            this.last = result;
            this.$nextTick(() => {this.floating = true})
        }
    }
})
</script>

<style scoped>
.recharge {
    height: 24px;
    font-weight: bold;
}
.failed {
    animation-name: shake-rotate;
    animation-duration: 500ms;
    animation-timing-function: ease-in;
}
@keyframes shake-rotate {
    0% {
        color: red;
        transform: rotate(-30deg)
    }
    25% {
        transform: rotate(30deg)
    }
    50% {
            transform: rotate(-15deg)
    }
    75% {
        transform: rotate(15deg)
    }
    100% {
        color: inherit;
    }
}
.last {
    position: relative;
    right: 15px;
    opacity: 0;
    pointer-events: none;
}
.last.floating {
    animation-name: resultfloat;
    animation-duration: 500ms;
    animation-timing-function: ease-out;
}
@keyframes resultfloat {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        transform: translateY(-2em);
    }
}
</style>
