/**
* name 
*/
module game{
	export class Room{

		protected static instance:Room;

		public static SCORE_KEY = "115_score_map";
		protected isSingle:boolean = false;

		protected userInfo:user.UserInfo = null;
		protected scoreMap:Object = null;

		protected mySeat:Seat = null;
		protected leftSeat:Seat = null;
		protected rightSeat:Seat = null;
		protected oppositeSeat:Seat = null;

		protected mySeatId:number = 0;
		protected seatMap:Object = null;
		protected isGaming:boolean = false;

		//庄家
		protected dealerSeatId:number = 0;
		//倍数
		protected dealerMultiple:number = 0;
		//主
		protected mainType:number = 0;

		//是否在放底牌阶段
		protected isDealerPutPocket:boolean = false;

		//当前出牌座位id
		protected nowOutSeatId:number = 0;

		//当前出牌类型
		protected nowOutType:number = constants.CardType.INIT;
		//当前出牌数量
		protected nowOutNum:number = 0;

		//当前大牌座位
		protected nowMaxSeatId:number = 0;
		//当前大牌
		protected nowMaxCard:Card = null;

		//当前闲家得分
		protected nowLostScore:number = 0;

		public static GetInstance():Room
		{
			if(null == Room.instance)
			{
				Room.instance = new Room();
			}
			return Room.instance;
		}

		constructor(){
			this.mySeat = new Seat();
			this.leftSeat = new Seat();
			this.rightSeat = new Seat();
			this.oppositeSeat = new Seat();

			let roomView = PageManager.GetInstance().getRoomView();
			this.mySeat.setSeatView(roomView.mySeat);
			this.leftSeat.setSeatView(roomView.leftSeat);
			this.rightSeat.setSeatView(roomView.rightSeat);
			this.oppositeSeat.setSeatView(roomView.oppositeSeat);

			this.userInfo = new user.UserInfo();
			this.userInfo.setNickname("莽夫");
			this.userInfo.setAvatar("avatar/b.png");
		}

		public getMainType():number
		{
			return this.mainType;
		}

		public setMainType(val:number):void
		{
			this.mainType = val;
		}

		public getIsSingle():boolean
		{
			return this.isSingle;
		}

		public setIsSingle(val:boolean):void
		{
			this.isSingle = val;
		}

		public getIsGaming():boolean
		{
			return this.isGaming;
		}

		public setIsGaming(val:boolean):void
		{
			this.isGaming = val;
		}

		public login():void
		{
			game.PageManager.GetInstance().showLogin();

			if (Laya.Browser.onMiniGame) {
				let wx = Laya.Browser.window.wx;
				
				wx.login({
					success: (res) => {
						let code = res.code;
						wx.getSetting({
							success: (resSetting) => {
								if (resSetting.authSetting["scope.userInfo"] == true)  { //已授权，直接获取
									wx.getUserInfo({
										withCredentials: true,
										success: (res2) => {
											this.userInfo.setNickname(res2.userInfo.nickName);
											this.userInfo.setAvatar(res2.userInfo.avatarUrl);
											this.showEnter();
										}
									});
								} else { //未授权，创建微信登录按钮
									let systemInfo = GameMain.GetInstance().getWxSystemInfo();
									let button = wx.createUserInfoButton({
										type: 'text',
										text: '登录',
										withCredentials: true,
										style: {
											left: systemInfo.windowWidth/2 - 70,
											top: systemInfo.windowHeight/2 - 20,
											width: 140,
											height: 40,
											lineHeight: 40,
											backgroundColor: '#ffffff',
											color: '#000000',
											textAlign: 'center',
											fontSize: 16,
											borderRadius: 4
										}
									})
									button.onTap((res2) => {
										this.userInfo.setNickname(res2.userInfo.nickName);
										this.userInfo.setAvatar(res2.userInfo.avatarUrl);
										button.destroy();
										this.showEnter();
									})
								}
							}
						});
					}
				});
			} else { //否则，展示登录框
				this.showEnter();
			}
		}

		public showEnter():void
		{
			game.PageManager.GetInstance().showEnter();
		}

		public startSingle():void
		{
			this.setIsSingle(true);
			PageManager.GetInstance().showRoom();

			PageManager.GetInstance().getRoomView().clearAll();

			//创造虚拟用户
			this.mockSeat();

			//开始游戏
			GameLogic.GetInstance().startGame();
		}

		public getScoreMap():any
		{
			if (this.scoreMap == null) {
				this.scoreMap = Laya.LocalStorage.getJSON(Room.SCORE_KEY);
				if (this.scoreMap == null || this.scoreMap == '') {
					this.scoreMap = {};
					this.scoreMap[1] = 100;
					this.scoreMap[2] = 100;
					this.scoreMap[3] = 100;
					this.scoreMap[4] = 100;
				}

				for (let i = 1; i <= 4; i++) {
					if (this.scoreMap[i] == undefined) {
						this.scoreMap[i] = 100;
					}
				}
			}

			return this.scoreMap;
		}

		public refreshAndSaveScore():void
		{
			this.scoreMap[this.mySeat.getUserInfo().getUserId()] = this.mySeat.getUserInfo().getScore();
			this.scoreMap[this.leftSeat.getUserInfo().getUserId()] = this.leftSeat.getUserInfo().getScore();
			this.scoreMap[this.rightSeat.getUserInfo().getUserId()] = this.rightSeat.getUserInfo().getScore();
			this.scoreMap[this.oppositeSeat.getUserInfo().getUserId()] = this.oppositeSeat.getUserInfo().getScore();

			Laya.LocalStorage.setJSON(Room.SCORE_KEY, this.scoreMap);
		}

		public mockSeat():void
		{
			//创造四个用户，设置给三个座位
			let scoreMap = this.getScoreMap();
			let userMy = {"userId":1, "score":scoreMap[1], "nickname":this.userInfo.getNickname(), "avatar":this.userInfo.getAvatar()};
			let userLeft = {"userId":2, "score":scoreMap[2], "nickname":"懵懂" , "avatar":"avatar/c.png"};
			let userOpposite = {"userId":3, "score":scoreMap[3], "nickname":"性活" , "avatar":"avatar/a.png"};
			let userRight = {"userId":4, "score":scoreMap[4], "nickname":"蛮干" , "avatar":"avatar/d.png"};

			let userManager = user.UserManager.GetInstance();
			userManager.processMyUserInfo(userMy);
			userManager.processOtherUserInfo(userLeft);
			userManager.processOtherUserInfo(userRight);
			userManager.processOtherUserInfo(userOpposite);

			let myUserInfo = userManager.getMyUserInfo();

			this.mySeat.setUserInfo(myUserInfo);

			this.mySeat.refreshSeatInfo();
		}

		public getMySeatId():number
		{
			return this.mySeatId;
		}

		public setMySeatId(val:number):void
		{
			this.mySeatId = val;
		}

		public getMySeat():Seat
		{
			return this.mySeat;
		}

		public getSeat(seatId:number):Seat
		{
			return this.seatMap[seatId];
		}

		public startWithSeatArr(seatArr:Array<Object>):void
		{
			let userManager = user.UserManager.GetInstance();
			let myUserInfo = userManager.getMyUserInfo();
			for (let i = 0, len = seatArr.length; i < len; i++) {
				if (seatArr[i]["userId"] == myUserInfo.getUserId()) {
					let mySeatId = parseInt(seatArr[i]["seatId"]), leftSeatId = parseInt(seatArr[(i + 3)%4]["seatId"]), oppositeSeatId = parseInt(seatArr[(i + 2)%4]["seatId"]), rightSeatId = parseInt(seatArr[(i + 1)%4]["seatId"]);
					let leftUserInfo = userManager.getUserInfo(seatArr[(i + 3)%4]["userId"]), oppositeUserInfo = userManager.getUserInfo(seatArr[(i + 2)%4]["userId"]), rightUserInfo = userManager.getUserInfo(seatArr[(i + 1)%4]["userId"]);

					this.setMySeatId(mySeatId);
					this.mySeat.setSeatId(mySeatId);

					this.leftSeat.setSeatId(leftSeatId);
					this.leftSeat.setUserInfo(leftUserInfo);

					this.rightSeat.setSeatId(rightSeatId);
					this.rightSeat.setUserInfo(rightUserInfo);

					this.oppositeSeat.setSeatId(oppositeSeatId);
					this.oppositeSeat.setUserInfo(oppositeUserInfo);

					this.seatMap = {};
					this.seatMap[mySeatId] = this.mySeat;
					this.seatMap[leftSeatId] = this.leftSeat;
					this.seatMap[rightSeatId] = this.rightSeat;
					this.seatMap[oppositeSeatId] = this.oppositeSeat;

					this.mySeat.refreshSeatInfo();
					this.leftSeat.refreshSeatInfo();
					this.rightSeat.refreshSeatInfo();
					this.oppositeSeat.refreshSeatInfo();
					break;
				}
			}
			this.setIsGaming(true);
		}

		//庄家结果公布处理
		public pubDealer(seatId:number, multiple:number):void
		{
			this.dealerSeatId = seatId;
			for (let handleSeatId in this.seatMap) {
				this.seatMap[handleSeatId].hideDealer();
			}
			this.getSeat(seatId).showDealer();
			PageManager.GetInstance().getRoomView().refreshMultiple(multiple);
		}

		//摸底牌
		public receivePocket(cardIds:Array<number>):void
		{
			if (this.dealerSeatId == this.mySeatId) {
				this.mySeat.addCard(cardIds);
			}
		}

		//要求放底牌
		public receiveAskPocket():void
		{
			this.isDealerPutPocket = true;
			PageManager.GetInstance().getRoomView().showPutPocket();
			this.calcuOutStatus();
		}

		//要求喊主
		public receiveAskMain():void
		{
			PageManager.GetInstance().getRoomView().showMainChoose();
		}

		//喊主
		public giveMain(mainType:number):void
		{
			GameLogic.GetInstance().sendDealerGiveMain(mainType);
		}

		//喊主结果公布处理
		public pubMain(mainType:number):void
		{
			this.mainType = mainType;
			this.mySeat.refreshHandCardPosition();
			PageManager.GetInstance().getRoomView().refreshMainType(mainType);
		}

		public isTurn():boolean
		{
			return (this.mySeatId == this.nowOutSeatId || this.isDealerPutPocket);
		}

		public calcuOutStatus():void
		{
			let roomView = PageManager.GetInstance().getRoomView();
			if (this.mySeatId == this.nowOutSeatId) { //出牌阶段，检查当前牌是否可出
				//获取所有选中的牌
				let cardList = Room.GetInstance().getMySeat().getSelectCardList();

				//出牌数量限制，TODO： 0时没有限制
				if (this.nowOutNum != 0 && cardList.length != this.nowOutNum) {
					console.log("数量不符，不允许出");
					roomView.hideCardOut();
					return;
				}

				//当前没有限制出牌类型，则所有牌全部为同一类型即可
				//当前限制了出牌类型，以下两种情况可出，1. 所有牌均为要求的类型。 2.选中的牌中有0张或多张要求的类型，而且除这几张牌外，手中再没有其他牌属于要求的类型

				//现在只允许出一张牌，先简略处理
				if (cardList.length != 1) {
					console.log("数量不符，不允许出");
					roomView.hideCardOut();
					return;
				}

				if (this.nowOutType == constants.CardType.INIT) { //未限制出牌类型,随便哪张都可以
					roomView.showCardOut();
				} else {
					//如果牌型相同
					let card = cardList[0];
					if (this.nowOutType == constants.CardType.MAIN) { //需要出主
						if (this.isMain(card)) { //也是主,当然可以
							roomView.showCardOut();
						} else { //检查有没有主
							if ( ! Room.GetInstance().getMySeat().hasCardType(this.nowOutType)) {
								roomView.showCardOut();
							} else {
								console.log("需要主却不出主，不允许出");
								roomView.hideCardOut();
							}
						}
					} else { //需要副
						if (card.getSuit() == this.nowOutType && ! this.isMain(card)) { //同类型的副
							roomView.showCardOut();
						} else { //检查对应的花色是不是真的出完了
							if ( ! Room.GetInstance().getMySeat().hasCardType(this.nowOutType)) {
								roomView.showCardOut();
							} else {
								console.log("需要花色" + this.nowOutType +"却不出，不允许出");
								roomView.hideCardOut();
							}
						}
					}
				}
			} else if (this.isDealerPutPocket) { //放底牌阶段，选中6张底牌即可
				let cardList = Room.GetInstance().getMySeat().getSelectCardList();
				if (cardList.length == 6) {
					roomView.showConfirmPutPocket();
				} else {
					roomView.hideConfirmPutPocket();
				}
			} else {
				roomView.hideCardOut();
			}
		}

		//判断一张牌是否是主
		public isMain(card:Card):boolean
		{
			if (card.getPoint() >= 15) {
				return true;
			}
			return card.getSuit() == this.getMainType();
		}

		// 比较两张牌大小
		// a是新出的牌，b是之前出的牌
		// 返回 负数 表示a 大 正数表示b大
		// 如果一样大，则根据优先原则，b更大
		public compareCard(a:Card, b:Card):number
		{
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
						if (a.getSuit() == mainType) { //新出的是主花色，更大
							return -1;
						} else {
							return 1;
						}
					}
				} else {
					return -1;
				}
			} else {
				if (bMain) {
					return 1;
				} else {
					if (a.getSuit() != b.getSuit()) { //花色不同，自然是之前的大
						return 1;
					} else {
						return b.getCardId() - a.getCardId();
					}
				}
			}
		}

		// 比较两张牌大小，用于展示，即花色也区分大小
		// 返回 负数 表示a 大， 正数表示b大
		public compareCardForShow(a:Card, b:Card):number
		{
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
		}

		//确定放置底牌
		public confirmPutPocket():void
		{
			let cardList = Room.GetInstance().getMySeat().getSelectCardList();
			if (cardList.length == 6) {
				GameLogic.GetInstance().sendPutPocket(cardList);
			}
		}

		//确定出牌
		public confirmCardOut():void
		{
			let cardList = Room.GetInstance().getMySeat().getSelectCardList();
			GameLogic.GetInstance().sendCardOut(this.mySeatId, cardList);
		}

		//清除选中的牌
		public clearSelectCards():void
		{
			this.mySeat.clearSelectCards();
		}

		//放底牌消息返回
		public receivePutPocketResult(cardIds:Array<number>):void
		{
			this.isDealerPutPocket = false;
			this.mySeat.clearSelectCards();
			this.mySeat.removeByCardIds(cardIds);
			PageManager.GetInstance().getRoomView().hidePutPocket();
		}

		//开始出牌
		public beginOut():void
		{
			this.nowOutType = constants.CardType.INIT;
			this.nowOutNum = 0;
			this.nowMaxCard = null;
			this.nowMaxSeatId = 0;
			this.nowLostScore = 0;
		}

		//轮到自己出牌了
		public outTurn(outType:number, outNum:number):void
		{
			this.nowOutSeatId = this.mySeatId;
			this.nowOutType = outType;
			this.nowOutNum = outNum;
		}

		public setNowOutSeatId(seatId: number):void
		{
			this.nowOutSeatId= seatId;
		}

		//接收到出牌消息
		public cardOut(seatId:number, outCardIds:Array<number>, maxSeatId:number):void
		{
			PageManager.GetInstance().getRoomView().hideCardOut();
			//清除手牌
			let seat = this.getSeat(seatId);
			seat.removeByCardIds(outCardIds);

			//出牌区展示出的牌
			seat.showOutCards(outCardIds);

			//更新当前最大的位置
			this.nowMaxSeatId = maxSeatId;
		}

		//接收到一轮结算消息
		public roundResult(maxSeatId:number, score:number):void
		{
			//TODO: maxSeatId有啥用

			this.nowLostScore += score;

			//更新分数
			let roomView = PageManager.GetInstance().getRoomView();
			roomView.score.text = "闲家分数：" + this.nowLostScore;

			//清除当前出牌
			this.mySeat.clearOutCards();
			this.leftSeat.clearOutCards();
			this.rightSeat.clearOutCards();
			this.oppositeSeat.clearOutCards();
		}

		//接收到游戏结束消息
		public gameOver(pocketCardIds:Array<number>, score:number, isDealerWin:boolean, dealerScore:number, otherScore:number):void
		{
			let roomView = PageManager.GetInstance().getRoomView();
			let userManager = user.UserManager.GetInstance();

			// 展示底牌
			this.showPockets(pocketCardIds);

			// 展示得分及结果
			let resultTxt:string = "庄家胜利";
			if ( ! isDealerWin) {
				resultTxt = "闲家胜利";
			}
			resultTxt += ", 闲家抢到分数为" + score;

			let resultList = [];
			for (let seatId in this.seatMap) {
				let userInfo = this.seatMap[seatId].getUserInfo();
				if (parseInt(seatId) == this.dealerSeatId) {
					resultList.push([userInfo.getNickname(), dealerScore]);
					userInfo.setScore(userInfo.getScore() + dealerScore);
				} else {
					resultList.push([userInfo.getNickname(), otherScore]);
					userInfo.setScore(userInfo.getScore() + otherScore);
				}
			}

			//保存分值
			this.refreshAndSaveScore();

			roomView.showResult(resultTxt, resultList);
		}

		public showPockets(cardIds:Array<number>):void
		{
			let pocketBox = PageManager.GetInstance().getRoomView().pocketCard;
			pocketBox.removeChildren();
			pocketBox.visible = true;
			for (let i = 0, len = cardIds.length; i < len; i++) {
				let newCard = this.getAvailableCard();
				newCard.setCardId(cardIds[i]);
				newCard.recover();
				let cardView = newCard.getCardView();
				pocketBox.addChild(cardView);
				cardView.y = 0;
				cardView.x = i * 105;
			}
		}

		public getAvailableCard():Card
		{
			return Laya.Pool.getItemByClass("card", Card);
		}
	}
}