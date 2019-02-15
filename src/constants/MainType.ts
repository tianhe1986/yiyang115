/**
* name 
*/
module constants{
	export class MainType{
		public static INIT    = 0;  //未喊
		public static SPADE   = 1;  //黑桃
		public static HEART   = 2;  //红心
		public static CLUB    = 3;  //梅花
		public static DIAMOND = 4;  //方块
		public static NONE    = 5;  //无主

		protected static typeNameMap:Object = {
			"0" : "未喊",
			"1" : "黑桃",
			"2" : "红桃",
			"3" : "梅花",
			"4" : "方块",
			"5" : "基主"
		};

		public static getTypeName(mainType:number):string
		{
			return MainType.typeNameMap[mainType] != undefined ? MainType.typeNameMap[mainType] : "";
		}
	}
}