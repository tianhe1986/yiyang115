/**
* name 
*/
module game{
	export class CardManager{
		//牌数量
		protected cardNum:number = 0;

		//牌列表
		protected cardList:Array<Card> = [];

		constructor(){

		}

		public getCardList():Array<Card>
		{
			return this.cardList;
		}

		public getSelectCardList():Array<Card>
		{
			let result:Array<Card> = [];
			for (let i = 0, len = this.cardList.length; i < len; i++) {
				if (this.cardList[i].getIsSelect()) {
					result.push(this.cardList[i]);
				}
			}

			return result;
		}

		//清除选中的牌
		public clearSelectCards():void
		{
			for (let i = 0, len = this.cardList.length; i < len; i++) {
				this.cardList[i].setIsSelect(false);
			}
		}

		//移除手中的牌
		public removeCard(cardId:number):void
		{
			for (let i = 0, len = this.cardList.length; i < len; i++) {
				if (this.cardList[i].getCardId() == cardId) {
					this.cardList.splice(i, 1);
					break;
				}
			}
		}

		//移除手牌
		public removeByCardIds(cardIds:Array<number>, isSelf:boolean = false):void
		{
			for (let i = 0, len = cardIds.length; i < len; i++) {
				this.removeCard(cardIds[i]);
			}
			this.sortCardList();
			this.setCardNum(this.cardList.length);

			if (isSelf) {
				this.refreshHandCardView();
			} else {
				
			}
		}

		public getCardNum():number
		{
			return this.cardNum;
		}

		public setCardNum(val:number):void
		{
			this.cardNum = val;
		}

		public getAvailableCard():Card
		{
			//TODO: 使用poolManager
			//return new Card();
			return Laya.Pool.getItemByClass("card", Card);
		}

		public recoverCard(card:Card):void
		{
			card.recover();
			Laya.Pool.recover("card", card);
		}

		//增加手牌
		public addCard(cardIds:Array<number>, isSelf:boolean = false):void
		{
			for (let i = 0, len = cardIds.length; i < len; i++) {
				let newCard = this.getAvailableCard();
				newCard.setCardId(cardIds[i]);
				newCard.setIsSelect(isSelf);
				this.cardList.push(newCard);
			}
			this.sortCardList();
			this.setCardNum(this.cardList.length);

			if (isSelf) {
				this.refreshHandCardView();
			} else {
				
			}
		}

		public refreshCard(cardIds:Array<number>, isSelf:boolean = false):void
		{
			for (let i = 0, len = this.cardList.length; i < len; i++) {
				this.recoverCard(this.cardList[i]);
			}
			this.cardList = [];

			for (let i = 0, len = cardIds.length; i < len; i++) {
				let newCard = this.getAvailableCard();
				newCard.setCardId(cardIds[i]);
				this.cardList.push(newCard);
			}
			this.sortCardList();
			this.setCardNum(this.cardList.length);

			if (isSelf) {
				this.refreshHandCardView();
			} else {
				
			}
		}

		public refreshHandCardPosition(isSelf:boolean = false):void
		{
			this.sortCardList();
			if (isSelf) {
				this.refreshHandCardView();
			}
		}

		public sortCardList():void
		{
			this.cardList.sort((a:Card, b:Card) => {
				let aMain = Room.GetInstance().isMain(a);
				let bMain = Room.GetInstance().isMain(b);

				//都是主，先比点数，再比正副，再看花色
				//一主一副，主在前
				//两副，先比花色，再比点数
				if (aMain) {
					if (bMain) {
						let diffPoint = b.getPoint() - a.getPoint();
						if (diffPoint != 0) {
							return diffPoint;
						} else {
							let mainType = Room.GetInstance().getMainType();
							if (a.getSuit() == mainType) {
								return -1;
							} else {
								if (b.getSuit() == mainType) {
									return 1;
								} else {
									return a.getSuit() - b.getSuit();
								}
							}
						}
					} else {
						return -1;
					}
				} else {
					if (bMain) {
						return 1;
					} else {
						let diffSuit = a.getSuit() - b.getSuit();
						if (diffSuit != 0) {
							return diffSuit;
						} else {
							return b.getCardId() - a.getCardId();
						}
					}
				}
			});
		}

		//刷新手牌展示
		public refreshHandCardView():void
		{
			let handCardView = PageManager.GetInstance().getRoomView().handCard;
			//简单粗暴的清除重绘，之后再优化
			handCardView.removeChildren();
			for (let i = 0, len = this.cardList.length; i < len; i++) {
				this.cardList[i].recover();
				this.cardList[i].bindClick();
				let cardView = this.cardList[i].getCardView();
				handCardView.addChild(cardView);
				cardView.y = this.cardList[i].getIsSelect() ? -75 : 0;
				cardView.x = i * 42;
			}
		}

		//手中是否有某种类型的牌,主算单独的类型
		public hasCardType(cardType:number):boolean
		{
			let room = Room.GetInstance();
			if (cardType == constants.CardType.MAIN) {
				for (let i = 0, len = this.cardList.length; i < len; i++) {
					if (room.isMain(this.cardList[i])) {
						return true;
					}
				}
			} else {
				for (let i = 0, len = this.cardList.length; i < len; i++) {
					if (this.cardList[i].getSuit() == cardType && ! room.isMain(this.cardList[i])) {
						return true;
					}
				}
			}

			return false;
		}
	}
}