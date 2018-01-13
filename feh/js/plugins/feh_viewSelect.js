
/***********************************************************************************************************************
 * constracta
 *
 */

/**
 * コンストラクタ
 * @returns
 */
function feh_viewSelect() {
	
	// 選択人数
	this._selectCount = 0;
	
	// 画面を初期化する
	this.init();
}

feh_viewSelect.prototype = Object.create(Object.prototype);
feh_viewSelect.prototype.constructor = feh_viewSelect;



/***********************************************************************************************************************
 * init
 *
 */

/**
 * キャラ選択画面を初期化する
 * @returns
 */
feh_viewSelect.prototype.init = function() {
	
	// 選択キャラクター表示
	this.showCharactor(g_sentoshaData[0], 0, 1);
	this.showCharactor(g_sentoshaData[1], 1, 1);
	this.showCharactor(g_sentoshaData[2], 2, 1);
	this.showCharactor(g_sentoshaData[3], 3, 1);
	this.showCharactor(g_sentoshaData[4], 4, 1);
	this.showCharactor(g_sentoshaData[5], 5, 1);
	this.showCharactor(g_sentoshaData[6], 0, 2);
	this.showCharactor(g_sentoshaData[7], 1, 2);
	this.showCharactor(g_sentoshaData[8], 2, 2);
	this.showCharactor(g_sentoshaData[9], 3, 2);
	
	// メッセージ表示
	showMessage("キャラクターを選んでください", 0, 0);
	showMessage("【味方チーム】", 0, 280);
	showMessage("【敵チーム】", 0, 400);
	
	// 画面ステータス設定
	g_gamenStatus = "none";
};


/***********************************************************************************************************************
 * excute main
 *
 */

/**
 * 選択画面の処理を実行します
 * @param x
 * @param y
 * @returns
 */
feh_viewSelect.prototype.excute = function(x, y, clickTarget) {


	// 初期表示の場合
	if (g_gamenStatus == "none") {
		
		// キャラをクリックした場合
		if (clickTarget == "selectCharactor") {
			this.excute1(x, y);			
		}
		
	// キャラ選択状態の場合
	} else if (g_gamenStatus == "selected") {
		
		// キャラを再度クリックして決定した場合
		if (clickTarget == "selectedCharactor") {
			this.excute2(x, y);
		}
		
	// 処理終了待ちの場合
	} else if (g_gamenStatus == "complete") {
		return ;
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
feh_viewSelect.prototype.excute1 = function(x, y) {
	
	// キャラクターを選択表示にする
	var id = this.getCharactorId(x, y);
	this.selectCharactor(x, y, id);
	
	// 選択したキャラのステータスを表示する（未実装）
	$gameScreen.showPicture(90, "status/ike_stat", 0, 360+14, 0, 100, 100, 255, 0);

	// 画面ステータスを更新する
	g_gamenStatus = "selected";
};

/**
 * キャラクター決定処理
 * @param x
 * @param y
 * @returns
 */
feh_viewSelect.prototype.excute2 = function(x, y) {
	
	// 選択キャラを設定する
	g_selectedIdArray[this._selectCount] = this.getCharactorId(x, y);
	
	// キャラクターを決定する
	this.decideCharactor(x, y);
	
	// 画面ステータスを更新する
	g_gamenStatus = "none";
	
	// キャラクターに所属チーム情報を設定する
	if (this._selectCount < 4) {
		g_sentoshaData[g_selectedIdArray[this._selectCount]].shozokuTeam = "blue";
	} else {
		g_sentoshaData[g_selectedIdArray[this._selectCount]].shozokuTeam = "red";
	}
	
	// 選択人数をカウントする
	this._selectCount++;
	
	// 全部選択した場合、バトルスタート
	if (this._selectCount == 8) {
		g_gamenStatus = "complete";
		var count = 0;
		var countup = function(){
			console.log(count++);
		}
		setTimeout((function() {
			g_startBattleFlg = true;
			g_gamenStatus = undefined;
			clearMessage();
			clearImg();
			clearGamen();
			g_viewBattle = new feh_viewBattle();
		}),
		1000);
	}
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
feh_viewSelect.prototype.showCharactor = function(charactor, x, y) {
	
	// キャラクターを画面に表示する
	// ※第１引数の画像番号は、１から始まることに注意
	$gameScreen.showPicture(parseInt(charactor.id)+1, "sd/" + charactor.img, 0, x*60, y*60, 100, 100, 255, 0);
	
	// 画面情報を更新する
	var param = new Array();
	param.category = "selectCharactor";
	param.id = charactor.id;
	g_gamen[x][y] = param;
};

/**
 * 画面のキャラクターを移動します
 */
feh_viewSelect.prototype.moveCharactor = function(id, x, y) {
	$gameScreen.movePicture(id+1, 0, 180, 300, 100, 100, 255, 0, 10);
};

/**
 * 画面のキャラクターを選択します
 */
feh_viewSelect.prototype.selectCharactor = function(x, y, id) {
	
	// キャラクターを選択色にする
	$gameScreen.tintPicture(parseInt(id)+1, [-60, -60, 60, 60], 10);

	// 画面情報を更新する
	var target = g_gamen[x][y];
	target["category"] = "selectedCharactor";
};

/**
 * 画面のキャラクターを未選択にします
 */
feh_viewSelect.prototype.decideCharactor = function(x, y) {
	
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
feh_viewSelect.prototype.getCharactorId = function(x, y) {
	return g_gamen[x][y].id;
};
