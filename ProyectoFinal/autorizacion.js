var provider = new firebase.auth.GoogleAuthProvider();
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("Usuario entró");
    sessionStorage.setItem("idusuario",user.uid);
    window.open("https://lgsusmx.github.io/GeoReferenciados-Practica1/ProyectoFinal/index.html","_self");
  } else {
    console.log("Usuario salió");
  }
});

const formaregistrate = document.getElementById("formaregistrate");

formaregistrate.addEventListener("submit", (e) => {
  e.preventDefault();

  const correo = formaregistrate["rcorreo"].value;
  const contrasena = formaregistrate["rcontrasena"].value;

  auth
    .createUserWithEmailAndPassword(correo, contrasena)
    .then((cred) => {
      return db.collection("usuarios").doc(cred.user.uid).set({
        nombre: formaregistrate["rnombre"].value,
        telefono: formaregistrate["rtelefono"].value,
        direccion: formaregistrate["rdireccion"].value,
      });
    })
    .then(() => {
      $("#registratemodal").modal("hide");
      sessionStorage.setItem("idusuario",cred.user.uid);
      formaregistrate.reset();
      formaregistrate.querySelector(".error").innerHTML = "";
    })
    .catch((err) => {
      formaregistrate.querySelector(".error").innerHTML = mensajeError(
        err.code
      );
    });
});

function mensajeError(codigo) {
  let mensaje = "";

  switch (codigo) {
    case "auth/wrong-password":
      mensaje = "Su contraseña no es correcta";
      break;
    case "auth/user-not-found":
      mensaje = "El usuario no existe o el correo no esta registrado";
      break;
    case "auth/weak-password":
      mensaje = "Contraseña débil debe tener al menos 6 caracteres";
      break;
    default:
      mensaje = "Ocurrió un error al ingresar con este usuario";
  }
  return mensaje;
}

const formaingresar = document.getElementById("formaingresar");

formaingresar.addEventListener("submit", (e) => {
  e.preventDefault();
  let correo = formaingresar["correo"].value;
  let contrasena = formaingresar["contrasena"].value;

  auth
    .signInWithEmailAndPassword(correo, contrasena)
    .then((cred) => {
      $("#ingresarmodal").modal("hide");
      formaingresar.reset();
      formaingresar.querySelector(".error").innerHTML = "";
    })
    .catch((err) => {
      formaingresar.querySelector(".error").innerHTML = mensajeError(err.code);
      console.log(err);
    });
});

entrarGoogle = () => {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
      var token = result.credential.accessToken;
      console.log(token);

      var user = result.user;

      console.log(user);
      const html = `
                <p>Nombre: ${user.displayName}</p>
                <p>Correo: ${user.email}</p>
                <img src="${user.photoURL}" width="50px">
            `;
      datosdelacuenta.innerHTML = html;

      $("#ingresarmodal").modal("hide");
      formaingresar.reset();
      formaingresar.querySelector(".error").innerHTML = "";

      // ...
    })
    .catch(function (error) {
      console.log(error);
    });
};

entrarFacebook = () => {
  var provider2 = new firebase.auth.FacebookAuthProvider();

  firebase
    .auth()
    .signInWithPopup(provider2)
    .then(function (result) {
      var token = result.credential.accessToken;
      console.log(token);
      var user = result.user;

      console.log(user);
      const html = `
            <img src="${user.photoURL}" width="50px"  >
                <p>Nombre: ${user.displayName}</p>
                <p>Correo: ${user.email}</p>
                
            `;
      datosdelacuenta.innerHTML = html;

      $("#ingresarmodal").modal("hide");
      formaingresar.reset();
      formaingresar.querySelector(".error").innerHTML = "";

      // ...
    })
    .catch(function (error) {
      console.log(error);
    });
};

function recuperarPWD() {
  var emailAddress = document.getElementById('rrecuperacorreo').value;
  auth.sendPasswordResetEmail(emailAddress).then(function () {
      alert('Enviamos un correo a tu direccion proporcionada para restablecer la contraseña');
    })
    .catch(function (error) {
        alert(error);
    });
}
