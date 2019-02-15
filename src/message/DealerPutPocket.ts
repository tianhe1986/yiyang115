/**
* name 
*/
module message{
	export class DealerPutPocket extends Base{
		public cardIds:Array<number> = [];
		constructor(){
			super();
			this.id = constants.MessageId.DEALER_PUT_POCKET;
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

		}

		public mockSend():void
		{
			game.GameLogic.GetInstance().mockHandlePutPocket(this.cardIds);
		}
	}
}