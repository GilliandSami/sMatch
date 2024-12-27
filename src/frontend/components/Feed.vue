<script>
import { ref, onMounted, computed, watch } from "vue";
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

    const trompeTesSmatchsPosts = ref([]); // Posts pour "trompe-tes-smatchs"
    const mesSmatchsPosts = ref([]); // Posts pour "mes-smatchs"
    const userData = ref(null); // Données utilisateur pour "mes-smatchs"
    const userCache = ref(new Map()); // Cache des détails utilisateur
    const isFollowingEmpty = ref(false); // Indicateur si l'utilisateur suit quelqu'un

    const loadPosts = async () => {
      const token = localStorage.getItem("jwt");

      try {
        if (props.feedType === "trompe-tes-smatchs") {
          // Charger les posts aléatoires
          const posts = await readAll({}, { Authorization: `Bearer ${token}` });
          trompeTesSmatchsPosts.value = posts || [];
        } else if (props.feedType === "mes-smatchs") {
          // Charger les posts des utilisateurs suivis
          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          const user = await read(userInfo.id, { Authorization: `Bearer ${token}` });
          userData.value = user;

          if (!user?.following || user.following.length === 0) {
            isFollowingEmpty.value = true;
            mesSmatchsPosts.value = [];
          } else {
            isFollowingEmpty.value = false;
            // Charger les posts des utilisateurs suivis
            const posts = [];
            for (const followedId of user.following) {
              const followedPosts = await readAll(
                { userId: followedId },
                { Authorization: `Bearer ${token}` }
              );
              posts.push(...(followedPosts || []));
            }
            mesSmatchsPosts.value = posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des posts :", error);
      }
    };

    const randomPosts = computed(() =>
      trompeTesSmatchsPosts.value.map((post) => ({
        ...post,
        userDetails: fetchUserDetails(post.user),
      }))
    );

    const followingPosts = computed(() =>
      mesSmatchsPosts.value.map((post) => ({
        ...post,
        userDetails: fetchUserDetails(post.user),
      }))
    );

    const fetchUserDetails = (userId) => {
      if (!userCache.value.has(userId)) {
        const { read } = useFetchApiCrud("/api/users");
        read(userId, { Authorization: `Bearer ${localStorage.getItem("jwt")}` })
          .then((data) => userCache.value.set(userId, data))
          .catch((error) => console.error("Erreur utilisateur :", error));
      }
      return userCache.value.get(userId);
    };

    onMounted(loadPosts);

    // Regarder les changements de la prop feedType et recharger les posts
    watch(
      () => props.feedType,
      async () => {
        await loadPosts();
      },
      { immediate: true } // Exécuter immédiatement pour le premier rendu
    );

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
    <Post v-if="feedType === 'trompe-tes-smatchs'" v-for="post in randomPosts" :key="post._id" :post="post" />

    <!-- Posts pour "mes-smatchs" -->
    <Post v-if="feedType === 'mes-smatchs' && !isFollowingEmpty" v-for="post in followingPosts" :key="post._id"
      :post="post" />
  </div>
</template>

<style scoped>
.feed {
  padding: 75px 15px 15px 15px;
  overflow-y: auto;
}

.no-following {
  text-align: center;
  color: gray;
  margin-top: 50px;
  font-size: 18px;
}
</style>
