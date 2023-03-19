const { Socket } = require("socket.io");
const { readJWT } = require("../utils/generate-jwt");
const { ChatMessages } = require("../models/chat-messages");

const chatMessages = new ChatMessages();


const socketController = async ( socket = new Socket(), io ) => {

  const token = socket.handshake.headers['x-token'];
  const user = await readJWT(token);

  if (!user) {
    return socket.disconnect();
  }

  //Agregar el usuario conectado
  chatMessages.connectUser( user );
  io.emit('usuarios-activos', chatMessages.usersArr)
  socket.emit('recibir-mensajes', chatMessages.last10)

  //Conectar al usuario a una sala epecial
  socket.join( user.id );

  //Limpiar cuadno alguien se desconecta
  socket.on('disconnect', () => {
    chatMessages.disconnectUser( user.id );
    io.emit('usuarios-activos', chatMessages.usersArr)
  })

  //Escuchar mensajes
  socket.on('enviar-mensaje', ({ message, uid }) => {
    if (uid) {
      //Mensaje privado
      return socket.to( uid ).emit('mensaje-privado',{ de: user.name, message});
    }
    //Mensaje Publico
    chatMessages.sendMessage(user.id, user.name, message);
    io.emit('recibir-mensajes', chatMessages.last10)
  })
}

module.exports = {
  socketController
}