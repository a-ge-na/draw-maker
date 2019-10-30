/**
 * 
 */
window.onload = function (){
    var button = document.getElementById('button-go');
    button.addEventListener('click', function(){
        var data = text2array();
        array2table(data);
    });
}

/**
 * 入力されたテキストを配列に変換
 */
function text2array(){
    var textarea = document.getElementById('input-text');
    var lines = textarea.value.split(/\r\n|\n/);
    lines.filter(line => line.trim!='');
    console.log(lines);

    var mode = document.getElementById('mode');
    switch(mode.value){
    case 'T':
        var sepaletor = "\t";
        break;
    case 'C':
        var sepaletor = ",";
        break;
    }
}

/**
 * 配列をテーブルに出力
 */
function array2table(data){

}

