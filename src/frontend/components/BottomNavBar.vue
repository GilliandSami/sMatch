<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useFetchApiCrud } from "../utils/FetchCrud";

export default {
  name: "BottomNavBar",
  setup() {
    const userProfilePicture = ref("/assets/default_profile.jpg"); // Image par défaut
    const selected = ref("home"); // Icône sélectionnée par défaut
    const userData = ref(null); // Données utilisateur réactives
    const router = useRouter(); // Obtenir l'objet router

    const { read } = useFetchApiCrud("/api/users");

    // Récupération des données utilisateur
    const fetchUserData = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo?.id;
      const token = localStorage.getItem("jwt");

      if (!userId || !token) {
        console.error("ID utilisateur ou token JWT manquant !");
        return;
      }

      try {
        // Appel à l'API pour récupérer les données utilisateur
        const response = await read(userId, {
          Authorization: `Bearer ${token}`,
        });

        // Mettre à jour les données utilisateur réactives
        userData.value = response;
        userProfilePicture.value =
          response?.profile_picture || "/assets/default_profile.jpg";
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
      }
    };

    // Sélectionner un élément de la barre de navigation
    const selectNavItem = (item) => {
      console.log("Item sélectionné :", item);
      selected.value = item;
      if (item === "account") {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const userId = userInfo?.id;
        if (userId) {
          router.push(`/profile/${userId}`); // Rediriger vers la page de profil
        }
      } else {
        router.push(`/${item}`); // Utiliser router.push pour naviguer
      }
    };

    // Charger les données utilisateur au montage
    onMounted(fetchUserData);

    return {
      userProfilePicture,
      selected,
      userData,
      selectNavItem,
    };
  },
};
</script>

<template>
  <div class="bottom-nav">
    <!-- Icône Home -->
    <button :class="{ active: selected === 'home' }" @click="selectNavItem('home')">
      <span class="material-icons">home</span>
    </button>
    <!-- Icône Search -->
    <button :class="{ active: selected === 'search' }" @click="selectNavItem('search')">
      <span class="material-icons">search</span>
    </button>
    <!-- Icône Stars -->
    <button :class="{ active: selected === 'groups' }" @click="selectNavItem('groups')">
      <span class="material-icons">star</span>
    </button>
    <!-- Icône Account -->
    <button :class="{ profile: true, active: selected === 'account' }" @click="selectNavItem('account')">
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
  font-size: 32px;
  outline: none;
  transition: transform 0.2s ease;
}

.bottom-nav button:hover {
  transform: scale(1.1);
  /* Zoom léger au survol */
}

.bottom-nav button.active {
  color: #D1B7FF;
  /* Couleur violette pour l'icône active */
}

.bottom-nav button.profile {
  position: relative;
}

.bottom-nav button.profile.active {
  border: 2px solid #D1B7FF;
  /* Bordure violette si active */
  border-radius: 50%;
}

.material-icons {
  font-size: 32px;
  /* Augmentation de la taille des icônes */
}

.profile-pic {
  width: 40px;
  /* Taille de l'image de profil légèrement augmentée */
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
