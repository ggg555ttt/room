//去除菜单里血条等显示
(function(){Window_MenuStatus.prototype.drawItemStatus = function(index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRect(index);
    var y = rect.y + rect.height / 2 - this.lineHeight() * 1.5;
    this.drawActorName(actor,rect.x+162,y); };  })();

/*:
 *  使RPG Maker MV能够自动换行。
 *  小优【66RPG：rpg-sheep】【百度贴吧：优加星爱兔子】
 *
 *
 * 实现自动换行小功能。
 */
Window_Selectable.prototype.processNormalCharacter = Window_Base.prototype.processNormalCharacter;
Window_Base.prototype.processNormalCharacter = function(textState) {
    var c = textState.text[textState.index];
    var w = this.textWidth(c);
    if (this.width - 2 * this.standardPadding() - textState.x >= w){
        this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
        textState.index++;
        textState.x += w;
    }else{
        this.processNewLine(textState);
        textState.index--;
        this.processNormalCharacter(textState);
    }
};


/*实现涂颜料的选择项*/
function paint(){
    var choices = [];
    if($gameParty.hasItem($dataItems[9]))   choices.push("红色颜料");
    if($gameParty.hasItem($dataItems[10]))    choices.push("绿色颜料");
    if($gameParty.hasItem($dataItems[11]))   choices.push("蓝色颜料");
    if($gameParty.hasItem($dataItems[12]))    choices.push("黄色颜料");
    if($gameParty.hasItem($dataItems[13]))   choices.push("血色颜料");
    if($gameParty.hasItem($dataItems[14]))    choices.push("棕色颜料");
    if($gameParty.hasItem($dataItems[15]))   choices.push("紫色颜料");
    if($gameParty.hasItem($dataItems[16]))   choices.push("白色颜料");
    var rightColorIndex = choices.indexOf("血色颜料");
    $gameMessage.add("要涂上哪一种颜料呢");
    $gameMessage.setChoices(choices, 0);
    $gameMessage.setChoiceCallback(function (n){
        if(n==rightColorIndex){
            $gameSwitches.setValue(8,true);
            $gameTemp.reserveCommonEvent(12);
        }else{
            $gameTemp.reserveCommonEvent(11);
        }
    });
}
//实现黄色宝箱两把钥匙的开启
function Koo_unlockSetup(){
    Koo_choices = [];
    choicesHelper1 = "";
    choicesHelper2 = "";
    if($gameParty.hasItem($dataItems[6]))   Koo_choices.push("红色钥匙");
    if($gameParty.hasItem($dataItems[7]))   Koo_choices.push("蓝色钥匙");
    if($gameParty.hasItem($dataItems[8]))   Koo_choices.push("绿色钥匙");
}
function Koo_unlock1(){
        $gameMessage.setChoices(Koo_choices, 0);
        $gameMessage.setChoiceCallback(function (n){
            choicesHelper1 = Koo_choices[n];
            Koo_choices.splice(n,1);
        });
}
function Koo_unlock2(){
        $gameMessage.setChoices(Koo_choices, 0);
        $gameMessage.setChoiceCallback(function (n) {
            choicesHelper2 = Koo_choices[n];
            Koo_unlockJudge();
        });
}

function Koo_unlockJudge(){
    if ((choicesHelper1 == "红色钥匙" || choicesHelper1 == "绿色钥匙") && (choicesHelper2 == "红色钥匙" || choicesHelper2 == "绿色钥匙"))
        $gameTemp.reserveCommonEvent(15);
    else {
        $gameTemp.reserveCommonEvent(16);
    }
}
//获取要使用物品的对象坐标，并加以判断
function Koo_useItemEvent(mapId,eventId){
    Koo_useItemPosition = $gameMap._mapId==mapId&&(
        ($gamePlayer._realX ==$gameMap.event(eventId)._x+1 && $gamePlayer._realY ==$gameMap.event(eventId)._y )||
        ($gamePlayer._realX ==$gameMap.event(eventId)._x-1 && $gamePlayer._realY ==$gameMap.event(eventId)._y )||
        ($gamePlayer._realX ==$gameMap.event(eventId)._x && $gamePlayer._realY ==$gameMap.event(eventId)._y+1 )||
        ($gamePlayer._realX ==$gameMap.event(eventId)._x+1 && $gamePlayer._realY ==$gameMap.event(eventId)._y ));
}
