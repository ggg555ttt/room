"use strict"

/*:
 * @plugindesc Black Room.
 * @author Garfeng
 *
 * @param Tile Width
 * @desc 一格的尺寸，默认48
 * @default 48
 *
 * @param Padding
 * @desc 内边距(0为全部填满颜色，我自用设为24)
 * @default 0
 *
 * @param Fade Speed
 * @desc 渐变速度
 * @default 10
 *
 * @param Black Room Color
 * @desc 遮盖层的颜色，比如 rgba(255,0,0,1) 代表红色
 * @default rgba(0,0,0,1)
 *
 * @param Black Room Z
 * @desc 遮盖层的z坐标
 * @default 9999
 */

/* 使用方法：
 * 地图添加注释，<broom></broom>内部必须为数组的json格式
 * <broom>[
 * [A_x1,A_y1,A_x2,A_y2],
 * [B_x1,B_y1,B_x2,B_Y2]
 * ]</broom>
 *
 * x1,y1 为左上角角点的坐标，x2,y2位右下角角点坐标
 * 比如：我设置了三个区：
 * <broom>
 * [
 *     [9,3,14,10],
 *     [14,3,16,11],
 *     [16,3,21,10]
 * ]
 </broom>
 */


var Black_Room_RE = /<broom>([.\s\S]+)<\/broom>/i;

var parameters = PluginManager.parameters("black_room");

var FKCC = parseInt(parameters["Tile Width"]);
var BLACK_ROOM_PADDING = parseInt(parameters["Padding"]);
var BLACK_ROOM_FADE_SPEED = parseInt(parameters["Fade Speed"]);
var Black_Room_Color = parameters["Black Room Color"];
var Black_Room_Z = parseInt(parameters["Black Room Z"]);

var Garfeng_Spriteset_Map_initialize = Spriteset_Map.prototype.initialize;
Spriteset_Map.prototype.initialize = function(){
    Garfeng_Spriteset_Map_initialize.call(this);

    this.black_rooms = new Array();
    this.black_rooms_sprite = new Array();

    let str = $dataMap.note;
    let match = Black_Room_RE.exec(str);

    if (match != null) {
        try {
            this.black_rooms = JSON.parse(match[1]);
        } catch (e) {
            console.error(e);
            console.log(match[1]);
        }
        if (this.black_rooms != null) {
            this.setupBlackRoom();
        }
    }

}

var Garfeng_Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;

Spriteset_Map.prototype.createLowerLayer = function() {
    Garfeng_Spriteset_Map_createLowerLayer.call(this);
};



Spriteset_Map.prototype.checkPosIn = function(sp) {
    let x = $gamePlayer._realX;
    let y = $gamePlayer._realY;

    if (x >= sp["x"] && x <= sp["x2"] &&
        y >= sp["y"] && y <= sp["y2"]) {
        return true;
    }
    return false;
};



Spriteset_Map.prototype.setupBlackRoom = function() {
    for(var i = 0;i<this.black_rooms.length;i++){
        let d = this.black_rooms[i];
        let x = d[0] * FKCC;
        let y = d[1] * FKCC;
        let width = (d[2] - d[0] +1)*FKCC;
        let height = (d[3] - d[1] +1)*FKCC;
        let pad = BLACK_ROOM_PADDING;

        let tmp = new Sprite();
        tmp.bitmap = new Bitmap(width,height);
        tmp.setFrame(0,0,width,height);
        tmp.move($gameMap.adjustX(d[0])*48 ,$gameMap.adjustY(d[1] )*48);
        //tmp.move(x,y);
        tmp.opacity = 255;
        tmp.z = Black_Room_Z;
        tmp.bitmap.fillRect(pad,pad,width-2*pad,height-2*pad,Black_Room_Color);


        let group = {};
        group.status = 0;
        group.sprite = tmp;
        group.pos = {
            "x":d[0],
            "y":d[1],
            "x2":d[2],
            "y2":d[3]
        };

        if (this.checkPosIn(group.pos)) {
            tmp.opacity = 0;
        }
        this.black_rooms_sprite.push(group);
        this._tilemap.addChild(tmp);
    }
};

//0 不变，1 fadein，-1 fadeout



Spriteset_Map.prototype.updateBlackRoom = function(){
    if (!this.black_rooms_sprite) {
        return;
    }
    for (var i = 0; i < this.black_rooms_sprite.length; i++) {
        let sp = this.black_rooms_sprite[i];
        if (this.checkPosIn(sp.pos)) {
            sp.status = -1;
        } else {
            sp.status = 1;
        }

        let x = sp.pos.x ;
        let y = sp.pos.y ;
        //console.log(sp.sprite.opacity);

        sp.sprite.move($gameMap.adjustX(x ) * 48 ,$gameMap.adjustY(y ) * 48);

        if (sp.status == 1 && sp.sprite.opacity < 255) {
            sp.sprite.opacity += sp.status * BLACK_ROOM_FADE_SPEED;
        } else if (sp.status == -1 && sp.sprite.opacity > 0) {
            sp.sprite.opacity += sp.status * BLACK_ROOM_FADE_SPEED;
        }
    }
}

var Garfeng_Spriteset_Map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function (){
    Garfeng_Spriteset_Map_update.call(this);
    this.updateBlackRoom();
}
