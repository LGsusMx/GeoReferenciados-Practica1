
function cambioIdioma() {

    d = document.getElementById('idioma');
    idioma = d.value;



    var titulo = document.getElementById('title');
    var añadir = document.getElementById('Add');
    var ruta = document.getElementById('pac-input');
    var paradas = document.getElementById('navbarDropdown');
    var borrar = document.getElementById('borraParadas');
    var advertencia = document.getElementById('labelAdvertencia');
    var trazar = document.getElementById('pac-input2');
    var español = document.getElementById('español');
    var ingles = document.getElementById('ingles');
    var italiano = document.getElementById('italiano');
    var chino = document.getElementById('chino');
    var japones = document.getElementById('japones');
    var ruso = document.getElementById('ruso');
    var aleman = document.getElementById('aleman');
    console.log(idioma);


    if (idioma == 'es'){
        titulo.textContent = "Traza tu ruta";
        añadir.textContent = "Agregar parada";
        ruta.placeholder = "Escriba una parada";
        paradas.textContent = "Paradas";
        borrar.textContent = "Borrar todas las paradas";
        advertencia.textContent = "Seleccione un elemento de la lista para borrarlo";
        trazar.textContent = "Trazar ruta";
        español.textContent = "Español";
        ingles.textContent = "Inglés";
        italiano.textContent = "Italiano";
        chino.textContent = "Chino";
        japones.textContent = "Japonés";
        ruso.textContent = "Ruso";
        aleman.textContent = "Alemán";
    } else if (idioma == 'en') {
        titulo.textContent = "Trace your route";
        añadir.textContent = "Add a stop";
        ruta.placeholder = "Write a destination";
        paradas.textContent = "Stops";
        borrar.textContent = "Clear all stops";
        advertencia.textContent = "Select an item from the list to delete it";
        trazar.textContent = "Trace route";
        español.textContent = "Spanish";
        ingles.textContent = "English";
        italiano.textContent = "Italian";
        chino.textContent = "Chinese";
        japones.textContent = "Japanese";
        ruso.textContent = "Russian";
        aleman.textContent = "German"
    } else if (idioma == 'it') {
        titulo.textContent = "Traccia il tuo percorso";
        añadir.textContent = "Aggiungi stop";
        ruta.placeholder = "Scrivi una fermata";
        paradas.textContent = "Fermate";
        borrar.textContent = "Cancella tutte le fermate";
        advertencia.textContent = "Seleziona un elemento dall'elenco per eliminarlo";
        trazar.textContent = "Traccia percorso";
        español.textContent = "Spagnolo";
        ingles.textContent = "Inglese";
        italiano.textContent = "Italiano";
        chino.textContent = "Cinese";
        japones.textContent = "Giapponese";
        ruso.textContent = "Russo";
        aleman.textContent = "Tedesco";
    } else if (idioma == 'zh') {
        titulo.textContent = "追踪你的路线";
        añadir.textContent = "添加停止";
        ruta.placeholder = "写一个停止";
        paradas.textContent = "停止";
        borrar.textContent = "清除所有停靠点";
        advertencia.textContent = "从列表中选择一个项目以将其删除";
        trazar.textContent = "绘制路线";
        español.textContent = "西班牙文";
        ingles.textContent = "英文";
        italiano.textContent = "义大利文";
        chino.textContent = "中国人";
        japones.textContent = "日本人";
        ruso.textContent = "俄语";
        aleman.textContent = "德語";
    } else if (idioma == 'ja') {
        titulo.textContent = "ルートをたどる";
        añadir.textContent = "経由地を追加";
        ruta.placeholder = "ストップを書く";
        paradas.textContent = "ストップ";
        borrar.textContent = "すべてのストップをクリア";
        advertencia.textContent = "リストからアイテムを選択して削除します";
        trazar.textContent = "ルートをプロット";
        español.textContent = "スペイン語";
        ingles.textContent = "英語";
        italiano.textContent = "イタリア語";
        chino.textContent = "中国語";
        japones.textContent = "日本語";
        ruso.textContent = "ロシア";
        aleman.textContent = "ドイツ人";
    } else if (idioma == 'ru') {
        titulo.textContent = "Проследи свой маршрут";
        añadir.textContent = "Добавить стоп";
        ruta.placeholder = "Напиши стоп";
        paradas.textContent = "Остановки";
        borrar.textContent = "Очистить все остановки";
        advertencia.textContent = "Выберите элемент из списка, чтобы удалить его";
        trazar.textContent = "Участок маршрута";
        español.textContent = "испанский язык";
        ingles.textContent = "английский";
        italiano.textContent = "итальянский";
        chino.textContent = "Китайский";
        japones.textContent = "Японский";
        ruso.textContent = "русский";
        aleman.textContent = "Немецкий";
    } else if (idioma == 'de') {
        titulo.textContent = "Verfolgen Sie Ihre Route";
        añadir.textContent = "Stop hinzufügen";
        ruta.placeholder = "Schreiben Sie einen Stopp";
        paradas.textContent = "Stopps";
        borrar.textContent = "Alle Stopps löschen";
        advertencia.textContent = "Wählen Sie ein Element aus der Liste aus, um es zu löschen";
        trazar.textContent = "Route zeichnen";
        español.textContent = "Spanisch";
        ingles.textContent = "Englisch";
        italiano.textContent = "Italienisch";
        chino.textContent = "Chinesisch";
        japones.textContent = "Japanisch";
        ruso.textContent = "Russisch";
        aleman.textContent = "Deutsche";
    }
}


