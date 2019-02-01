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
	}
}