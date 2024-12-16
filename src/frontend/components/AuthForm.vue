<script>
import { useAuth } from "../utils/authUtils";

const { login, register } = useAuth();

export default {
  data() {
    return {
      isLogin: true, // Toggle entre login et register
      form: {
        email: "",
        password: "",
        username: "", // Utilisé uniquement pour l'enregistrement
      },
    };
  },
  methods: {
    switchToLogin() {
      this.isLogin = true;
    },
    switchToRegister() {
      this.isLogin = false;
    },
    async handleSubmit() {
      try {
        if (this.isLogin) {
          await login({ email: this.form.email, password: this.form.password });
        } else {
          await register({ username: this.form.username, email: this.form.email, password: this.form.password });
        }
        this.$router.push("/home"); // Redirection vers la page d'accueil
      } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur lors de l'authentification");
      }
    },
  },
};
</script>

<template>
  <div class="auth-container">
    <!-- Navigation entre Connexion et Enregistrement -->
    <div class="auth-switch">
      <button :class="{ active: isLogin }" @click="switchToLogin">
        Se connecter
      </button>
      <button :class="{ active: !isLogin }" @click="switchToRegister">
        S'enregistrer
      </button>
    </div>

    <!-- Formulaire -->
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="form.email" placeholder="Email" required />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" v-model="form.password" placeholder="Mot de passe" required />
      </div>

      <!-- Champ supplémentaire pour l'enregistrement -->
      <div class="form-group" v-if="!isLogin">
        <label for="username">Pseudo</label>
        <input type="text" id="username" v-model="form.username" placeholder="Pseudo" required />
      </div>

      <button class="submit-btn">
        {{ isLogin ? "Me connecter" : "Créer mon compte" }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
}

.auth-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.auth-switch button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: bold;
}

.auth-switch button.active {
  background-color: #f46b45;
  color: white;
  border-radius: 10px;
}

.form-group {
  margin-bottom: 1.5rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #f46b45;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>