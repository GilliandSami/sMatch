import WebSocketServerOrigin from "./WebSocketServerOrigin.mjs";
import WebSocket from 'ws';
import crypto from 'crypto';
import { bytesBase64Decode } from "./string.mjs";

export default class WSServer {
  // Step 1 - Initialisation du serveur WebSocket
  constructor({
    port = 8887,                  // Numéro de port par défaut pour le serveur
    maxNbOfClients = 1000,        // Nombre maximal de clients autorisés
    verbose = true,               // Activer/désactiver les logs détaillés
    origins = 'http://localhost:5173',  // Origines autorisées pour les connexions WebSocket
    pingTimeout = 30000,          // Intervalle de temps avant de considérer un client inactif
    authCallback = (headers, wsServer) => { }, // Fonction de rappel pour l'authentification
  } = {}) {
    this.port = port;
    this.maxNbOfClients = maxNbOfClients;
    this.verbose = verbose;
    this.origins = origins;
    this.pingTimeout = pingTimeout;
    this.pingInterval = null;
    this.authCallback = authCallback;
    this.clients = new Map();     // Stocke les clients connectés avec leurs métadonnées
    this.server = null;           // Instance du serveur WebSocket
  }

  // Step 2 - Démarrer le serveur WebSocket
  start() {
    this.server = new WebSocketServerOrigin({
      port: this.port,
      origins: this.origins,
      maxNbOfClients: this.maxNbOfClients,
      verbose: this.verbose,
    });

    // Écoute les nouveaux clients et les fermetures de connexion
    this.server.on('connection', (client, request) => this.onConnection(client, request));
    this.server.on('close', () => this.close());

    // Définit un intervalle pour vérifier les connexions inactives
    this.pingInterval = setInterval(() => this.pingManagement(), this.pingTimeout);
    this.log(`WebSocket Server started on port ${this.port}`);
  }

  // Step 3 - Gestion des connexions inactives (ping/pong)
  pingManagement() {
    for (const [client, metadata] of this.clients.entries()) {
      if (client.isAlive === false) {
        this.log(`Client ${metadata.id} is dead`);
        client.terminate();   // Termine la connexion si le client ne répond pas
        this.clients.delete(client);  // Retire le client de la liste active
      } else {
        client.isAlive = false;
        client.ping();        // Envoie un ping pour vérifier la connexion
      }
    }
  }

  // Step 4 - Fermer le serveur et libérer les ressources
  close() {
    if (this.server === null) return;
    clearInterval(this.pingInterval);  // Arrête l'intervalle de gestion du ping
    this.log(`WebSocket Server closed on port ${this.port}`);
    this.clients.clear();  // Supprime tous les clients enregistrés
    this.server.close();
    this.server = null;
  }

  // Step 5 - Créer les métadonnées du client après la connexion
  createClientMetadata(client, customMetadata) {
    this.clients.set(client, {
      id: crypto.randomUUID(),  // Génère un identifiant unique pour le client
      ...customMetadata,        // Ajoute les métadonnées personnalisées fournies
    });
    client.isAlive = true;      // Initialise le statut de la connexion comme active
  }

  // Step 6 - Fonction utilitaire pour enregistrer des messages de log
  log(message) {
    if (this.verbose) {
      console.log(message);
    }
  }

  // Step 7 - Gestion de la connexion d'un nouveau client
  onConnection(client, request) {
    // Récupère le token d'authentification depuis les sous-protocoles de la requête
    const subprotocols = request.headers['sec-websocket-protocol'];
    let token = null;
    if (typeof subprotocols == 'string') {
      const subprotArr = subprotocols.replaceAll(', ', ',').split(',');
      if (subprotArr.length > 1) {
        token = subprotArr[subprotArr.length - 1];
        token = bytesBase64Decode(token);  // Décodage du token
      }
    }

    // Utilise la fonction d'authentification pour vérifier le client
    const customMetadata = this.authCallback(token, request, this);
    if (customMetadata === false) {
      this.sendAuthFailed(client);  // Envoie un message d'échec d'authentification
      client.close();               // Ferme la connexion du client non authentifié
      return;
    }

    // Crée les métadonnées pour le client authentifié
    this.createClientMetadata(client, customMetadata);
    this.log(`New client connected: ${this.clients.get(client).id}`);
    this.sendAuthSuccess(client);  // Confirme l'authentification réussie

    // Écoute les événements pour gérer la connexion du client
    client.on('error', (error) => this.onError(client, error));
    client.on('message', (message) => this.onMessage(client, message));
    client.on('close', () => this.onClose(client));
    client.on('pong', () => this.onPong(client));
  }

  // Step 8 - Gestion des réponses "pong" des clients pour confirmer qu'ils sont actifs
  onPong(client) {
    client.isAlive = true;  // Marque le client comme actif
  }

  // Step 9 - Gestion de la déconnexion d'un client
  onClose(client) {
    this.log(`Client disconnected: ${this.clients.get(client).id}`);
    this.clients.delete(client);  // Supprime le client de la liste des clients actifs
  }

  // Step 10 - Gestion des erreurs de connexion
  onError(client, error) {
    this.log(`Client ${this.clients.get(client).id} error: ${error?.message}`);
    client.close();  // Ferme la connexion du client en cas d'erreur
  }

  // Step 11 - Gestion des messages reçus des clients
  onMessage(client, message) {
    message = message.toString();
    this.broadcast(message);  // Diffuse le message reçu à tous les autres clients
  }

  // Step 12 - Diffusion d'un message à tous les clients
  broadcast(message) {
    for (const client of this.clients.keys()) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);  // Envoie le message aux clients ayant une connexion ouverte
      }
    }
  }

  // Step 13 - Diffusion d'un message à tous les autres clients sauf l'expéditeur
  broadcastOthers(client, message) {
    for (const otherClient of this.clients.keys()) {
      if (otherClient !== client && otherClient.readyState === WebSocket.OPEN) {
        otherClient.send(message);
      }
    }
  }

  // Step 14 - Envoie un message à un client spécifique
  send(client, message) {
    if (client.readyState !== WebSocket.OPEN) return;
    client.send(message);
  }

  // Step 15 - Envoie un message d'échec d'authentification
  sendAuthFailed(client) {
    this.send(client, 'auth-failed');
  }

  // Step 16 - Envoie un message de succès d'authentification
  sendAuthSuccess(client) {
    this.send(client, 'auth-success');
  }

  // Step 17 - Récupère les métadonnées de tous les clients connectés
  geClientsData() {
    return Array.from(this.clients.values());
  }
}
