var script= null;
var scriptOriginal = null;
window.onload = iniciarLenguaje();
function editarLenguaje(idioma){
    if(script == null){
        document.head.removeChild(scriptOriginal);
    }
    if (script !=null) {
        document.head.removeChild(script);
    }
    
    script = document.createElement("script");
    script.src ="https://maps.googleapis.com/maps/api/js?key=AIzaSyDtdoQeXdlgm1q7E8gEVrxZeOA-8fssxOM&libraries=places&callback=iniciaMapa&language=" +
  idioma;
document.head.appendChild(script);
}
function iniciarLenguaje(){
    console.log('inicie we');
     scriptOriginal = document.createElement("script");
    scriptOriginal.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDtdoQeXdlgm1q7E8gEVrxZeOA-8fssxOM&libraries=places&callback=iniciaMapa';
    document.head.appendChild(scriptOriginal);
}

var provider = new firebase.auth.GoogleAuthProvider();
auth.onAuthStateChanged( user =>{
 
    if(user){
        console.log('Usuario entró');
    }
    else{
        window.open('https://maniakevin.github.io/GeoReferenciados-Practica1/ProyectoFinal/indexhd.html','_self');
    }

});

const salir = document.getElementById('salir');

salir.addEventListener('click', (e)=>{
    e.preventDefault();
    auth.signOut().then(()=>{
        alert("El usuario ha salido del sistema");
        window.open('https://maniakevin.github.io/GeoReferenciados-Practica1/ProyectoFinal/indexhd.html','_self');
    });

});