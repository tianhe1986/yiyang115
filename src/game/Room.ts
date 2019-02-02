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
		protected oppositeSeat:Seat = null;

		protected mySeatId:number = 0;
		protected seatMap:Object = null;
		protected isGaming:boolean = false;

		//主
		protected mainType:number = 0;

		//当前出牌

		//当前大牌

		public static GetInstance():Room
		{
			if(null == Room.instance)
			{
				Room.instance = new Room();
			}
			return Room.instance;
		}

		constructor(){
			this.mySeat = new Seat();
			this.leftSeat = new Seat();
			this.rightSeat = new Seat();
			this.oppositeSeat = new Seat();

			let roomView = PageManager.GetInstance().getRoomView();
			this.mySeat.setSeatView(roomView.mySeat);
			this.leftSeat.setSeatView(roomView.leftSeat);
			this.rightSeat.setSeatView(roomView.rightSeat);
			this.oppositeSeat.setSeatView(roomView.oppositeSeat);

			this.userInfo = new user.UserInfo();
			this.userInfo.setNickname("莽夫");
			this.userInfo.setAvatar("avatar/b.png");
		}

		public getMainType():number
		{
			return this.mainType;
		}

		public setMainType(val:number):void
		{
			this.mainType = val;
		}

		public getIsSingle():boolean
		{
			return this.isSingle;
		}

		public setIsSingle(val:boolean):void
		{
			this.isSingle = val;
		}

		public getIsGaming():boolean
		{
			return this.isGaming;
		}

		public setIsGaming(val:boolean):void
		{
			this.isGaming = val;
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

		public startSingle():void
		{
			this.setIsSingle(true);
			PageManager.GetInstance().showRoom();

			PageManager.GetInstance().getRoomView().clearAll();

			//创造虚拟用户
			this.mockSeat();

			//开始游戏
			GameLogic.GetInstance().startGame();
		}

		public getScoreMap():any
		{
			if (this.scoreMap == null) {
				this.scoreMap = Laya.LocalStorage.getJSON(Room.SCORE_KEY);
				if (this.scoreMap == null || this.scoreMap == '') {
					this.scoreMap = {};
					this.scoreMap[1] = 100;
					this.scoreMap[2] = 100;
					this.scoreMap[3] = 100;
					this.scoreMap[4] = 100;
				}
			}

			return this.scoreMap;
		}

		public refreshAndSaveScore():void
		{
			this.scoreMap[this.mySeat.getUserInfo().getUserId()] = this.mySeat.getUserInfo().getScore();
			this.scoreMap[this.leftSeat.getUserInfo().getUserId()] = this.leftSeat.getUserInfo().getScore();
			this.scoreMap[this.rightSeat.getUserInfo().getUserId()] = this.rightSeat.getUserInfo().getScore();
			this.scoreMap[this.oppositeSeat.getUserInfo().getUserId()] = this.oppositeSeat.getUserInfo().getScore();

			Laya.LocalStorage.setJSON(Room.SCORE_KEY, this.scoreMap);
		}

		public mockSeat():void
		{
			//创造四个用户，设置给三个座位
			let scoreMap = this.getScoreMap();
			let userMy = {"userId":1, "score":scoreMap[1], "nickname":this.userInfo.getNickname(), "avatar":this.userInfo.getAvatar()};
			let userLeft = {"userId":2, "score":scoreMap[2], "nickname":"懵懂" , "avatar":"avatar/c.png"};
			let userOpposite = {"userId":3, "score":scoreMap[3], "nickname":"性活" , "avatar":"avatar/a.png"};
			let userRight = {"userId":4, "score":scoreMap[4], "nickname":"蛮干" , "avatar":"avatar/d.png"};

			let userManager = user.UserManager.GetInstance();
			userManager.processMyUserInfo(userMy);
			userManager.processOtherUserInfo(userLeft);
			userManager.processOtherUserInfo(userRight);
			userManager.processOtherUserInfo(userOpposite);

			let myUserInfo = userManager.getMyUserInfo();

			this.mySeat.setUserInfo(myUserInfo);

			this.mySeat.refreshSeatInfo();
		}

		public getMySeatId():number
		{
			return this.mySeatId;
		}

		public setMySeatId(val:number):void
		{
			this.mySeatId = val;
		}

		public getMySeat():Seat
		{
			return this.mySeat;
		}

		public getSeat(seatId:number):Seat
		{
			return this.seatMap[seatId];
		}

		public startWithSeatArr(seatArr:Array<Object>):void
		{
			let userManager = user.UserManager.GetInstance();
			let myUserInfo = userManager.getMyUserInfo();
			for (let i = 0, len = seatArr.length; i < len; i++) {
				if (seatArr[i]["userId"] == myUserInfo.getUserId()) {
					let mySeatId = parseInt(seatArr[i]["seatId"]), leftSeatId = parseInt(seatArr[(i + 3)%4]["seatId"]), oppositeSeatId = parseInt(seatArr[(i + 2)%4]["seatId"]), rightSeatId = parseInt(seatArr[(i + 1)%4]["seatId"]);
					let leftUserInfo = userManager.getUserInfo(seatArr[(i + 3)%4]["userId"]), oppositeUserInfo = userManager.getUserInfo(seatArr[(i + 2)%4]["userId"]), rightUserInfo = userManager.getUserInfo(seatArr[(i + 1)%4]["userId"]);

					this.setMySeatId(mySeatId);
					this.mySeat.setSeatId(mySeatId);

					this.leftSeat.setSeatId(leftSeatId);
					this.leftSeat.setUserInfo(leftUserInfo);

					this.rightSeat.setSeatId(rightSeatId);
					this.rightSeat.setUserInfo(rightUserInfo);

					this.oppositeSeat.setSeatId(oppositeSeatId);
					this.oppositeSeat.setUserInfo(oppositeUserInfo);

					this.seatMap = {};
					this.seatMap[mySeatId] = this.mySeat;
					this.seatMap[leftSeatId] = this.leftSeat;
					this.seatMap[rightSeatId] = this.rightSeat;
					this.seatMap[oppositeSeatId] = this.oppositeSeat;

					this.mySeat.refreshSeatInfo();
					this.leftSeat.refreshSeatInfo();
					this.rightSeat.refreshSeatInfo();
					this.oppositeSeat.refreshSeatInfo();
					break;
				}
			}
			this.setIsGaming(true);
		}

		public isTurn():boolean
		{
			return false;
		}

		public calcuOutStatus():void
		{

		}

		public confirmCardOut():void
		{

		}
	}
}