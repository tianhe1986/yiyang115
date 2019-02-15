/**
* name 
*/
module message{
	export class PutPocketResult extends Base{
		public cardIds:Array<number> = [];
		constructor(){
			super();
			this.id = constants.MessageId.PUT_POCKET_RESULT;
		}

		public writeData():void
		{
			this.content["cardIds"] = this.cardIds;
		}

		public readData():void
		{
			this.cardIds = this.content["cardIds"];
		}

		public receiveHandle():void
		{
			game.Room.GetInstance().receivePutPocketResult(this.cardIds);
		}

		public mockSend():void
		{
			
		}
	}
}