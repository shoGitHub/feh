
/*
 * コード整理内容
 * ・クラス分け
 * ・プライベートとパpブリックめそっどわけ
 * 
 * 
 */


/**
 * feh_view
 * 
 * 画面がクリックされて最初に呼び出されるクラスです。
 * 以下の関数とデータを所持します。
 * 
 * ・ゲームの初期化関数
 * ・画面をクリックされて呼び出される関数
 * ・グローバルデータ
 * ・共通の便利関数
 * 
 */


/*******************************************************************
 * グローバルデータ
 *******************************************************************/

/**
 * テストモード
 */
var g_isViewBattleTest = true;

/**
 * 画面のステータス情報
 */
var g_gamenStatus = undefined;

/**
 * 画面に表示するメッセージ情報
 */
var g_messageArray = new Array();

/**
 * クリック可能なオブジェクトの情報を保持する
 */
var g_gamen = new Array();

/**
 * 選択したキャラクターのID
 */
var g_selectedIdArray = new Array();

/**
 * バトル開始フラグ
 */
var g_startBattleFlg = false;

/**
 * 選択画面クラス
 */
//var g_viewSelect = null;

/**
 * バトル画面クラス
 */
var g_viewBattle = null;

/**
 * デザイナークラス
 */
var g_designer = null;



/*******************************************************************
 * feh初期化関数
 *******************************************************************/

/**
 * 初期化を行う
 * @returns
 */
function fehInit() {

	// グローバル変数を初期化する
	g_gamenStatus = undefined;
	g_messageArray = new Array();
	g_gamen = new Array();
	g_selectedIdArray = new Array();
	g_startBattleFlg = false;
//	g_viewSelect = undefined;
	g_viewBattle = undefined;
	g_designer = new feh_designer();
	
	// 画面情報を初期化
	clearGamen();
	
	// 選択画面を呼び出す
//	g_viewSelect = new feh_viewSelect();
	
	// データ初期化
	initData();
	
	// 戦闘画面テストモードの場合
	// 必要なデータを設定して、戦闘画面から始めます
	if (g_isViewBattleTest) {
		g_selectedIdArray = [0,1,2,3,4,5,6,7];
		g_sentoshaData[0].shozokuTeam = "blue";
		g_sentoshaData[1].shozokuTeam = "blue";
		g_sentoshaData[2].shozokuTeam = "blue";
		g_sentoshaData[3].shozokuTeam = "blue";
		g_sentoshaData[4].shozokuTeam = "red";
		g_sentoshaData[5].shozokuTeam = "red";
		g_sentoshaData[6].shozokuTeam = "red";
		g_sentoshaData[7].shozokuTeam = "red";
		g_startBattleFlg = true;
		g_gamenStatus = undefined;
		g_designer.clearInfo();
		g_designer.clearImg();
		clearGamen();
		g_viewBattle = new feh_viewBattle();
	}
}


/*******************************************************************
 * 画がクリックされると呼び出される関数
 *******************************************************************/

/**
 * クリックされた画面のマスを特定して、
 * 処理を実行する
 * @returns
 */
function clickAction() {

	// クリックしたマスを特定する
	var x = $gameMap.canvasToMapX(TouchInput.x);
	var y = $gameMap.canvasToMapY(TouchInput.y);
	
	// デバッグログ
//	console.dir("■start clickAction");
//	console.dir("■gamenStatus, gamen, x, y");
//	console.dir(g_gamenStatus);
//	console.dir(g_gamen);
//	console.dir(x);
//	console.dir(y);
	
	// クリックした対象を取得する
	var clickTarget = getClickTarget(x, y);
	
	// バトルスタート前の場合、選択画面の処理を行う
	if (!g_startBattleFlg) {
//		g_viewSelect.excute(x, y, clickTarget);
		
	// バトルスタート後の場合、バトル画面の処理を行う
	} else {
		g_viewBattle.excute(x, y, clickTarget);
	}
	
	// デバッグログ
	console.dir("■end clickAction");
	console.dir("■gamenStatus, gamen");
	console.dir(g_gamenStatus);
	console.dir(g_gamen);
}



/*******************************************************************
 * 共通のutil関数
 *******************************************************************/


/**
 * 画面情報を全て消去します
 * @returns
 */
function clearGamen() {
	g_gamen = [
		[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
		[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
		[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
		[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
		[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
		[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
	];
}

/**
 * 指定したマスの状態を取得します
 */
function getClickTarget(x, y) {
	if (g_gamen[x] == undefined) {
		return undefined;
	}
	return g_gamen[x][y];
};

/**
 * オブジェクトを値渡しでコピーします（参照渡しでない）
 * @param target
 * @returns
 */
function copyObject(target) {
	return JSON.parse(JSON.stringify(target) || "null");
}

/**
 * データを初期化します
 * @returns
 */
function initData() {
	for (i=0; i<g_sentoshaData.length; i++) {
		g_sentoshaData[i].nokoriHp = g_sentoshaData[i].hp;
	}
}


(function () {
    var timeouts = [],
        messageName = 'zero-timeout-message';

    function setZeroTimeoutPostMessage(fn) {
        timeouts.push(fn);
        window.postMessage(messageName, '*');
    }

    function setZeroTimeout(fn) {
        setTimeout(fn, 0);
    }

    function handleMessage(event) {
        if (event.source == window && event.data == messageName) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            if (timeouts.length) {
                timeouts.shift()();
            }
        }
    }

    if (window.postMessage) {
        if (window.addEventListener) {
            window.addEventListener('message', handleMessage, true);
        } else if (window.attachEvent) {
            window.attachEvent('onmessage', handleMessage);
        }
        window.setZeroTimeout = setZeroTimeoutPostMessage;
    } else {
        window.setZeroTimeout = setZeroTimeout;
    }
}());
