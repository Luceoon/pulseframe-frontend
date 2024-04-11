<script lang="ts">
import * as api from "../api";

export default {
  data(): {
    name: string;
    file: File | null;
    isUploading: boolean;
    isValidating: boolean;
    errorMsg: string;
  } {
    return {
      name: "",
      file: null,
      isUploading: false,
      isValidating: false,
      errorMsg: ""
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    onFileChanged(event: any) {
      this.file = event.target.files[0];
    },
    onNameChanged(event: any) {
      this.name = event.target.value;
    },
    async validate(): Promise<boolean> {
            
      let valid = true;
      this.errorMsg = "";

      if (this.name == "") {
        this.errorMsg += "Name cannot be empty. ";
        valid = false;
      }
      else{
        const result = await api.validate(this.name);
        if (!result) {
          this.errorMsg += "Name already exists. ";
          valid = false;
        }
      }

      if (this.file == null) {
        this.errorMsg += "File cannot be empty. ";
        valid = false;
      }
      else if (this.file.type != "image/gif") {
        this.errorMsg += "File must be a GIF. ";
        valid = false;
      }
      else if (this.file.size > 1024 * 1024) {
        this.errorMsg += "File must be less than 1MB. ";
        valid = false;
      }

      return valid;
    },
    async upload() {

      this.isValidating = true;
      const valid = await this.validate();
      this.isValidating = false;

      if (!valid)
        return;

      this.isUploading = true;

      if (this.file == null)
        return;

      const result = await api.uploadAnim(this.name, this.file);

      if (!result) console.error("Error while uploading");

      this.isUploading = false;
      this.close();
      this.$emit("refresh");
    },
  },
};
</script>

<template>
  <div class="modal-backdrop">
    <div v-if="isUploading" class="modal">
      <header class="modal-header">
        <slot name="header">Uploading...</slot>
      </header>
    </div>
    <div v-else class="modal">
      <header class="modal-header">
        <slot name="header">Upload new animation</slot>
        <button type="button" class="btn-close" @click="close">x</button>
      </header>

      <section class="modal-body">
        <slot name="body">
          <div>
            <label class="modal-label" for="name">Name:</label>
            <input
              type="text"
              id="name"
              @change="onNameChanged"
            />
          </div>
          <div>
            <label class="modal-label" for="file">File:</label>
            <input type="file" accept=".gif" @change="onFileChanged" />
          </div>
        </slot>
        <slot name="error" v-if="errorMsg"><br><label  style="color: red !important;">{{ errorMsg }}</label></slot>
      </section>

      <footer class="modal-footer">
        <slot name="footer"> Supported Format: GIF (32x16 Pixels) </slot>
        <button
          type="button"
          class="btn"
          :disabled="isValidating"
          @click="upload"
        >Upload</button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #161616;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  color: #4aae9b;
  justify-content: space-between;
  font-size: 18px;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.modal-label {
  margin-bottom: 10px;
  width: 150px;
  text-align: left;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: #4aae9b;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4aae9b;
  border: 1px solid #4aae9b;
  border-radius: 2px;
}
</style>
