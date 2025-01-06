<script>
import { useFetchApiCrud } from "../utils/FetchCrud";
import { useRouter } from "vue-router";

export default {
  name: "Card",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isFollowing: false, // État pour savoir si l'utilisateur authentifié suit l'utilisateur affiché
    };
  },
  setup() {
    const { followUser, unfollowUser } = useFetchApiCrud("/api/users");
    const router = useRouter();

    return {
      followUser,
      unfollowUser,
      router,
    };
  },
  methods: {
    async toggleFollow(event) {
      // Empêcher la propagation du clic sur la carte
      event.stopPropagation();

      const token = localStorage.getItem("jwt");
      try {
        if (this.isFollowing) {
          // Unfollow l'utilisateur
          await this.unfollowUser(this.user._id, {
            Authorization: `Bearer ${token}`,
          });
          this.isFollowing = false; // Mettre à jour l'état après la réussite
        } else {
          // Follow l'utilisateur
          await this.followUser(this.user._id, {
            Authorization: `Bearer ${token}`,
          });
          this.isFollowing = true; // Mettre à jour l'état après la réussite
        }
      } catch (error) {
        console.error("Erreur lors du suivi/désabonnement :", error);
      }
    },
    checkIfFollowing() {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.isFollowing = this.user.followers?.some(
        (followerId) => followerId === userInfo.id
      );
    },
    navigateToProfile() {
      // Navigation vers la page du profil de l'utilisateur
      this.router.push(`/profile/${this.user._id}`);
    },
  },
  mounted() {
    this.checkIfFollowing();
  },
};
</script>

<template>
  <div class="card" @click="navigateToProfile">
    <!-- Bouton suivre/désabonner -->
    <button
      class="follow-btn"
      :class="{ following: isFollowing }"
      @click="toggleFollow"
    >
      <span class="material-icons">{{ isFollowing ? "remove" : "add" }}</span>
    </button>

    <!-- Photo de profil -->
    <img
      :src="user.profile_picture || '/assets/default_profile.jpg'"
      alt="Photo de profil"
      class="profile-pic"
    />

    <!-- Nom et description de l'utilisateur -->
    <div class="user-info">
      <h4>{{ user.username }}</h4>
      <p>{{ user.bio || "Viens me Smatcher !" }}</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  width: 160px; /* Ajusté pour une forme plus carrée */
  height: 160px; /* Ajusté pour une forme plus carrée */
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  text-align: center;
  overflow: hidden;
  cursor: pointer; /* Permet de montrer que la carte est cliquable */
}

.profile-pic {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.user-info h4 {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 10px 0; /* Ajout d'un espace sous le nom */
  color: #333;
}

.user-info p {
  font-size: 14px;
  color: #666;
  margin: 0; /* Supprimé les marges pour mieux aligner avec le style global */
}

.follow-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  background-color: #ff6c19;
  color: #fff;
  transition: background-color 0.3s;
  z-index: 10;
}

.follow-btn.following {
  background-color: #a020f0;
}

.follow-btn:hover {
  background-color: #ff8145;
}

.material-icons {
  font-size: 20px;
}
</style>
