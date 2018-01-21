
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
		
		// 味方キャラをクリックした場合の処理
		if (clickTarget == "charactor") {
			this.excute1(x, y);
		}
		
		// 敵キャラか行動済みキャラをクリックした場合の処理
		if (clickTarget == "enemyCharactor" || clickTarget == "decideCharactor") {
			this.excute11(x, y);
		}
		
	// 移動可能キャラ選択状態の場合
	} else if (g_gamenStatus == "selected") {
		
		// 自マスをクリックした場合、キャラクターを待機状態にする
		if (clickTarget == "moveCharactor") {
			this.excute3(x, y);
		}
		
		// キャラの移動先をクリックした場合の処理
		if (clickTarget == "moveMap") {
			this.excute2(x, y);
		}
		
		// 攻撃対象をクリックした場合の処理
		if (clickTarget == "canAttackEnemy") {
			this.excute8(x, y);
		}
		
		// 補助対象をクリックした場合の処理
		
		// 別キャラクターをクリックした場合の処理
		if (clickTarget == "charactor" 
			|| clickTarget == "enemyCharactor"
			|| clickTarget == "decideCharactor") {
			this.excute6(x, y);
		}
		
		// 関係ないマスをクリックした場合、行動をキャンセルする
		if (clickTarget == undefined) {
			this.excute99();
		}

	// キャラ移動先選択状態の場合
	} else if (g_gamenStatus == "moved") {
		
		// 別の移動先をクリックした場合の処理
		if (clickTarget == "moveMap") {
			this.excute2(x, y);
		}
		
		// 同じ移動先をクリックした場合、移動先決定
		if (clickTarget == "moveCharactor") {
			this.excute3(x, y);
		}
		
		// 攻撃対象をクリックした場合
		if (clickTarget == "canAttackEnemy") {
			this.excute8(x, y);
		}
		
		// 補助対象をクリックした場合

		// その他キャラクターをクリックした場合の処理
		if (clickTarget == "charactor" 
			|| clickTarget == "enemyCharactor"
			|| clickTarget == "decideCharactor") {
			this.excute6(x, y);
		}

		// 関係ないマスをクリックした場合、行動をキャンセルする
		if (clickTarget == undefined) {
			this.excute7(x, y);
		}
		
	// 攻撃対象選択状態の場合
	} else if (g_gamenStatus == "selectedAttackEnemy") {
		
		// 同じ攻撃対象をクリックした場合
		if (clickTarget == "selectedAttackEnemy") {
			this.excute5(x, y);
		}
		
		// 別の攻撃対象をクリックした場合
		if (clickTarget == "canAttackEnemy") {
			this.excute12(x, y);
		}
		
		// 攻撃できないキャラクターをクリックした場合
		if (clickTarget == "charactor" 
			|| clickTarget == "enemyCharactor"
			|| clickTarget == "decideCharactor") {
			this.excute6(x, y);
		}
		
		// 別の移動先をクリックした場合　→移動中状態に
		if (clickTarget == "moveMap") {
			this.excute9(x, y);
		}
		
		// 移動中のキャラクターをクリックした場合
		if (clickTarget == "moveCharactor") {
			this.excute10(x, y);
		}
		
		// 関係ないマスをクリックした場合
		if (clickTarget == undefined) {
			this.excute7(x, y);
		}

	// 補助対象選択状態の場合
	} else if (g_gamenStatus == "") {
		
	}

	// デバッグログ
	console.dir("■end battle excute");
	console.dir("■battle, charactor");
	console.dir(this._battle);
	console.dir(this._charactor);
};


/***********************************************************************************************************************
 * excute
 *
 */


/**
 * キャラ選択処理
 * @returns
 */
feh_viewBattle.prototype.excute1 = function(x, y) {

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
	
	// 画面ステータス設定
	g_gamenStatus = "moved";
};

/**
 * キャラクター移動決定
 */
feh_viewBattle.prototype.excute3 = function(x, y) {

	// キャラクターを移動済み表示にする
	this.decideMove(x, y);
	
	// 戦闘画面の情報をクリアする
	this.clearBattleViewInfo();
	
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
	
	// 戦闘画面の情報をクリアする
	this.clearBattleViewInfo();
	
	// 全キャラクター行動済みの場合、ターン終了
	if (this.isTurnEnd()) {
		this.endTurn();
	}
	
	// 画面ステータス設定
	g_gamenStatus = "none";
}

/*
 * 移動キャラクター選択中に、他のキャラクターを選択する処理
 */
feh_viewBattle.prototype.excute6 = function(x, y) {
	
	// クリックしたキャラクターのステータスを表示する
	this.viewStatus(x, y);
	
	// 攻撃対象選択状態をキャンセルする
	this.unselectAttackEnemy();
	
	// 画面ステータス設定
	g_gamenStatus = "moved";
}

/**
 * キャラクターの移動先選択中に、移動をキャンセルする処理
 */
feh_viewBattle.prototype.excute7 = function(x, y) {
	
	// 選択キャラクターの表示を元に戻す
	$gameScreen.movePicture(
			this._charactor[this._beforeMoveX][this._beforeMoveY].imgNo, 
			0, this._beforeMoveX * 60, this._beforeMoveY * 60, 100, 100, 255, 0, 10);
	$gameScreen.tintPicture(this._charactor[this._beforeMoveX][this._beforeMoveY].imgNo, [0, 0, 0, 0], 10);

	// バトル画面の情報をクリアする
	this.clearBattleViewInfo();

	// 画面ステータス設定
	g_gamenStatus = "none";
}

/**
 * 攻撃可能なキャラクターをクリックした場合
 */
feh_viewBattle.prototype.excute8 = function(x, y) {
	
	// クリックしたキャラクターを攻撃可能なマスに移動する
	this.moveNearEnemy(x, y);
}

/**
 * 攻撃対象選択中に別の移動先をクリックした場合
 */
feh_viewBattle.prototype.excute9 = function(x, y) {
	
	// 移動する
	this.excute2(x, y);
	
	// 攻撃対象選択状態をキャンセルする
	this.unselectAttackEnemy();
}

/**
 * 攻撃対象選択中に移動キャラクターをクリックした場合
 */
feh_viewBattle.prototype.excute10 = function(x, y) {
	
	// クリックしたキャラクターのステータスを表示する
	this.viewStatus(this._beforeMoveX, this._beforeMoveY);
	
	// 攻撃対象選択状態をキャンセルする
	this.unselectAttackEnemy();
	
	// 画面ステータス設定
	g_gamenStatus = "moved";
}

/**
 * 状態なし、他のキャラクターを選択する処理
 */
feh_viewBattle.prototype.excute11 = function(x, y) {
	
	// クリックしたキャラクターのステータスを表示する
	this.viewStatus(x, y);
	
	// 画面ステータス設定
	g_gamenStatus = "none";
}

/**
 * 攻撃対象選択中に、別の攻撃対象を選択する処理
 */
feh_viewBattle.prototype.excute12 = function(x, y) {
	
	// 攻撃対象選択状態をキャンセルする
	this.unselectAttackEnemy();
	
	// クリックしたキャラクターを攻撃可能なマスに移動する
	this.moveNearEnemy(x, y);	
}
/**
 * 行動をキャンセルする処理
 */
feh_viewBattle.prototype.excute99 = function() {
	
	// 選択キャラクターの表示を元に戻す
	$gameScreen.tintPicture(this._battle.selectedCharactor.imgNo, [0, 0, 0, 0], 10);

	// バトル画面の情報をクリアする
	this.clearBattleViewInfo();

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
	
	// キャラクター画面情報を更新する
	g_gamen[x][y] = "moveCharactor";
	
	// キャラクターを選択色にする
	$gameScreen.tintPicture(this._charactor[x][y].imgNo, [-60, -60, 60, 60], 10);
	
	// キャラクターの移動範囲を表示する
	var moveMap = this._battleLogic.getMoveMap(this._charactor[x][y].status, x, y);
	for (i=0; i<6; i++) {
		for (j=0; j<8; j++) {
			if (moveMap[i][j] >= 0) {
				$gameScreen.tintPicture(this.getMapImgNo(i, j), [-60, -60, 60, 60], 10);
				
				// マップ画面情報を更新する
				if (g_gamen[i][j] == undefined) {
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

	// 選択したキャラのステータスを表示する
	this.viewStatus(x, y);
	
	// 選択キャラクターの移動マス情報を保存する
	this._beforeMoveX = x;
	this._beforeMoveY = y;
	this._afterMoveX = x;
	this._afterMoveY = y;
	
	// 選択キャラクター情報を保存する
	this._battle.selectedCharactor = this._charactor[x][y];
};


/**
 * 画面のキャラクターを移動します
 */
feh_viewBattle.prototype.moveCharactor = function(x, y) {
	
	// キャラクターを移動する
	$gameScreen.movePicture(
			this._battle.selectedCharactor.imgNo, 
			0, x*60, y*60, 100, 100, 255, 0, 10);

	// 移動キャラクター情報を画面情報に設定する
	g_gamen[this._afterMoveX][this._afterMoveY] = "moveMap";
	g_gamen[x][y] = "moveCharactor";
	
	// キャラクター移動前、移動後のマスを保存する
	this._afterMoveX = x;
	this._afterMoveY = y;
};

/**
 * キャラクターの移動を確定します
 */
feh_viewBattle.prototype.decideMove = function(x, y) {
	
	// キャラクター情報を移動する
	this._charactor[x][y] = this._battle.selectedCharactor;
	if (!(x == this._beforeMoveX && y == this._beforeMoveY)) {
		this._charactor[this._beforeMoveX][this._beforeMoveY] = undefined;
	}
	
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
	var msg = this._attackData.kougekisha.name
				+ " - HP " + this._attackData.kougekisha.nokoriHp
				+ "/" + this._attackData.kougekisha.hp;
	showMessage(msg, 380, 60);
	msg = this._attackData.hangekisha.name
			+ " - HP " + this._attackData.hangekisha.nokoriHp
			+ "/" + this._attackData.hangekisha.hp;
	showMessage(msg, 380, 90);
	for (i=0; i<this._attackData.kougekiDataArray.length; i++) {
		msg = this._attackData.kougekiDataArray[i].kougekisha.name
				+ " の攻撃 ";
		showMessage(msg, 380, 130+i*70);
		msg = "　"
				+ this._attackData.kougekiDataArray[i].shubisha.name
				+ " に "
				+ this._attackData.kougekiDataArray[i].damage
				+ " ダメージ";
		showMessage(msg, 380, 160+i*70);
	}

	// 戦闘表示状態を画面情報に設定する
	g_gamen[x][y] = "selectedAttackEnemy";
}

/**
 * 攻撃を実行します
 */
feh_viewBattle.prototype.decideAttack = function(x, y) {
	
	// 攻撃を実行する
	this._battleLogic.excuteAttack(this._attackData);
	
	// 攻撃の結果を表示する
	this.clearInfo();
	var msg = this._attackData.kougekisha.name
				+ " - HP " + this._attackData.kougekisha.nokoriHp
				+ "/" + this._attackData.kougekisha.hp;
	showMessage(msg, 380, 60);
	msg = this._attackData.hangekisha.name
				+ " - HP " + this._attackData.hangekisha.nokoriHp
				+ "/" + this._attackData.hangekisha.hp;
	showMessage(msg, 380, 90);	
	if (this._attackData.kougekishaShibouFlg) {
		msg = this._attackData.kougekisha.name
				+ " は倒れた";
		showMessage(msg, 380, 130);
	}
	if (this._attackData.hangekishaShibouFlg) {
		msg = this._attackData.hangekisha.name
				+ " は倒れた";
		showMessage(msg, 380, 130);
	}
	
	// 攻撃者が死んだ場合
	if (this._attackData.kougekishaShibouFlg) {
		
		// 攻撃者を死亡状態にする
		$gameScreen.erasePicture(this._charactor[this._beforeMoveX][this._beforeMoveY].imgNo);
		this._charactor[this._beforeMoveX][this._beforeMoveY] = undefined;
		g_gamen[this._beforeMoveX][this._beforeMoveY] = undefined;
		
	// 守備者が死んだ場合
	} else if (this._attackData.hangekishaShibouFlg) {
		
		// 攻撃キャラクターを決定状態にする
		this.decideMove(this._afterMoveX, this._afterMoveY);
		
		// 守備者を死亡状態にする
		$gameScreen.erasePicture(this._charactor[x][y].imgNo);
		this._charactor[x][y] = undefined;
		g_gamen[x][y] = undefined;
		
	// どちらも生き残った場合
	} else {
		
		// 攻撃キャラクターを決定状態にする
		this.decideMove(this._afterMoveX, this._afterMoveY);
	}
	
	// 情報をクリアする
	this.clearBattleViewInfo();
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
 * ステータスを表示します
 */
feh_viewBattle.prototype.viewStatus = function(x, y) {
	this.clearInfo();
	var msg = this._charactor[x][y].status.name + " のステータス";
	showMessage(msg, 380, 30);
	msg = "　ＨＰ " + this._charactor[x][y].status.nokoriHp
				+ "/" + this._charactor[x][y].status.hp;
	showMessage(msg, 380, 60);
	msg = "　攻撃 " + this._charactor[x][y].status.kougeki;
	showMessage(msg, 380, 90);
	msg = "　速さ " + this._charactor[x][y].status.hayasa;
	showMessage(msg, 380, 120);
	msg = "　防御 " + this._charactor[x][y].status.shubi;
	showMessage(msg, 380, 150);
	msg = "　魔防 " + this._charactor[x][y].status.mabou;
	showMessage(msg, 380, 180);
	msg = "　武器 " + this._charactor[x][y].status.bukiSkill;
	showMessage(msg, 380, 210);
	msg = "　補助 " + this._charactor[x][y].status.hojoSkill;
	showMessage(msg, 380, 240);
	msg = "　奥義 " + this._charactor[x][y].status.ougi;
	showMessage(msg, 380, 270);
	msg = "　aｽｷﾙ " + this._charactor[x][y].status.aSkill;
	showMessage(msg, 380, 300);
	msg = "　bｽｷﾙ " + this._charactor[x][y].status.bSkill;
	showMessage(msg, 380, 330);
	msg = "　cｽｷﾙ " + this._charactor[x][y].status.cSkill;
	showMessage(msg, 380, 360);
}

/**
 * 敵キャラを攻撃できる位置に移動します
 */
feh_viewBattle.prototype.moveNearEnemy = function(x, y) {

	// 指定した敵キャラが攻撃可能なマス情報を取得する
	var attackMap = this._battleLogic.getCanAttackMap(
			this._charactor[this._beforeMoveX][this._beforeMoveY].status, x, y);

	// 移動せずに攻撃が可能な場合
	var resultX;
	var resultY;
	if (attackMap[this._afterMoveX][this._afterMoveY]) {
		resultX = this._afterMoveX;
		resultY = this._afterMoveY;
		
	// 移動しないと攻撃できない場合
	} else {
		
		// 移動可能なマス情報を取得する
		var moveMap = this._battleLogic.getMoveMap(
						this._charactor[this._beforeMoveX][this._beforeMoveY].status, 
						this._beforeMoveX, this._beforeMoveY);
		
		// 指定した敵が攻撃可能かつ移動可能なマスを特定する
		for (i=0; i<6; i++) {
			for (j=0; j<8; j++) {
				if (attackMap[i][j] 
						&& moveMap[i][j] >= 0 
						&& this._charactor[i][j] == undefined) {
					resultX = i;
					resultY = j;
				}
			}
		}
	}

	// 対象マスまで移動する
	this.excute2(resultX, resultY);
	
	// 攻撃情報を設定する
	this.excute4(x, y);
}

/**
 * 攻撃対象選択状態を解除します
 */
feh_viewBattle.prototype.unselectAttackEnemy = function() {
	for (i=0; i<6; i++) {
		for (j=0; j<8; j++) {
			if(g_gamen[i][j] == "selectedAttackEnemy") {
				g_gamen[i][j] = "canAttackEnemy";
			}
		}
	}
}





/***********************************************************************************************************************
 * util
 *
 */

/**
 * バトル画面の情報をクリアします
 */
feh_viewBattle.prototype.clearBattleViewInfo = function() {

	// 画面情報をクリア
	for (i=0; i<6; i++) {
		for (j=0; j<8; j++) {
			
			// キャラクターがいないマスの場合
			if (this._charactor[i][j] == undefined) {
				g_gamen[i][j] = undefined;
				
			// 味方キャラクターが存在するマスの場合
			} else if(this._battle.turn == this._charactor[i][j].team) {
				if (g_gamen[i][j] != "decideCharactor") {
					g_gamen[i][j] = "charactor";
				}
				
			// 敵キャラクターが存在するマスの場合
			} else if(this._battle.turn != this._charactor[i][j].team) {
				g_gamen[i][j] = "enemyCharactor";
			}
		}
	}
	
	// 戦闘画面情報をクリア
	this._battle.selectedCharactor = undefined;
	this._beforeMoveX = undefined;
	this._beforeMoveY = undefined;
	this._afterMoveX = undefined;
	this._afterMoveY = undefined;
	this._attackData = undefined;
	
	// マップの表示状態をクリア
	this.clearMoveMap();
}

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
			if (g_gamen[i][j] == "moveMap") {
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



