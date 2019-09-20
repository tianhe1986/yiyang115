/**
* name 
*/
module message{
	export class OutTurn extends Base{
		public outType:number = 0;
		public outNum:number = 0;
		constructor(){
			super();
			this.id = constants.MessageId.OUT_TURN;
		}

		public writeData():void
		{
			this.content = {"outType":this.outType, "outNum":this.outNum};
		}

		public readData():void
		{
			this.outType = this.content["outType"];
			this.outNum = this.content["outNum"];
		}

		public receiveHandle():void
		{
			//轮到我了
			game.Room.GetInstance().outTurn(this.outType, this.outNum);
		}

		public mockSend():void
		{
			//轮到电脑了，参数都没啥用

			//延迟一秒处理
			Laya.timer.once(1000, this, () => {
				game.GameLogic.GetInstance().mockHandleOutTurn();
			});
		}
	}
}