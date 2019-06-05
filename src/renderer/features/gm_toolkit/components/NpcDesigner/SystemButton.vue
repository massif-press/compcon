<template>
    <div>
        <v-chip
            class="system-chip"
            v-ripple
            @click="dialog = true"
            label
            outline
            :color="`system--${system.type}`"
        >
            <v-icon left small>{{ icon }}</v-icon>
            {{ system.name }}
            <v-icon
                class="rightbtn"
                size="24"
                right
                v-if="closable"
                @click.stop="$emit('close')"
            >
                mdi-minus-box
            </v-icon>
            <v-icon
                class="rightbtn"
                size="24"
                right
                v-if="addable"
                @click.stop="$emit('add')"
            >
                mdi-plus-box
            </v-icon>
        </v-chip>
        <v-dialog v-model="dialog" max-width="40%">
            <system-dialog-card :npc="npc" :system="system" />
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { NPCSystem } from '../../logic/interfaces/NPCSystem';
import NPC from '../../logic/NPC';

import SystemDialogCard from '../SystemDialogCard.vue'


@Component({
    components: {SystemDialogCard}
})
export default class SystemButton extends Vue {
    @Prop(Object) readonly system!: NPCSystem.Any;
    @Prop(Object) readonly npc!: NPC;
    @Prop({default: false}) readonly closable!: boolean;
    @Prop({default: false}) readonly addable!: boolean;
    dialog = false;

    get icon(): string {
        switch (this.system.type) {
            case 'system':
                return 'mdi-settings'
                break;
            case 'trait':
                return 'mdi-account-circle'
                break;
            case 'weapon':
                return 'mdi-sword-cross'
                break;
        }
    }


}
</script>

<style>
.v-chip.system-chip {
    padding: 0.1em 0.5em;
    text-transform: uppercase;
    font-size: 0.85em;
}
.v-chip.system-chip * {
    cursor: pointer !important;
}
.v-chip.system-chip:focus {
    box-shadow: none !important;
}
.v-chip.system-chip:focus::after {
   display: none;
}

.v-chip .rightbtn:hover {
    opacity: 0.7 !important;
}

</style>
