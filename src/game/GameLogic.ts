/**
* name 
*/
module game{
	export class GameLogic{

		protected mockSeatUserMap:Object = {};
		protected mockSeatCardMap:Object = {};

		protected static instance:GameLogic;

		//发牌时的底牌
		protected mockPocketList:Array<number> = [];
		//庄家放置的底牌
		protected mockDealerPocketList:Array<number> = [];
		//主
		protected mockMainType:number = 0;
		//庄家座位
		protected mockDealerSeatId:number = 0;
		//倍数
		protected mockDealerMultiple:number = 0;

		//当前首个出牌座位
		protected mockOutBeginSeatId:number = 0;
		//当前出牌座位
		protected mockNowOutSeatId:number = 0;
		//当前出牌数量
		protected mockNowOutNum:number = 1;
		//当前出牌类型
		protected mockNowOutType:number = constants.CardType.INIT;

		//当前大牌座位
		protected mockNowMaxSeatId:number = 0;
		//当前大牌
		protected mockNowMaxCard:Card = null;
		//当前庄家是否已经出过牌
		protected mockNowDealOut:boolean = false;
		//当前回合分数之和
		protected mockNowRoundScore:number = 0;

		//闲家得分
		protected mockNowLostScore:number = 0;
		
		public static GetInstance():GameLogic
		{
			if(null == GameLogic.instance)
			{
				GameLogic.instance = new GameLogic();
			}
			return GameLogic.instance;
		}

		constructor(){
			this.mockClearSeatCard();
		}

		public mockClearSeatCard():void
		{
			this.mockSeatCardMap = {1:{}, 2:{}, 3:{}, 4:{}};
		}

		public mockSendMessage(msg:message.Base):void
		{
			msg.writeData();
			let msgObj = {"id":msg.getMessageId(), "content":msg.getContent()};
			net.SocketManager.GetInstance().onMessageReveived(JSON.stringify(msgObj));
		}

		public startGame():void
		{
			if ( ! Room.GetInstance().getIsSingle()) {
				return;
			}

			this.mockStart();
			this.mockGiveCard();

			//TODO 抢庄消息，这里先直接假定玩家是庄
			this.mockDealerClear();
			this.mockAskDealer();
		}

		public mockStart():void
		{
			//发送游戏开始的消息
			this.mockSeatUserMap = {1:1, 2:2, 3:3, 4:4};

			let seatArr:Array<Object> = [];
			for (let i in this.mockSeatUserMap) {
				seatArr.push({"seatId": i, "userId": this.mockSeatUserMap[i]});
			}
			
			let msg:message.GameStart = new message.GameStart();
			msg.seatArr = seatArr;

			this.mockSendMessage(msg);
		}

		public mockGiveCard():void
		{
			//模拟洗牌，并分发出去，记录各自的牌
			let arr:Array<number> = [];
			for (let i = 1; i <= 54; i++) {
				arr.push(i);
			}

			//洗牌
			let randomIndex:number, itemAtIndex:number;
			for (let i = 53; i >= 0; i--) {
				randomIndex = Math.floor(Math.random()*(i+1));
				itemAtIndex = arr[randomIndex];

				arr[randomIndex] = arr[i];
				arr[i] = itemAtIndex;
			}

			this.mockClearSeatCard();
			this.processSeatCard(1, arr.splice(0, 12));
			this.processSeatCard(2, arr.splice(0, 12));
			this.processSeatCard(3, arr.splice(0, 12));
			this.processSeatCard(4, arr.splice(0, 12));

			this.mockPocketList = arr;
		}

		protected processSeatCard(seatId:number, cardIds:Array<number>):void
		{
			for (let i = 0, len = cardIds.length; i < len; i++) {
				this.mockSeatCardMap[seatId][cardIds[i]] = true;
			}

			//对于玩家，发送牌消息
			if (seatId == Room.GetInstance().getMySeatId()) {
				let msg:message.GiveCard = new message.GiveCard();
				msg.seatId = seatId;
				msg.cardNum = cardIds.length;
				msg.cardIds = cardIds;

				this.mockSendMessage(msg);
			} else { //对于电脑，直接处理
				Room.GetInstance().getSeat(seatId).refreshCard(cardIds);
				let msg:message.GiveCard = new message.GiveCard();
				msg.seatId = seatId;
				msg.cardNum = cardIds.length;
				msg.cardIds = [];

				this.mockSendMessage(msg);
			}
			
		}

		//抢庄相关信息清除
		public mockDealerClear():void
		{
			this.mockDealerSeatId = 0;
			this.mockDealerMultiple = 0;
		}

		//开始抢庄
		public mockAskDealer():void
		{
			//暂时直接指定庄
			this.mockDealerResult(1, 5);
		}

		//抢庄结果处理
		public mockDealerResult(seatId:number, multiple:number):void
		{
			this.mockDealerSeatId = seatId;
			this.mockDealerMultiple = multiple;

			//公布抢庄结果
			this.mockPubDealer();

			//给庄家发送底牌信息
			this.mockGivePocket();

			//要求庄家放底牌
			this.mockAskPocket();
		}

		//公布抢庄结果
		public mockPubDealer():void
		{
			let msg:message.PubDealer = new message.PubDealer();
			msg.dealSeatId = this.mockDealerSeatId;
			msg.multiple = this.mockDealerMultiple;

			this.mockSendMessage(msg);
		}

		//给庄家发送底牌信息
		public mockGivePocket():void
		{
			//玩家是庄，发送
			if (this.mockDealerSeatId == Room.GetInstance().getMySeatId()) {
				let msg:message.GivePocket= new message.GivePocket();

				for (let i = 0, len = this.mockPocketList.length; i < len; i++) {
					this.mockSeatCardMap[this.mockDealerSeatId][this.mockPocketList[i]] = true;
				}

				msg.cardIds = this.mockPocketList.slice();
				this.mockPocketList = [];

				this.mockSendMessage(msg);
			} else { //TODO: 电脑是庄，直接计算主和底牌

			}
		}

		//要求庄家喊主
		public mockAskMain():void
		{
			//玩家是庄，发送
			if (this.mockDealerSeatId == Room.GetInstance().getMySeatId()) {
				let msg:message.AskMain = new message.AskMain();
				this.mockSendMessage(msg);
			} else { //TODO: 电脑是庄，直接公布主花色

			}
		}

		//庄家喊主
		public sendDealerGiveMain(mainType:number):void
		{
			let msg:message.DealerGiveMain = new message.DealerGiveMain();
			msg.mainType = mainType;
			net.SocketManager.GetInstance().sendMessage(msg);
		}

		//收到庄家喊主消息
		public mockHandleGiveMain(msg:message.DealerGiveMain):void
		{
			this.mockMainType = msg.mainType;
			//公布主
			this.mockPubMain(msg.mainType);

			this.mockBeginOut();

			this.mockOutBeginSeatId = this.mockDealerSeatId;
			this.mockNowOutSeatId = this.mockDealerSeatId;
			//TODO: 允许一次出多张牌
			this.mockNowOutNum = 1;
			this.mockOutTurn();
		}

		//公布主
		public mockPubMain(mainType:number):void
		{
			let msg:message.PubMain = new message.PubMain();
			msg.mainType = mainType;
			this.mockSendMessage(msg);
		}

		//要求庄家放底牌
		public mockAskPocket():void
		{
			//玩家是庄，发送
			if (this.mockDealerSeatId == Room.GetInstance().getMySeatId()) {
				let msg:message.AskPocket = new message.AskPocket();
				this.mockSendMessage(msg);
			} else { //TODO: 电脑是庄，直接放置底牌

			}
		}

		//发送庄家放底牌消息
		public sendPutPocket(cardList:Array<game.Card>):void
		{
			let msg:message.DealerPutPocket = new message.DealerPutPocket();
			let cardIds:Array<number> = [];
			for (let i = 0, len = cardList.length; i < len; i++) {
				cardIds.push(cardList[i].getCardId());
			} 
			msg.cardIds = cardIds;
			net.SocketManager.GetInstance().sendMessage(msg);
		}

		//收到庄家放底牌消息
		public mockHandlePutPocket(cardIds:Array<number>):void
		{
			if (this.matchAndClearSeatCard(this.mockDealerSeatId, cardIds)) {
				//发送放底牌成功的消息
				let msg:message.PutPocketResult = new message.PutPocketResult();
				msg.cardIds = cardIds;
				this.mockSendMessage(msg);

				//要求喊主
				this.mockAskMain();
			}
		}

		//匹配并清除牌
		public matchAndClearSeatCard(seatId:number, cardIds:Array<number>):boolean
		{
			for (let i = 0, len = cardIds.length; i < len; i++) {
				let cardId = cardIds[i];
				if (this.mockSeatCardMap[seatId][cardId] == undefined) {
					return false;
				}
			}

			for (let i = 0, len = cardIds.length; i < len; i++) {
				let cardId = cardIds[i];
				delete(this.mockSeatCardMap[seatId][cardId]);
			}

			return true;
		}

		//是否有特定类型的牌
		public hasCardType(seatId:number, cardType:number):boolean
		{
			let room = Room.GetInstance();
			

			
			if (cardType == constants.CardType.MAIN) {
				for (let cardId in this.mockSeatCardMap[seatId]) {
					let card:Card = this.getAvailableCard();
					card.setCardId(parseInt(cardId));
					if (room.isMain(card)) {
						this.recoverCard(card);
						return true;
					}
					this.recoverCard(card);
				}
			} else {
				for (let cardId in this.mockSeatCardMap[seatId]) {
					let card:Card = this.getAvailableCard();
					card.setCardId(parseInt(cardId));
					if (card.getSuit() == cardType && ! room.isMain(card)) {
						this.recoverCard(card);
						return true;
					}
					this.recoverCard(card);
				}
			}

			return false;
		}

		//开始出牌阶段
		public mockBeginOut():void
		{
			let msg:message.BeginOut = new message.BeginOut();
			this.mockSendMessage(msg);
		}

		//下一个出牌者
		public mockOutTurn():void
		{
			let msg:message.OutTurn = new message.OutTurn();

			//当前出牌类型
			msg.outType = this.mockNowOutType;
			//当前出牌数量
			msg.outNum = this.mockNowOutNum;

			//如果下一个是自己，发送消息
			if (this.mockNowOutSeatId == game.Room.GetInstance().getMySeatId()) {
				this.mockSendMessage(msg);
			} else { //不是自己
				net.SocketManager.GetInstance().sendMessage(msg);
			}
		}

		//处理电脑出牌
		public mockHandleOutTurn():void
		{
			/**
			 * 暂时先只考虑不为庄的情况
			 * 如果是首个出牌者，选一张为副且不是分的牌来出
			 * 如果不是首个出牌者，分以下几种情况：
			 * 1. 庄家已经出过牌，且庄家最大。如果能大，则大，不能大，选一张不是分的打出去
			 * 2. 庄家已经出过牌，且不是最大。赶紧上分。
			 * 3. 庄家还未出牌，庄家有可能为大。
			 * 		庄家有同花色副，能管则管上，不能管不出分。
			 * 		庄家没有同花色副。自己也没有同花色副，能用主管则用主管上。自己有同花色5分则出。
			 * 4. 庄家还未出牌，但不可能为大。赶紧上分
			 *    
			 */

			let seatId = this.mockNowOutSeatId;
			if (seatId == game.Room.GetInstance().getMySeatId()) {
				return;
			}
			if (this.mockNowOutType == constants.CardType.INIT) {
				// 先乱搞乱发财，随机选一张出了再说
				let cardIds = [];
				for (let cardId in this.mockSeatCardMap[seatId]) {
					cardIds.push(cardId);
				}

				let index = Math.ceil((cardIds.length - 1) * Math.random());
				let card:game.Card = this.getAvailableCard();
				card.setCardId(cardIds[index]); 
				this.sendCardOut(seatId, [card]);
				this.recoverCard(card);
			} else {

				// TODO: 始终保存一份当前牌集
				//当前牌集
				let cardTypeMap = {};
				let cardList:Array<game.Card> = [];
				let room:Room = Room.GetInstance();

				for (let cardId in this.mockSeatCardMap[seatId]) {
					let card:game.Card = this.getAvailableCard();
					card.setCardId(parseInt(cardId));
					cardList.push(card);
					let key = room.isMain(card) ? constants.CardType.MAIN : card.getSuit();
					if (cardTypeMap[key] == undefined) {
						cardTypeMap[key] = [];
					}
					cardTypeMap[key].push(card);
				}

				let cardCount:number = cardList.length;
				if (1 == cardCount) { //就剩一张了，没啥好说的吧
					this.sendCardOut(seatId, cardList);
					return;
				}

				let isDealerBig:boolean = (this.mockDealerSeatId == this.mockNowMaxSeatId);
				let typeNum:number = 0;
				if (this.mockNowOutType == constants.CardType.MAIN) { //需要出主
					if (isDealerBig) {
						if (cardTypeMap[constants.CardType.MAIN]) { //有主， 努力管上，管不上则出最小的主
							typeNum = cardTypeMap[constants.CardType.MAIN].length;
							cardTypeMap[constants.CardType.MAIN].sort(room.compareCard);
							if (room.compareCard(cardTypeMap[constants.CardType.MAIN][0], this.mockNowMaxCard) > 0) { //管不上

								for (let i = typeNum - 1; i >= 0; i--) {
									let point:number = cardTypeMap[constants.CardType.MAIN][i].getPoint();
									if (point != 5 && point != 10 && point != 13) {
										this.sendCardOut(seatId, [cardTypeMap[constants.CardType.MAIN][i]]);
										return;
									}
								}

								this.sendCardOut(seatId, [cardTypeMap[constants.CardType.MAIN][typeNum - 1]]);
								return;
							} else { // 找分或是最小的能管上的
								for (let i = 0; i < typeNum; i++) {
									let point:number = cardTypeMap[constants.CardType.MAIN][i].getPoint();
									if (point == 5 || point == 10 || point == 13) {
										this.sendCardOut(seatId, [cardTypeMap[constants.CardType.MAIN][i]]);
										return;
									}

									if (room.compareCard(cardTypeMap[constants.CardType.MAIN][i], this.mockNowMaxCard) > 0) {
										this.sendCardOut(seatId, [cardTypeMap[constants.CardType.MAIN][i - 1]]);
										return;
									}
								}

								this.sendCardOut(seatId, [cardTypeMap[constants.CardType.MAIN][typeNum - 1]]);
								return;
							}
						} else { // 没有主，随机丢一张，乱搞乱发财
							let index = Math.ceil((cardCount - 1) * Math.random());
							this.sendCardOut(seatId, [cardList[index]]);
							return;
						}
					} else { //
						if (cardTypeMap[constants.CardType.MAIN]) { //有主
							typeNum = cardTypeMap[constants.CardType.MAIN].length;
							cardTypeMap[constants.CardType.MAIN].sort(room.compareCard);
							if (this.mockNowDealOut) { // 庄家出过了，能上分就上分
								for (let i = 0; i < typeNum; i++) {
									let point:number = cardTypeMap[constants.CardType.MAIN][i].getPoint();
									if (point == 5 || point == 10 || point == 13) {
										this.sendCardOut(seatId, [cardTypeMap[constants.CardType.MAIN][i]]);
										return;
									}
								}

								this.sendCardOut(seatId, [cardTypeMap[constants.CardType.MAIN][typeNum - 1]]);
							} else { // TODO： 如何评估庄家有没有可能大
								let index = Math.ceil((typeNum - 1) * Math.random());
								this.sendCardOut(seatId, [cardTypeMap[constants.CardType.MAIN][index]]);
							}
							
							return;
						} else { // 没有主
							// 庄家出过了，能上分就上分
							if (this.mockNowDealOut) {
								for (let i = 0; i < cardCount; i++) {
									let point:number = cardList[i].getPoint();
									if (point == 5 || point == 10 || point == 13) {
										this.sendCardOut(seatId, [cardList[i]]);
										return;
									}
								}
							}

							// 随机丢一张，乱搞乱发财
							let index = Math.ceil((cardCount - 1) * Math.random());
							this.sendCardOut(seatId, [cardList[index]]);
							return;
						}
					}
				} else { //需要副
					let nowOutType = this.mockNowOutType;
					if (isDealerBig) {
						if (cardTypeMap[nowOutType]) { //有同样的副
							typeNum = cardTypeMap[nowOutType].length;
							cardTypeMap[nowOutType].sort(room.compareCard);
							if (room.compareCard(cardTypeMap[nowOutType][0], this.mockNowMaxCard) > 0) { //管不上
								for (let i = typeNum - 1; i >= 0; i--) {
									let point:number = cardTypeMap[nowOutType][i].getPoint();
									if (point != 5 && point != 10 && point != 13) {
										this.sendCardOut(seatId, [cardTypeMap[nowOutType][i]]);
										return;
									}
								}

								this.sendCardOut(seatId, [cardTypeMap[nowOutType][typeNum - 1]]);
								return;
							} else { // 找分或是最小的能管上的
								for (let i = 0; i < typeNum; i++) {
									let point:number = cardTypeMap[nowOutType][i].getPoint();
									if (point == 5 || point == 10 || point == 13) {
										this.sendCardOut(seatId, [cardTypeMap[nowOutType][i]]);
										return;
									}

									if (room.compareCard(cardTypeMap[nowOutType][i], this.mockNowMaxCard) > 0) {
										this.sendCardOut(seatId, [cardTypeMap[nowOutType][i - 1]]);
										return;
									}
								}

								this.sendCardOut(seatId, [cardTypeMap[nowOutType][typeNum - 1]]);
								return;
							}
						} else { // 没有, 先努力用主管上
							if (cardTypeMap[constants.CardType.MAIN]) { //有主， 努力管上，管不上则出最小的主
								typeNum = cardTypeMap[constants.CardType.MAIN].length;
								cardTypeMap[constants.CardType.MAIN].sort(room.compareCard);
								if (room.compareCard(cardTypeMap[constants.CardType.MAIN][0], this.mockNowMaxCard) > 0) { //管不上

									for (let i = typeNum - 1; i >= 0; i--) {
										let point:number = cardTypeMap[constants.CardType.MAIN][i].getPoint();
										if (point != 5 && point != 10 && point != 13) {
											this.sendCardOut(seatId, [cardTypeMap[constants.CardType.MAIN][i]]);
											return;
										}
									}

									this.sendCardOut(seatId, [cardTypeMap[constants.CardType.MAIN][typeNum - 1]]);
									return;
								} else { // 找分或是最小的能管上的
									for (let i = 0; i < typeNum; i++) {
										let point:number = cardTypeMap[constants.CardType.MAIN][i].getPoint();
										if (point == 5 || point == 10 || point == 13) {
											this.sendCardOut(seatId, [cardTypeMap[constants.CardType.MAIN][i]]);
											return;
										}

										if (room.compareCard(cardTypeMap[constants.CardType.MAIN][i], this.mockNowMaxCard) > 0) {
											this.sendCardOut(seatId, [cardTypeMap[constants.CardType.MAIN][i - 1]]);
											return;
										}
									}

									this.sendCardOut(seatId, [cardTypeMap[constants.CardType.MAIN][typeNum - 1]]);
									return;
								}
							} else { // 没有主，随机丢一张，乱搞乱发财
								let index = Math.ceil((cardCount - 1) * Math.random());
								this.sendCardOut(seatId, [cardList[index]]);
								return;
							}
						}
					} else {
						if (cardTypeMap[nowOutType]) { //有同样的副
							typeNum = cardTypeMap[nowOutType].length;
							cardTypeMap[nowOutType].sort(room.compareCard);
							if (this.mockNowDealOut) { // 庄家出过了， 上分
								for (let i = 0; i < typeNum; i++) {
									let point:number = cardTypeMap[nowOutType][i].getPoint();
									if (point == 5 || point == 10 || point == 13) {
										this.sendCardOut(seatId, [cardTypeMap[nowOutType][i]]);
										return;
									}
								}

								this.sendCardOut(seatId, [cardTypeMap[nowOutType][typeNum - 1]]);
								return;
							} else { // 没有，随机出
								let index = Math.ceil((cardCount - 1) * Math.random());
								this.sendCardOut(seatId, [cardList[index]]);
								return;
							}
						} else {
							if (this.mockNowDealOut) { // 庄家出过了， 上分
								for (let i = 0; i < cardCount; i++) {
									let point:number = cardList[i].getPoint();
									if (point == 5 || point == 10 || point == 13) {
										this.sendCardOut(seatId, [cardList[i]]);
										return;
									}
								}
							}
							
							// 没有，随机出
							let index = Math.ceil((cardCount - 1) * Math.random());
							this.sendCardOut(seatId, [cardList[index]]);
							return;
						}
					}
				}
			}
		}

		//发送出牌消息
		public sendCardOut(seatId:number, cardList:Array<game.Card>):void
		{
			let msg:message.CardOut = new message.CardOut();
			let cardIds:Array<number> = [];
			for (let i = 0, len = cardList.length; i < len; i++) {
				cardIds.push(cardList[i].getCardId());
			}
			msg.seatId = seatId;
			msg.outCardIds = cardIds;
			net.SocketManager.GetInstance().sendMessage(msg);
		}

		//收到出牌消息
		public mockHandleCardOut(seatId:number, cardIds:Array<number>):void
		{
			//检查当前要求出牌座位是否符合
			if (this.mockNowOutSeatId != seatId) {
				return;
			}

			if (this.mockNowOutNum != cardIds.length) {
				return;
			}

			//检查当前出牌是否符合
			let cardList:Array<Card> = [];
			for (let i = 0, len = cardIds.length; i < len; i++) {
				//TODO: 这里回收有点麻烦, 暂时懒得写了
				let newCard = new Card();
				newCard.setCardId(cardIds[i]);
				cardList.push(newCard);
				let point:number = newCard.getPoint();
				if (point == 5 || point == 10) {
					this.mockNowRoundScore += point;
				} else if (point == 13) { //老K算10分
					this.mockNowRoundScore += 10;
				}
			}

			//当前是第一个人, 随便一张都可以,在清除手中牌时再判断
			let room:Room = Room.GetInstance();
			let card:Card = cardList[0];
			let tempNowOutType:number = this.mockNowOutType;
			let tempNowMaxCard:Card = this.mockNowMaxCard;
			let tempNowMaxSeatId:number = this.mockNowMaxSeatId;
			if (this.mockOutBeginSeatId == seatId) { // 是第一个人，设置类型
				if (room.isMain(card)) {
					tempNowOutType = constants.CardType.MAIN;
				} else {
					tempNowOutType = card.getSuit();
				}
				tempNowMaxCard = card;
			} else { //当前不是第一个人,检查类型
				if (this.mockNowOutType == constants.CardType.MAIN) { //需要出主
					if (room.isMain(card)) { //也是主,当然可以
						//如果比最大的还大,则设置
						if (room.compareCard(card, tempNowMaxCard) < 0) { //新的牌比较大
							tempNowMaxCard = card;
							tempNowMaxSeatId = seatId;
						}
					} else { //检查有没有主
						if ( ! this.hasCardType(seatId, this.mockNowOutType)) {
							return;
						}
						//不是主,肯定小,不用比了
					}
				} else { //需要副
					if (card.getSuit() == this.mockNowOutType && ! room.isMain(card)) { //同类型的副
						if (card.getPoint() > tempNowMaxCard.getPoint()) {
							tempNowMaxCard = card;
							tempNowMaxSeatId = seatId;
						}
					} else { //检查对应的花色是不是真的出完了
						if ( ! this.hasCardType(seatId, this.mockNowOutType)) {
							return;
						}
						//如果是主,更大,否则小
						if (room.isMain(card)) {
							tempNowMaxCard = card;
							tempNowMaxSeatId = seatId;
						}
					}
				}
			}

			//清除手中的牌
			if (this.matchAndClearSeatCard(seatId, cardIds)) {
				//设置大牌
				this.mockNowMaxCard = tempNowMaxCard;
				this.mockNowMaxSeatId = tempNowMaxSeatId;
				this.mockNowOutType = tempNowOutType;
				if (seatId == this.mockDealerSeatId) {
					this.mockNowDealOut = true;
				}
				//出牌广播,带上当前大牌座位信息
				this.sendPubCardOut(seatId, cardIds, this.mockNowMaxSeatId);
				//下一个出牌者座位
				this.mockNowOutSeatId = this.mockNowOutSeatId + 1;
				if (this.mockNowOutSeatId > 4) {
					this.mockNowOutSeatId = 1;
				}
				if (this.mockNowOutSeatId == this.mockOutBeginSeatId) { //是最后一个,延迟两秒结算,并进入下一回合
					this.mockRoundEnd();
				} else { //如果不是最后一个,给下一个发出牌消息
					this.mockOutTurn();
				}
			}
		}

		//出牌广播
		public sendPubCardOut(seatId:number, cardIds:Array<number>, nowMaxSeatId:number):void
		{
			let msg:message.PubCardOut = new message.PubCardOut();
			msg.seatId = seatId;
			msg.outCardIds = cardIds;
			msg.maxSeatId = nowMaxSeatId;
			this.mockSendMessage(msg);
		}

		//当前回合结束
		public mockRoundEnd():void
		{
			
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
	}
}