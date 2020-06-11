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
     scriptOriginal = document.createElement("scriptOriginal");
    scriptOriginal.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDtdoQeXdlgm1q7E8gEVrxZeOA-8fssxOM&libraries=places&callback=iniciaMapa';
    document.head.appendChild(scriptOriginal);
    document.onload = iniciarLenguaje();
}
