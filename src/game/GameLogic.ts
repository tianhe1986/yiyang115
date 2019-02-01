/**
* name 
*/
module game{
	export class GameLogic{
		protected static instance:GameLogic;

		public static GetInstance():GameLogic
		{
			if(null == GameLogic.instance)
			{
				GameLogic.instance = new GameLogic();
			}
			return GameLogic.instance;
		}

		constructor(){

		}

		public startGame():void
		{
			
		}
	}
}