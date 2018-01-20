
/**
 * テスト用関数
 * @returns
 */
function testFunction() {
	var battle = getBattleData();
	console.dir(battle);
}

/**
 * コンストラクタ
 * @returns
 */
function feh_battleLogic() {
}

feh_battleLogic.prototype = Object.create(Object.prototype);
feh_battleLogic.prototype.constructor = feh_battleLogic;

/**
 * キャラクターが指定したマスを攻撃できるマス情報を取得する
 * viewクラスから呼び出される処理。
 */
feh_battleLogic.prototype.getCanAttackMap = function(charactor, x, y) {

	var map = [
			[false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false],
	];
	
	
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
	console.dir("■map");
	console.dir(map);
	return map;
}


/**
 * x,yマスのキャラクターの移動可能なマップ情報を返却する。
 * viewクラスから呼び出される処理。
 * 
 * 
 * @return 移動可能マップ情報２次元配列。
 * 			array[x][y] == false の場合、x,yマスに移動不可
 * 			array[x][y] == true の場合、x,yマスに移動不可
 */
feh_battleLogic.prototype.getMoveMap = function(x, y) {
	
	/*
	 * アルゴリズムは次のURLを参照
	 * http://2dgames.jp/2012/05/22/%E6%88%A6%E8%A1%93slg%E3%81%AE%E4%BD%9C%E3%82%8A%E6%96%B9%EF%BC%88%E7%A7%BB%E5%8B%95%E7%AF%84%E5%9B%B2%E3%82%92%E6%B1%82%E3%82%81%E3%82%8B%EF%BC%89/
	 */
	
	// 移動可能マップ初期化
	// ※x,yが反転することに注意
	var moveMap = [
			[-1, -1, -1, -1, -1, -1, -1, -1],
			[-1, -1, -1, -1, -1, -1, -1, -1],
			[-1, -1, -1, -1, -1, -1, -1, -1],
			[-1, -1, -1, -1, -1, -1, -1, -1],
			[-1, -1, -1, -1, -1, -1, -1, -1],
			[-1, -1, -1, -1, -1, -1, -1, -1],
	];
	
	// 移動可能マップ探索
	this.searchMap(moveMap, 2, x, y);
	
	return moveMap;
}

/**
 * 移動範囲探索アルゴリズム
 */
feh_battleLogic.prototype.searchMap = function(moveMap, move, x, y) {
	
	// 移動力０の場合、探索終了
	if (move == 0) {
		return;
	}
	
	// 上方向を探索
	if ((y - 1) >= 0) {
		if (this.serch(moveMap, move, x, y-1)) {
			this.searchMap(moveMap, move-1, x, y-1);
		}
	}
	
	// 右方向を探索
	if ((x + 1) <= 5) {
		if (this.serch(moveMap, move, x+1, y)) {
			this.searchMap(moveMap, move-1, x+1, y);
		}
	}
	
	// 下方向を探索
	if ((y + 1) <= 7) {
		if (this.serch(moveMap, move, x, y+1)) {
			this.searchMap(moveMap, move-1, x, y+1);
		}
	}
	
	// 左方向を探索
	if ((x - 1) >= 0) {
		if (this.serch(moveMap, move, x-1, y)) {
			this.searchMap(moveMap, move-1, x-1, y);
		}
	}	
}

/**
 * 移動範囲探索アルゴリズム
 */
feh_battleLogic.prototype.serch = function(moveMap, move, x, y) {
	
	// 探索済みの場合
	if (moveMap[x][y] > 0) {
		return false;
	}
	
	// 探索実行
	moveMap[x][y] += move;
	return (moveMap[x][y] > 0);
}

/**
 * 攻撃可能マップを取得します
 */
feh_battleLogic.prototype.getAttackMap = function(charactor, moveMap) {

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
			if (moveMap[i][j] >= 0) {
				
				// 遠近によって条件分け（未実装）
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
			}
		}
	}
	
	// デバッグログ
	console.dir("■attackMap");
	console.dir(attackMap);
	
	// 攻撃マップを返却
	return attackMap;
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

/**
 * バトルデータを設定する
 * @returns
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
	var isEnd = false;
	for (i = 0; i < battle.kougekiJunArray.length; i++) {
		
		var kougeki;
		if (battle.kougekiJunArray[i] == kougekisha.shozokuTeam) {
			kougeki = this.setKougekiData(kougekisha, hangekisha);
			battle.kougekiDataArray.push(kougeki);

			// 死亡した場合、バトル終了
			if (kougeki.shubishaShibouFlg && !isEnd) {
				isEnd = true;
				battle.hangekishaShibouFlg = true;
			}
		} else {
			kougeki = this.setKougekiData(hangekisha, kougekisha);
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
 * 攻撃を実行します
 * viewクラスから呼び出される処理
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

/**
 * 攻撃データを設定する
 * @param kougekisha
 * @param shubisha
 * @param kougekiJunArray
 * @returns
 */
feh_battleLogic.prototype.setKougekiData = 
	function(kougekisha, shubisha, kougekiJunArray) {

	var kougeki = new kougekiData();

	kougeki.kougekisha = kougekisha;	// 攻撃者
	kougeki.shubisha = shubisha;	// 攻撃者
	kougeki.damage = this.culcDamage(kougekisha, shubisha);	// ダメージ
	kougeki.kougekishaOugiHendou = -1;						// 攻撃者奥義変動値
	kougeki.shubishaoOgiHendou = -1;						// 守備者奥義変動値
	kougeki.kougekishaOugiFlg = false;				// 攻撃者奥義有無
	kougeki.shubishaOugiFlg = false;					// 守備者奥義有無
	if (kougeki.shubisha.nokoriHp <= kougeki.damage) {			// 守備者死亡判定
		kougeki.shubishaShibouFlg = true;
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
	
	kougekiJun.push(kougekisha.shozokuTeam);
	
	if (this.canHangeki(kougekisha, hangekisha)) {
		kougekiJun.push(hangekisha.shozokuTeam);
	}
	
	if (this.canTsuigeki(kougekisha, hangekisha)) {
		kougekiJun.push(kougekisha.shozokuTeam);		
	}

	if (this.canTsuigeki(hangekisha, kougekisha)) {
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

	// ダメージタイプ考慮
	if (g_bukiTypeData[kougekisha.bukiType].damageType == "butsuri") {
		damage = kougekisha.kougeki - shubisha.shubi;
	} else {
		damage = kougekisha.kougeki - shubisha.mabou;
	}
	
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
