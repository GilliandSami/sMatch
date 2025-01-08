<script>
import { ref } from "vue";
import { useFetchApiCrud } from "../utils/FetchCrud";
import { useAuth } from "../utils/authUtils"; // Importez useAuth
import { useRouter } from "vue-router"; // Importer le routeur pour redirection

export default {
  name: "AccountInformation",
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { read, update, followUser, unfollowUser } = useFetchApiCrud("/api/users");
    const { readAll } = useFetchApiCrud("/api/posts");
    const userInfo = ref({});
    const isAuthenticatedUser = ref(false);
    const isEditing = ref(false);
    const isFollowing = ref(false);
    const selectedImage = ref(null);
    const postsCount = ref(0);
    const router = useRouter();

    const { logout } = useAuth(); // Instanciez useAuth pour accéder à logout

    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const user = await read(props.userId, { Authorization: `Bearer ${token}` });
        userInfo.value = user;

        const authUserId = JSON.parse(localStorage.getItem("userInfo")).id;
        isAuthenticatedUser.value = authUserId === props.userId;

        if (!isAuthenticatedUser.value) {
          isFollowing.value = user.followers?.some((followerId) => followerId === authUserId);
        }

        const posts = await readAll({ userId: props.userId }, { Authorization: `Bearer ${token}` });
        postsCount.value = posts.length;
      } catch (error) {
        console.error("Erreur lors du chargement des informations utilisateur :", error);
      }
    };

    const toggleFollow = async () => {
      try {
        const token = localStorage.getItem("jwt");

        if (isFollowing.value) {
          await unfollowUser(props.userId, { Authorization: `Bearer ${token}` });
          isFollowing.value = false;
        } else {
          await followUser(props.userId, { Authorization: `Bearer ${token}` });
          isFollowing.value = true;
        }
      } catch (error) {
        console.error("Erreur lors du suivi/désabonnement :", error);
      }
    };

    const saveChanges = async () => {
      try {
        const token = localStorage.getItem("jwt");

        const updateData = {
          username: userInfo.value.username,
          bio: userInfo.value.bio,
        };

        console.log("Données envoyées à l'API :", updateData);

        await update(props.userId, updateData, {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        });

        isEditing.value = false;
        await fetchUserInfo();
        alert("Modifications enregistrées !");
      } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        alert("Erreur lors de la mise à jour des informations.");
      }
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        selectedImage.value = file;
      }
    };

    const handleLogout = () => {
      logout(); // Appeler la fonction logout
      router.push("/"); // Rediriger vers la page de connexion
    };

    fetchUserInfo();

    return {
      userInfo,
      isAuthenticatedUser,
      isEditing,
      isFollowing,
      postsCount,
      toggleFollow,
      saveChanges,
      fetchUserInfo,
      handleImageChange,
      handleLogout,
    };
  },
};
</script>

<template>
  <div class="account-information">
    <div class="header">
      <h2>
        <textarea
          v-if="isEditing"
          v-model="userInfo.username"
          class="username-edit"
          placeholder="Modifier le pseudo"
        ></textarea>
        <span v-else>{{ userInfo.username }}</span>
      </h2>
      <div class="actions">
        <div class="button-group">
          <button
            v-if="isAuthenticatedUser"
            class="logout-button"
            @click="handleLogout"
          >
            <span class="material-icons">logout</span>
          </button>
          <button
            v-if="isAuthenticatedUser"
            class="action-button"
            :class="{ edit: isEditing }"
            @click="isEditing ? saveChanges() : (isEditing = true)"
          >
            {{ isEditing ? "Terminer" : "Modifier" }}
          </button>
          <button
            v-else
            class="action-button follow"
            @click="toggleFollow"
          >
            {{ isFollowing ? "Break-up" : "Smatcher" }}
          </button>
        </div>
      </div>
    </div>

    <div class="profile">
      <div class="profile-picture">
        <label v-if="isEditing" class="edit-overlay">
          <span class="material-icons file-upload">photo_camera</span>
          <input type="file" @change="handleImageChange" />
        </label>
        <img :src="userInfo.profile_picture || '/assets/default_profile.jpg'" alt="Photo de profil" />
      </div>
      <div class="stats">
        <div>
          <h3>{{ postsCount }}</h3>
          <p>Posts</p>
        </div>
        <div>
          <h3>{{ userInfo.following?.length || 0 }}</h3>
          <p>sMatchs</p>
        </div>
        <div>
          <h3>{{ userInfo.followers?.length || 0 }}</h3>
          <p>Followers</p>
        </div>
      </div>
    </div>

    <div class="description">
      <p v-if="!isEditing">{{ userInfo.bio || "Viens me Smatcher !" }}</p>
      <textarea v-else v-model="userInfo.bio" class="description-edit" placeholder="Modifier la description"></textarea>
    </div>
  </div>
</template>

<style scoped>
/* Général */
.account-information {
  background: white;
  color: #000;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.username-edit {
  font-size: 1.5em;
  font-weight: bold;
  border: none;
  background: #f0f0f0;
  padding: 5px;
  outline: none;
  border-radius: 5px;
  width: 100%;
}

/* Conteneur pour aligner les boutons */
.actions {
  display: flex;
  align-items: center;
}

/* Groupe de boutons alignés */
.button-group {
  display: flex;
  align-items: center;
  gap: 10px; /* Espacement entre les boutons */
}

/* Boutons d'action */
.action-button {
  font-size: 14px;
  font-weight: bold;
  padding: 10px 15px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
  outline: none;
}

/* Bouton "Modifier" */
.action-button.edit {
  background-color: #ff6c19;
  color: white;
  box-shadow: 0px 4px 6px rgba(255, 108, 25, 0.3);
}

.action-button.edit:hover {
  background-color: #ff8145;
  box-shadow: 0px 6px 8px rgba(255, 108, 25, 0.4);
}

/* Bouton "Smatcher" */
.action-button.follow {
  background-color: #4caf50;
  color: white;
  box-shadow: 0px 4px 6px rgba(76, 175, 80, 0.3);
}

.action-button.follow:hover {
  background-color: #66bb6a;
  box-shadow: 0px 6px 8px rgba(76, 175, 80, 0.4);
}

/* Bouton "Break-up" */
.action-button.follow.breakup {
  background-color: #f44336;
  color: white;
  box-shadow: 0px 4px 6px rgba(244, 67, 54, 0.3);
}

.action-button.follow.breakup:hover {
  background-color: #e57373;
  box-shadow: 0px 6px 8px rgba(244, 67, 54, 0.4);
}

/* Bouton Déconnexion */
.logout-button {
  width: 40px;
  height: 40px;
  border: none;
  margin-right: 10px;
  border-radius: 50%;
  background-color: #ffccd5; /* Rouge pâle */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.logout-button:hover {
  background-color: #ffadb8; /* Rouge un peu plus foncé */
  box-shadow: 0px 4px 6px rgba(255, 108, 108, 0.3);
}

.logout-button span.material-icons {
  color: #f44336; /* Rouge */
  font-size: 20px;
}

/* Profile */
.profile {
  display: flex;
  align-items: center;
}

.profile-picture {
  position: relative;
  width: 70px;
  height: 70px;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.profile-picture .edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.profile-picture .edit-overlay .file-upload {
  color: white;
  font-size: 24px;
}

.profile-picture .edit-overlay input[type="file"] {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

/* Stats */
.stats {
  display: flex;
  gap: 30px;
  margin-left: 80px;
}

.stats div {
  text-align: center;
}

.stats h3 {
  color: #000;
}

.stats p {
  color: #666;
}

/* Description */
.description {
  margin-top: 20px;
  color: #000;
}

.description-edit {
  width: 100%;
  border: none;
  resize: none;
  font-size: 16px;
  background: #f0f0f0;
  padding: 5px;
  border-radius: 5px;
}
</style>

