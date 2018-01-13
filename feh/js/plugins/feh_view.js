

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
var g_viewSelect = null;

/**
 * バトル画面クラス
 */
var g_viewBattle = null;



//------------------------------------------------------------------
// 共通関数


/**
 * 初期化を行う
 * @returns
 */
function fehInit() {
	
	// 画面情報を初期化
	clearGamen();
	
	// 選択画面を呼び出す
	g_viewSelect = new feh_viewSelect();
	
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
		clearMessage();
		clearImg();
		clearGamen();
		g_viewBattle = new feh_viewBattle();
	}
}

/**
 * クリックされた画面のマスを特定して、
 * 処理を実行する
 * @returns
 */
function clickAction() {

	// クリックしたマスを特定する
	var x = $gameMap.canvasToMapX(TouchInput.x);
	var y = $gameMap.canvasToMapY(TouchInput.y);
	
	// クリックした対象を取得する
	var clickTarget = getClickTarget(x, y)
	
	// デバッグログ
	console.dir("x, y, g_gamen");
	console.dir(x);
	console.dir(y);
	console.dir(g_gamen);
	
	// バトルスタート前の場合、選択画面の処理を行う
	if (!g_startBattleFlg) {
		g_viewSelect.excute(x, y, clickTarget);
		
	// バトルスタート後の場合、バトル画面の処理を行う
	} else {
		g_viewBattle.excute(x, y, clickTarget);
		
	}
}

/**
 * 画面にメッセージを表示する
 * @param message
 * @param x
 * @param y
 * @returns
 */
function showMessage(message, x, y) {
	var param = new Array();
	param.message = message;
	param.x = x;
	param.y = y;
	g_messageArray.push(param);
}

/**
 * メッセージを全て消去します
 * @returns
 */
function clearMessage() {
	g_messageArray = new Array();
}

/**
 * 表示画像を全て消去します
 * @returns
 */
function clearImg() {
	for (var i=0; i<200; i++) {
		$gameScreen.erasePicture(i);
	}
}

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
	var target = g_gamen[x][y];
	if (target == undefined) {
		return undefined;
	}
	return target.category;
};

/**
 * オブジェクトを値渡しでコピーします（参照渡しでない）
 * @param target
 * @returns
 */
function copyObject(target) {
	return JSON.parse(JSON.stringify(target) || "null");
}

