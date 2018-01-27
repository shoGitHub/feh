
/**
 * feh_designer
 * 
 * 画面の表示ロジックを担当します。
 * 主に画像を表示する処理です。
 * 
 * 
 */



/*******************************************************************
 * パブリック関数
 *******************************************************************/

/**
 * コンストラクタ
 */
function feh_designer() {
	
	// キャラクターの画像No
	this._charactorImgNo = 50;
}

feh_designer.prototype = Object.create(Object.prototype);
feh_designer.prototype.constructor = feh_designer;


/**
 * 画面にメッセージを表示する
 */
feh_designer.prototype.message = function(message, x, y) {
	var param = new Array();
	param.message = message;
	param.x = x;
	param.y = y;
	g_messageArray.push(param);
};

/**
 * メッセージを全て消去します
 * @returns
 */
feh_designer.prototype.clearMessage = function() {
	g_messageArray = new Array();
};

/**
 * 表示画像を全て消去します
 * @returns
 */
feh_designer.prototype.clearImg = function() {
	for (var i=0; i<100; i++) {
		$gameScreen.erasePicture(i);
	}
};

/**
 * 情報表示をクリアします
 */
feh_designer.prototype.clearInfo = function() {
	g_messageArray = new Array();
};




/*******************************************************************
 * パブリック関数 map
 *******************************************************************/

/**
 * マップを表示します
 */
feh_designer.prototype.showMap = function(mapId) {

	var c = 0;
	for (i=0; i<8; i++) {
		for (j=0; j<6; j++) {
			
			// マップを表示する
			// ※マップの画像IDは１～４８
			$gameScreen.showPicture(c+1, "map/map_" + c++, 0, 60*j, 60*i, 100, 100, 255, 0);
		}
	}
};

/**
 * マップを移動可能色にします
 */
feh_designer.prototype.moveMap = function(x, y) {
	$gameScreen.tintPicture(this.getMapImgNo(x, y), [-60, -60, 60, 60], 10);
};

/**
 * マップを攻撃可能色にします
 */
feh_designer.prototype.attackMap = function(x, y) {
	$gameScreen.tintPicture(this.getMapImgNo(x, y), [60, -60, -60, 60], 10);
};

/**
 * マップを通常色にします
 */
feh_designer.prototype.clearMap = function() {
	for (i=1; i<49; i++) {
		$gameScreen.tintPicture(i, [0, 0, 0, 0], 10);
	}
};




/*******************************************************************
 * パブリック関数 キャラクター
 *******************************************************************/

/*
 * キャラクターを表示します
 */
feh_designer.prototype.showCharactor = function(charactor, x, y) {
	
	// 画像Noを設定する
	charactor.imgNo = this._charactorImgNo++;
	
	// キャラクターを画面に表示する
	$gameScreen.showPicture(
			charactor.imgNo,
			"sd/" + charactor.status.img, 0, x*60, y*60, 100, 100, 255, 0);
};

/**
 * キャラクターを移動します
 */
feh_designer.prototype.moveCharactor = function(charactor, x, y) {
	$gameScreen.movePicture(charactor.imgNo, 0, x * 60, y * 60, 100, 100, 255, 0, 10);
};

/**
 * キャラクターを通常色にします
 */
feh_designer.prototype.normalCharactor = function(charactor) {
	$gameScreen.tintPicture(charactor.imgNo, [0, 0, 0, 0], 10);
};

/**
 * キャラクターを選択色にします
 */
feh_designer.prototype.selectCharactor = function(charactor) {
	$gameScreen.tintPicture(charactor.imgNo, [-60, -60, 60, 60], 10);
};

/**
 * キャラクターを行動済みにします
 */
feh_designer.prototype.decideCharactor = function(charactor) {
	$gameScreen.tintPicture(charactor.imgNo, [0, 0, 0, 255], 10);
};

/**
 * キャラクターを非表示にします
 */
feh_designer.prototype.eraseCharactor = function(charactor) {
	$gameScreen.erasePicture(charactor.imgNo);
};



/*******************************************************************
 * パブリック関数 情報画面
 *******************************************************************/


feh_designer.prototype.charactorStatus = function(charactor) {
	// まずクリアする
	this.clearInfo();
	var msg = charactor.status.name + " のステータス";
	this.message(msg, 380, 30);
	msg = "　ＨＰ " + charactor.status.nokoriHp
				+ "/" + charactor.status.hp;
	this.message(msg, 380, 60);
	msg = "　攻撃 " + charactor.status.kougeki;
	this.message(msg, 380, 90);
	msg = "　速さ " + charactor.status.hayasa;
	this.message(msg, 380, 120);
	msg = "　守備 " + charactor.status.shubi;
	this.message(msg, 380, 150);
	msg = "　魔防 " + charactor.status.mabou;
	this.message(msg, 380, 180);
	msg = "　武器 " + charactor.status.bukiSkill;
	this.message(msg, 380, 210);
	msg = "　補助 " + charactor.status.hojoSkill;
	this.message(msg, 380, 240);
	msg = "　奥義 " + charactor.status.ougi;
	this.message(msg, 380, 270);
	msg = "　aｽｷﾙ " + charactor.status.aSkill;
	this.message(msg, 380, 300);
	msg = "　bｽｷﾙ " + charactor.status.bSkill;
	this.message(msg, 380, 330);
	msg = "　cｽｷﾙ " + charactor.status.cSkill;
	this.message(msg, 380, 360);
};

/**
 * 攻撃情報を表示する
 */
feh_designer.prototype.attack = function(attackData) {
	// まずクリアする
	this.clearInfo();
	var msg = attackData.kougekisha.name
				+ " - HP " + attackData.kougekisha.nokoriHp
				+ "/" + attackData.kougekisha.hp;
	this.message(msg, 380, 60);
	msg = attackData.hangekisha.name
			+ " - HP " + attackData.hangekisha.nokoriHp
			+ "/" + attackData.hangekisha.hp;
	this.message(msg, 380, 90);
	for (i=0; i<attackData.kougekiDataArray.length; i++) {
		msg = attackData.kougekiDataArray[i].kougekisha.name
				+ " の攻撃 ";
		this.message(msg, 380, 130+i*70);
		msg = "　"
				+ attackData.kougekiDataArray[i].shubisha.name
				+ " に "
				+ attackData.kougekiDataArray[i].damage
				+ " ダメージ";
		this.message(msg, 380, 160+i*70);
	}
};

/**
 * 攻撃結果を表示する
 */
feh_designer.prototype.attackResult = function(attackData) {
	// まずクリアする
	this.clearInfo();
	var msg = attackData.kougekisha.name
				+ " - HP " + attackData.kougekisha.nokoriHp
				+ "/" + attackData.kougekisha.hp;
	this.message(msg, 380, 60);
	msg = attackData.hangekisha.name
			+ " - HP " + attackData.hangekisha.nokoriHp
			+ "/" + attackData.hangekisha.hp;
	this.message(msg, 380, 90);	
	if (attackData.kougekishaShibouFlg) {
		msg = attackData.kougekisha.name + " は倒れた";
		this.message(msg, 380, 130);
	}
	if (attackData.hangekishaShibouFlg) {
		msg = attackData.hangekisha.name + " は倒れた";
		this.message(msg, 380, 130);
	}
};

/**
 * バトル終了
 */
feh_designer.prototype.endBattle = function() {
	this.clearMessage();
	this.message("戦闘終了！", 380, 150);
};





/*******************************************************************
 * プライベート関数
 *******************************************************************/

/**
 * x,yマスの画像Noを取得します
 */
feh_designer.prototype.getMapImgNo = function(x, y) {
	return (1 + parseInt(x) + (parseInt(y) * 6));
};

