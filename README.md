<p align="center"><img src="src/frontend/assets/Smatch.png" width="400" alt="Logo Smatch - Projet HEIG-VD Frontend"></p>

# 🎯 **sMatch Frontend**

**sMatch Frontend** est la partie utilisateur de l'application sociale **sMatch**, réalisée dans le cadre du cours *"Architecture orientée Web"* à la [HEIG-VD]. Inspirée de Twitter, cette application permet aux étudiants d'interagir, de partager des messages, et de collaborer dans des groupes, le tout avec une interface moderne et intuitive.

---

## 📚 **Table des matières**

- [🎯 sMatch Frontend](#-smatch-frontend)
  - [🌍 Contexte](#-contexte)
  - [👥 Équipe](#-équipe)
  - [✨ Fonctionnalités principales](#-fonctionnalités-principales)
  - [⚙️ Requis](#️-requis)
  - [🚀 Installation et lancement](#-installation-et-lancement)
  - [📖 Backend sMatch](#-backend-smatch)
  - [🎨 Maquettes Figma](#-maquettes-figma)
  - [📂 Structure du projet](#-structure-du-projet)
  - [🔧 Configuration](#-configuration)
  - [🤝 Contributions](#-contributions)

---

## 🌍 **Contexte**

Le frontend de **sMatch** est conçu pour offrir une expérience utilisateur fluide et interactive, utilisant **Vue.js**, **PrimeVue**, **VueRouter**, et **WebSocket**. Il s'intègre avec la REST API **sMatch** pour fournir les fonctionnalités sociales suivantes :

- Créer, liker, commenter, et supprimer des posts.
- Suivre ou ne plus suivre des utilisateurs.
- Gérer des groupes collaboratifs.
- Recevoir des notifications en temps réel grâce aux WebSockets.

---

## 👥 **Équipe**

Ce projet a été réalisé avec la contribution des membres suivants :

- **Morgane Devals**  
  [GitHub](https://github.com/morgui2003) | [LinkedIn](https://www.linkedin.com/in/morgane-devals-5730ba26a/)

- **Sami Gilliand**  
  [GitHub](https://github.com/GilliandSami) | [LinkedIn](https://www.linkedin.com/in/sami-gilliand/)

- **Léa Macaluso**  
  [GitHub](https://github.com/macalusolea) | [LinkedIn](https://www.linkedin.com/in/lea-macaluso/)

---

## ✨ **Fonctionnalités principales**

### **Authentification**
- Inscription et connexion sécurisées avec **JWT**.
- Déconnexion simple et sécurisée.

### **Gestion des utilisateurs**
- Modification du profil utilisateur (nom, photo de profil, bio).
- Suivre ou ne plus suivre d'autres utilisateurs.

### **Publications**
- Créer, modifier, liker, commenter, et supprimer des posts.
- Visualiser les posts likés par l'utilisateur.

### **Groupes**
- Créer ou rejoindre des groupes.
- Ajouter ou supprimer des membres d'un groupe.

### **Temps réel**
- Notifications en temps réel pour les nouveaux posts et interactions.
- Discussions en direct dans les groupes via WebSocket.

### **Interface utilisateur**
- Design moderne basé sur les maquettes Figma.
- Utilisation de **PrimeVue** pour des composants interactifs.

---

## ⚙️ **Requis**

- **Node.js** 14.x ou supérieur
- **npm** ou **yarn**
- **Vue CLI** (optionnel, si vous souhaitez utiliser Vue en global)

---

## 🚀 **Installation et lancement**

### **Cloner le projet**

```bash
git clone https://github.com/username/sMatch-frontend.git
```

### **Installer les dépendances**

```bash
cd sMatch-frontend
npm install
```

### **Configurer l'environnement**

Créez un fichier `.env` à la racine avec les variables suivantes :

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WEBSOCKET_URL=ws://localhost:3000
```

### **Lancer le serveur de développement**

```bash
npm run dev
```

L'application sera accessible à l'adresse : [http://localhost:5173](http://localhost:5173)

---

## 📖 **Backend sMatch**

Ce projet est basé sur une REST API développée spécifiquement pour sMatch. Pour en savoir plus sur le backend ou installer l'API localement, visitez le repository suivant :

[sMatch REST API](https://github.com/GilliandSami/sMatch-RestAPI/tree/main)

---

## 🎨 **Maquettes Figma**

Les maquettes de l'application sMatch sont disponibles sur Figma. Consultez-les ici :

[Maquettes sMatch](https://www.figma.com/design/Oayx8EktIW8gYPf4wOrxFO/Maquettes-DevMobil?node-id=0-1&t=IlBOZtxyVq8ApqSH-1)

---

## 📂 **Structure du projet**

Voici la structure principale du projet frontend :

```plaintext
src/
├── assets/         # Images et ressources statiques
├── backend/        # Serveur WebSocket
├── frontend/       # Application Vue.js
│   ├── components/ # Composants Vue
│   ├── composables/ # Fonctions réutilisables
│   ├── class/      # Classes utilitaires
│   ├── utils/      # Fonctions auxiliaires (FetchAPI, authUtils, etc.)
│   ├── router.js   # Configuration de VueRouter
│   ├── app.js      # Entrée principale de Vue.js
│   └── index.html  # Fichier HTML principal
└── websocket/      # Gestion des WebSockets
```

---

## 🔧 **Configuration**

### **Variables d'environnement**

- `VITE_API_BASE_URL` : URL de la REST API de sMatch.
- `VITE_WEBSOCKET_URL` : URL pour le serveur WebSocket.

### **Dépendances principales**

- **Vue.js** : Framework principal.
- **VueRouter** : Gestion des routes et navigation.
- **PrimeVue** : Composants UI interactifs.
- **Vite** : Serveur de développement rapide.
- **WebSocket** : Temps réel pour les notifications et discussions.

---

## 🤝 **Contributions**

Les contributions sont les bienvenues ! Merci de respecter les étapes suivantes :

1. Forkez le projet.
2. Créez une branche dédiée : `feature/nom-de-votre-feature`.
3. Soumettez une pull request avec une description détaillée.

---
