import { useFetchApi, setDefaultHeaders } from './FetchAPI';

/**
 * Utilitaire pour gérer l'authentification.
 * Fournit des fonctions pour login, register, et gestion du token.
 * @param {string} baseUrl - L'URL de base pour l'API.
 */
export function useAuth(baseUrl = null) {
    const { fetchApi } = useFetchApi(baseUrl);

    /**
     * Fonction pour définir ou supprimer le token JWT.
     * @param {string|null} token - Le token JWT à définir. Si null, le token sera supprimé.
     */
    function setAuthToken(token) {
        if (token) {
            setDefaultHeaders({
                Authorization: `Bearer ${token}`,
            });
        } else {
            // Supprimer le token des en-têtes
            setDefaultHeaders({
                Authorization: '',
            });
        }
    }

    /**
     * Fonction pour se connecter.
     * @param {object} credentials - Les informations de connexion (email, password).
     * @returns {Promise<object>} - Le token JWT ou une erreur.
     */
    async function login(credentials) {
        try {
            const response = await fetchApi({
                url: '/auth/login',
                method: 'POST',
                data: credentials,
            });

            // Si la connexion réussit, enregistrer le token
            setAuthToken(response.token);
            localStorage.setItem('jwt', response.token);

            return response; // Renvoie la réponse complète (y compris le token)
        } catch (error) {
            throw error; // Gérer les erreurs
        }
    }

    /**
     * Fonction pour s'inscrire.
     * @param {object} userData - Les informations nécessaires à l'inscription (username, email, password).
     * @returns {Promise<object>} - Le token JWT ou une erreur.
     */
    async function register(userData) {
        try {
            const response = await fetchApi({
                url: '/auth/register',
                method: 'POST',
                data: userData,
            });

            // Si l'inscription réussit, enregistrer le token
            setAuthToken(response.token);
            localStorage.setItem('jwt', response.token);

            return response; // Renvoie la réponse complète (y compris le token)
        } catch (error) {
            throw error; // Gérer les erreurs
        }
    }

    /**
     * Fonction pour se déconnecter.
     * Supprime le token JWT du stockage local et des en-têtes.
     */
    function logout() {
        setAuthToken(null);
        localStorage.removeItem('jwt');
        console.log('Déconnexion réussie');
    }

    return {
        login,
        register,
        logout,
        setAuthToken, // Exposer la fonction pour des cas spécifiques
    };
}
