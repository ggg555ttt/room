/*x1:新图块的地图的x坐标
 y1:新图块的地图的y坐标
 x2:要替换的地图的x坐标
 y2:要替换的地图的y坐标
 z:图块的层次，如0代表地面。
 value:1.将你想要替换的新图块摆上地图，记下当前图块所在地图的x1,y1位置
 2.新建一个事件页，使用脚本：alert($gameMap.tileId(x1,y1,z))
 3.执行游戏，记下步骤2的数值即value，关闭游戏。
 4.新建一个事件页，使用脚本：$gameMap.setTileData(x2,y2,z,value) 完成指定位置的图块替换
 */
(function(){Game_Map.prototype.setTileData=function(x,y,z,value){
    var width = this.width();
    var height = this.height();
    var index =(z * height + y) * width + x;
    this.data()[index]=value;
    }
})();
