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
      isAuthor: false, // État local pour savoir si l'utilisateur est l'auteur du post
    };
  },
  setup() {
    const { likeItem, unlikeItem, del } = useFetchApiCrud("/api/posts");
    const router = useRouter();

    return {
      likeItem,
      unlikeItem,
      del,
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

    async deletePost() {
      try {
        const token = localStorage.getItem("jwt");
        const confirmation = confirm("Voulez-vous vraiment supprimer ce post ?");
        if (!confirmation) return;

        await this.del(this.post._id, {
          Authorization: `Bearer ${token}`,
        });
        alert("Post supprimé avec succès !");
        this.$emit("post-deleted", this.post._id); // Émet un événement au parent pour mettre à jour la liste des posts
      } catch (error) {
        console.error("Erreur lors de la suppression du post :", error);
        alert("Erreur lors de la suppression du post.");
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

    checkIfAuthor() {
      const userId = JSON.parse(localStorage.getItem("userInfo"))?.id;
      this.isAuthor = this.post.user === userId;
    },

    goToUserProfile() {
      this.router.push(`/profile/${this.post.user}`);
    },
  },
  mounted() {
    this.checkIfLiked();
    this.checkIfAuthor();
  },
};
</script>

<template>
  <div class="post">
    <div class="post-header">
      <img
        :src="post.userDetails?.profile_picture || '/assets/default_profile.jpg'"
        alt="User"
        class="profile-pic"
        @click="goToUserProfile"
      />
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
      <button v-if="isAuthor" @click="deletePost" class="delete-button">
        <span class="material-icons">delete</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.post {
  background-color: #ffffff; /* Fond blanc */
  color: #000; /* Texte noir */
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Ombre douce */
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  margin-right: 15px;
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
  width: 100%;
}

.post-info h4 {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.post-info small {
  font-size: 14px;
  margin-left: auto;
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
  color: #ff6c19; /* Boutons orange */
}

.post-actions button:hover {
  color: #ff8145; /* Orange plus clair au hover */
}

.material-icons {
  font-size: 20px;
  vertical-align: middle;
}

/* Bouton Supprimer */
.delete-button {
  color: #f44336; /* Rouge */
  transition: color 0.3s, transform 0.2s;
}

.delete-button:hover {
  color: #e57373; /* Rouge plus clair */
  transform: scale(1.1); /* Légère mise en avant au hover */
}
</style>

