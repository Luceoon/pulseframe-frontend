<script lang="ts">
import * as api from '../api';
import type { Anim } from '../model';

export default {
    props: {
        anim: {
            type: Object as () => Anim,
            required: true
        }
    },
    data() {
        return {
            imageUrl: "",
            isDeleting: false,
            deletePrompt: false
        };
    },
    mounted() {
        this.imageUrl = api.getImageUrl(this.anim.filename);
    },
    watch: {
        'anim.active': {
            handler(newValue: boolean, oldValue: boolean) {
                if (this.isDeleting)
                    return;

                if (newValue === oldValue)
                    return;


                console.log(`Animation with id ${this.anim.id} changed to ${this.anim.active ? 'active' : 'inactive'}`);
                this.updateAnim();
            }
        },
        'anim.loop': {
            handler(newValue: boolean, oldValue: boolean) {
                if (this.isDeleting)
                    return;

                if (newValue === oldValue)
                    return;


                console.log(`Animation with id ${this.anim.id} changed to ${this.anim.loop ? 'looping' : 'not looping'}`);
                this.updateAnim();
            }
        }
    },
    methods: {
        async removeAnim() {
            this.isDeleting = true;
            
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const success = await api.deleteAnim(this.anim.id);

            console.log(`Animation with id ${this.anim.id} from deleted ${success ? 'successfully' : 'unsuccessfully'}`);
            this.$emit('refresh');
        },
        async updateAnim() {
            console.log(`Pushing animation updates with id ${this.anim.id}`);
            const res = await api.updateAnim(this.anim.id, this.anim);

            if (!res)
                console.error(`Error while updating animation with id ${this.anim.id}`);
            else
                console.log(`Updates pushed successfully`);
        },
        saveDuration() {
            if (this.isDeleting)
                    return;

            console.log(`Duration of animation with id ${this.anim.id} changed to ${this.anim.duration}`);
            this.updateAnim();
        }
    }
};
</script>

<template>
    <li class="anim-item" v-bind:class="{ deleting: isDeleting }">
        <img :src="imageUrl" alt="GIF" class="anim-image" />
        <span class="anim-title">{{ anim.name }}</span>
        <span v-if="isDeleting" class="anim-options">Deleting</span>
        <span v-else-if="deletePrompt" class="anim-options">
            <span>This animation will be removed permanently. Do you want to proceed?</span>
            <span>
                <button class="sbtn sbtn-red" @click="removeAnim()">Yes</button>
                <button class="sbtn" @click="deletePrompt = false">No</button>
            </span>
        </span>
        <span v-else class="anim-options">
            <span>Duration
            <input type="number" v-model="anim.duration" @blur="saveDuration()"></span>
            <span>Loop
            <input type="checkbox" v-model="anim.loop"></span>
            <span>Active
            <input type="checkbox" v-model="anim.active"></span>
            <span>
                <i class="fas fa-trash remove-icon" @click="deletePrompt = true"></i>
            </span>
        </span>
    </li>
</template>

<style scoped>
.anim-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    background-color: darkslategray;
    border-radius: 10px;
    padding: 5px;
    transition: 1s;
}

.anim-image {
    width: 140px;
    height: 70px;
    margin-right: 10px;
    image-rendering: crisp-edges;
}

.anim-title {
    margin-left: 20px;
    font-size: 24px;
}

.anim-options {
    margin-left: auto;
    margin-right: 20px;
    display: flex;
    align-items: center;
}

.anim-options span {
    margin-left: 18px;
}

.anim-options span input {
    margin-left: 8px;
    font-size: 18px;;
}

.sbtn {
    margin-left: 10px;
    width: 50px;
    transition: .5s;
}

.sbtn-red:hover {
    background-color: red;
}

.remove-icon {
    position: relative;
    font-size: 24px;
    color: rgb(231, 231, 231);
    cursor: pointer;
    transition: .2s;
    transform-origin: center;
}

.remove-icon:hover {
    color: red;
    font-size: 28px;
    transform: scale(1.2);
}

.deleting {
    background-color: red;
}

input[type=checkbox]
{
  -ms-transform: scale(1.5); /* IE */
  -moz-transform: scale(1.5); /* FF */
  -webkit-transform: scale(1.5); /* Safari and Chrome */
  -o-transform: scale(1.5); /* Opera */
  transform: scale(1.5);
  padding: 10px;
  margin: 10px;
}
</style>



