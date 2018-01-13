
var g_sentoshaData = JSON.parse('[{"id":"0","name":"アイク","shozokuTeam":"1","bukiType":"0","idouType":"","nokoriHp":"40","ougiCount":"","hp":"40","kougeki":"50","hayasa":"30","shubi":"30","mabou":"20","bukiSkill":"","hojoSkill":"","ougi":"","aSkill":"","bSkill":"","cSkill":"","seiin":"","kizuna":"","sien":"","level":"","img":"ike"},{"id":"1","name":"リリーナ","shozokuTeam":"1","bukiType":"1","idouType":"","nokoriHp":"33","ougiCount":"","hp":"33","kougeki":"53","hayasa":"35","shubi":"20","mabou":"30","bukiSkill":"","hojoSkill":"","ougi":"","aSkill":"","bSkill":"","cSkill":"","seiin":"","kizuna":"","sien":"","level":"","img":"aira"},{"id":"2","name":"子チキ","shozokuTeam":"1","bukiType":"2","idouType":"","nokoriHp":"39","ougiCount":"","hp":"39","kougeki":"47","hayasa":"27","shubi":"33","mabou":"34","bukiSkill":"","hojoSkill":"","ougi":"","aSkill":"","bSkill":"","cSkill":"","seiin":"","kizuna":"","sien":"","level":"","img":"eiriku"},{"id":"3","name":"ローロー","shozokuTeam":"1","bukiType":"3","idouType":"","nokoriHp":"40","ougiCount":"","hp":"40","kougeki":"52","hayasa":"34","shubi":"27","mabou":"16","bukiSkill":"","hojoSkill":"","ougi":"","aSkill":"","bSkill":"","cSkill":"","seiin":"","kizuna":"","sien":"","level":"","img":"eiriku"},{"id":"4","name":"セネリオ","shozokuTeam":"1","bukiType":"4","idouType":"","nokoriHp":"35","ougiCount":"","hp":"35","kougeki":"43","hayasa":"33","shubi":"20","mabou":"33","bukiSkill":"","hojoSkill":"","ougi":"","aSkill":"","bSkill":"","cSkill":"","seiin":"","kizuna":"","sien":"","level":"","img":"eiriku"},{"id":"5","name":"ファ","shozokuTeam":"1","bukiType":"5","idouType":"","nokoriHp":"50","ougiCount":"","hp":"50","kougeki":"45","hayasa":"28","shubi":"27","mabou":"30","bukiSkill":"","hojoSkill":"","ougi":"","aSkill":"","bSkill":"","cSkill":"","seiin":"","kizuna":"","sien":"","level":"","img":"eiriku"},{"id":"6","name":"オスカー","shozokuTeam":"1","bukiType":"6","idouType":"","nokoriHp":"38","ougiCount":"","hp":"38","kougeki":"44","hayasa":"36","shubi":"24","mabou":"19","bukiSkill":"","hojoSkill":"","ougi":"","aSkill":"","bSkill":"","cSkill":"","seiin":"","kizuna":"","sien":"","level":"","img":"eiriku"},{"id":"7","name":"ウルスラ","shozokuTeam":"1","bukiType":"7","idouType":"","nokoriHp":"34","ougiCount":"","hp":"34","kougeki":"39","hayasa":"33","shubi":"18","mabou":"30","bukiSkill":"","hojoSkill":"","ougi":"","aSkill":"","bSkill":"","cSkill":"","seiin":"","kizuna":"","sien":"","level":"","img":"eiriku"},{"id":"8","name":"ノノ","shozokuTeam":"1","bukiType":"8","idouType":"","nokoriHp":"49","ougiCount":"","hp":"49","kougeki":"48","hayasa":"30","shubi":"28","mabou":"24","bukiSkill":"","hojoSkill":"","ougi":"","aSkill":"","bSkill":"","cSkill":"","seiin":"","kizuna":"","sien":"","level":"","img":"eiriku"},{"id":"9","name":"レベッカ","shozokuTeam":"1","bukiType":"9","idouType":"","nokoriHp":"36","ougiCount":"","hp":"36","kougeki":"38","hayasa":"34","shubi":"20","mabou":"27","bukiSkill":"","hojoSkill":"","ougi":"","aSkill":"","bSkill":"","cSkill":"","seiin":"","kizuna":"","sien":"","level":"","img":"eiriku"}]');
var g_bukiTypeData = JSON.parse('[{"id":"0","name":"ken","color":"red","range":"1","damageType":"butsuri"},{"id":"1","name":"akaMa","color":"red","range":"2","damageType":"mahou"},{"id":"2","name":"akaRyu","color":"red","range":"1","damageType":"mahou"},{"id":"3","name":"ono","color":"green","range":"1","damageType":"butsuri"},{"id":"4","name":"midoriMa","color":"green","range":"2","damageType":"mahou"},{"id":"5","name":"midoriRyu","color":"green","range":"1","damageType":"mahou"},{"id":"6","name":"yari","color":"blue","range":"1","damageType":"butsuri"},{"id":"7","name":"aoMa","color":"blue","range":"2","damageType":"mahou"},{"id":"8","name":"aoRyu","color":"blue","range":"1","damageType":"mahou"},{"id":"9","name":"yumi","color":"white","range":"2","damageType":"butsuri"},{"id":"10","name":"anki","color":"white","range":"2","damageType":"butsuri"},{"id":"11","name":"tsue","color":"white","range":"2","damageType":"mahou"}]');

// 戦闘者データ
function sentoshaData() {
/**
	shozokuTeam		// 所属チーム
	name			// 名前
	bukiType		// 武器タイプ
	idouType		// 移動タイプ
	nokoriHp		// 残りHP
	ougiCount		// 奥義カウント
	hp				// HP
	kougeki			// 攻撃
	hayasa			// 速さ
	shubi			// 守備
	mabou			// 魔防
	bukiSkill		// 武器スキル
	hojoSkill		// 補助スキル
	ougi			// 奥義
	aSkill			// Aスキル
	bSkill			// bスキル
	cSkill			// cスキル
	seiin			// 聖印
	kizuna			// 絆
	sien			// 支援
	level			// レベル
	img				// 画像
**/
}

// バトルデータ
function battleData() {
/**
	kougekisha			// 攻撃者
	hanngekisha			// 反撃者
	kougekiJunArray		// 攻撃順配列
	kougekishaShibouFlg	// 攻撃者死亡判定
	hangekishaShibouFlg	// 反撃者死亡判定
	kougekiDataArray	// 攻撃データ配列
**/
}

// 攻撃データ
function kougekiData() {
/**
	kougekisha				// 攻撃者
	damage					// ダメージ
	kougekishaOugiHendou	// 攻撃者奥義変動値
	shubishaoOgiHendou		// 守備者奥義変動値
	kougekishaOugiFlg		// 攻撃者奥義有無
	shubishaOugiFlg			// 守備者奥義有無
	shubishaShibouFlg		// 守備者死亡判定
**/
}

// 武器タイプデータ
function bukiTypeData() {
/**
	name	// 武器タイプ名
	color	// 色
	range	// 攻撃範囲
	damageType	// ダメージ計算タイプ（物/魔）
 */
}
