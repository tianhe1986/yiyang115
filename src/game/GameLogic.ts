/**
* name 
*/
module game{
	export class GameLogic{

		protected mockSeatUserMap:Object = {};
		protected mockSeatCardMap:Object = {};

		protected static instance:GameLogic;

		//发牌时的底牌
		protected pocketList:Array<number> = [];
		//庄家放置的底牌
		protected mainPocketList:Array<number> = [];
		//主
		protected mainType:number = 0;
		
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
			this.mockMainClear();
			this.mockAskMain();
			this.mockMainResult(1, 5);
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

			this.pocketList = arr;
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
		public mockMainClear():void
		{

		}

		//开始抢庄
		public mockAskMain():void
		{
			//未初始化，从头开始
		}

		//抢庄结果处理
		public mockMainResult(seatId:number, multiple:number):void
		{
			//公布抢庄结果

			//给庄家发送底牌信息

			//要求庄家喊主
		}
	}
}