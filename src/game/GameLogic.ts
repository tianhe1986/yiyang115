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
			this.processSeatCard(1, arr.splice(0, 13));
			this.processSeatCard(2, arr.splice(0, 13));
			this.processSeatCard(3, arr.splice(0, 13));
			this.processSeatCard(4, arr.splice(0, 13));

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

			//要求庄家喊主
			this.mockAskMain();
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

		}

		//要求庄家喊主
		public mockAskMain():void
		{

		}

		//要求庄家放底牌
		public mockAskPocket():void
		{

		}
	}
}