import { useFetchApi, setDefaultHeaders } from './FetchAPI';

/**
 * Utilitaire pour gérer l'authentification.
 * Fournit des fonctions pour login, register, et gestion du token JWT.
 * @param {string} baseUrl - L'URL de base pour l'API (facultatif, sinon utilise celle par défaut).
 */
export function useAuth(baseUrl = null) {
    const { fetchApi } = useFetchApi(baseUrl);

    /**
     * Définit ou supprime le token JWT dans les en-têtes HTTP.
     * @param {string|null} token - Le token JWT à définir. Si null, il sera supprimé.
     */
    function setAuthToken(token) {
        if (token) {
            setDefaultHeaders({
                Authorization: `Bearer ${token}`,
            });
        } else {
            // Supprime le token des en-têtes HTTP
            setDefaultHeaders({
                Authorization: '',
            });
        }
    }

    /**
     * Fonction pour se connecter.
     * @param {object} credentials - Les informations de connexion (email et password).
     * @returns {Promise<object>} - La réponse de l'API contenant le token JWT ou une erreur.
     */
    async function login(credentials) {
        try {
            const response = await fetchApi({
                url: '/api/auth/login',
                method: 'POST',
                data: credentials,
            });

            // Vérifie si le token est présent dans la réponse
            if (response.token) {
                setAuthToken(response.token); // Définit le token dans les en-têtes HTTP
                localStorage.setItem('jwt', response.token); // Stocke le token dans le localStorage
            } else {
                throw new Error("Le token JWT est manquant dans la réponse.");
            }

            return response;
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            throw error; // Relance l'erreur pour une gestion dans le frontend
        }
    }

    /**
     * Fonction pour s'inscrire.
     * @param {object} userData - Les données nécessaires à l'inscription (username, email, password).
     * @returns {Promise<object>} - La réponse de l'API contenant le token JWT ou une erreur.
     */
    async function register(userData) {
        try {
            const response = await fetchApi({
                url: '/api/auth/register',
                method: 'POST',
                data: userData,
            });

            // Vérifie si le token est présent dans la réponse
            if (response.token) {
                setAuthToken(response.token); // Définit le token dans les en-têtes HTTP
                localStorage.setItem('jwt', response.token); // Stocke le token dans le localStorage
            } else {
                throw new Error("Le token JWT est manquant dans la réponse.");
            }

            return response;
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            throw error; // Relance l'erreur pour une gestion dans le frontend
        }
    }

    /**
     * Fonction pour se déconnecter.
     * Supprime le token JWT du stockage local et des en-têtes HTTP.
     */
    function logout() {
        setAuthToken(null); // Supprime le token des en-têtes HTTP
        localStorage.removeItem('jwt'); // Supprime le token du localStorage
        console.log('Déconnexion réussie'); // À remplacer par une notification si nécessaire
    }

    return {
        login,
        register,
        logout,
        setAuthToken, // Expose cette fonction pour des cas spécifiques
    };
}