/**
* name 
*/
module game{
	export class Seat{
		//座位编号
		protected seatId:number = null;

		//座位展示
		protected seatView:Laya.Box = null;

		protected userInfo:user.UserInfo = null;

		protected cardManager:CardManager = null;

		constructor()
		{
			this.cardManager = new CardManager();
		}

		public setSeatId(val:number):void
		{
			this.seatId = val;
		}

		public getSeatId():number
		{
			return this.seatId;
		}

		public setUserInfo(val:user.UserInfo):void
		{
			this.userInfo = val;
		}

		public getUserInfo():user.UserInfo
		{
			return this.userInfo;
		}

		public setSeatView(val:Laya.Box):void
		{
			this.seatView = val;
		}

		public getSeatView():Laya.Box
		{
			return this.seatView;
		}

		public getCardManager():CardManager
		{
			return this.cardManager;
		}

		public refreshSeatInfo():void
		{
			let seatView = this.getSeatView();
			if (seatView === null) {
				return;
			}
			(seatView.getChildByName("nickname") as Laya.Text).text = this.getUserInfo().getNickname();
			(seatView.getChildByName("avatar") as Laya.Image).skin = this.getUserInfo().getAvatar();
			(seatView.getChildByName("score") as Laya.Text).text = "" + this.getUserInfo().getScore();
			(seatView.getChildByName("cardNum") as Laya.Text).text = "" + this.getCardManager().getCardNum();
		}

		//增加手牌，新增的手牌默认为选中状态
		public addCard(cardIds:Array<number>):void
		{
			this.cardManager.addCard(cardIds, this.getSeatId() == game.Room.GetInstance().getMySeatId());
			this.refreshSeatInfo();
		}

		//移除手牌
		public removeByCardIds(cardIds:Array<number>):void
		{
			this.cardManager.removeByCardIds(cardIds, this.getSeatId() == game.Room.GetInstance().getMySeatId());
			this.refreshSeatInfo();
		}

		public refreshHandCardPosition():void
		{
			this.cardManager.refreshHandCardPosition(this.getSeatId() == game.Room.GetInstance().getMySeatId());
		}

		public refreshCard(cardIds:Array<number>):void
		{
			this.cardManager.refreshCard(cardIds, this.getSeatId() == game.Room.GetInstance().getMySeatId());
			this.refreshSeatInfo();
		}

		public setCardNum(cardNum:number):void
		{
			this.cardManager.setCardNum(cardNum);
			this.refreshSeatInfo();
		}

		public getCardNum():number
		{
			return this.cardManager.getCardNum();
		}

		public getSelectCardList():Array<Card>
		{
			return this.cardManager.getSelectCardList();
		}

		//清除选中的牌
		public clearSelectCards():void
		{
			this.cardManager.clearSelectCards();
		}

		//显示庄家标识
		public showDealer():void
		{
			let seatView = this.getSeatView();
			if (seatView === null) {
				return;
			}
			(seatView.getChildByName("dealer") as Laya.Text).visible = true;
		}

		//隐藏庄家标识
		public hideDealer():void
		{
			let seatView = this.getSeatView();
			if (seatView === null) {
				return;
			}
			(seatView.getChildByName("dealer") as Laya.Text).visible = false;
		}
	}
}