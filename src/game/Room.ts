/**
* name 
*/
module game{
	export class Room{

		protected static instance:Room;

		public static SCORE_KEY = "score_map";
		protected isSingle:boolean = false;

		protected userInfo:user.UserInfo = null;
		protected scoreMap:Object = null;

		protected mySeat:Seat = null;
		protected leftSeat:Seat = null;
		protected rightSeat:Seat = null;

		protected mySeatId:number = 0;
		protected seatMap:Object = null;
		protected isGaming:boolean = false;

		public static GetInstance():Room
		{
			if(null == Room.instance)
			{
				Room.instance = new Room();
			}
			return Room.instance;
		}

		constructor(){

		}

		public login():void
		{
			game.PageManager.GetInstance().showLogin();

			if (Laya.Browser.onMiniGame) {
				let wx = Laya.Browser.window.wx;
				
				wx.login({
					success: (res) => {
						let code = res.code;
						wx.getSetting({
							success: (resSetting) => {
								if (resSetting.authSetting["scope.userInfo"] == true)  { //已授权，直接获取
									wx.getUserInfo({
										withCredentials: true,
										success: (res2) => {
											this.userInfo.setNickname(res2.userInfo.nickName);
											this.userInfo.setAvatar(res2.userInfo.avatarUrl);
											this.showEnter();
										}
									});
								} else { //未授权，创建微信登录按钮
									let systemInfo = GameMain.GetInstance().getWxSystemInfo();
									let button = wx.createUserInfoButton({
										type: 'text',
										text: '登录',
										withCredentials: true,
										style: {
											left: systemInfo.windowWidth/2 - 70,
											top: systemInfo.windowHeight/2 - 20,
											width: 140,
											height: 40,
											lineHeight: 40,
											backgroundColor: '#ffffff',
											color: '#000000',
											textAlign: 'center',
											fontSize: 16,
											borderRadius: 4
										}
									})
									button.onTap((res2) => {
										this.userInfo.setNickname(res2.userInfo.nickName);
										this.userInfo.setAvatar(res2.userInfo.avatarUrl);
										button.destroy();
										this.showEnter();
									})
								}
							}
						});
					}
				});
			} else { //否则，展示登录框
				this.showEnter();
			}
		}

		public showEnter():void
		{
			game.PageManager.GetInstance().showEnter();
		}

		public isTurn():boolean
		{
			return false;
		}

		public calcuOutStatus():void
		{

		}
	}
}