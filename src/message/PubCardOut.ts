/**
* name 
*/
module message{
	export class PubCardOut extends Base{
		public seatId:number = 0;
		public outCardIds:Array<number> = [];
		public maxSeatId:number = 0;

		constructor(){
			super();
			this.id = constants.MessageId.PUB_CARD_OUT;
		}

		public writeData():void
		{
			this.content["seatId"] = this.seatId;
			this.content["outCardIds"] = this.outCardIds;
			this.content["maxSeatId"] = this.maxSeatId;
		}

		public readData():void
		{
			this.seatId = this.content["seatId"];
			this.outCardIds = this.content["outCardIds"];
			this.maxSeatId = this.content["maxSeatId"];
		}

		public receiveHandle():void
		{
			game.Room.GetInstance().cardOut(this.seatId, this.outCardIds, this.maxSeatId);
		}

		public mockSend():void
		{

		}
	}
}