
/***********************************************************************************************************************
 * constracta
 *
 */

/**
 * コンストラクタ
 * @returns
 */
function feh_viewBattle() {

	// 初期化
	this._beforeMoveX = undefined;
	this._beforeMoveY = undefined;
	
	// 画面を初期化する
	this.init();
	
	// バトルロジッククラス
	this._battleLogic = new feh_battleLogic();
	
	// バトル画面で選択中のキャラクターId
	this._selectedCharactorId = undefined;
}

feh_viewBattle.prototype = Object.create(Object.prototype);
feh_viewBattle.prototype.constructor = feh_viewBattle;



/***********************************************************************************************************************
 * init
 *
 */

/**
 * バトル画面を初期化する
 * @returns
 */
feh_viewBattle.prototype.init = function() {

	// マップを表示する
	// ※マップの画像IDは１～４８
	var c = 0;
	for (i=0; i<8; i++) {
		for (j=0; j<6; j++) {
			$gameScreen.showPicture(c+1, "map/map_" + c++, 0, 60*j, 60*i, 100, 100, 255, 0);
		}
	}

	// キャラクターを表示する
	for (i=0; i<8; i++) {
		var x = 1 + (i % 4);
		var y = 0;
		if (i > 3) {
			y = 7;
		}
		this.showCharactor(g_sentoshaData[g_selectedIdArray[i]], x, y);
	}
	
	// 画面ステータス設定
	g_gamenStatus = "none";
};

/***********************************************************************************************************************
 * excute main
 *
 */

/**
 * バトル画面の処理を実行します
 * @param x
 * @param y
 * @returns
 */
feh_viewBattle.prototype.excute = function(x, y, clickTarget) {
	
	// 状態なしの場合
	if (g_gamenStatus == "none") {
		
		// 移動可能キャラをクリックした場合の処理
		if (clickTarget == "blueCharactor") {
			this.execute1(x, y);
		}
		
		// 移動不可能キャラをクリックした場合の処理
		
	// 移動可能キャラ選択状態の場合
	} else if (g_gamenStatus == "selected") {
		
		// 自マスをクリックした場合、キャラクターを待機状態にする
		
		// キャラの移動先をクリックした場合の処理
		if (clickTarget == "moveMap") {
			this.excute2(x, y);
		}
		
		// 攻撃対象をクリックした場合の処理
		
		// 補助対象をクリックした場合の処理
		
		// 別キャラクターをクリックした場合、そのキャラクターを選択状態にする
		
		// 関係ないマスをクリックした場合、行動をキャンセルする

	// キャラ移動先選択状態の場合
	} else if (g_gamenStatus == "moved") {
		
		// 同じ移動先をクリックした場合、移動先決定
		if (clickTarget == "movedCharactor") {
			this.excute3(x, y);
		}
		
		// 攻撃対象をクリックした場合
		if (clickTarget == "enemyCharactor") {
			this.excute4(x, y);
		}
		
		// 補助対象をクリックした場合

		// 関係ないマスをクリックした場合、行動をキャンセルする
		
	// 攻撃対象選択状態の場合
	} else if (g_gamenStatus == "") {
		
		// 同じ攻撃対象をクリックした場合

	// 補助対象選択状態の場合
	} else if (g_gamenStatus == "") {
		
	}
};


/***********************************************************************************************************************
 * excute
 *
 */


/**
 * キャラ選択処理
 * @returns
 */
feh_viewBattle.prototype.execute1 = function(x, y) {

	// キャラクターを選択表示にする
	this.selectCharactor(x, y);
	
	// 選択キャラクターを保存
	this._selectedCharactorId = this.getCharactorId(x, y);
		
	// 画面ステータス設定
	g_gamenStatus = "selected";
};

/**
 * キャラクター移動処理
 */
feh_viewBattle.prototype.excute2 = function(x, y) {

	// キャラクターを選択表示にする
	this.moveCharactor(x, y);
	
	// 画面ステータス設定
	g_gamenStatus = "moved";
};

/**
 * キャラクター移動決定
 */
feh_viewBattle.prototype.excute3 = function(x, y) {

	// キャラクターを移動済み表示にする
	this.decideMove(x, y);
	
	// 全キャラクター行動済みの場合、ターン終了
	if (this.isTrunEnd()) {
		
	}
	
	// 画面ステータス設定
	g_gamenStatus = "none";
};


/***********************************************************************************************************************
 * view
 *
 */

/**
 * 画面にキャラクターを表示します
 * @param charactor
 * @param x
 * @param y
 * @returns
 */
feh_viewBattle.prototype.showCharactor = function(charactor, x, y) {
	
	// キャラクターを画面に表示する
	// ※第１引数の画像番号は、キャラクターIDに６０下駄をはかせる
	$gameScreen.showPicture(parseInt(charactor.id)+60, "sd/" + charactor.img, 0, x*60, y*60, 100, 100, 255, 0);
	
	// キャラクター情報を画面情報に設定する
	var param = new Array();
	if (g_sentoshaData[parseInt(charactor.id)].shozokuTeam == "blue") {
		param.category = "blueCharactor";
	} else {
		param.category = "redCharactor";
	}
	param.id = charactor.id;
	g_gamen[x][y] = param;
};

/**
 * キャラクター選択表示処理
 */
feh_viewBattle.prototype.selectCharactor = function(x, y) {
	
	// キャラクターを選択色にする
	$gameScreen.tintPicture(this.getCharactorId(x, y)+60, [-60, -60, 60, 60], 10);

	// キャラクター画面情報を更新する
	var target = g_gamen[x][y];
	target["category"] = "selectedCharactor";
	
	// キャラクターの移動範囲を表示する
	var moveMap = this._battleLogic.getMoveMap(x, y);
	for (i=0; i<6; i++) {
		for (j=0; j<8; j++) {
			if (moveMap[i][j] >= 0) {
				$gameScreen.tintPicture(this.getMapImgNo(i, j), [-60, -60, 60, 60], 10);
				
				// マップ画面情報を更新する
				var temp = g_gamen[i][j];
				if (temp == undefined) {
					temp = new Array();
					temp["category"] = "moveMap";
					g_gamen[i][j] = temp;
				}
			}
		}
	}
	
	// キャラクターの移動前情報を保存する
	this._beforeMoveX = x;
	this._beforeMoveY = y;

	// 選択したキャラのステータスを表示する（未実装）
	$gameScreen.showPicture(50, "status/ike_stat", 0, 360+14, 0, 100, 100, 255, 0);
};


/**
 * 画面のキャラクターを移動します
 */
feh_viewBattle.prototype.moveCharactor = function(x, y) {
	
	// キャラクターを移動する
	$gameScreen.movePicture(this._selectedCharactorId+60, 0, x*60, y*60, 100, 100, 255, 0, 10);

	// 移動キャラクター情報を画面情報に設定する
	var temp = new Array();
	temp["category"] = "movedCharactor";
	g_gamen[x][y] = temp;

	// 移動元キャラクター情報を画面情報に設定する
	var temp = new Array();
	temp["category"] = "beforeMoveCharactor";
	g_gamen[this._beforeMoveX][this._beforeMoveY] = temp;
};

/**
 * キャラクターの移動を確定します
 */
feh_viewBattle.prototype.decideMove = function(x, y) {
	
	// キャラクターを移動済み表示にする
	$gameScreen.tintPicture(this._selectedCharactorId+60, [0, 0, 0, 255], 10);
	
	// 移動マップを非表示にする
	this.clearMoveMap();

	// 移動決定情報を画面情報に設定する
	var temp = new Array();
	temp["category"] = "decideCharactor";
	g_gamen[x][y] = temp;
};






/**
 * 画面のキャラクターを未選択にします
 */
feh_viewBattle.prototype.decideCharactor = function(x, y) {
	
	// 決定キャラクターを移動する
	var id = this.getCharactorId(x, y)
	$gameScreen.tintPicture(parseInt(id)+1, [0, 0, 0, 0], 10);
	var x2 = this._selectCount % 4;
	var y2 = 5;
	if (this._selectCount > 3) {
		y2 = 7;
	}
	$gameScreen.movePicture(parseInt(id)+1, 0, x2*60, y2*60, 100, 100, 255, 0, 10);

	// 画面情報を更新する
	var target = g_gamen[x][y];
	target.category = "decideCharactor";
	g_gamen[x2][y2] = target;
	g_gamen[x][y] = undefined;
};



/***********************************************************************************************************************
 * util
 *
 */


/**
 * 選択キャラクターのidを取得する
 */
feh_viewBattle.prototype.getCharactorId = function(x, y) {
	return parseInt(g_gamen[x][y].id);
};

/**
 * x,yマスの画像Noを取得します
 */
feh_viewBattle.prototype.getMapImgNo = function(x, y) {
	return (1 + parseInt(x) + (parseInt(y) * 6));
};

/**
 * 移動マップを非表示にして
 * 画面情報からも削除します
 */
feh_viewBattle.prototype.clearMoveMap = function() {
	for (i=1; i<49; i++) {
		$gameScreen.tintPicture(i, [0, 0, 0, 0], 10);
	}
	for (i=0; i<6; i++) {
		for (j=0; j<8; j++) {
			var temp = g_gamen[i][j];
			if (temp == undefined) {
				continue;
			} 
			if (temp["category"] == "moveMap"
				|| temp["category"] == "beforeMoveCharactor") {
				g_gamen[i][j] = undefined;
			}
		}
	}
}

