<script>
import { useFetchApiCrud } from "../utils/FetchCrud";
import { ref, onMounted } from "vue";

export default {
  name: "BottomNavBar",
  data() {
    return {
      selected: "home", // Icône sélectionnée par défaut
      userProfilePicture: null, // Image de profil de l'utilisateur
    };
  },
  methods: {
    async fetchUserData() {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        const userId = userInfo?.id;
        if (!userId) {
            console.error("ID utilisateur introuvable !");
            this.userProfilePicture = "/assets/default_profile.png";
            return;
        }

        const token = localStorage.getItem("jwt");
        if (!token) {
            console.error("Token JWT manquant !");
            this.userProfilePicture = "/assets/default_profile.png";
            return;
        }

        const { read } = useFetchApiCrud("/api/users");

        try {
            const response = await read(userId, {
            Authorization: `Bearer ${token}`,
            });

            console.log("Données utilisateur résolues :", response);

            const userData = response?.data || response;
            if (!userData || !userData.profile_picture) {
            console.log("Aucune image de profil trouvé")
            }

            this.userProfilePicture = userData.profile_picture || "/assets/default_profile.jpg";
        } catch (error) {
            console.error(
            "Erreur lors de la récupération des données utilisateur :",
            error
            );
            this.userProfilePicture = "/assets/default_profile.jpg";
        }
    },
    selectNavItem(item) {
        console.log("Item sélectionné :", item);
        this.selected = item;
        this.$router.push(`/${item}`);
    },
    },
  mounted() {
    this.fetchUserData();
  },
};
</script>

<template>
  <div class="bottom-nav">
    <!-- Icône Home -->
    <button
      :class="{ active: selected === 'home' }"
      @click="selectNavItem('home')"
    >
      <span class="material-icons">home</span>
    </button>
    <!-- Icône Search -->
    <button
      :class="{ active: selected === 'search' }"
      @click="selectNavItem('search')"
    >
      <span class="material-icons">search</span>
    </button>
    <!-- Icône Stars -->
    <button
      :class="{ active: selected === 'groups' }"
      @click="selectNavItem('groups')"
    >
      <span class="material-icons">star</span>
    </button>
    <!-- Icône Account -->
    <button
      :class="{ profile: true, active: selected === 'account' }"
      @click="selectNavItem('account')"
    >
      <img :src="userProfilePicture" alt="Profile" class="profile-pic" />
    </button>
  </div>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding: 10px 0;
  z-index: 100;
}

.bottom-nav button {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: gray;
  font-size: 24px;
  outline: none;
}

.bottom-nav button.active {
  color: #a020f0; /* Couleur violette pour l'icône active */
}

.bottom-nav button.profile {
  position: relative;
}

.bottom-nav button.profile.active {
  border: 2px solid #a020f0; /* Bordure violette si active */
  border-radius: 50%;
}

.profile-pic {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
