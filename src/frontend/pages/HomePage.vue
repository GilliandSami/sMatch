<script>
import FeedSwitcher from "../components/FeedSwitcher.vue";
import BottomNavBar from "../components/BottomNavBar.vue";
import CreatePostForm from "../components/CreatePostForm.vue";
import Feed from "../components/Feed.vue";

export default {
  name: "HomePage",
  components: {
    FeedSwitcher,
    BottomNavBar,
    CreatePostForm,
    Feed,
  },
  data() {
    return {
      currentFeed: "mes-smatchs", // Fil d'actualité sélectionné
    };
  },
  methods: {
    onFeedSelected(feed) {
      this.currentFeed = feed;
      console.log(`Fil d'actualité sélectionné : ${feed}`);
    },
  },
};
</script>

<template>
  <div class="home-page">
    <!-- Composant de sélection du fil d'actualité -->
    <FeedSwitcher @feed-selected="onFeedSelected" />

    <!-- Formulaire de création de post -->
    <CreatePostForm />

    <!-- Fil d'actualité dynamique -->
    <Feed :feedType="currentFeed" />

    <!-- Barre de navigation en bas -->
    <BottomNavBar />
  </div>
</template>

<style scoped>
.home-page {
  padding-top: 120px;
  /* Ajusté pour inclure les composants supérieurs */
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
