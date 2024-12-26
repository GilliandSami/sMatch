<script>
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
      isFollowing: false,
      hasLiked: false,
    };
  },
  methods: {
    async toggleFollow() {
      try {
        this.isFollowing = !this.isFollowing;
        alert(`Vous ${this.isFollowing ? "suivez" : "ne suivez plus"} ${this.post.userDetails?.username || "Utilisateur inconnu"}`);
      } catch (error) {
        console.error("Erreur lors du suivi :", error);
      }
    },
    async toggleLike() {
      try {
        this.hasLiked = !this.hasLiked;
        this.post.likes = this.hasLiked ? this.post.likes + 1 : this.post.likes - 1;
      } catch (error) {
        console.error("Erreur lors du like :", error);
      }
    },
    sharePost() {
      navigator.clipboard.writeText(`${window.location.origin}/posts/${this.post._id}`);
      alert("Lien copié dans le presse-papier !");
    },
  },
  mounted() {
    const userId = localStorage.getItem("userId");
    this.isFollowing = this.post.userDetails?.followers?.includes(userId) || false;
    this.hasLiked = this.post.likes?.includes(userId) || false;
  },
};
</script>

<template>
  <div class="post">
    <div class="post-header">
      <img :src="post.userDetails?.profile_picture || '/assets/default_profile.jpg'" alt="User" class="profile-pic" />
      <button v-if="!isFollowing" class="follow-btn" @click="toggleFollow">+</button>
      <div>
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
  padding: 15px;
  border-bottom: 1px solid #ddd;
}

.post-header {
  display: flex;
  align-items: center;
}

.profile-pic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.follow-btn {
  margin-left: auto;
  background-color: #a020f0;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
}

.post-content {
  margin-top: 10px;
}

.post-actions button {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 10px;
}
</style>
