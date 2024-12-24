<script>
import { ref, onMounted, watch } from "vue";
import Post from "./Post.vue";
import { useFetchApiCrud } from "../utils/FetchCrud";

export default {
    name: "Feed",
    props: {
        feedType: String, // Fil d'actualité sélectionné : "mes-smatchs" ou "trompe-tes-smatchs"
    },
    components: { Post },
    data() {
        return {
            posts: [], // Liste des posts à afficher
            currentUser: null, // Utilisateur authentifié
            isFollowingEmpty: false, // Vérifie si l'utilisateur ne suit personne
        };
    },
    methods: {
        async fetchPosts() {
            const token = localStorage.getItem("jwt");
            const { readAll } = useFetchApiCrud("/api/posts");
            try {
                if (this.feedType === "trompe-tes-smatchs") {
                    const { data: allPosts } = await readAll({}, { Authorization: `Bearer ${token}` });
                    console.log(allPosts);
                    
                    const posts = allPosts._value;
                    console.log(posts);

                    // Accéder aux données réactives via .value
                    // const posts = allPosts.value;
                    // this.posts = posts.sort(() => Math.random() - 0.5); // Mélange aléatoire
                } else if (this.feedType === "mes-smatchs") {
                    const { read } = useFetchApiCrud("/api/users");
                    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                    const userId = userInfo.id;

                    const { data: userData } = await read(userId, { Authorization: `Bearer ${token}` });

                    // Vérification si l'utilisateur ne suit personne
                    const following = userData.value?.following || [];
                    if (following.length === 0) {
                        this.isFollowingEmpty = true;
                        this.posts = [];
                        return;
                    }

                    this.isFollowingEmpty = false;

                    const followingPosts = [];
                    for (const followedId of following) {
                        const { data: posts } = await readAll(
                            { userId: followedId },
                            { Authorization: `Bearer ${token}` }
                        );

                        // Accéder aux données réactives via .value
                        if (Array.isArray(posts.value)) {
                            followingPosts.push(...posts.value);
                        }
                    }

                    this.posts = followingPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Tri par date
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des posts :", error);
            }
        },
    },
    watch: {
        feedType: "fetchPosts", // Recharge les posts lorsque le fil d'actualité change
    },
    mounted() {
        this.fetchPosts();
    },
};
</script>

<template>
    <div class="feed">
        <p v-if="isFollowingEmpty" class="no-following">
            Vous ne smatchez personne pour le moment
        </p>
        <Post v-for="post in posts" :key="post._id" :post="post" :currentUser="currentUser" />
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
