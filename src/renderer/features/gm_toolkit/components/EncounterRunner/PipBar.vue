<template>
    <div>
        <v-layout
            grow-shrink-0
            align-center
            class="text-xs-left text-uppercase body-2"
        >
            <v-flex>{{ label }} {{ value }}/{{ max }}</v-flex>
            <v-flex ml-0 class="primary--text">
                <v-fade-transition leave-absolute>
                    <v-btn
                        style="color: currentColor !important"
                        class="text--darken-1"
                        icon
                        small
                        @click="startInputting"
                        v-if="!inputting"
                    >
                        <v-icon>mdi-keyboard</v-icon>
                    </v-btn>
                    <div v-else>
                        <input
                            type="text"
                            class="pipinput"
                            ref="pipinput"
                            :value="myInput"
                            @input="onInputChange"
                            @keyup.enter="sendInput"
                            @blur="cancelInput"
                            @keyup.escape="cancelInput"
                        />
                    </div>
                </v-fade-transition>
            </v-flex>
        </v-layout>
        <v-rating
            class="pipbar"
            :value="value"
            @input="v => $emit('input', v)"
            :length="max"
            empty-icon="mdi-circle-outline"
            full-icon="mdi-circle"
            background-color="primary"
            hover
            clearable
            :ripple="false"
            dense
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({

})
export default class PipBar extends Vue {
    @Prop(String) label!: string;
    @Prop({type: Number, required: true}) value!: number;
    @Prop(Number) max!: number;
    @Prop({type: Boolean, default: false}) rollover!: boolean;
    @Prop({type: Boolean, default: false}) rolloverNegative!: boolean;

    inputting = false;
    myInput = '';

    startInputting() {
        this.inputting = true;
        this.$nextTick(() => {
            (this.$refs.pipinput as HTMLInputElement).focus()
        })
    }
    sendInput() {
        const thisInput = this.myInput;
        if (!thisInput.match(/\d/)) return;

        this.inputting = false;

        let preResult = this.value;

        if (thisInput === '') return;
        else if (thisInput.startsWith('+')) {
            preResult += parseInt(thisInput.substr(1))
        } else if (thisInput.startsWith('-')) {
            preResult -= parseInt(thisInput.substr(1))
        } else {
            preResult = parseInt(thisInput)
        }

        if (this.rollover && this.rolloverNegative) {
            while (preResult >= this.max) {
                preResult = preResult - this.max;
                this.$emit('rollover')
            }
        }
        else preResult = Math.min(preResult, this.max);

        if (this.rollover && !this.rolloverNegative) {
            while (preResult < 1) {
                preResult = this.max + preResult;
                this.$emit('rollover')
            }
        } else {
            preResult = Math.max(0, preResult);
        }

        this.$emit('input', preResult);
        this.myInput = '';
    }
    cancelInput() {
        this.inputting = false;
        this.myInput = '';
    }

    onInputChange(e: any) {
        const newVal = e.target.value;
        if (newVal.match(/^[+-\d]\d*$/) || newVal === '') this.myInput = newVal;
        else e.target.value = this.myInput;
    }

}
</script>

<style>
.pipbar {
    display: flex;
    flex-wrap: wrap;
}
.pipbar .v-icon {
    padding: 0px 0px !important;
}
.pipbar .v-icon .v-ripple__container {
    width: 32px !important;
    height: 28px !important;
    left: -1px !important;
}
.pipinput {
    height: 28px;
    margin: 6px 8px;
    font-weight: bold;
}
.pipinput:focus {
    outline: none;
}
</style>
