/**
* name 
*/
module message{
	export class AskMain extends Base{
		constructor(){
			super();
			this.id = constants.MessageId.ASK_MAIN;
		}

		public writeData():void
		{
			
		}

		public readData():void
		{
			
		}

		public receiveHandle():void
		{
			game.Room.GetInstance().receiveAskMain();
		}

		public mockSend():void
		{
			
		}
	}
}