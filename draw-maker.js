/**
 * ダブルスペアを表すクラス
 * 
 * @param {String} player1 
 * @param {String} team1 
 * @param {String} player2 
 * @param {String} team2 
 * @param {Number} seed 
 */
class Pair extends Object {
    constructor(player1, team1, player2, team2, seed) {
        super();
        this.player1 = player1;
        this.team1 = team1;
        this.player2 = player2;
        this.team2 = team2;
        this.seed = seed;
    }

    getFriendship(obj) {
        if (obj === this) {
            return 0;
        }
        if (obj instanceof Array) {
            var sum = 0;
            obj.forEach(element => {
                sum += this.getFriendship(element);
            });
            return sum;
        } else if (obj instanceof Pair) {
            var score = 0;
            score += (this.team1 == obj.team1) ? 1 : 0;
            score += (this.team1 == obj.team2) ? 1 : 0;
            score += (this.team2 == obj.team1) ? 1 : 0;
            score += (this.team2 == obj.team2) ? 1 : 0;
            score *= (this.team1 == this.team2) ? 2 : 1;
            return score;
        } else {
            console.log('error');
        }
    }

}

/**
 * ラウンドロビンの対戦ブロックを表すクラス
 * 
 * @param {Numver} capacity ブロック内のユニット数
 */
class Block extends Array {
    constructor() {
        super();
    }

    /**
     * ペアの拒否レベル
     * 
     * @param {Pair} Obj 
     */
    getRefusalScore(Obj) {
        var score = 0;
        score += 10000 * this.length;
        score += 100 * Obj.getFriendship(this);
        score += 1 * 0;
        return score;
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
    lines.forEach(element => { element = element.trim() });
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
function makeDraw(data) {
    var blockcount = Math.ceil(data.length / 4);
    var blocks = [...Array(blockcount)].map(x => new Block());  // blockcount個のBlockの配列
    var data2 = Array.from(data);
    data2.sort(function(a, b) {
        return b.getFriendship(data2) - a.getFriendship(data2);
    });
    while(pair = data2.shift()){
        var block = blocks.reduce((a, b) => a.getRefusalScore(pair) <= b.getRefusalScore(pair) ? a : b);
        block.push(pair);
        data2.sort(function(a, b) {
            return b.getFriendship(data2) - a.getFriendship(data2);
        });
    }
console.log(blocks);
return blocks;
}

/**
 * 配列をテーブルに出力
 */
function array2table(data) {
    // 既存テーブルがあれば削除
    // 組数に合わせて配分？
}