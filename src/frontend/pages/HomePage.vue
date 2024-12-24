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
    <!-- Composant de sélection -->
    <FeedSwitcher @feed-selected="onFeedSelected" />
    <!-- Formulaire de création de post -->
    <CreatePostForm />
    <!-- Contenu dynamique selon le fil -->
    <Feed :feedType="currentFeed" />
    <!-- Barre de navigation -->
    <BottomNavBar />
  </div>
</template>

<style scoped>
.home-page {
  padding-top: 120px;
  /* Ajusté pour prendre en compte le FeedSwitcher et CreatePostForm */
  display: flex;
  flex-direction: column;
}
</style>
