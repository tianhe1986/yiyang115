/**
* name 
*/
module game{
	export class Card{
		//卡牌id
		protected cardId:number = 0;

		//卡牌图片视图
		protected cardImage:Laya.Image;

		//卡牌点数
		protected point:number = 0;

		//卡牌花色
		protected suit:number = 0;

		//是否选中
		protected isSelect:boolean = false;

		constructor(){
			this.cardImage = new Laya.Image();
			this.cardImage.width = 105;
			this.cardImage.height = 150;
		}

		public recover():void
		{
			this.cardImage.off(Laya.Event.CLICK, this, this.switchStatus);
		}

		public bindClick():void
		{
			this.cardImage.on(Laya.Event.CLICK, this, this.switchStatus);
		}

		public switchStatus():void
		{
			if (Room.GetInstance().isTurn()) {
				this.setIsSelect(! this.isSelect);
				Room.GetInstance().calcuOutStatus();
			}
		}

		public setIsSelect(val:boolean)
		{
			if (val) {
				this.isSelect = true;
				this.cardImage.y = -75;
			} else {
				this.isSelect = false;
				this.cardImage.y = 0;
			}
		}

		public getIsSelect():boolean
		{
			return this.isSelect;
		}

		public getCardView():Laya.Image
		{
			return this.cardImage;
		}

		public setCardId(val:number):void
		{
			this.cardId = val;
			if (val < 53) {
				this.point = Math.ceil(val/4) + 2;
				if (this.point == 7) { //7比2大
					this.point = 16;
				}

				//花色
				this.suit = val % 4;
				if (this.suit == 0) {
					this.suit = 4;
				}
			} else { //王
				if (val == 53) {
					this.point = 17;
				} else if (val == 54) {
					this.point = 18;
				}
				this.suit = constants.CardSuit.JOKER;
			}
			
			this.cardImage.skin = "card/" + val + ".jpg";
		}

		public getCardId():number
		{
			return this.cardId;
		}

		public getPoint():number
		{
			return this.point;
		}

		public getSuit():number
		{
			return this.suit;
		}
	}
}