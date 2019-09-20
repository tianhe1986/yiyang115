/**
* name 
*/
module message{
	export class RoundResult extends Base{
		public maxSeatId:number = 0;
		public score:number = 0;
		constructor(){
			super();
			this.id = constants.MessageId.ROUND_RESULT;
		}

		public writeData():void
		{
			this.content = {"maxSeatId":this.maxSeatId, "score":this.score};
		}

		public readData():void
		{
			this.maxSeatId = this.content["maxSeatId"];
			this.score = this.content["score"];
		}

		public receiveHandle():void
		{
			game.Room.GetInstance().roundResult(this.maxSeatId, this.score);
		}

		public mockSend():void
		{

		}
	}
}