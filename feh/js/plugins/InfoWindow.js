//=============================================================================
// InfoWindow.js
//=============================================================================

/*:
 * @plugindesc 情報表示ウィンドウをメニュー画面に追加するプラグイン
 * @author Me
 *
 * @help 情報表示ウィンドウをメニュー画面上に追加します。
 *
 */

(function() {

	// マップ上にウィンドウ表示するよ宣言
	var Scene_map_start = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function() {
		Scene_map_start.call(this);
	    this._InfoWindow = new Window_Info();
	    this.addWindow(this._InfoWindow);
	};
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this._InfoWindow.refresh();
    };
	
	// ここからメニューウィンドウ作り始まります。
	function Window_Info() {
	    this.initialize.apply(this, arguments);
	}

	Window_Info.prototype = Object.create(Window_Base.prototype);
	Window_Info.prototype.constructor = Window_Info;
	Window_Info.prototype.initialize = function() {
//		var x = 20;
//		var y = 20;
//	    var width = 180;
//	    var height = 108;
		var x = 0;
		var y = 0;
	    var width = 660;
	    var height = 480;
	    Window_Base.prototype.initialize.call(this, x, y, width, height);
	};

//	Window_Info.prototype.setText = function(str) {
//		this._text = str;
//		this.refresh();
//	};
	
	// ウィンドウに載せる内容
	Window_Info.prototype.refresh = function() {
	    this.contents.clear();
//		this.changeTextColor(this.textColor(16));
//      this.drawIcon(210, 1, 1);
//	    this.drawText("拾った宝箱",40, 1);
//		this.resetTextColor();
//		this.drawText($gameVariables.value(2) + " 個",0,this.lineHeight());
		for (var i=0; i<g_messageArray.length; i++) {
		    this.drawTextEx(
		    		g_messageArray[i].message, 
		    		g_messageArray[i].x, 
		    		g_messageArray[i].y
		    );
		}
	};
	
	// フォントサイズ
	Window_Info.prototype.standardFontSize = function() {
    	return 20;
    };
	// ウィンドウの透明度
	Window_Info.prototype.standardBackOpacity = function() {
    	return 0;
	};
    // ウィンドウの余白
	Window_Info.prototype.standardPadding = function() {
//    	return 18;
		return 0;
	};
	// ウィンドウの色調
	Window_Info.prototype.updateTone = function() {
//    	this.setTone(64, 0, 128);
		this.setTone(0, 0, 0);
	};

	Window_Info.prototype.textPadding = function() {
//	    return 6;
		return 0;
	};

	Window_Info.prototype.loadWindowskin = function() {
	    this.windowskin = ImageManager.loadSystem('infoWindow');
	};
	
})();