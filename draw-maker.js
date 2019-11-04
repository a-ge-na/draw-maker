
/**
 * ダブルスペアを表すクラス
 * 
 * @param {String} player1 
 * @param {String} team1 
 * @param {String} player2 
 * @param {String} team2 
 * @param {Number} seed 
 */
class Pair extends Object{
    constructor(player1, team1, player2, team2, seed){
        super();
        this.player1 = player1;
        this.team1 = team1;
        this.player2 = player2;
        this.team2 = team2;
        this.seed = seed;
    }

    getFriendship(obj){
        if(obj === this){
            return 0;
        }
        if(obj instanceof Array){
            var sum = 0;
            obj.forEach(element => {
                sum += this.getFriendship(element);
            });
            return sum;
        }else if(obj instanceof Pair){
            var score = 0;
            score += (this.team1 == obj.team1) ? 1 : 0;
            score += (this.team1 == obj.team2) ? 1 : 0;
            score += (this.team2 == obj.team1) ? 1 : 0;
            score += (this.team2 == obj.team2) ? 1 : 0;
            return score;
        }else{
            console.log('error');
        }
    }
    
}

/**
 * ラウンドロビンの対戦ブロックを表すクラス
 * 
 * @param {Numver} capacity ブロック内のユニット数
 */
class Block extends Array{
    constructor(capacity){
        super(capacity);
    }        
}
/**
 * 
 */
window.onload = function() {
    var button = document.getElementById('button-go');
    button.addEventListener('click', function() {
        var data = text2array();
        data = makeDraw(data);
        array2table(data);
    });

    button.click();
}

/**
 * 入力されたテキストを配列に変換
 */
function text2array() {
    var textarea = document.getElementById('input-text');
    var lines = textarea.value.split(/\r\n|\n/);
    lines.forEach(element => {element = element.trim()});
    lines = lines.filter(line => line.trim().length > 0);
    var mode = document.getElementById('mode');
    var objs = Array();
    switch (mode.value) {
        case 'T':
            var sepaletor = "\t";
            break;
        case 'C':
            var sepaletor = ",";
            break;
    }
    lines.forEach(element => {
        var token = element.split(sepaletor);
        var i = 0;
        var obj = new Pair(token[i++], token[i++], token[i++], token[i++], token[i++]);
        objs.push(obj);
    });
    return objs;
}

/**
 * 
 * @param {*} data 
 */
function makeDraw(data){
//    switch(data.length){
//    case 6:
        var blocks = Array(new Block(3), new Block(3));
        //        break;
//    }
    // TODO: テーブルを作る
    // テーブルの配列を返す
    // 
    data.sort(function(a, b){
/*
        seed順を最優先
        同チームの多い方を優先
        その他・・・
*/
        // SEED
        return b.getFriendship(data) - a.getFriendship(data);
    });
    data.forEach(element => {
        console.log(element,element.getFriendship(data));
    });
    return data;
}

/**
 * 配列をテーブルに出力
 */
function array2table(data) {
    // 既存テーブルがあれば削除
    // 組数に合わせて配分？
}