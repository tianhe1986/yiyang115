/**
* name 
*/
module message{
	export class AskPocket extends Base{
		constructor(){
			super();
			this.id = constants.MessageId.ASK_POCKET;
		}

		public writeData():void
		{
			
		}

		public readData():void
		{
			
		}

		public receiveHandle():void
		{
			game.Room.GetInstance().receiveAskPocket();
		}

		public mockSend():void
		{
			
		}
	}
}