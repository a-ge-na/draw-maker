/**
 * ダブルスペアを表すクラス
 * @constructor
 * @param {String} player1 選手名１
 * @param {String} player2 選手名２
 * @param {String} team1 チーム名１
 * @param {String} team2 チーム名２
 * @param {Number} seed シード順(省略可)
 */
Pair = function(player1, player2, team1, team2, seed) {
    this.player1 = player1;
    this.team1 = team1;
    this.player2 = player2;
    this.team2 = team2;
    this.seed = seed ? Number(seed) : 9999;

    /**
     * 引数のペアまたはペア配列との同チーム度合いを返す。
     * @param {Pair|Pair[]} obj 
     */
    this.getFriendship = function (obj) {
        if (obj === this) {
            return 0;
        }
        if (obj instanceof Array) {
            let sum = 0;
            obj.forEach(element => {
                sum += this.getFriendship(element);
            });
            return sum;
        } else if (obj instanceof Pair) {
            let score = 0;
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
 * @constructor
 * @extends Array
 */
Block = function(){
     /**
     * ペアの拒否レベル
     * @param {Pair} Obj 
     */
    this.getRefusalScore = function(Obj) {
        let score = 0;
        score += 10000 * this.length;
        score += 100 * Obj.getFriendship(this);
        score += 1 * 0;
        return score;
    }
}
Block.prototype = Object.create( Array.prototype);

/**
 * @description ドローの優先度の高さを返す
 * @deprecated 不要になりそう
 * @param {Pair} pair 
 * @param {Array} teams 
 */
function getDrawProirity(pair, teams){
// TODO: シードの優先度があればそれを高く
let priority = 0;
    priority += (teams.length - teams.findIndex(team => team.name == pair.team1));
    priority += (teams.length - teams.findIndex(team => team.name == pair.team2));
    return priority;
}

/**
 window読み込み時の処理
 */
window.onload = function() {
    let button = document.getElementById('button-go');
    button.addEventListener('click', function() {
        let data = text2array();
        let blocks = makeDraw(data);
        array2table(blocks);
    });

    button.click();
}

/**
 * 入力されたテキストを配列に変換
 * @returns {Pair[]} 選手1,選手2,チーム1,チーム2,シード の配列
 */
function text2array() {
    let textarea = document.getElementById('input-text');
    let lines = textarea.value.split(/\r\n|\n/);
    lines.forEach(element => { element = element.trim() });
    lines = lines.filter(line => line.trim().length > 0);
    let mode = document.getElementById('mode');
    let objs = Array();
    let sepaletor = {'T': "\t", 'C': ","}[mode.value];
    lines.forEach(element => {
        let token = element.split(sepaletor);
        let i = 0;
        let obj = new Pair(token[i++], token[i++], token[i++], token[i++], token[i++]);
        objs.push(obj);
    });
    return objs;
dol
}

/**
 * ドローの作成(改名 or 分割 予定)
 * @param {Pair[]} data
 * @returns {Block[]} ドローを格納したBlockの配列 
 */
function makeDraw(data) {
    let blockcount = Math.ceil(data.length / 4);
    let blocks = [...Array(blockcount)].map(x => new Block());  // blockcount個のBlockの配列
    let pairs = Array.from(data);
    let newpairs = new Array();

    // DOTO: シード順にソート取り出す
    pairs.sort(function(a,b){
        return a.seed - b.seed;
    });
    while(pairs[0].seed < 9999){
        newpairs.push(pairs.shift());
    }
    
    // {チーム：エントリー数}の配列を取得。配列は多いチームから順に並べている。
    let teams = getTeams(data);

    // チームごとに、所属するペアを取得する。同チームのペアは優先度を高くする。
    teams.forEach(team => {
        var teamspair = pairs.filter(pair => 
            (pair.team1 == team.name || pair.team2 == team.name)
            );
        teamspair.sort( function(a,b){
            return b.getFriendship(teamspair) - a.getFriendship(teamspair);
        });
        newpairs = newpairs.concat(teamspair);
        pairs = pairs.filter( pair =>
            !(pair.team1 == team.name || pair.team2 == team.name)
            );
    });

    pairs = Array.from(newpairs);
    console.table(pairs);

    // 順にブロックに配置
    let block = blocks[0]; // テストコード
    while(pair = pairs.shift()){
        let block = blocks.reduce((a, b) => a.getRefusalScore(pair) <= b.getRefusalScore(pair) ? a : b);
        block.push(pair);
    }
    return blocks;
}

/**
 * 配列をHTMLのテーブルとして出力。
 * @param {Block[]} Blockの配列
 */
function array2table(blocks) {
    // 既存テーブルがあれば削除
    div = document.getElementById('right-part');
    div.innerText = '';

    // 組数に合わせて配分？
    let i = "A".charCodeAt(0);
    let index = 1;
    blocks.forEach(block => {
        let table = document.createElement('table');
        table.id = 'block-' + String.fromCharCode(i++);  
        block.forEach(pair => {
            let tr;
            // TODO: このへん美しくしたい
            tr = table.insertRow(-1);
            tr.insertCell(-1);
            tr.insertCell(-1);
            tr.insertCell(-1);
            tr.cells[0].textContent = pair.player1;
            tr.cells[1].textContent = pair.team1;
            tr.cells[2].textContent = pair.seed == 9999 ? '-' : pair.seed;
            tr.cells[2].rowSpan = 2;
            tr = table.insertRow(-1);
            tr.insertCell(-1);
            tr.insertCell(-1);
            tr.cells[0].textContent = pair.player2;
            tr.cells[1].textContent = pair.team2;
        });
        div.appendChild(table);
        // TODO:コピー用ボタンと関数
        let button = document.createElement('button');
        button.textContent = 'コピー';
        button.addEventListener('click', function(){
            copyTableToClipboard(table.id);
        })
/*         button.addEventListener('click', function(){
            let range = document.createRange();
            range.selectNodeContents(table);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy')
        });
 */        div.appendChild(button);
    });
}

/**
 * チーム名:数 の配列を作る。
 * @param {Array} data 
 */
function getTeams(data){
    // {name:チーム名, count:数}なオブジェクトを格納
    let teams = new Array;
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
    // 一旦テーブルの内容をテキストボックスに移す
    let table = document.getElementById(tableid);
    let textarea = document.getElementById('copypa');
    
    textarea.textContent = table.textContent;

    // テキストボックスからクリップボードへ
    let range = document.createRange();
    range.selectNodeContents(textarea);
    window.getSelection().addRange(range);
}