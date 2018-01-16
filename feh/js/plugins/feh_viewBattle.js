
/***********************************************************************************************************************
 * constracta
 *
 */

/**
 * コンストラクタ
 * @returns
 */
function feh_viewBattle() {
	
	// データを初期化する
	this.initData();
	
	// 画面を初期化する
	this.initView();
	
	// バトルロジッククラス
	this._battleLogic = new feh_battleLogic();
}

feh_viewBattle.prototype = Object.create(Object.prototype);
feh_viewBattle.prototype.constructor = feh_viewBattle;



/***********************************************************************************************************************
 * init
 *
 */

/**
 * バトル画面のデータを初期設定します
 */
feh_viewBattle.prototype.initData = function() {

	/**
	 * 戦闘画面表示に必要な情報
	 * 
	 * 戦闘情報
	 * 　ターン数
	 * 　どちらチームのターンか？
	 * 　青チームの残り人数
	 * 　赤チームの残り人数
	 * 　勝利したチームはどっちか？
	 * 　選択中キャラクター
	 * 
	 * オブジェクト情報
	 * 　マスに存在するオブジェクト（破壊可能な壁とか）
	 * 
	 * キャラクター情報
	 * 　所属チーム
	 * 　行動済みフラグ
	 * 　死亡フラグ
	 * 　ステータス
	 * 　画像No
	 * 
	 * 画面情報
	 * 　攻撃情報
	 * 　キャラクター移動前のマス情報
	 * 　キャラクター移動後のマス情報
	 */
	
	// オブジェクト情報（未実装）
	this._object = undefined
	
	// バトル情報
	this._battle = {
//			turnNum: 0,
			turn: "blue",
			blueNum: 4,
			redNum: 4,
			victoryTeam: undefined,
			selectedCharactor: undefined
	};
	
	// キャラクター情報
	this._charactor = [
		[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
		[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
		[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
		[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
		[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
		[undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
	];
	for (i=0; i < g_selectedIdArray.length; i++) {
		var charactor = {};
		charactor.status = g_sentoshaData[g_selectedIdArray[i]];
		charactor.decidedFlg = false;
		charactor.deadFlg = false;
		// キャラクターの画像Noは６０～６７
		charactor.imgNo = i + 60;
		if (i < 4) {
			charactor.team = "blue";
		} else {
			charactor.team = "red";
		}
		var x = 1 + (i % 4);
		var y = 0;
		if (i > 3) {
			y = 3;
		}
		this._charactor[x][y] = charactor;
	}
	
	// キャラクター移動前のマス
	this._beforeMoveX = undefined;
	this._beforeMoveY = undefined;
	
	// キャラクター移動後のマス
	this._afterMoveX = undefined;
	this._afterMoveY = undefined;
	
	// 攻撃情報
	this._attackData = undefined;
}

/**
 * バトル画面を初期化する
 * @returns
 */
feh_viewBattle.prototype.initView = function() {

	var c = 0;
	for (i=0; i<8; i++) {
		for (j=0; j<6; j++) {
			
			// マップを表示する
			// ※マップの画像IDは１～４８
			$gameScreen.showPicture(c+1, "map/map_" + c++, 0, 60*j, 60*i, 100, 100, 255, 0);

			// キャラクターを表示する
			if (this._charactor[j][i] != undefined) {
				this.showCharactor(j, i);
			}
		}
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

	// デバッグログ
	console.dir("■start battle excute");
	console.dir("■battle, charactor");
	console.dir(this._battle);
	console.dir(this._charactor);
	
	// 状態なしの場合
	if (g_gamenStatus == "none") {
		
		// 移動可能キャラをクリックした場合の処理
		if (clickTarget == "charactor") {
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
		if (clickTarget == "canAttackEnemy") {
			
		}
		
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
		if (clickTarget == "canAttackEnemy") {
			this.excute4(x, y);
		}
		
		// 補助対象をクリックした場合

		// 関係ないマスをクリックした場合、行動をキャンセルする
		
	// 攻撃対象選択状態の場合
	} else if (g_gamenStatus == "selectedAttackEnemy") {
		
		// 同じ攻撃対象をクリックした場合
		if (clickTarget == "selectedAttackEnemy") {
			this.excute5(x, y);
		}

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
		
	// 画面ステータス設定
	g_gamenStatus = "selected";
};

/**
 * キャラクター移動処理
 */
feh_viewBattle.prototype.excute2 = function(x, y) {

	// キャラクターを選択表示にする
	this.moveCharactor(x, y);
	
	// 行動済み人数を更新する
	
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
	if (this.isTurnEnd()) {
		this.endTurn();
	}
	
	// 画面ステータス設定
	g_gamenStatus = "none";
};

/**
 * 攻撃可能敵キャラクター選択処理
 */
feh_viewBattle.prototype.excute4 = function(x, y) {
	
	// その場で攻撃できる場合
	// 移動しないと攻撃できない場合
	
	// 戦闘結果を表示する
	this.showBattle(x, y);
	
	// 画面ステータス設定
	g_gamenStatus = "selectedAttackEnemy";
}

/**
 * 攻撃を実行する処理
 */
feh_viewBattle.prototype.excute5 = function(x, y) {
	
	// 攻撃を実行する
	this.decideAttack(x, y);
	
	// 全キャラクター行動済みの場合、ターン終了
	if (this.isTurnEnd()) {
		this.endTurn();
	}
	
	// 画面ステータス設定
	g_gamenStatus = "none";
}

/***********************************************************************************************************************
 * view
 *
 */

/**
 * 画面にキャラクターを表示します
 */
feh_viewBattle.prototype.showCharactor = function(x, y) {
		
	// キャラクターを画面に表示する
	$gameScreen.showPicture(
			this._charactor[x][y].imgNo,
			"sd/" + this._charactor[x][y].status.img, 0, x*60, y*60, 100, 100, 255, 0);
	
	// キャラクター情報を画面情報に設定する
	if (this._charactor[x][y].team == "blue") {
		g_gamen[x][y] = "charactor";
	} else {
		g_gamen[x][y] = "enemyCharactor";
	}
};

/**
 * キャラクター選択表示処理
 */
feh_viewBattle.prototype.selectCharactor = function(x, y) {
	
	// キャラクターを選択色にする
	$gameScreen.tintPicture(this._charactor[x][y].imgNo, [-60, -60, 60, 60], 10);

	// キャラクター画面情報を更新する
	g_gamen[x][y] = "selectedCharactor";
	
	// キャラクターの移動範囲を表示する
	var moveMap = this._battleLogic.getMoveMap(x, y);
	for (i=0; i<6; i++) {
		for (j=0; j<8; j++) {
			if (moveMap[i][j] >= 0) {
				$gameScreen.tintPicture(this.getMapImgNo(i, j), [-60, -60, 60, 60], 10);
				
				// マップ画面情報を更新する
				var temp = g_gamen[i][j];
				if (temp == undefined) {
					g_gamen[i][j] = "moveMap";
				}
			}
		}
	}
	
	// 攻撃可能マップを表示する
	var attackMap = this._battleLogic.getAttackMap(this._charactor[x][y].status, moveMap);
	for (i=0; i<6; i++) {
		for (j=0; j<8; j++) {
			if (attackMap[i][j]) {
				
				// 攻撃可能なキャラクター情報を画面情報に設定する
				if (this._charactor[i][j] != undefined) {
					if (this._charactor[i][j].team != this._charactor[x][y].team) {
						g_gamen[i][j] = "canAttackEnemy";
					}					
				}

				// 移動不可かつ攻撃可能なマスは赤く表示する
				if (moveMap[i][j] < 0) {
					$gameScreen.tintPicture(this.getMapImgNo(i, j), [60, -60, -60, 60], 10);
				}
			}
		}
	}
	
	// 選択キャラクターの移動前情報を保存する
	this._beforeMoveX = x;
	this._beforeMoveY = y;
	
	// 選択キャラクター情報を保存する
	this._battle.selectedCharactor = this._charactor[x][y];

	// 選択したキャラのステータスを表示する（未実装）
	this.clearInfo();
	$gameScreen.showPicture(50, "status/ike_stat", 0, 360+14, 0, 100, 100, 255, 0);
};


/**
 * 画面のキャラクターを移動します
 */
feh_viewBattle.prototype.moveCharactor = function(x, y) {
	
	// キャラクターを移動する
	$gameScreen.movePicture(
			this._charactor[this._beforeMoveX][this._beforeMoveY].imgNo, 
			0, x * 60, y * 60, 100, 100, 255, 0, 10);

	// 移動キャラクター情報を画面情報に設定する
	g_gamen[x][y] = "movedCharactor";
	
	// 選択キャラクターの移動後情報を保存する
	this._afterMoveX = x;
	this._afterMoveY = y;

	// 移動元キャラクター情報を画面情報に設定する
	g_gamen[this._beforeMoveX][this._beforeMoveY] = "beforeMoveCharactor";
};

/**
 * キャラクターの移動を確定します
 */
feh_viewBattle.prototype.decideMove = function(x, y) {
	
	// キャラクター情報を移動する
	this._charactor[x][y] = this._charactor[this._beforeMoveX][this._beforeMoveY];
	this._charactor[this._beforeMoveX][this._beforeMoveY] = undefined;
	
	// キャラクターを移動済み表示にする
	$gameScreen.tintPicture(this._charactor[x][y].imgNo, [0, 0, 0, 255], 10);
	
	// キャラクターを行動決定済みにする
	this._charactor[x][y].decidedFlg = true;
	
	// 移動マップを非表示にする
	this.clearMoveMap();

	// 移動決定情報を画面情報に設定する
	g_gamen[x][y] = "decideCharactor";
};

/**
 * 攻撃結果を表示します
 */
feh_viewBattle.prototype.showBattle = function(x, y) {
	
	// 戦闘情報を取得する
	this._attackData = this._battleLogic.getBattleData(
			this._battle.selectedCharactor.status, this._charactor[x][y].status);

	// ステータス情報を非表示にする
	this.clearInfo();
	
	// 戦闘情報を表示する
	for (i=0; i<this._attackData.kougekiDataArray.length; i++) {
		var msg = "";
		msg = this._attackData.kougekiDataArray[i].kougekisha.name
				+ " の攻撃 ";
		showMessage(msg, 380, 60+i*70);
		msg = "　"
				+ this._attackData.kougekiDataArray[i].shubisha.name
				+ " に "
				+ this._attackData.kougekiDataArray[i].damage
				+ " ダメージ";
		showMessage(msg, 380, 90+i*70);
		
		if (this._attackData.kougekiDataArray[i].shubishaShibouFlg) {
			msg = this._attackData.kougekiDataArray[i].shubisha.name
					+ " は倒れた";
			showMessage(msg, 380, 120+i*70);
		}
	}

	// 戦闘表示状態を画面情報に設定する
	g_gamen[x][y] = "selectedAttackEnemy";
}

/**
 * 攻撃を実行します
 */
feh_viewBattle.prototype.decideAttack = function(x, y) {
	
	// 攻撃を実行する
//	this._battleLogic.excuteAttack();
	
	// 攻撃者が死んだ場合
	if (this._attackData.kougekishaShibouFlg) {
		
	// 守備者が死んだ場合
	} else if (this._attackData.hangekishaShibouFlg) {
		
	// 守備者が死んだ場合
	} else {
		// キャラクターを決定状態にする
		this.decideMove(this._afterMoveX, this._afterMoveY);
	}
}


/**
 * ターンエンド処理を行います
 */
feh_viewBattle.prototype.endTurn = function() {

	// バトル情報
	if (this._battle.turn == "blue") {
		this._battle.turn = "red";
	} else {
		this._battle.turn = "blue";
	}
	
	// キャラクター情報更新
	for (i=0; i<6; i++) {
		for (j=0; j<8; j++) {
			if (this._charactor[i][j] != undefined) {
				$gameScreen.tintPicture(this._charactor[i][j].imgNo, [0, 0, 0, 0], 10);
				this._charactor[i][j].decidedFlg = false;
				
				// マップ画面情報を更新する
				if (this._battle.turn == this._charactor[i][j].team) {
					g_gamen[i][j] = "charactor";
				} else {
					g_gamen[i][j] = "enemyCharactor";
				}
			}
		}
	}
	
	
}






/**
 * 画面のキャラクターを未選択にします
 */
feh_viewBattle.prototype.decideCharactor = function(x, y) {
//	
//	// 決定キャラクターを移動する
//	var id = this.getCharactorId(x, y)
//	$gameScreen.tintPicture(parseInt(id)+1, [0, 0, 0, 0], 10);
//	var x2 = this._selectCount % 4;
//	var y2 = 5;
//	if (this._selectCount > 3) {
//		y2 = 7;
//	}
//	$gameScreen.movePicture(parseInt(id)+1, 0, x2*60, y2*60, 100, 100, 255, 0, 10);
//
//	// 画面情報を更新する
//	var target = g_gamen[x][y];
//	target.category = "decideCharactor";
//	g_gamen[x2][y2] = target;
//	g_gamen[x][y] = undefined;
};



/***********************************************************************************************************************
 * util
 *
 */

/**
 * ターン終了かどうかを判定します
 */
feh_viewBattle.prototype.isTurnEnd = function(x, y) {
	for (i=0; i<6; i++) {
		for (j=0; j<8; j++) {
			if (this._charactor[i][j] == undefined) {
				continue;
			}

			if (this._battle.turn == this._charactor[i][j].team
					&& !this._charactor[i][j].decidedFlg) {
				return false;
			}		
		}
	}
	return true;
}

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
			if (g_gamen[i][j] == "moveMap"
				|| g_gamen[i][j]== "beforeMoveCharactor") {
				g_gamen[i][j] = undefined;
			}
		}
	}
}

/**
 * 情報画面をクリアする
 */
feh_viewBattle.prototype.clearInfo = function() {
	$gameScreen.erasePicture(50);
	clearMessage();
}



