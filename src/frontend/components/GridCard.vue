<script>
import Card from "./Card.vue"; // Importation du composant mineur "Card"
import { ref, computed, onMounted } from "vue";
import { useFetchApiCrud } from "../utils/FetchCrud";

export default {
  name: "GridCard",
  components: { Card },
  props: {
    searchQuery: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const { readAll } = useFetchApiCrud("/api/users");
    const allUsers = ref([]); // Stocke tous les utilisateurs récupérés
    const loading = ref(false); // État de chargement
    const error = ref(null); // État d'erreur

    const fetchUsers = async () => {
      loading.value = true;
      error.value = null;

      const token = localStorage.getItem("jwt");

      try {
        const users = await readAll({}, { Authorization: `Bearer ${token}` });
        allUsers.value = users || [];
      } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs :", err);
        error.value = "Erreur lors du chargement des utilisateurs.";
      } finally {
        loading.value = false;
      }
    };

    // Filtrer les utilisateurs en fonction de la recherche
    const filteredUsers = computed(() => {
      if (!props.searchQuery) {
        return allUsers.value;
      }

      const query = props.searchQuery.toLowerCase();
      return allUsers.value.filter((user) =>
        user.username.toLowerCase().includes(query)
      );
    });

    onMounted(() => {
      fetchUsers();
    });

    return {
      filteredUsers,
      loading,
      error,
    };
  },
};
</script>

<template>
  <div class="grid-card">
    <h2>Découvrir</h2>

    <p v-if="loading">Chargement...</p>

    <p v-if="error" class="error">{{ error }}</p>

    <div class="grid">
      <Card
        v-for="user in filteredUsers"
        :key="user._id"
        :user="user"
      />
    </div>
  </div>
</template>

<style scoped>
.grid-card {
  padding: 10px;
}

.grid-card h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
