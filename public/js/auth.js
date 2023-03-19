const myForm = document.querySelector('form');

let url = "http://localhost:8080/api/auth/";

myForm.addEventListener('submit', ev => {
  ev.preventDefault();

  const formData = {};

  for ( let el of myForm.elements ) {
    if (el.name.length > 0) {
      formData[el.name] = el.value
    }
  }

  console.log(formData);

  fetch(url + 'login', {
    method: 'POST',
    body: JSON.stringify( formData ),
    headers: { 'Content-Type': 'application/json' }
  })
  .then( resp => resp.json())
  .then( ({ msg, token }) => {
    if (msg) {
      console.error(msg);
    }

    localStorage.setItem('token', token);
    window.location = 'chat.html';
  })
  .catch( err => {
    console.log(err)
  })
})



function handleCredentialResponse(response) {
  //Google token: ID_TOKEN
  // console.log(response.credential);
  const body = { id_token: response.credential };

  fetch(url + "google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then((resp) => {
      console.log(resp.token);
      // localStorage.setItem("email", resp.user.email);
      localStorage.setItem("token", resp.token);
      window.location = 'chat.html';
    })
    .catch(console.warn);
}

const button = document.getElementById("google_signout");
button.onclick = () => {
  google.accounts.id.disableAutoSelect();

  google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
    localStorage.clear();
    location.reload();
  });
};
