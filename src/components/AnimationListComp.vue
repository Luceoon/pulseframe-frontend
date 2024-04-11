<script lang="ts">
import AnimComp from './AnimComp.vue';
import * as api from '../api';
import type { Anim } from '../model';

export default {
    components: {
        AnimComp
    },
    data() {
        return {
            animations: Array<Anim>(),
            isLoading: true
        };
    },
    mounted() {
        this.fetchAnimations();
    },
    methods: {
        async fetchAnimations() {
            await api.fetchAllAnims().then((response) => {
                this.animations = response;
                this.isLoading = false;
                console.log(response);
            }).catch((error) => {
                console.error(error);
            });
        },
        async refresh() {
            await this.fetchAnimations();
        }
    }
};
</script>

<template>
    <div>
        <div v-if="isLoading">Loading...</div>
        <div v-else>
            <ul>
                <AnimComp v-for="animation in animations" :anim="animation" @refresh="refresh" />
            </ul>
        </div>
    </div>
</template>

<style scoped>
ul {
    list-style-type: none;
    padding: 10px;
}
</style>