<script>
import { ref, watch } from "vue";
import Post from "./Post.vue";
import { useFetchApiCrud } from "../utils/FetchCrud";

export default {
  name: "AccountPosts",
  components: { Post },
  props: {
    userId: {
      type: String,
      required: true,
    },
    selectedTab: {
      type: String,
      required: true, // "posts" ou "likes"
    },
  },
  setup(props) {
    const { readAll } = useFetchApiCrud("/api/posts");
    const { read } = useFetchApiCrud("/api/users");

    const posts = ref([]);
    const userCache = ref(new Map()); // Cache pour les détails des utilisateurs
    const isLoading = ref(true);

    // Charger les posts selon l'onglet sélectionné
    const loadPosts = async () => {
      isLoading.value = true;
      const token = localStorage.getItem("jwt");

      try {
        if (props.selectedTab === "posts") {
          // Récupérer les posts de l'utilisateur
          const userPosts = await readAll(
            { userId: props.userId },
            { Authorization: `Bearer ${token}` }
          );

          posts.value = await enrichPostsWithUserDetails(userPosts);
        } else if (props.selectedTab === "likes") {
          // Récupérer tous les posts
          const allPosts = await readAll({}, { Authorization: `Bearer ${token}` });
          // Filtrer les posts likés par l'utilisateur
          const likedPosts = allPosts.filter((post) =>
            post.likes.includes(props.userId)
          );

          posts.value = await enrichPostsWithUserDetails(likedPosts);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des posts :", error);
      } finally {
        isLoading.value = false;
      }
    };

    // Fonction pour enrichir les posts avec les détails utilisateur
    const enrichPostsWithUserDetails = async (posts) => {
      return Promise.all(
        posts.map(async (post) => {
          const userDetails = await fetchUserDetails(post.user);
          return { ...post, userDetails };
        })
      );
    };

    // Fonction pour récupérer les détails utilisateur
    const fetchUserDetails = async (userId) => {
      if (!userCache.value.has(userId)) {
        try {
          const userDetails = await read(userId, {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          });
          userCache.value.set(userId, userDetails);
        } catch (error) {
          console.error("Erreur lors de la récupération des détails utilisateur :", error);
          return { username: "Utilisateur inconnu", profile_picture: "/assets/default_profile.jpg" }; // Valeurs par défaut
        }
      }
      return userCache.value.get(userId);
    };

    // Regarder les changements de l'onglet sélectionné et recharger les posts
    watch(
      () => props.selectedTab,
      async () => {
        await loadPosts();
      },
      { immediate: true }
    );

    return {
      posts,
      isLoading,
    };
  },
};
</script>

<template>
  <div class="account-posts">
    <p v-if="isLoading" class="loading">Chargement des posts...</p>
    <p v-if="!isLoading && posts.length === 0" class="no-posts">
      Aucun post trouvé pour cet onglet.
    </p>
    <Post v-for="post in posts" :key="post._id" :post="post" />
  </div>
</template>

<style scoped>
.account-posts {
  padding: 20px;
  padding-top: 160px;
  overflow-y: auto;
}

.loading {
  text-align: center;
  color: gray;
  font-size: 16px;
  margin-top: 20px;
}

.no-posts {
  text-align: center;
  color: gray;
  font-size: 16px;
  margin-top: 20px;
}
</style>
