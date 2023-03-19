
class Message {
  constructor(uid, name, message) {
    this.uid = uid;
    this.name = name;
    this.message = message;
  }
}

class ChatMessages {

  constructor() {
    this.messsages = [];
    this.users = {};
  }

  get last10() {
    this.messsages = this.messsages.splice(0, 10);
    return this .messsages;
  }

  get usersArr() {
    return Object.values( this.users ); // [ {}, {}, {}]
  }

  sendMessage( uid, name, message) {
    this.messsages.unshift(
      new Message(uid, name, message)
    );
  }

  connectUser(user) {
    this.users[user.id] = user
  }

  disconnectUser(id) {
    delete this.users[id];
  }
}

module.exports = {
  ChatMessages
};