/*:
 * @plugindesc In depth map.
 * @author Garfeng
 *
 * @param Pass Region Id
 * @desc 人物可以通行的region id
 * @default 9
 *
 * @param Block Region Id
 * @desc 人物不可通行的region id（在设置了9的外面包一圈，防止人物走到墙里面去）
 * @default 10
 */


var parameters = PluginManager.parameters('In_depth');
var REGION_Pass_id = parseInt(parameters['Pass Region Id']);
var REGION_Block_id = parseInt(parameters['Block Region Id']);

var Garfeng_Game_Map_setup = Game_Map.prototype.setup;

Game_Map.prototype.setup = function(mapId) {
    Garfeng_Game_Map_setup.call(this,mapId);

    this.indep_flags = [];
    this.setNewFlags();

};

Game_Map.prototype.setNewFlags = function() {
    var width = $dataMap.width;
    var height = $dataMap.height;//

    for(var j = 0;j<height;j++){
        for(var i = 0;i<width;i++){
            if (this.regionId(i,j) == REGION_Pass_id) {
                this.indep_flags.push(this.tileId(i,j,3));
            }
        }
    }
};

Game_Map.prototype.tilesetFlags = function() {
    var tileset = this.tileset();
    if (tileset) {
        var result = tileset.flags;
        if (this.indep_flags) {
            for (var i = this.indep_flags.length - 1; i >= 0; i--) {
                result[this.indep_flags[i]] |= 0x10;
            }
        }
        return result;
    } else {
        return [];
    }
};


var Garfeng_Game_Map_tileId = Game_Map.prototype.tileId;
Game_Map.prototype.tileId = function(x, y, z) {
    var width = $dataMap.width;
    var height = $dataMap.height;//
    //2816
    //if (z==3) {
    //alert("z:"+x+" "+y+" "+ z+":"+$dataMap.data[(z * height + y) * width + x] || 0);
    //}
    if (z == 3 && this.regionId(x,y) == REGION_Pass_id) {
        var tmpZ = 0;
        return $dataMap.data[(tmpZ * height + y) * width + x] || 0;
    } else if (z == 0 && this.regionId(x,y) == REGION_Pass_id) {
        return 2816;
    }
    return Garfeng_Game_Map_tileId.call(this,x,y,z);
};


var Garfeng_Game_Map_checkPassage = Game_Map.prototype.checkPassage;

Game_Map.prototype.checkPassage = function(x, y, bit) {

    if (this.regionId(x,y) == REGION_Pass_id) {
        return true;
    }

    if (this.regionId(x,y) == REGION_Block_id) {
        return false;
    }

    return Garfeng_Game_Map_checkPassage.call(this,x,y,bit);

};
