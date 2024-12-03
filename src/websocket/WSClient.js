import EventMixins from './Event.js';
import { bytesBase64Encode } from "./string.mjs";

export default class WSClient {
  // Step 1 - Initialisation du client WebSocket PubSub
  constructor(url = null, defaultTimeout = 5000) {
    // Définit l'URL du WebSocket en fonction de l'environnement (localhost, HTTPS)
    if (url === null) {
      const hostname = window.location.hostname;
      const mustBeSecure = window.location.protocol == 'https:';
      const port = mustBeSecure ? 443 : 80;
      this.url = `${mustBeSecure ? 'wss' : 'ws'}://${hostname}:${port}`;
    } else {
      this.url = url;
    }
    this.wsClient = null;
    this.defaultTimeout = defaultTimeout;
    this.rpcId = 0;   // Identifiant pour les appels RPC
    this.pubId = 0;   // Identifiant pour les publications
    this.subId = 0;   // Identifiant pour les souscriptions
    this.unsubId = 0; // Identifiant pour les désabonnements

    Object.assign(this, EventMixins);  // Mélange les méthodes d'EventMixins dans cette classe
    this.mixinEvent();  // Initialise les événements
  }

  // Step 2 - Connexion au serveur WebSocket avec une option de token d'authentification
  connect(token = null) {
    // Vérifie si le token est une chaîne de caractères, sinon rejette la connexion
    if (token != null && typeof token != 'string') {
      return Promise.reject(new Error('The auth token must be a string.'));
    }
    const subprotocols = ['im.pubsub'];  // Définit les sous-protocoles utilisés
    if (typeof token === 'string') {
      subprotocols.push(bytesBase64Encode(token));  // Encode le token en base64 et l'ajoute aux sous-protocoles
    }

    this.wsClient = new WebSocket(this.url, subprotocols);  // Crée le WebSocket avec l'URL et les sous-protocoles
    this.wsClient.addEventListener('message', (event) => this.onMessage(event));  // Ajoute un écouteur pour les messages

    return new Promise((resolve, reject) => {
      // Résout ou rejette la promesse en fonction des événements de connexion
      this.once('ws:auth:sucess', () => resolve());
      this.once('ws:auth:failed', () => reject(new Error('WS auth failed')));
      this.wsClient.addEventListener('error', () => reject(new Error('WS connection error')));
      this.wsClient.addEventListener('close', () => {
        this.close();
        reject(new Error('WS connection closed.'));
      });
    });
  }

  // Step 3 - Fermeture de la connexion WebSocket
  close() {
    if (this.wsClient === null) return;
    this.wsClient.close();
    this.wsClient = null;
    this.emit('close');  // Émet l'événement de fermeture
  }

  // Step 4 - Gestion des messages reçus du WebSocket
  onMessage(event) {
    const data = JSON.parse(event.data);  // Parse le message reçu en JSON

    // Gestion des différentes actions (sub, unsub, pub-confirm, pub, rpc, error, auth-failed, auth-success)
    if (data.action === 'sub') {
      this.emit(`ws:sub:${data.chan}`, {
        response: data.response,
        type: data.type,
        id: data.id,
      });
      return;
    }

    if (data.action === 'unsub') {
      this.emit(`ws:unsub:${data.chan}`, {
        response: data.response,
        type: data.type,
        id: data.id,
      });
      return;
    }

    if (data.action === 'pub-confirm') {
      this.emit(`ws:pub:${data.chan}`, {
        response: data.response,
        type: data.type,
        id: data.id,
      });
      return;
    }

    if (data.action === 'pub') {
      this.emit(`ws:chan:${data.chan}`, data.msg);
      return;
    }

    if (data.action === 'rpc') {
      this.emit(`ws:rpc:${data.name}`, {
        response: data.response,
        type: data.type,
        id: data.id,
      });
      return;
    }

    if (data.action === 'error') {
      this.emit(`ws:error`, data.msg);
      return;
    }

    if (data.action === 'auth-failed') {
      this.emit('ws:auth:failed');
      this.close();
      return;
    }

    if (data.action === 'auth-success') {
      this.emit('ws:auth:sucess');
      return;
    }
  }

  // Step 5 - Appel de procédure à distance (RPC) via WebSocket
  rpc(name, data = {}, timeout = this.defaultTimeout) {
    return new Promise((resolve, reject) => {
      const id = this.rpcId++;  // Incrémente l'ID du RPC

      const timer = setTimeout(() => {
        this.off(`ws:rpc:${name}`, callback);
        reject(new Error('WS RPC Timeout for ' + name + ' (rpc id: ' + id + ')'));
      }, timeout);

      const callback = (resp) => {
        if (resp.id !== id) return;
        clearTimeout(timer);
        this.off(`ws:rpc:${name}`, callback);
        if (resp.type === 'success') {
          resolve(resp.response)
        } else {
          reject(new Error(resp.response));
        }
      };

      this.on(`ws:rpc:${name}`, callback);  // Ajoute le callback pour l'événement RPC
      this.wsClient.send(JSON.stringify({ action: 'rpc', name, data, id }));  // Envoie la requête RPC au serveur
    });
  }

  // Step 6 - Publication d'un message sur un canal
  pub(chan, msg, timeout = this.defaultTimeout) {
    return new Promise((resolve, reject) => {
      const id = this.pubId++;  // Incrémente l'ID de publication

      const timer = setTimeout(() => {
        this.off(`ws:pub:${chan}`, callback);
        reject(new Error('WS Pub Timeout for ' + chan + ' (pub id: ' + id + ')'));
      }, timeout);

      const callback = (resp) => {
        if (resp.id !== id) return;
        clearTimeout(timer);
        this.off(`ws:pub:${chan}`, callback);
        if (resp.type === 'success') {
          resolve(resp.response)
        } else {
          reject(new Error(resp.response));
        }
      };

      this.on(`ws:pub:${chan}`, callback);  // Ajoute le callback pour l'événement de publication
      this.wsClient.send(JSON.stringify({ action: 'pub', chan, id, msg }));  // Envoie la publication au serveur
    });
  }

  // Step 7 - Souscription à un canal
  sub(chan, callback, timeout = this.defaultTimeout) {
    this.on(`ws:chan:${chan}`, callback);  // Ajoute un callback pour les messages de ce canal
    if (!this.hasListener(chan)) {
      return new Promise((resolve, reject) => {
        const id = this.subId++;  // Incrémente l'ID de souscription

        const timer = setTimeout(() => {
          this.off(`ws:sub:${chan}`, subCallback);
          reject(new Error('WS Sub Timeout for ' + chan + ' (sub id: ' + id + ')'));
        }, timeout);

        const subCallback = (resp) => {
          if (resp.id !== id) return;
          clearTimeout(timer);
          this.off(`ws:sub:${chan}`, subCallback);
          if (resp.type === 'success') {
            resolve(resp.response)
          } else {
            this.off(`ws:chan:${chan}`, callback);
            reject(new Error(resp.response));
          }
        };

        this.on(`ws:sub:${chan}`, subCallback);  // Ajoute le callback pour la réponse de souscription
        this.wsClient.send(JSON.stringify({ action: 'sub', chan, id }));  // Envoie la demande de souscription au serveur
      });
    }
    return Promise.resolve('Subscribed');
  }

  // Step 8 - Désabonnement d'un canal
  unsub(chan, callback = null, timeout = this.defaultTimeout) {
    if (callback !== null) {
      this.off(`ws:chan:${chan}`, callback);  // Supprime un callback spécifique
    } else {
      this.clear(`ws:chan:${chan}`);  // Supprime tous les callbacks du canal
    }

    if (!this.hasListener(`ws:chan:${chan}`)) {
      return new Promise((resolve, reject) => {
        const id = this.unsubId++;  // Incrémente l'ID de désabonnement

        const timer = setTimeout(() => {
          this.off(`ws:unsub:${chan}`, unsubCallback);
          reject(new Error('WS Unsub Timeout for ' + chan + ' (unsub id: ' + id + ')'));
        }, timeout);

        const unsubCallback = (resp) => {
          if (resp.id !== id) return;
          clearTimeout(timer);
          this.off(`ws:unsub:${chan}`, unsubCallback);
          if (resp.type === 'success') {
            resolve(resp.response)
          } else {
            reject(new Error(resp.response));
          }
        };

        this.on(`ws:unsub:${chan}`, unsubCallback);  // Ajoute le callback pour la réponse de désabonnement
        this.wsClient.send(JSON.stringify({ action: 'unsub', chan, id }));  // Envoie la demande de désabonnement au serveur
      });
    }

    return Promise.resolve('Unsubscribed');
  }
}
