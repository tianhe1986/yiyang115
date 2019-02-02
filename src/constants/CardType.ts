/**
* name 
*/
module constants{
	export class CardType{
		public static INIT = -1; //前面没有牌
		public static SPADE   = 1;  //黑桃
		public static HEART   = 2;  //红心
		public static CLUB    = 3;  //梅花
		public static DIAMOND = 4;  //方块
		public static MAIN    = 10; //主
		
		protected static typeNameMap:Object = {};

		public static init():void
		{
			CardType.typeNameMap[-1] = "前面没有牌";
			CardType.typeNameMap[2] = "红桃";
			CardType.typeNameMap[1] = "黑桃";
			CardType.typeNameMap[3] = "梅花";	
			CardType.typeNameMap[4] = "方块";
			CardType.typeNameMap[10] = "调主";
		}

		public static getTypeName(cardType:number):string
		{
			return CardType.typeNameMap[cardType] != undefined ? CardType.typeNameMap[cardType] : "";
		}
	}
}