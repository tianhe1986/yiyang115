/**Created by the LayaAirIDE*/
module view{
	export class room extends ui.roomUI{
		constructor(){
			super();
			this.initButtons();
			this.initResult();
		}

		public initButtons():void
		{
			this.cardOutButton.on(Laya.Event.CLICK, this, this.onCardOut);
		}

		public initResult():void
		{
			(this.result.getChildByName("resultList") as Laya.List).renderHandler = new Laya.Handler(this, this.resultItem);
			this.result.getChildByName("confirm").on(Laya.Event.CLICK, this, this.onRestart);
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

		public onCardOut():void
		{
			game.Room.GetInstance().confirmCardOut();
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

		public showResult(winner:string, resultList:Array<any>):void
		{
			(this.result.getChildByName("resultList") as Laya.List).array = resultList;
			(this.result.getChildByName("winner") as Laya.Text).text = winner;

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
			this.result.visible = false;
			this.hideMock();
			this.showTips("");
			this.handCard.removeChildren();
			(this.mySeat.getChildByName("outCard") as Laya.Box).visible = false;
			(this.leftSeat.getChildByName("outCard") as Laya.Box).visible = false;
			(this.rightSeat.getChildByName("outCard") as Laya.Box).visible = false;
			(this.oppositeSeat.getChildByName("outCard") as Laya.Box).visible = false;
		}
	}
}