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
        <!-- <label for="email">Email</label> -->
        <div class="input-with-icon">
          <img src="/assets/mail_24dp.svg" alt="Email Icon" class="icon" />
          <input type="email" id="email" v-model="form.email" placeholder="Email" required />
        </div>
      </div>

      <div class="form-group">
        <!-- <label for="password">Mot de passe</label> -->
        <div class="input-with-icon">
          <img src="/assets/lock_24dp.svg" alt="Lock Icon" class="icon" />
          <input type="password" id="password" v-model="form.password" placeholder="Mot de passe" required />
        </div>
      </div>

      <!-- Champ supplémentaire pour l'enregistrement -->
      <div class="form-group" v-if="!isLogin">
        <!-- <label for="username">Pseudo</label> -->
        <div class="input-with-icon">
          <img src="/assets/cruelty_free_24dp.svg" alt="Pseudo Icon" class="icon" />
          <input type="text" id="username" v-model="form.username" placeholder="Pseudo" required />
        </div>
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
  width: 100%;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0px;
  position: relative;
}

.auth-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.auth-switch button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: bold;
  color: #FF6C19;
  font-size: 1rem;
  border-radius: 50px; /* Boutons totalement arrondis */
}

.auth-switch button.active {
  background-color: #FF6C19;
  color: white;
  border-radius: 50px; /* Bouton actif arrondi */
}

.form-group {
  margin-bottom: 1.5rem;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon .icon {
  position: absolute;
  left: 10px;
  width: 24px;
  height: 24px;
  pointer-events: none;
}

.input-with-icon input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 3rem;
  border: 2px solid #FF6C19;
  border-radius: 50px;
  font-size: 1rem;
  outline: none;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #FF6C19;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 50px; /* Bouton de soumission totalement arrondi */
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #ff8145;
}
</style>
