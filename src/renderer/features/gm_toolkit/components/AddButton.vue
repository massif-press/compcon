<template>
    <File class="add-button" :name="text" icon="add" :to="to" />
</template>

<script>
import File from './File'

export default {
    components: { File },
    props: { text: { type: String, required: true }, to: { type: String } }
}
</script>

<style scoped>
.file-btn {
    border: none !important;
}
.file-btn .file-btn-text {
    margin-top: 10px !important;
}
</style>
