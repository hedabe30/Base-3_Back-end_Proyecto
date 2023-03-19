
let url = "http://localhost:8080/api/auth/";

let user = null;
let socket = null;

//Referencias HTML
const txtUid      = document.querySelector('#txtUid')
const txtMensaje  = document.querySelector('#txtMensaje')
const ulUsers     = document.querySelector('#ulUsers')
const ulMenssages = document.querySelector('#ulMenssages')
const btnSalir    = document.querySelector('#btnSalir')


const validateJWT = async () => {

  const token = localStorage.getItem('token') || '';

  if (token <= 10) {
    window.location = 'index.html';
    throw new Error('No hay token en el servidor');
  }

  const resp = await fetch(url , {
    headers: {'x-token': token}
  });

  const { user: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem('token', tokenDB);
  console.log(userDB, tokenDB);
  user = userDB;
  document.title = user.name;

  await connectSocket();

}

const connectSocket = async () => {

  socket = io({
    'extraHeaders': {
      'x-token': localStorage.getItem('token')
    }
  });

  socket.on('connect', () => {
    console.log('Socket online');
  })
  socket.on('disconnect', () => {
    console.log('Socket offline');
  })

  socket.on('recibir-mensajes', drawMessages)

  socket.on('usuarios-activos', drawUsers);

  socket.on('mensaje-privado', (payload) => {
    console.log('Privado', payload);
  })
}

const drawUsers = (users = []) => {
  let usersHtml = '';
  users.forEach(({name, uid}) => {

    usersHtml += `
      <li>
        <p>
          <h5 class="text-success"> ${name} <h5/>
          <span class="fs-6 text-muted">${uid}<span/>
        <p/>
      </li>
    `
  })

  ulUsers.innerHTML = usersHtml;
}

const drawMessages = (messages = []) => {
  let messagesHtml = '';
  messages.forEach(({name, message}) => {

    messagesHtml += `
      <li>
        <p>
          <span class="text-primary">${name}: <span/>
          <span>${message}<span/>
        <p/>
      </li>
    `
  })

  ulMenssages.innerHTML = messagesHtml;
}

txtMensaje.addEventListener('keyup', ({keyCode}) => {

  const message = txtMensaje.value;
  const uid = txtUid.value;

  if(keyCode !== 13) { return; }
  if(message.length === 0) { return; }

  socket.emit('enviar-mensaje', {message, uid});

  txtMensaje.value = '';

})

const main = async () => {

  //Validar JWT
  await validateJWT();


};

main();