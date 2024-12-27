<script>
import { useFetchApiCrud } from "../utils/FetchCrud";
import { useRouter } from "vue-router";

export default {
  name: "Post",
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      hasLiked: false, // État local pour savoir si l'utilisateur a liké ce post
    };
  },
  setup() {
    const { likeItem, unlikeItem } = useFetchApiCrud("/api/posts");
    const router = useRouter();

    return {
      likeItem,
      unlikeItem,
      router, // Utiliser le routeur pour la navigation
    };
  },
  methods: {
    async toggleLike() {
      try {
        const token = localStorage.getItem("jwt");

        if (this.hasLiked) {
          await this.unlikeItem(this.post._id, {
            Authorization: `Bearer ${token}`,
          });
          const userId = localStorage.getItem("userId");
          this.post.likes = this.post.likes.filter((likeId) => likeId !== userId);
        } else {
          await this.likeItem(this.post._id, {
            Authorization: `Bearer ${token}`,
          });
          const userId = localStorage.getItem("userId");
          this.post.likes.push(userId);
        }

        this.hasLiked = !this.hasLiked;
      } catch (error) {
        console.error("Erreur lors du like/unlike :", error);
      }
    },

    sharePost() {
      navigator.clipboard.writeText(`${window.location.origin}/posts/${this.post._id}`);
      alert("Lien copié dans le presse-papier !");
    },

    checkIfLiked() {
      const userId = localStorage.getItem("userId");
      this.hasLiked = this.post.likes?.some((likeId) => likeId === userId) || false;
    },

    goToUserProfile() {
      // Rediriger vers le profil utilisateur
      this.router.push(`/profile/${this.post.user}`);
    },
  },
  mounted() {
    this.checkIfLiked();
  },
};
</script>

<template>
  <div class="post">
    <div class="post-header">
      <img :src="post.userDetails?.profile_picture || '/assets/default_profile.jpg'" alt="User" class="profile-pic"
        @click="goToUserProfile" />
      <div class="post-info">
        <h4>{{ post.userDetails?.username || "Utilisateur inconnu" }}</h4>
        <small>{{ new Date(post.created_at).toLocaleDateString() }}</small>
      </div>
    </div>
    <p class="post-content">{{ post.content }}</p>
    <div class="post-actions">
      <button @click="toggleLike">
        <span class="material-icons">{{ hasLiked ? "favorite" : "favorite_border" }}</span>
        {{ post.likes.length }}
      </button>
      <button @click="sharePost">
        <span class="material-icons">share</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.post {
  background-color: #fff;
  /* Fond blanc */
  color: #000;
  /* Texte noir */
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* Ombre douce */
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  margin-right: 130px;
}

.profile-pic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

.post-info {
  display: flex;
  align-items: baseline;
  gap: 15px;
}

.post-info h4 {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.post-info small {
  font-size: 14px;
  color: gray;
}

.post-content {
  margin: 15px 0;
  font-size: 16px;
  line-height: 1.5;
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.post-actions button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #ff6c19;
  /* Boutons orange */
}

.post-actions button:hover {
  color: #ff8145;
  /* Orange plus clair au hover */
}

.material-icons {
  font-size: 20px;
  vertical-align: middle;
}
</style>
