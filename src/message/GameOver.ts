/**
* name 
*/
module message{
	export class GameOver extends Base{
		public pocketCardsIds:Array<number> = []; // 底牌，最后展示给所有人看
		public score:number = 0; //本局游戏闲家抢到的分数
		public isDealerWin:boolean = null; //是否庄家获胜
		public dealerScore:number = 0; // 庄家本轮积分
		public otherScore:number = 0; // 其他人本轮积分

		constructor(){
			super();
			this.id = constants.MessageId.GAME_OVER;
		}

		public writeData():void
		{
			this.content = {"pocketCardsIds":this.pocketCardsIds, "score":this.score, "isDealerWin":this.isDealerWin, "dealerScore":this.dealerScore, "otherScore":this.otherScore};
		}

		public readData():void
		{
			this.pocketCardsIds = this.content["pocketCardsIds"];
			this.score = this.content["score"];
			this.isDealerWin = this.content["isDealerWin"];
			this.dealerScore = this.content["dealerScore"];
			this.otherScore = this.content["otherScore"];
		}

		public receiveHandle():void
		{
			game.Room.GetInstance().gameOver(this.pocketCardsIds, this.score, this.isDealerWin, this.dealerScore, this.otherScore);
		}

		public mockSend():void
		{

		}
	}
}