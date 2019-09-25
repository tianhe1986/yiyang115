/**Created by the LayaAirIDE*/
module view{
	export class room extends ui.roomUI{
		constructor(){
			super();
			this.initButtons();
			this.initResult();
			this.initMainChoose();
		}

		public initButtons():void
		{
			this.cardOutButton.on(Laya.Event.CLICK, this, this.onCardOut);
			this.putPocketButton.on(Laya.Event.CLICK, this, this.onPutPocket);
		}

		public initResult():void
		{
			(this.result.getChildByName("resultList") as Laya.List).renderHandler = new Laya.Handler(this, this.resultItem);
			this.result.getChildByName("confirm").on(Laya.Event.CLICK, this, this.onRestart);
		}

		public initMainChoose():void
		{
			for (let i = 1; i <= 5; i++) {
				this.mainChoose.getChildByName("type" + i).on(Laya.Event.CLICK, this, this.giveMain, [i]);
			}
			
		}

		public giveMain(type:number):void
		{
			this.hideMainChoose();
			game.Room.GetInstance().giveMain(type);
		}

		public resultItem(cell:Laya.Box,index:number):void
		{
			let arr = (this.result.getChildByName("resultList") as Laya.List).array;
			if (index >= arr.length) {
				return;
			}

			(cell.getChildByName("nickname") as Laya.Text).text = arr[index][0];
			(cell.getChildByName("score") as Laya.Text).text = arr[index][1];
		}

		//确定出牌
		public onCardOut():void
		{
			game.Room.GetInstance().confirmCardOut();
		}

		//确定放底牌
		public onPutPocket():void
		{
			game.Room.GetInstance().confirmPutPocket();
		}

		public showTips(str:string):void
		{
			this.tips.text = str;
		}

		public showCardOut():void
		{
			this.cardOutButton.visible = true;
		}

		public hideCardOut():void
		{
			this.cardOutButton.visible = false;
		}

		public onRestart():void
		{
			this.clearAll();
			game.GameLogic.GetInstance().startGame();
		}

		public showResult(resultTxt:string, resultList:Array<any>):void
		{
			(this.result.getChildByName("resultList") as Laya.List).array = resultList;
			(this.result.getChildByName("resultTxt") as Laya.Text).text = resultTxt;

			this.showMock();
			this.result.visible = true;
		}

		public showMock():void
		{
			this.mock.visible = true;
		}

		public hideMock():void
		{
			this.mock.visible = false;
		}

		public clearAll():void
		{
			this.pocketCard.visible = false;
			this.result.visible = false;
			this.hideMock();
			this.showTips("");
			this.handCard.removeChildren();
			(this.mySeat.getChildByName("outCard") as Laya.Box).removeChildren();
			(this.leftSeat.getChildByName("outCard") as Laya.Box).removeChildren();
			(this.rightSeat.getChildByName("outCard") as Laya.Box).removeChildren();
			(this.oppositeSeat.getChildByName("outCard") as Laya.Box).removeChildren();
			this.multiple.text = "倍数：";
			this.mainType.text = "主：未喊";
			this.score.text = "闲家分数：0";
		}

		//刷新倍数
		public refreshMultiple(multiple:number):void
		{
			this.multiple.text = "倍数：X" + multiple;
		}

		//展示要求放底牌
		public showPutPocket():void
		{
			this.putPocketBox.visible = true;
		}

		public hidePutPocket():void
		{
			this.putPocketBox.visible = false;
		}

		//展示放底牌按钮
		public showConfirmPutPocket():void
		{
			this.putPocketButton.visible = true;
		}

		public hideConfirmPutPocket():void
		{
			this.putPocketButton.visible = false;
		}

		//展示喊主
		public showMainChoose():void
		{
			this.mainChoose.visible = true;
		}

		//隐藏喊主
		public hideMainChoose():void
		{
			this.mainChoose.visible = false;
		}

		public refreshMainType(mainType:number):void
		{
			this.mainType.text = "主：" + constants.MainType.getTypeName(mainType);
		}
	}
}