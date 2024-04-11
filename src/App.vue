<script lang="ts">
import AnimationListComp from './components/AnimationListComp.vue';
import UploadComp from './components/UploadComp.vue';

export default {
  components: {
    AnimationListComp,
    UploadComp
  },
  data() {
    return {
      isUploadModalOpen: false
    };
  },
  methods: {
    openUploadModal() {
      this.isUploadModalOpen = true;
    },
    closeUploadModal() {
      this.isUploadModalOpen = false;
    },
    async refreshAnimList() {
      await (this.$refs.animList as any).fetchAnimations();
    }
  }
};
</script>

<template>
  <div>
    <header>
      <nav class="navbar">
        <h1 class="navbar-title">Pulseframe Control Panel</h1>
        <button class="btn navbar-button" @click="openUploadModal">Upload</button>
      </nav>
    </header>
    <div>
      <AnimationListComp ref="animList" style="padding-top: 20px;" />
    </div>
  </div>

  <UploadComp v-show="isUploadModalOpen" @close="closeUploadModal" @refresh="refreshAnimList" />
</template>

<style scoped>
header {
  background-color: rgb(32, 52, 52);
  border-radius: 10px;
  padding: 10px;
}

.navbar {
  display: flex;
  justify-content: space-between;
  padding: 5px 30px;
}

.navbar-title {
  display: inline-block;
  color: white;
  font-size: 32px;
}

.navbar-button {
  display: inline-block;
}
</style>
