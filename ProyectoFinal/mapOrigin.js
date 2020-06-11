
var script= null;
var scriptOriginal = document.createElement('scriptOriginal');
scriptOriginal.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDtdoQeXdlgm1q7E8gEVrxZeOA-8fssxOM&libraries=places&callback=iniciaMapa';
document.head.appendChild(scriptOriginal);
function editarLenguaje(idioma){
    if(scriptOriginal == null){
        document.head.removeChild(scriptOriginal);
        script = document.createElement('script');
    }
    if (script !=null) {
        document.head.removeChild(script);
    }
    
    var script = document.createElement("script");
    script.src ="https://maps.googleapis.com/maps/api/js?key=AIzaSyDtdoQeXdlgm1q7E8gEVrxZeOA-8fssxOM&libraries=places&callback=iniciaMapa&language=" +
  idioma;
document.head.appendChild(script);
}
