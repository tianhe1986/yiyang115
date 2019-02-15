/**
* name 
*/
module message{
	export class DealerGiveMain extends Base{
		public mainType:number = 0;
		constructor(){
			super();
			this.id = constants.MessageId.DEALER_GIVE_MAIN;
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
			
		}

		public mockSend():void
		{
			game.GameLogic.GetInstance().mockHandleGiveMain(this);
		}
	}
}