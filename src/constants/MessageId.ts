/**
* name 
*/
module constants{
	export class MessageId{
		public static GAME_START = 1; //游戏开始
		public static GAME_OVER = 2; //游戏结束
		public static GIVE_CARD = 3; //发牌
		public static ASK_DEALER = 4; //询问抢庄
		public static RISE_DEALER = 5; //抢庄回复
		public static PUB_DEALER = 6; //公布庄家
		public static GIVE_POCKET = 7; //给庄家发底牌
		public static ASK_MAIN = 8; //要求庄家喊主
		public static DEALER_GIVE_MAIN = 9; //庄家喊主
		public static PUB_MAIN = 10; //公布主牌花色
		public static ASK_POCKET = 11; //要求庄家放置底牌
		public static DEALER_PUT_POCKET = 12; //庄家放置底牌
		public static PUT_POCKET_RESULT = 13; //庄家放置底牌结果
		public static BEGIN_OUT = 14; //开始出牌阶段
		public static OUT_TURN = 15; //轮到出牌
		public static CARD_OUT = 16; //玩家出牌
		public static PUB_CARD_OUT = 17; //广播玩家出牌
		public static ROUND_RESULT = 18; //广播一轮结算结果
		public static DEALER_SURRENDER = 19; //庄家投降
		public static DEALER_LOOK_POCKET = 20; //庄家看底牌

		private static _maps:Object;

		public static init()
		{
			MessageId._maps = {};
			MessageId._maps[MessageId.GAME_START] = message.GameStart;
			MessageId._maps[MessageId.GIVE_CARD] = message.GiveCard;
			MessageId._maps[MessageId.ASK_DEALER] = message.AskDealer;
			MessageId._maps[MessageId.RISE_DEALER] = message.RiseDealer;
			MessageId._maps[MessageId.PUB_DEALER] = message.PubDealer;
			MessageId._maps[MessageId.GIVE_POCKET] = message.GivePocket;
			MessageId._maps[MessageId.ASK_MAIN] = message.AskMain;
			MessageId._maps[MessageId.DEALER_GIVE_MAIN] = message.DealerGiveMain;
			MessageId._maps[MessageId.PUB_MAIN] = message.PubMain;
			MessageId._maps[MessageId.ASK_POCKET] = message.AskPocket;
			MessageId._maps[MessageId.DEALER_PUT_POCKET] = message.DealerPutPocket;
			MessageId._maps[MessageId.PUT_POCKET_RESULT] = message.PutPocketResult;
			MessageId._maps[MessageId.BEGIN_OUT] = message.BeginOut;
			MessageId._maps[MessageId.OUT_TURN] = message.OutTurn;
			MessageId._maps[MessageId.CARD_OUT] = message.CardOut;
		}
		
		public static GetProtocolNameById(pid:number):Function|null
		{
			return MessageId._maps[pid] ? MessageId._maps[pid] : null;
		}
	}
}