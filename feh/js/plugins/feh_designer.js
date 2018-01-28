
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
	
	// キャラクターの画像Noは50～57
	this._charactorImgNo = 50;
}

feh_designer.prototype = Object.create(Object.prototype);
feh_designer.prototype.constructor = feh_designer;


/**
 * 画面にメッセージを表示する
 */
feh_designer.prototype.message = function(message, x, y, color) {
	g_messageArray.push({
		message: message,
		x: x,
		y: y,
		color: color
	});
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
 * インフォメーションをクリアします
 */
feh_designer.prototype.clearInfo = function() {
	
	// メッセージを削除する
	g_messageArray = new Array();
	
	// インフォ画像を削除する
	// ※インフォ画像の画像Noは61～70
	for (var i=61; i<71; i++) {
		$gameScreen.erasePicture(i);
	}
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
 * パブリック関数 インフォメーション
 *******************************************************************/

/**
 * キャラクターのステータスを表示する
 */
feh_designer.prototype.charactorStatus = function(charactor) {
	
	// まずクリアする
	this.clearInfo();
	
	// ステータスを表示する
	$gameScreen.showPicture(61, "sd/" + charactor.img, 0, 480, 30, 100, 100, 255, 0);
	var msg = "　ＨＰ\n　攻撃\n　速さ\n　守備\n　魔防\n　武器\n　補助\n　奥義\n　aｽｷﾙ\n　bｽｷﾙ\n　cｽｷﾙ\n";
	this.message(msg, 380, 90);
	msg = charactor.nokoriHp	+ "/" + charactor.hp + "\n"
				+ charactor.kougeki + "\n"
				+ charactor.hayasa + "\n"
				+ charactor.shubi + "\n"
				+ charactor.mabou + "\n"
				+ charactor.bukiSkill + "\n"
				+ charactor.hojoSkill + "\n"
				+ charactor.ougi + "\n"
				+ charactor.aSkill + "\n"
				+ charactor.bSkill + "\n"
				+ charactor.cSkill + "\n";
	this.message(msg, 460, 90, "yellow");
};

/**
 * 攻撃予想を表示する
 */
feh_designer.prototype.attack = function(attackData) {
	
	// まずクリアする
	this.clearInfo();
	
	// 攻撃予想を表示する
	$gameScreen.showPicture(62, "sd/" + attackData.kougekisha.img, 0, 370, 140, 100, 100, 255, 0);
	$gameScreen.showPicture(63, "sd/" + attackData.hangekisha.img, 0, 590, 210, 100, 100, 255, 0);
	var msg = "HP\nDM";
	this.message(msg, 430, 140);
	this.message(msg, 475, 210);
	msg = "   " + attackData.kougekisha.nokoriHp + " →\n   " +attackData.kougekisha.damage;
	this.message(msg, 430, 140, "yellow");
	msg = "         " + attackData.kougekisha.tmpHp;
	if (attackData.kougekisha.tmpHp == 0) {
		this.message(msg, 430, 140, "red");
	} else {
		this.message(msg, 430, 140, "yellow");
	}
	if (attackData.kougekisha.kougekiNum > 1) {
		msg = "\n      × " + attackData.kougekisha.kougekiNum;
		this.message(msg, 430, 140, "yellow");
	}
	
	msg = "   " + attackData.hangekisha.nokoriHp + " →\n   " +attackData.hangekisha.damage;
	this.message(msg, 475, 210, "yellow");
	msg = "         " + attackData.hangekisha.tmpHp;
	if (attackData.hangekisha.tmpHp == 0) {
		this.message(msg, 475, 210, "red");
	} else {
		this.message(msg, 475, 210, "yellow");
	}
	if (attackData.hangekisha.kougekiNum > 1) {
		msg = "\n      × " + attackData.hangekisha.kougekiNum;
		this.message(msg, 475, 210, "yellow");
	}
};

/**
 * 攻撃結果を表示する
 */
feh_designer.prototype.attackResult = function(attackData) {
	
	// まずクリアする
	this.clearInfo();
	
	// 攻撃予想を表示する
	$gameScreen.showPicture(62, "sd/" + attackData.kougekisha.img, 0, 370, 140, 100, 100, 255, 0);
	$gameScreen.showPicture(63, "sd/" + attackData.hangekisha.img, 0, 590, 210, 100, 100, 255, 0);
	var msg = "HP\nDM";
	this.message(msg, 430, 140);
	this.message(msg, 475, 210);
	
	msg = "\n   " + attackData.kougekisha.damage;
	this.message(msg, 430, 140, "yellow");
	msg = "   " + attackData.kougekisha.nokoriHp;
	if (attackData.kougekisha.nokoriHp == 0) {
		this.message(msg, 430, 140, "red");
		$gameScreen.tintPicture(62, [0, 0, 0, 255], 10);
	} else {
		this.message(msg, 430, 140, "yellow");
	}
	if (attackData.kougekisha.kougekiNum > 1) {
		msg = "\n      × " + attackData.kougekisha.kougekiNum;
		this.message(msg, 430, 140, "yellow");
	}
	
	msg = "\n   " + attackData.hangekisha.damage;
	this.message(msg, 475, 210, "yellow");
	msg = "   " + attackData.hangekisha.nokoriHp;
	if (attackData.hangekisha.nokoriHp == 0) {
		this.message(msg, 475, 210, "red");
		$gameScreen.tintPicture(63, [0, 0, 0, 255], 10);
	} else {
		this.message(msg, 475, 210, "yellow");
	}
	if (attackData.hangekisha.kougekiNum > 1) {
		msg = "\n      × " + attackData.hangekisha.kougekiNum;
		this.message(msg, 475, 210, "yellow");
	}
};

/**
 * バトル終了
 */
feh_designer.prototype.endBattle = function() {
	this.clearInfo();
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

