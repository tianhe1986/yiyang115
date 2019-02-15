/**
* name 
*/
module message{
	export class PubMain extends Base{
		public mainType:number = 0;

		constructor(){
			super();
			this.id = constants.MessageId.PUB_MAIN;
		}

		public writeData():void
		{
			this.content = {"mainType":this.mainType};
		}

		public readData():void
		{
			this.mainType = this.content["mainType"];
		}

		public receiveHandle():void
		{
			game.Room.GetInstance().pubMain(this.mainType);
		}

		public mockSend():void
		{
			
		}
	}
}