/**
* name 
*/
module message{
	export class CardOut extends Base{
		public seatId:number = 0;
		public outCardIds:Array<number> = [];
		constructor(){
			super();
			this.id = constants.MessageId.CARD_OUT;
		}

		public writeData():void
		{
			this.content["seatId"] = this.seatId;
			this.content["outCardIds"] = this.outCardIds;
		}

		public readData():void
		{
			this.seatId = this.content["seatId"];
			this.outCardIds = this.content["outCardIds"];
		}

		public receiveHandle():void
		{

		}

		public mockSend():void
		{
			game.GameLogic.GetInstance().mockHandleCardOut(this.seatId, this.outCardIds);
		}
	}
}