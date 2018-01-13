

/**
 * キャラクター選択人数
 */
var g_selectCount = 0;



//------------------------------------------------------------------
// キャラ選択画面処理 関数

/**
 * 選択画面の処理を実行します
 * @param x
 * @param y
 * @returns
 */
function viewSelectAction(x, y) {

	// 初期表示の場合
	if (g_gamenStatus == undefined) {
		initSelectCharaAction();
		
	// 初期表示の場合
	} else if (g_gamenStatus == "initialized") {
		
		// キャラを選択した場合
		if (isClickSelectCharactor(x, y)) {
			SelectCharactorAction(x, y);			
		}
		
	// キャラ選択状態の場合
	} else if (g_gamenStatus == "selected") {
		
		if (isClickSelectedCharactor(x, y)) {
			decideCharactorAction(x, y);
		}
	}
}

/**
 * キャラ選択画面を初期化する
 * @returns
 */
function initSelectCharaAction() {
	
	// 選択キャラクター表示
	showCharactor(g_sentoshaData[0], 0, 1);
	showCharactor(g_sentoshaData[1], 1, 1);
	showCharactor(g_sentoshaData[2], 2, 1);
	showCharactor(g_sentoshaData[3], 3, 1);
	showCharactor(g_sentoshaData[4], 4, 1);
	showCharactor(g_sentoshaData[5], 5, 1);
	showCharactor(g_sentoshaData[6], 0, 2);
	showCharactor(g_sentoshaData[7], 1, 2);
	showCharactor(g_sentoshaData[8], 2, 2);
	showCharactor(g_sentoshaData[9], 3, 2);
	
	// メッセージ表示
	showMessage("キャラクターを選んでください", 0, 0);
	showMessage("【味方チーム】", 0, 280);
	showMessage("【敵チーム】", 0, 400);
	
	// 画面ステータス設定
	g_gamenStatus = "initialized";
}

/**
 * キャラ選択処理
 * @returns
 */
function SelectCharactorAction(x, y) {
	
	// キャラクターを選択表示にする
	var id = getCharactorId(x, y);
	selectCharactor(x, y, id);
	
	// 選択したキャラのステータスを表示する（未実装）
	$gameScreen.showPicture(90, "status/ike_stat", 0, 360+14, 0, 100, 100, 255, 0);

	// 画面ステータスを更新する
	g_gamenStatus = "selected";
}

/**
 * キャラクター決定処理
 * @param x
 * @param y
 * @returns
 */
function decideCharactorAction(x, y) {
	
	// 選択キャラを設定する
	g_selectedIdArray[g_selectCount] = getCharactorId(x, y);
	
	// キャラクターを決定する
	decideCharactor(x, y);
	
	// 画面ステータスを更新する
	g_gamenStatus = "initialized";
	
	// 選択人数をカウントする
	g_selectCount++;
	
	// 全部選択した場合、バトルスタート
	if (g_selectCount == 8) {
		var count = 0;
		var countup = function(){
			console.log(count++);
		}
		setTimeout((function() {
			g_startBattleFlg = true;
			g_gamenStatus = undefined;
			clearMessage();
			clearImg();			
		}),
		800);
	}
}



//------------------------------------------------------------------
// 表示系関数

/**
 * 画面にキャラクターを表示します
 * @param charactor
 * @param x
 * @param y
 * @returns
 */
function showCharactor(charactor, x, y) {
	
	// キャラクターを画面に表示する
	// ※第１引数の画像番号は、１から始まることに注意
	$gameScreen.showPicture(parseInt(charactor.id)+1, "sd/" + charactor.img, 0, x*60, y*60, 100, 100, 255, 0);
	
	// 画面情報を更新する
	var param = new Array();
	param.category = "selectCharactor";
	param.id = charactor.id;
	g_gamen[getGamenKey(x, y)] = param;
}

/**
 * 画面のキャラクターを移動します
 */
function moveCharactor(id, x, y) {
	$gameScreen.movePicture(id+1, 0, 180, 300, 100, 100, 255, 0, 10);
}

/**
 * 画面のキャラクターを選択します
 */
function selectCharactor(x, y, id) {
	
	// キャラクターを選択色にする
	$gameScreen.tintPicture(parseInt(id)+1, [-60, -60, 60, 60], 10);

	// 画面情報を更新する
	var target = g_gamen[getGamenKey(x, y)];
	target.category = "selectedCharactor";
}

/**
 * 画面のキャラクターを未選択にします
 */
function decideCharactor(x, y) {
	
	// 決定キャラクターを移動する
	var id = getCharactorId(x, y)
	$gameScreen.tintPicture(parseInt(id)+1, [0, 0, 0, 0], 10);
	var x2 = g_selectCount % 4;
	var y2 = 5;
	if (g_selectCount > 3) {
		y2 = 7;
	}
	$gameScreen.movePicture(parseInt(id)+1, 0, x2*60, y2*60, 100, 100, 255, 0, 10);

	// 画面情報を更新する
	var target = g_gamen[getGamenKey(x, y)];
	target.category = "decideCharactor";
	g_gamen[getGamenKey(x2, y2)] = target;
	g_gamen[getGamenKey(x, y)] = undefined;
}

//------------------------------------------------------------------
// 画面上の操作可能オブジェクト　関数

/**
 * 選択キャラクターをクリックしたかを判定する
 * @param x
 * @param y
 * @returns
 */
function isClickSelectCharactor(x, y) {
	var target = g_gamen[getGamenKey(x, y)];
	if (target == undefined) {
		return false;
	} 
	if (target.category == "selectCharactor") {
		return true;
	}
	return false;
}

/**
 * 選択済みキャラクターをクリックしたかを判定する
 * @param x
 * @param y
 * @returns
 */
function isClickSelectedCharactor(x, y) {
	var target = g_gamen[getGamenKey(x, y)];
	if (target == undefined) {
		return false;
	} 
	if (target.category == "selectedCharactor") {
		return true;
	}
	return false;
}

/**
 * 選択キャラクターのidを取得する
 */
function getCharactorId(x, y) {
	return g_gamen[getGamenKey(x, y)].id;
}

/**
 * 画面情報のキーを取得する
 * @param x
 * @param y
 * @returns
 */
function getGamenKey(x, y) {
	return ("x" + String(x) + "y" + String(y));
}








///**
//* マップ画面を初期化する
//* @returns
//*/
//function initMap() {
//
//	var c = 0;
//	for (i=0; i<8; i++) {
//		for (j=0; j<6; j++) {
//			$gameScreen.showPicture(c+1, "map/map_" + c++, 0, 60*j, 60*i, 100, 100, 255, 0);
//		}
//	}
//	$gameScreen.showPicture(60, "sd/ike", 0, 60, 0, 100, 100, 255, 0);
//	$gameScreen.showPicture(61, "sd/misuto", 0, 120, 0, 100, 100, 255, 0);
//	$gameScreen.showPicture(62, "sd/osuka", 0, 180, 0, 100, 100, 255, 0);
//	$gameScreen.showPicture(63, "sd/senerio", 0, 240, 0, 100, 100, 255, 0);
//	$gameScreen.showPicture(64, "sd/nino", 0, 60, 420, 100, 100, 255, 0);
//	$gameScreen.showPicture(65, "sd/jafaru", 0, 120, 420, 100, 100, 255, 0);
//	$gameScreen.showPicture(66, "sd/roid", 0, 180, 420, 100, 100, 255, 0);
//	$gameScreen.showPicture(67, "sd/urusura", 0, 240, 420, 100, 100, 255, 0);
//}
//
//function clickChara() {
//	$gameScreen.showPicture(90, "status/ike_stat", 0, 360+14, 0, 100, 100, 255, 0);
//	$gameScreen.tintPicture(62, [-60, -60, 60, 60], 10);
//	$gameScreen.tintPicture(1, [-60, -60, 60, 60], 10);
//	$gameScreen.tintPicture(2, [-60, -60, 60, 60], 10);
//	$gameScreen.tintPicture(3, [-60, -60, 60, 60], 10);
//	$gameScreen.tintPicture(4, [-60, -60, 60, 60], 10);
//	$gameScreen.tintPicture(5, [-60, -60, 60, 60], 10);
//	$gameScreen.tintPicture(6, [-60, -60, 60, 60], 10);
//	$gameScreen.tintPicture(8, [-60, -60, 60, 60], 10);
//	$gameScreen.tintPicture(9, [-60, -60, 60, 60], 10);
//	$gameScreen.tintPicture(10, [-60, -60, 60, 60], 10);
//	$gameScreen.tintPicture(11, [-60, -60, 60, 60], 10);
//	$gameScreen.tintPicture(12, [-60, -60, 60, 60], 10);
//	$gameScreen.tintPicture(15, [-60, -60, 60, 60], 10);
//	$gameScreen.tintPicture(16, [-60, -60, 60, 60], 10);
//	$gameScreen.tintPicture(22, [-60, -60, 60, 60], 10);
//}
//function moveChara() {
//	$gameScreen.tintPicture(62, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(1, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(2, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(3, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(4, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(5, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(6, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(8, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(9, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(10, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(11, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(12, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(15, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(16, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(22, [0, 0, 0, 0], 10);
//	$gameScreen.movePicture(62,0,180,180,100,100,255,0,10);
//}
//function clickCharaE() {
//	$gameScreen.showPicture(90, "ike_stat", 0, 360+14, 0, 100, 100, 255, 0);
//	$gameScreen.tintPicture(67, [60, -60, -60, 60], 10);
//	$gameScreen.tintPicture(34, [60, -60, -60, 60], 10);
//	$gameScreen.tintPicture(36, [60, -60, -60, 60], 10);
//	$gameScreen.tintPicture(39, [60, -60, -60, 60], 10);
//	$gameScreen.tintPicture(40, [60, -60, -60, 60], 10);
//	$gameScreen.tintPicture(41, [60, -60, -60, 60], 10);
//	$gameScreen.tintPicture(42, [60, -60, -60, 60], 10);
//	$gameScreen.tintPicture(44, [60, -60, -60, 60], 10);
//	$gameScreen.tintPicture(45, [60, -60, -60, 60], 10);
//	$gameScreen.tintPicture(46, [60, -60, -60, 60], 10);
//	$gameScreen.tintPicture(47, [60, -60, -60, 60], 10);
//	$gameScreen.tintPicture(48, [60, -60, -60, 60], 10);
//}
//function moveCharaE() {
//	$gameScreen.tintPicture(67, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(34, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(36, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(39, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(40, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(41, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(42, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(44, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(45, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(46, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(47, [0, 0, 0, 0], 10);
//	$gameScreen.tintPicture(48, [0, 0, 0, 0], 10);
//	$gameScreen.movePicture(67,0,180,300,100,100,255,0,10);
//}
