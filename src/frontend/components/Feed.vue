<script>
import { computed, ref, watch } from "vue";
import Post from "./Post.vue";
import { useFetchApiCrud } from "../utils/FetchCrud";

export default {
  name: "Feed",
  props: {
    feedType: {
      type: String,
      required: true,
    },
  },
  components: { Post },
  setup(props) {
    const { readAll } = useFetchApiCrud("/api/posts");
    const { read } = useFetchApiCrud("/api/users");

    const allPosts = ref([]); // Tous les posts pour "trompe-tes-smatchs"
    const userData = ref(null); // Données utilisateur pour "mes-smatchs"
    const userCache = ref(new Map()); // Cache des données utilisateur
    const isFollowingEmpty = ref(false); // Indicateur d'absence d'utilisateurs suivis

    // Récupérer les posts en fonction du type de fil
    const loadPosts = () => {
      const token = localStorage.getItem("jwt");

      if (props.feedType === "trompe-tes-smatchs") {
        const { data } = readAll({}, { Authorization: `Bearer ${token}` });
        allPosts.value = data;
        isFollowingEmpty.value = false; // Il y a toujours des posts aléatoires
      }

      if (props.feedType === "mes-smatchs") {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const { data } = read(userInfo.id, { Authorization: `Bearer ${token}` });
        userData.value = data;

        if (!data?.value?.following || data.value.following.length === 0) {
          isFollowingEmpty.value = true;
        } else {
          isFollowingEmpty.value = false;
        }
      }
    };

    // Calculer les posts aléatoires pour "trompe-tes-smatchs"
    const randomPosts = computed(() => {
      if (!allPosts.value?.value) return [];
      return allPosts.value.value.map((post) => ({
        ...post,
        userDetails: fetchUserDetails(post.user),
      })).sort(() => Math.random() - 0.5); // Mélanger aléatoirement
    });

    // Calculer les posts pour les utilisateurs suivis dans "mes-smatchs"
    const followingPosts = computed(() => {
      if (!userData.value?.value?.following) return [];
      const posts = [];

      userData.value.value.following.forEach((followedId) => {
        const { data } = readAll(
          { userId: followedId },
          { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
        );

        if (data.value) {
          data.value.forEach((post) => {
            posts.push({
              ...post,
              userDetails: fetchUserDetails(post.user),
            });
          });
        }
      });

      return posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    });

    // Récupérer les détails utilisateur pour un post
    const fetchUserDetails = (userId) => {
      if (!userCache.value.has(userId)) {
        const { data } = read(userId, { Authorization: `Bearer ${localStorage.getItem("jwt")}` });

        watch(
          data,
          (newData) => {
            userCache.value.set(userId, newData);
          },
          { immediate: true }
        );
      }
      // Retourner les données utilisateur (ou undefined si pas encore récupérées)
      return userCache.value.get(userId);
    };

    // Surveiller les changements du type de fil
    watch(() => props.feedType, loadPosts, { immediate: true });

    return {
      randomPosts,
      followingPosts,
      isFollowingEmpty,
    };
  },
};
</script>

<template>
  <div class="feed">
    <!-- Message si aucun utilisateur suivi -->
    <p v-if="feedType === 'mes-smatchs' && isFollowingEmpty" class="no-following">
      Vous ne sMatchez personne pour le moment...
    </p>

    <!-- Posts pour "trompe-tes-smatchs" -->
    <Post
      v-if="feedType === 'trompe-tes-smatchs'"
      v-for="post in randomPosts"
      :key="post._id"
      :post="post"
    />

    <!-- Posts pour "mes-smatchs" -->
    <Post
      v-if="feedType === 'mes-smatchs'"
      v-for="post in followingPosts"
      :key="post._id"
      :post="post"
    />
  </div>
</template>

<style scoped>
.feed {
  padding: 15px;
  overflow-y: auto;
}

.no-following {
  text-align: center;
  color: gray;
  margin-top: 50px;
  font-size: 18px;
}
</style>
