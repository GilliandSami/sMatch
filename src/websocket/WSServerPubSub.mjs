import WSServer from "./WSServer.mjs";
import WSServerError from "./WSServerError.mjs";

export default class WSServerPubSub extends WSServer {
  // Initialise les maps pour stocker les canaux et les RPC
  channels = new Map();
  rpcs = new Map();

  /**
   * Step 1 - Ajout d'un canal de publication/souscription
   *
   * @param {string} chan - Nom du canal
   * @param {object} options - Options du canal
   * @param {boolean} [options.usersCanPub=true] - Autoriser les utilisateurs à publier sur ce canal
   * @param {boolean} [options.usersCanSub=true] - Autoriser les utilisateurs à s'abonner à ce canal
   * @param {function} [options.hookPub=(msg, client, wsServer) => msg] - Fonction de hook avant la publication d'un message
   * @param {function} [options.hookSub=(client, wsServer) => true] - Fonction de hook avant l'abonnement d'un client
   * @param {function} [options.hookUnsub=(client, wsServer) => null] - Fonction de hook avant le désabonnement d'un client
   * @returns {boolean} - Retourne true si le canal a été ajouté, false sinon (s'il existe déjà)
   */
  addChannel(chan, {
    usersCanPub = true,
    usersCanSub = true,
    hookPub = (msg, client, wsServer) => msg,
    hookSub = (client, wsServer) => true,
    hookUnsub = (client, wsServer) => null,
  } = {}) {
    if (this.channels.has(chan)) return false; // Vérifie si le canal existe déjà
    this.channels.set(chan, {
      usersCanPub,
      usersCanSub,
      hookPub,
      hookSub,
      hookUnsub,
      clients: new Set(), // Stocke les clients abonnés au canal
    });
    return true;
  }

  /**
   * Step 2 - Ajout d'un appel de procédure distante (RPC)
   *
   * @param {string} name - Nom de la procédure RPC
   * @param {function} callback - Fonction à exécuter lors de l'appel du RPC
   * @returns {boolean} - Retourne true si la RPC a été ajoutée, false sinon (si elle existe déjà)
   */
  addRpc(name, callback) {
    if (this.rpcs.has(name)) return false; // Vérifie si la RPC existe déjà
    this.rpcs.set(name, callback); // Ajoute la RPC avec son callback
    return true;
  }

  /**
   * Step 3 - Suppression d'un canal de publication/souscription
   *
   * @param {string} chanName - Nom du canal à supprimer
   * @returns {boolean} - Retourne true si le canal a été supprimé, false sinon (s'il n'existe pas)
   */
  removeChannel(chanName) {
    if (!this.channels.has(chanName)) return false;
    const chan = this.channels.get(chanName);
    // Appelle le hook de désabonnement pour chaque client
    for (const client of chan.clients) {
      chan.hookUnsub(this.clients.get(client), this);
    }
    this.channels.delete(chanName); // Supprime le canal
    return true;
  }

  /**
   * Step 4 - Suppression d'un appel de procédure distante (RPC)
   *
   * @param {string} name - Nom de la RPC à supprimer
   * @returns {boolean} - Retourne true si la RPC a été supprimée, false sinon (si elle n'existe pas)
   */
  removeRpc(name) {
    if (!this.rpcs.has(name)) return false;
    this.rpcs.delete(name); // Supprime la RPC
    return true;
  }

  /**
   * Step 5 - Gestion des messages reçus d'un client
   * 
   * @param {object} client - Le client qui a envoyé le message
   * @param {string} message - Le message reçu
   */
  onMessage(client, message) {
    message = message.toString();
    let data;
    try {
      data = JSON.parse(message); // Tente de parser le message en JSON
    } catch (e) {
      return this.sendError(client, 'Invalid data'); // Erreur si le message n'est pas en JSON valide
    }

    // Vérifie si l'action est prise en charge (sub, pub, unsub, rpc)
    if (data.action != 'sub' && data.action != 'pub' && data.action != 'unsub' && data.action != 'rpc') {
      return this.sendError(client, 'Invalid action');
    }

    // Route l'action vers la gestion appropriée (RPC ou PubSub)
    if (data.action === 'rpc') {
      return this.manageRpc(client, data);
    } else {
      return this.managePubSub(client, data);
    }
  }

  /**
   * Step 6 - Gestion des messages Pub/Sub
   * 
   * @param {object} client - Le client qui a envoyé le message
   * @param {object} data - Données contenant l'action et les informations du canal
   */
  managePubSub(client, data) {
    // Validation des champs "chan" et "id"
    if (typeof data?.chan !== 'string') {
      return this.sendError(client, 'Invalid chan');
    }
    if (typeof data?.id !== 'number') {
      return this.sendError(client, 'Invalid id or id is missing');
    }

    // Gestion du désabonnement d'un client
    if (data.action === 'unsub') {
      if (!this.channels.has(data.chan)) {
        return this.sendUnsubError(client, data.id, data.chan, 'Unknown chan');
      }
      const chan = this.channels.get(data.chan);

      if (!chan.clients.has(client)) {
        return this.sendUnsubError(client, data.id, data.chan, 'Not subscribed');
      }

      chan.hookUnsub(this.clients.get(client), this);
      chan.clients.delete(client); // Supprime le client du canal
      return this.sendUnsubSuccess(client, data.id, data.chan, 'Unsubscribed');
    }

    // Gestion de l'abonnement d'un client
    if (data.action === 'sub') {
      if (!this.channels.has(data.chan)) {
        return this.sendSubError(client, data.id, data.chan, 'Unknown chan');
      }
      const chan = this.channels.get(data.chan);

      if (!chan.usersCanSub) {
        return this.sendSubError(client, data.id, data.chan, 'Users cannot sub on this chan');
      }

      if (!chan.hookSub(this.clients.get(client), this)) {
        return this.sendSubError(client, data.id, data.chan, 'Subscription denied');
      }

      chan.clients.add(client); // Ajoute le client au canal
      return this.sendSubSuccess(client, data.id, data.chan, 'Subscribed');
    }

    // Gestion de la publication d'un message
    if (data.action === 'pub') {
      if (!this.channels.has(data.chan)) {
        return this.sendPubError(client, data.id, data.chan, 'Unknown chan');
      }
      const chan = this.channels.get(data.chan);

      if (!chan.usersCanPub) {
        return this.sendPubError(client, data.id, data.chan, 'Users cannot pub on this chan');
      }

      let dataToSend;
      try {
        dataToSend = chan.hookPub(data.msg, this.clients.get(client), this);
      } catch (e) {
        if (!(e instanceof WSServerError)) this.log(e.name + ': ' + e.message);
        const response = e instanceof WSServerError ? e.message : 'Server error';
        return this.sendPubError(client, data.id, data.chan, response);
      }

      this.sendPubSuccess(client, data.id, data.chan, 'Message sent');
      return this.pub(data.chan, dataToSend);
    }
  }

  /**
   * Step 7 - Gestion des appels de procédures distantes (RPC)
   * 
   * @param {object} client - Le client qui a envoyé l'appel RPC
   * @param {object} data - Données contenant l'action, le nom et les paramètres du RPC
   */
  manageRpc(client, data) {
    if (typeof data?.name !== 'string') {
      return this.sendError(client, 'Invalid rpc name');
    }
    if (!data?.data) {
      return this.sendError(client, 'Data is required');
    }
    if (typeof data?.id !== 'number') {
      return this.sendError(client, 'Invalid rpc id');
    }

    const rpc = this.rpcs.get(data.name);

    if (!rpc) {
      return this.sendRpcError(client, data.id, data.name, 'Unknown rpc');
    }

    let response;
    try {
      response = rpc(data.data, this.clients.get(client), this);
    } catch (e) {
      if (!(e instanceof WSServerError)) this.log(e.name + ': ' + e.message);
      const response = e instanceof WSServerError ? e.message : 'Server error';
      return this.sendRpcError(client, data.id, data.name, response);
    }

    return this.sendRpcSuccess(client, data.id, data.name, response);
  }

  /**
   * Step 8 - Publier un message à tous les clients d'un canal spécifique
   * 
   * @param {string} chanName - Nom du canal
   * @param {object} msg - Message à envoyer
   * @returns {boolean} - Retourne true si le message a été envoyé avec succès
   */
  pub(chanName, msg) {
    const chan = this.channels.get(chanName);
    if (!chan) return false;

    const message = JSON.stringify({
      action: 'pub',
      chan: chanName,
      msg,
    });

    for (const client of chan.clients) {
      this.send(client, message);
    }

    return true;
  }

  /**
   * Step 9 - Gestion de la fermeture de la connexion d'un client
   * 
   * @param {object} client - Le client qui se déconnecte
   */
  onClose(client) {
    for (const chan of this.channels.values()) {
      if (chan.clients.has(client)) {
        chan.hookUnsub(this.clients.get(client), this);
        chan.clients.delete(client);
      }
    }
    super.onClose(client);
  }

  /**
   * Step 10 - Méthodes utilitaires pour envoyer des réponses et des erreurs aux clients
   */
  sendError(client, msg) {
    this.send(client, JSON.stringify({ action: 'error', msg }));
    return false;
  }

  sendRpcError(client, id, name, response) {
    this.sendRpc(client, id, name, response, 'error');
    return false;
  }

  sendRpcSuccess(client, id, name, response) {
    this.sendRpc(client, id, name, response);
    return true;
  }

  sendRpc(client, id, name, response, type = 'success') {
    this.send(client, JSON.stringify({
      action: 'rpc',
      id,
      name,
      type,
      response,
    }));
  }

  sendSubError(client, id, chan, response) {
    this.sendSubConfirm(client, id, chan, response, 'error');
    return false;
  }

  sendSubSuccess(client, id, chan, response) {
    this.sendSubConfirm(client, id, chan, response);
    return true;
  }

  sendSubConfirm(client, id, chan, response, type = 'success') {
    this.send(client, JSON.stringify({
      action: 'sub',
      id,
      chan,
      type,
      response,
    }));
  }

  sendUnsubError(client, id, chan, response) {
    this.sendUnsubConfirm(client, id, chan, response, 'error');
    return false;
  }

  sendUnsubSuccess(client, id, chan, response) {
    this.sendUnsubConfirm(client, id, chan, response);
    return true;
  }

  sendUnsubConfirm(client, id, chan, response, type = 'success') {
    this.send(client, JSON.stringify({
      action: 'unsub',
      id,
      chan,
      type,
      response,
    }));
  }

  sendPubError(client, id, chan, response) {
    this.sendPubConfirm(client, id, chan, response, 'error');
    return false;
  }

  sendPubSuccess(client, id, chan, response) {
    this.sendPubConfirm(client, id, chan, response);
    return true;
  }

  sendPubConfirm(client, id, chan, response, type = 'success') {
    this.send(client, JSON.stringify({
      action: 'pub-confirm',
      id,
      chan,
      type,
      response,
    }));
  }

  sendAuthFailed(client) {
    this.send(client, JSON.stringify({ action: 'auth-failed' }));
  }

  sendAuthSuccess(client) {
    this.send(client, JSON.stringify({ action: 'auth-success' }));
  }
}
