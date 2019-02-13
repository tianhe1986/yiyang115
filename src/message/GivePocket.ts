/**
* name 
*/
module message{
	export class GivePocket extends Base{
		public cardIds:Array<number> = [];

		constructor(){
			super();
			this.id = constants.MessageId.GIVE_POCKET;
		}

		public writeData():void
		{
			this.content = {"cardIds":this.cardIds};
		}

		public readData():void
		{
			this.cardIds = this.content["cardIds"];
		}

		public receiveHandle():void
		{
			game.Room.GetInstance().receivePocket(this.cardIds);
		}

		public mockSend():void
		{
			
		}
	}
}