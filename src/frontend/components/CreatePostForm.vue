<script>
import { ref, onMounted } from "vue";
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

    const { read, create } = useFetchApiCrud("/api/users");

    // Récupérer les données utilisateur
    const fetchUserData = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo?.id;
      const token = localStorage.getItem("jwt");

      if (!userId || !token) {
        console.error("Utilisateur non connecté ou token manquant !");
        userProfilePicture.value = "/assets/default_profile.jpg";
        return;
      }

      try {
        const response = await read(userId, {
          Authorization: `Bearer ${token}`,
        });

        userProfilePicture.value =
          response?.profile_picture || "/assets/default_profile.jpg";
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
      }
    };

    // Charger les données utilisateur au montage
    onMounted(fetchUserData);

    // Fonction pour soumettre un post
    const submitPost = async () => {
      if (!postContent.value.trim() && !selectedImage.value) {
        alert("Veuillez écrire un message ou sélectionner une image avant de poster !");
        return;
      }

      const token = localStorage.getItem("jwt");
      const { create } = useFetchApiCrud("/api/posts");

      try {
        if (selectedImage.value) {
          const formData = new FormData();
          formData.append("content", postContent.value.trim());
          formData.append("media_uri", selectedImage.value);

          await create(formData, {
            Authorization: `Bearer ${token}`,
          });
        } else {
          await create(
            {
              content: postContent.value.trim(),
            },
            {
              Authorization: `Bearer ${token}`,
            }
          );
        }

        alert("Votre post a été publié !");
        postContent.value = "";
        selectedImage.value = null;
      } catch (error) {
        console.error("Erreur lors de la création du post :", error);
        alert("Erreur lors de la création du post !");
      }
    };

    return {
      postContent,
      userProfilePicture,
      selectedImage,
      showEmojiPicker,
      submitPost,
      toggleEmojiPicker: () => (showEmojiPicker.value = !showEmojiPicker.value),
      addEmoji: (event) => {
        const emoji = event.detail.unicode;
        postContent.value += emoji;
        showEmojiPicker.value = false;
      },
      selectImage: (event) => {
        const file = event.target.files[0];
        if (file) {
          selectedImage.value = file;
          alert(`Image sélectionnée : ${file.name}`);
        }
      },
    };
  },
};
</script>

<template>
  <div class="create-post-form">
    <img :src="userProfilePicture" alt="Profile" class="profile-pic" />
    <div class="form-content">
      <textarea v-model="postContent" placeholder="Quoi de neuf ?!" maxlength="300"></textarea>
      <div class="actions">
        <div class="left-actions">
          <!-- Bouton d'ajout d'image -->
          <button>
            <label for="image-upload" class="material-icons">image</label>
            <input type="file" id="image-upload" @change="selectImage" style="display: none" />
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
    <emoji-picker v-if="showEmojiPicker" @emoji-click="addEmoji"
      style="position: absolute; bottom: 70px; left: 10px; z-index: 1000;"></emoji-picker>
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
  background-color: #f0f0f0;
  border: none;
  border-radius: 20px;
  padding: 10px;
  resize: none;
  font-size: 14px;
  outline: none;
  color: #4a4a4a;
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
  color: #D1B7FF;
}

.send-button {
  background-color: #D1B7FF;
  border: none;
  border-radius: 35%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 30px;
  padding: 0;
}

.send-button .material-icons {
  font-size: 20px;
  color: white;
}

button span.material-icons {
  font-size: 20px;
}
</style>
