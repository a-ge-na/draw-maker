/**
 * ダブルスペアを表すクラス
 */
class Pair extends Object {
    constructor(player1, player2, team1, team2, seed) {
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
 */
class Block extends Array {
    /**
     * ブロックの生成
     */
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
 * @description ドローの優先度の高さを返す
 * 
 * @param {Pair} pair 
 * @param {Array} teams 
 */
function getDrawProirity(pair, teams){
// TODO: シードの優先度があればそれを高く
    var priority = 0;
    priority += (teams.length - teams.findIndex(team => team.name == pair.team1));
    priority += (teams.length - teams.findIndex(team => team.name == pair.team2));
    return priority;
}

/**
 window読み込み時の処理
 */
window.onload = function() {
    var button = document.getElementById('button-go');
    button.addEventListener('click', function() {
        var data = text2array();
        var blocks = makeDraw(data);
        array2table(blocks);
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
dol
}

/**
 * 
 * @param {*} data 
 */
function makeDraw(data) {
    var blockcount = Math.ceil(data.length / 4);
    var blocks = [...Array(blockcount)].map(x => new Block());  // blockcount個のBlockの配列
    var pairs = Array.from(data);

    // {チーム：エントリー数}の配列を取得。配列は多いチームから順に並べている。
    var teams = getTeams(data);
 //   console.table(teams);
    pairs.forEach(pair => {
//        console.log(pair, getDrawProirity(pair, teams));
    });
    console.log("----");
    // シード順にソート。設定なしは999として扱う
    pairs.sort(function(a, b) {
        var seeda = a.seed ? a.seed : 999;
        var seedb = b.seed ? b.seed : 999;
        return seeda - seedb;
    });

    // シード設定があるペアを設定(ブロック数より少なければ空き順に)
    while(pairs[0].seed){
        pair = pairs.shift();
        blocks.sort(function(a, b){
            return a.length - b.length;
        });
        blocks[0].push(pair);
    }
    /*  TODO:
        一番人数の多いチーム所属から振り分け
            なるべく同じチームが当たらないように
    */

    // TODO:チーム数の多い順にソート？
    pairs.sort(function(a, b) {
        return getDrawProirity(b, teams) -  getDrawProirity(a, teams);
    });
    while(pair = pairs.shift()){
        var block = blocks.reduce((a, b) => a.getRefusalScore(pair) <= b.getRefusalScore(pair) ? a : b);
console.log(pair);
        block.push(pair);
        pairs.sort(function(a, b) {
            return b.getFriendship(pairs) - a.getFriendship(pairs);
        });
    }
    return blocks;
}

/**
 * 配列をテーブルに出力
 */
function array2table(blocks) {
    // 既存テーブルがあれば削除
    div = document.getElementById('right-part');
    div.innerText = '';

    // 組数に合わせて配分？
    var i = "A".charCodeAt(0);
    blocks.forEach(block => {
        var table = document.createElement('table');
        table.id = 'block-' + String.fromCharCode(i++);  
        block.forEach(pair => {
            var tr;
            // TODO: このへん美しくしたい
            tr = table.insertRow(-1);
            tr.insertCell(-1);
            tr.insertCell(-1);
            tr.cells[0].textContent = pair.player1;
            tr.cells[1].textContent = pair.team1;
            tr = table.insertRow(-1);
            tr.insertCell(-1);
            tr.insertCell(-1);
            tr.cells[0].textContent = pair.player2;
            tr.cells[1].textContent = pair.team2;
        });
        div.appendChild(table);
        // TODO:コピー用ボタンと関数
        var button = document.createElement('button');
        button.textContent = 'コピー';
        button.addEventListener('click', function(){
            var range = document.createRange();
            range.selectNodeContents(table);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy')
        });
        div.appendChild(button);
    });
}

/**
 * チーム名:数 の配列を作る。
 * @param {Array} data 
 */
function getTeams(data){
    // {name:チーム名, count:数}なオブジェクトを格納
    var teams = new Array;
    data.forEach(element => {
        teamcount = teams.find(team => (team.name == element.team1));
        if(!teamcount){
            teamcount = {name: element.team1, count: 1};
            teams.push(teamcount);
        }else{
            teamcount.count ++;
        }
        teamcount = teams.find(team => (team.name == element.team2));
        if(!teamcount){
            teamcount = {name: element.team2, count: 1};
            teams.push(teamcount);
        }else{
            teamcount.count ++;
        }
    });
    teams.sort(function(a, b){
        return b.count - a.count;
    });
    return teams;
}

/**
 * テーブルの中身をクリップボードにコピー
 * 
 * @param {String} tableid コピー対象のテーブルのID 
 */
function copyTableToClipboard(tableid){
    var table = document.getElementById(tableid);
    var range = document.createRange();
    range.selectNodeContents(table);
    window.getSelection().addRange(range);
}