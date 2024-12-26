<script>
import { ref, watch } from "vue";
import { useFetchApiCrud } from "../utils/FetchCrud";
// Importer la bibliothèque d'emojis
import "emoji-picker-element";

export default {
  name: "CreatePostForm",
  setup() {
    const postContent = ref("");
    const userProfilePicture = ref("/assets/default_profile.jpg"); // Image de profil par défaut
    const selectedImage = ref(null);
    const showEmojiPicker = ref(false);

    const { read } = useFetchApiCrud("/api/users");

    // Récupérer les données utilisateur
    const fetchUserData = () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo?.id;
      const token = localStorage.getItem("jwt");

      if (!userId || !token) {
        console.error("Utilisateur non connecté ou token manquant !");
        userProfilePicture.value = "/assets/default_profile.jpg";
        return;
      }

      const { data } = read(userId, {
        Authorization: `Bearer ${token}`,
      });

      // Surveiller les données et les appliquer au profil
      watch(
        data,
        (newData) => {
          userProfilePicture.value =
            newData?.profile_picture || "/assets/default_profile.jpg";
          console.log("Données utilisateur récupérées :", newData);
        },
        { immediate: true }
      );
    };

    // Charger les données utilisateur au montage
    fetchUserData();

    // Retourner les données et méthodes pour l'utilisation dans le template
    return {
      postContent,
      userProfilePicture,
      selectedImage,
      showEmojiPicker,
    };
  },
  methods: {
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
