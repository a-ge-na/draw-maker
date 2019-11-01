function Unit() {

}

function Pair(player1, team1, player2, team2, seed) {
    this.player1 = player1;
    this.team1 = team1;
    this.player2 = player2;
    this.team2 = team2;
    this.seed = seed;
}

/**
 * 
 */
window.onload = function() {
    var button = document.getElementById('button-go');
    button.addEventListener('click', function() {
        var data = text2array();
        array2table(data);
    });
}

/**
 * 入力されたテキストを配列に変換
 */
function text2array() {
    var textarea = document.getElementById('input-text');
    var lines = textarea.value.split(/\r\n|\n/).filter(line => line.trim().length > 0);
    var mode = document.getElementById('mode');
    switch (mode.value) {
        case 'T':
            var sepaletor = "\t";
            break;
        case 'C':
            var sepaletor = ",";
            break;
    }
    console.log(lines);
    lines.forEach(element => {
        var token = element.split(sepaletor);
        var i = 0;
        var obj = new Pair(token[i++], token[i++], token[i++], token[i++], token[i++]);
        console.log(obj);
    });
}

/**
 * 配列をテーブルに出力
 */
function array2table(data) {

}