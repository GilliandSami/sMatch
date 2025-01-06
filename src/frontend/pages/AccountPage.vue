<script>
import AccountInformation from "../components/AccountInformation.vue";
import AccountSwitcher from "../components/AccountSwitcher.vue";
import AccountPosts from "../components/AccountPosts.vue";
import BottomNavBar from "../components/BottomNavBar.vue";

export default {
  name: "AccountPage",
  components: { AccountInformation, AccountSwitcher, AccountPosts, BottomNavBar },
  data() {
    return {
      userId: this.$route.params.userId || JSON.parse(localStorage.getItem("userInfo")).id,
      selectedTab: "posts", // Onglet par défaut (Posts)
    };
  },
  methods: {
    handleTabSelection(tab) {
      this.selectedTab = tab; // Met à jour l'onglet sélectionné
    },
  },
};
</script>

<template>
  <div class="account-page">
    <!-- Composant AccountInformation fixé en haut -->
    <AccountInformation :userId="userId" />

    <!-- Composant AccountSwitcher fixé sous AccountInformation -->
    <AccountSwitcher @tab-selected="handleTabSelection" />

    <!-- Composant AccountPosts pour afficher les posts -->
    <div class="posts-container">
      <AccountPosts :userId="userId" :selectedTab="selectedTab" />
    </div>

    <!-- Barre de navigation en bas -->
    <BottomNavBar />
  </div>
</template>

<style scoped>
.account-page {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100vh;
  background-color: #f8f9fa;
  overflow: hidden;
}

/* Container pour AccountPosts */
.posts-container {
  position: absolute;
  top: 170px; /* Hauteur combinée de AccountInformation + AccountSwitcher */
  bottom: 60px; /* Compense la hauteur de BottomNavBar */
  left: 0;
  right: 0;
  overflow-y: auto;
  background: white;
}
</style>
