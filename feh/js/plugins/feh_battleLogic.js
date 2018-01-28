
/**
 * feh_battleLogic
 * 
 * シミュレーションゲームのロジックを実装するクラスです。
 * 主にキャラクターのステータスに関係する以下の処理を保持します。
 * 
 * ・戦闘処理
 * ・キャラクターの移動範囲の算出
 * ・キャラクターの攻撃範囲の算出
 * ・キャラクターのスキルに関する処理
 * 
 * 
 */



/*******************************************************************
 * パブリック関数
 *******************************************************************/



/**
 * コンストラクタ
 * @returns
 */
function feh_battleLogic() {
}

feh_battleLogic.prototype = Object.create(Object.prototype);
feh_battleLogic.prototype.constructor = feh_battleLogic;


/**
 * 指定したマスをキャラクターが攻撃できるマス情報を取得する
 */
feh_battleLogic.prototype.getCanAttackMap = function(charactor, x, y) {

	// 初期化
	var map = [
			[false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false],
	];
	
	// 攻撃範囲１の場合
	if (g_bukiTypeData[charactor.bukiType].range == 1) {
		if (this.isMap(x+1, y)) {
			map[x+1][y] = true;
		}
		if (this.isMap(x, y+1)) {
			map[x][y+1] = true;
		}
		if (this.isMap(x-1, y)) {
			map[x-1][y] = true;
		}
		if (this.isMap(x, y-1)) {
			map[x][y-1] = true;
		}
		
	// 攻撃範囲２の場合
	} else if (g_bukiTypeData[charactor.bukiType].range == 2) {
		if (this.isMap(x+2, y)) {
			map[x+2][y] = true;
		}
		if (this.isMap(x+1, y+1)) {
			map[x+1][y+1] = true;
		}
		if (this.isMap(x, y+2)) {
			map[x][y+2] = true;
		}
		if (this.isMap(x-1, y+1)) {
			map[x-1][y+1] = true;
		}
		if (this.isMap(x-2, y)) {
			map[x-2][y] = true;
		}
		if (this.isMap(x-1, y-1)) {
			map[x-1][y-1] = true;
		}
		if (this.isMap(x, y-2)) {
			map[x][y-2] = true;
		}
		if (this.isMap(x+1, y-1)) {
			map[x+1][y-1] = true;
		}
	}

	return map;
}


/**
 * x,yマスのキャラクターの移動範囲を算出する
 * 
 * 
 * @return 移動可能マップ情報２次元配列。
 * 			array[x][y] == false の場合、x,yマスに移動不可
 * 			array[x][y] == true の場合、x,yマスに移動不可
 */
feh_battleLogic.prototype.getMoveMap = function(charactor, x, y) {
	
	// 移動距離
	var moveType = charactor.idouType;
	var moveRange = parseInt(g_moveTypeData[charactor.idouType].moveRange);
	
	/*
	 * 移動可能マップ初期化
	 * 　-1　→　平地
	 * 　-2　→　森
	 * 　 7　→　壁（移動不可地形）
	 * 　 8　→　川（飛行移動可能地形）
	 * 　 9　→　溝（騎馬移動難航地形）
	 */
	var moveMap = [
			[-1, -1, -1, -1, -1, -1, -1, -1],
			[-1, -1, -9, -1, -2, -2, -1, -1],
			[-1, -1, -9, -1, -1, -1, -1, -2],
			[-2, -1, -1, -1, -1, -9, -1, -1],
			[-1, -1, -2, -2, -1, -9, -1, -1],
			[-1, -1, -1, -1, -1, -1, -1, -1],
	];
	moveMap[x][y] = moveRange;
	
	// 移動可能マップ探索
	for (k=0; k<moveRange; k++) {
		for (i=0; i<6; i++) {
			for (j=0; j<8; j++) {
				if (moveMap[i][j] > 0) {
					this.searchMap(moveMap, moveType, i, j);
				}
			}
		}
	}
	
	// デバッグログ
	console.log("■movemap");
	console.dir(moveMap);
	
	return moveMap;
}

/**
 * キャラクターの攻撃範囲を算出します
 */
feh_battleLogic.prototype.getAttackMap = function(charactor, moveMap) {

	// 攻撃距離
	var attackRange = parseInt(g_bukiTypeData[charactor.bukiType].range);

	// 攻撃可能マップ初期化
	// ※x,yが反転することに注意
	var attackMap = [
			[false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false],
	];

	// 攻撃マップを作成
	for (i=0; i<6; i++) {
		for (j=0; j<8; j++) {
			
			// 移動可能なマスから攻撃範囲を探索する
			if (moveMap[i][j] >= 0 
					&& (g_gamen[i][j] == "moveMap" 
						|| g_gamen[i][j] == "moveCharactor")) {

				// 近距離攻撃の場合
				if (attackRange == 1) {
					if (this.isMap(i+1, j)) {
						attackMap[i+1][j] = true; 
					}
					if (this.isMap(i, j+1)) {
						attackMap[i][j+1] = true; 
					}
					if (this.isMap(i-1, j)) {
						attackMap[i-1][j] = true; 
					}
					if (this.isMap(i, j-1)) {
						attackMap[i][j-1] = true; 
					}

				// 遠距離攻撃の場合
				} else if (attackRange == 2) {
					if (this.isMap(i+2, j)) {
						attackMap[i+2][j] = true;
					}
					if (this.isMap(i+1, j+1)) {
						attackMap[i+1][j+1] = true;
					}
					if (this.isMap(i, j+2)) {
						attackMap[i][j+2] = true;
					}
					if (this.isMap(i-1, j+1)) {
						attackMap[i-1][j+1] = true;
					}
					if (this.isMap(i-2, j)) {
						attackMap[i-2][j] = true;
					}
					if (this.isMap(i-1, j-1)) {
						attackMap[i-1][j-1] = true;
					}
					if (this.isMap(i, j-2)) {
						attackMap[i][j-2] = true;
					}
					if (this.isMap(i+1, j-1)) {
						attackMap[i+1][j-1] = true;
					}
				}
			}
		}
	}
	
	// デバッグログ
//	console.dir("■attackMap");
//	console.dir(attackMap);
	
	// 攻撃マップを返却
	return attackMap;
}

/**
 * キャラクターが攻撃した場合の、戦闘結果を算出します
 */
feh_battleLogic.prototype.getBattleData = function(kougekisha, hangekisha) {

	var battle = new battleData();

	// 攻撃者、反撃者の設定
	battle.kougekisha = kougekisha;
	battle.hangekisha = hangekisha;
	
	// 攻撃者、反撃者の戦闘中ステータスの算出
	
	
	// 攻撃順の設定
	battle.kougekiJunArray = this.setKougekiJun(kougekisha, hangekisha);
	
	// 攻撃データ設定
	battle.kougekiDataArray = [];
	battle.kougekishaShibouFlg = false;
	battle.hangekishaShibouFlg = false;
	kougekisha.tmpHp = kougekisha.nokoriHp;
	kougekisha.kougekiNum = 0;
	kougekisha.damage = 0;
	hangekisha.tmpHp = hangekisha.nokoriHp;
	hangekisha.kougekiNum = 0;
	hangekisha.damage = 0;
	var isEnd = false;
	for (i = 0; i < battle.kougekiJunArray.length; i++) {
		
		var kougeki;
		if (battle.kougekiJunArray[i] == kougekisha.shozokuTeam) {
			kougeki = this.setKougekiData(kougekisha, hangekisha, isEnd);
			battle.kougekiDataArray.push(kougeki);

			// 死亡した場合、バトル終了
			if (kougeki.shubishaShibouFlg && !isEnd) {
				isEnd = true;
				battle.hangekishaShibouFlg = true;
			}
		} else {
			kougeki = this.setKougekiData(hangekisha, kougekisha, isEnd);
			battle.kougekiDataArray.push(kougeki);

			// 死亡した場合、バトル終了
			if (kougeki.shubishaShibouFlg && !isEnd) {
				isEnd = true;
				battle.kougekishaShibouFlg = true;
			}
		}
	}
	
	// デバッグログ
	console.dir("■attackData");
	console.dir(battle);
	
	return battle;
}

/**
 * キャラクターの攻撃を実行して、
 * HPなどのステータスに反映します
 */
feh_battleLogic.prototype.excuteAttack = function(attackData) {

	// ダメージを反映する
	var attackDataArray = attackData.kougekiDataArray;
	for (i=0; i<attackDataArray.length; i++) {
		
		// ダメージ計算する
		attackDataArray[i].shubisha.nokoriHp -= attackDataArray[i].damage;
		if (attackDataArray[i].shubisha.nokoriHp < 0) {
			attackDataArray[i].shubisha.nokoriHp = 0;
		}

		// 守備者が死亡した場合、終了
		if (attackDataArray[i].shubishaShibouFlg) {
			return ;
		}	
	}	
}



/*******************************************************************
 * プライベート関数　マップ系統
 *******************************************************************/


/**
 * 移動範囲探索アルゴリズム
 */
feh_battleLogic.prototype.searchMap = function(moveMap, moveType, x, y) {
	
	// 上方向を探索
	if ((y - 1) >= 0) {
		this.serch(moveMap, moveType, moveMap[x][y], x, y-1);
	}
	
	// 右方向を探索
	if ((x + 1) <= 5) {
		this.serch(moveMap, moveType, moveMap[x][y], x+1, y);
	}
	
	// 下方向を探索
	if ((y + 1) <= 7) {
		this.serch(moveMap, moveType, moveMap[x][y], x, y+1);
	}
	
	// 左方向を探索
	if ((x - 1) >= 0) {
		this.serch(moveMap, moveType, moveMap[x][y], x-1, y);
	}	
}

/**
 * 移動範囲探索アルゴリズム
 */
feh_battleLogic.prototype.serch = function(moveMap, moveType, moveRange, x, y) {
	
	// 探索済みの場合
	if (moveMap[x][y] >= 0) {
		return ;
	}
	
	// 敵キャラクターがいるマスは移動不可
	if (g_gamen[x][y] == "enemyCharactor") {
		return ;
	}
	
	// 森地形の場合
	if (moveMap[x][y] == -2) {
		
		// 騎馬は移動不可
		if (moveType == 1) {
			return ;
		}
		
		// 重装は平地と同じ扱いにする
		if (moveType == 2) {
			moveMap[x][y] = -1;
		}
	}
	
	// 探索実行
	if ((moveMap[x][y] + moveRange) >= 0) {
		moveMap[x][y] += moveRange;
	}
}


/**
 * 指定したマスがマップをはみ出ていないか判定します
 * 
 */
feh_battleLogic.prototype.isMap = function(x, y) {
	if (x < 0 || 5 < x
			|| y < 0 || 7 < y) {
		return false;
	}
	return true;
}



/*******************************************************************
 * プライベート関数　戦闘系統
 *******************************************************************/



/**
 * 攻撃データを設定する
 * @param kougekisha
 * @param shubisha
 * @param kougekiJunArray
 * @returns
 */
feh_battleLogic.prototype.setKougekiData = 
	function(kougekisha, shubisha, isEnd) {

	var kougeki = new kougekiData();

	kougeki.kougekisha = kougekisha;
	kougeki.shubisha = shubisha;
	kougeki.damage = this.culcDamage(kougekisha, shubisha);
	kougeki.kougekishaOugiHendou = -1;
	kougeki.shubishaoOgiHendou = -1;
	kougeki.kougekishaOugiFlg = false;
	kougeki.shubishaOugiFlg = false;
	kougekisha.damage = kougeki.damage;
	kougekisha.kougekiNum += 1;
	if (!isEnd) {
		shubisha.tmpHp -= kougeki.damage;
	}
	if (shubisha.tmpHp <= 0) {
		kougeki.shubishaShibouFlg = true;
		shubisha.tmpHp = 0;
	} else {
		kougeki.shubishaShibouFlg = false;
	}
	
	return kougeki;
}

/**
 * 攻撃する順番を設定した配列を返却する。
 * 配列には所属チームを設定する。
 * @param kougekisha
 * @param hangekisha
 * @returns
 */
feh_battleLogic.prototype.setKougekiJun = function(kougekisha, hangekisha) {
	
	var kougekiJun = [];
	
	// 攻撃者の攻撃
	kougekiJun.push(kougekisha.shozokuTeam);
	
	// 反撃者の反撃
	if (this.canHangeki(kougekisha, hangekisha)) {
		kougekiJun.push(hangekisha.shozokuTeam);
	}
	
	// 攻撃者の追撃
	if (this.canTsuigeki(kougekisha, hangekisha)) {
		kougekiJun.push(kougekisha.shozokuTeam);		
	}

	// 反撃者の追撃
	if (this.canHangeki(kougekisha, hangekisha) && this.canTsuigeki(hangekisha, kougekisha)) {
		kougekiJun.push(hangekisha.shozokuTeam);	
	}
	
	return kougekiJun;
}

/**
 * ダメージを計算する
 * @param kougekisha
 * @param shubisha
 * @returns
 */
feh_battleLogic.prototype.culcDamage = function(kougekisha, shubisha) {

	var damage = 0;
	var rate = 1;
	var kougeki = kougekisha.kougeki;
	var bougyo;
	
	// ダメージタイプ考慮
	if (g_bukiTypeData[kougekisha.bukiType].damageType == "butsuri") {
		bougyo = shubisha.shubi;
	} else {
		bougyo = shubisha.mabou;
	}
	
	// 倍率を算出
	// 有利色の判定
	if ((g_bukiTypeData[kougekisha.bukiType].color == "red" && g_bukiTypeData[shubisha.bukiType].color == "green")
			|| (g_bukiTypeData[kougekisha.bukiType].color == "green" && g_bukiTypeData[shubisha.bukiType].color == "blue")
			|| (g_bukiTypeData[kougekisha.bukiType].color == "blue" && g_bukiTypeData[shubisha.bukiType].color == "red")) {
		rate += 0.2;
	}
	
	// 不利色の判定
	if ((g_bukiTypeData[kougekisha.bukiType].color == "red" && g_bukiTypeData[shubisha.bukiType].color == "blue")
			|| (g_bukiTypeData[kougekisha.bukiType].color == "green" && g_bukiTypeData[shubisha.bukiType].color == "red")
			|| (g_bukiTypeData[kougekisha.bukiType].color == "blue" && g_bukiTypeData[shubisha.bukiType].color == "green")) {
		rate -= 0.2;
	}
	
	// 倍率の小数点を考慮
	if (rate < 1) {
		kougeki = Math.trunc(kougeki * rate)+1;
	} else {
		kougeki = Math.trunc(kougeki * rate);
	}
	
	// ダメージを算出
	damage = kougeki - bougyo;
	
	// 0考慮
	if (damage < 0) {
		damage = 0;
	}
	
	return damage;
}

/**
 * 反撃可能かを判定する
 * @param kougekisha
 * @param hangekisha
 * @returns
 */
feh_battleLogic.prototype.canHangeki = function(kougekisha, hangekisha) {
	if (g_bukiTypeData[kougekisha.bukiType].range == g_bukiTypeData[hangekisha.bukiType].range) {
		return true;
	} else {
		return false;
	} 
}

/**
 * 追撃可能かどうかを判定する
 * @param kougekisha
 * @param hangekisha
 * @returns
 */
feh_battleLogic.prototype.canTsuigeki = function(kougekisha, hangekisha) {
	if ((kougekisha.hayasa - hangekisha.hayasa) > 5) {
		return true;
	} else {
		return false;
	}
}
