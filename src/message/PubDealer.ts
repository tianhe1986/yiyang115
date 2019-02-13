/**
* name 
*/
module message{
	export class PubDealer extends Base{
		public dealSeatId:number = 0;
		public multiple:number = 0;

		constructor(){
			super();
			this.id = constants.MessageId.PUB_DEALER;
		}

		public writeData():void
		{
			this.content = {"dealSeatId":this.dealSeatId, "multiple":this.multiple};
		}

		public readData():void
		{
			this.dealSeatId = this.content["dealSeatId"];
			this.multiple = this.content["multiple"];
		}

		public receiveHandle():void
		{
			game.Room.GetInstance().pubDealer(this.dealSeatId, this.multiple);
		}

		public mockSend():void
		{
			
		}
	}
}