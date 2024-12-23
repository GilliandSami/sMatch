<script>
import { ref } from "vue";
import { useFetchApiCrud } from "../utils/FetchCrud";
// Importer la bibliothèque d'emojis
import "emoji-picker-element";

export default {
  name: "CreatePostForm",
  data() {
    return {
      postContent: "",
      userProfilePicture: null,
      selectedImage: null,
      showEmojiPicker: false, // Contrôle de la visibilité du sélecteur d'emojis
    };
  },
  methods: {
    async fetchUserData() {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo?.id;

      const token = localStorage.getItem("jwt");
      if (!token || !userId) {
        console.error("Utilisateur non connecté ou token manquant !");
        this.userProfilePicture = "/assets/default_profile.jpg";
        return;
      }

      const { read } = useFetchApiCrud("/api/users");

      try {
        const response = await read(userId, {
          Authorization: `Bearer ${token}`,
        });

        this.userProfilePicture =
          response.data.profile_picture || "/assets/default_profile.jpg";
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
        this.userProfilePicture = "/assets/default_profile.jpg";
      }
    },

    selectImage(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedImage = file;
        alert(`Image sélectionnée : ${file.name}`);
      }
    },

    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },

    addEmoji(event) {
      const emoji = event.detail.unicode;
      this.postContent += emoji;
      this.showEmojiPicker = false;
    },

    async submitPost() {
      if (!this.postContent.trim() && !this.selectedImage) {
        alert("Veuillez écrire un message ou sélectionner une image avant de poster !");
        return;
      }

      const token = localStorage.getItem("jwt");
      const { create } = useFetchApiCrud("/api/posts");

      try {
        if (this.selectedImage) {
          const formData = new FormData();
          formData.append("content", this.postContent.trim());
          formData.append("media_uri", this.selectedImage);

          await create(formData, {
            Authorization: `Bearer ${token}`,
          });
        } else {
          await create(
            {
              content: this.postContent.trim(),
            },
            {
              Authorization: `Bearer ${token}`,
            }
          );
        }

        alert("Votre post a été publié !");
        this.postContent = "";
        this.selectedImage = null;
      } catch (error) {
        console.error("Erreur lors de la création du post :", error);
        alert("Erreur lors de la création du post !");
      }
    },
  },

  mounted() {
    this.fetchUserData();
  },
};
</script>

<template>
  <div class="create-post-form">
    <img :src="userProfilePicture" alt="Profile" class="profile-pic" />
    <div class="form-content">
      <textarea
        v-model="postContent"
        placeholder="Quoi de neuf ?!"
        maxlength="300"
      ></textarea>
      <div class="actions">
        <div class="left-actions">
          <!-- Bouton d'ajout d'image -->
          <button>
            <label for="image-upload" class="material-icons">image</label>
            <input
              type="file"
              id="image-upload"
              @change="selectImage"
              style="display: none"
            />
          </button>
          <!-- Bouton d'ajout d'emojis -->
          <button @click="toggleEmojiPicker">
            <span class="material-icons">mood</span>
          </button>
        </div>
        <button class="send-button" @click="submitPost">
          <span class="material-icons">send</span>
        </button>
      </div>
    </div>

    <!-- Emoji Picker -->
    <emoji-picker
      v-if="showEmojiPicker"
      @emoji-click="addEmoji"
      style="position: absolute; bottom: 70px; left: 10px; z-index: 1000;"
    ></emoji-picker>
  </div>
</template>

<style scoped>
.create-post-form {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-start;
  padding: 10px;
  background-color: #fff;
  z-index: 100;
  border-bottom: 1px solid #ddd;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.form-content {
  flex-grow: 1;
}

textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 10px;
  resize: none;
  font-size: 14px;
  outline: none;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.left-actions {
  display: flex;
  gap: 5px;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 5px;
  color: gray;
}

.send-button {
  color: #a020f0;
}

button span.material-icons {
  font-size: 20px;
}
</style>
