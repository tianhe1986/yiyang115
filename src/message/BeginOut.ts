/**
* name 
*/
module message{
	export class BeginOut extends Base{
		constructor(){
			super();
			this.id = constants.MessageId.BEGIN_OUT;
		}

		public writeData():void
		{
			
		}

		public readData():void
		{
			
		}

		public receiveHandle():void
		{
			game.Room.GetInstance().beginOut();
		}

		public mockSend():void
		{
			
		}
	}
}