
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class enterUI extends View {
		public single:Laya.Button;
		public rule:Laya.Button;
		public mock:Laya.Box;
		public ruleBox:Laya.Box;
		public ruleText:laya.display.Text;
		public ruleClose:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":1334,"height":750,"centerY":0.5,"centerX":0.5},"child":[{"type":"Box","props":{"y":0,"x":0},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":1334,"lineWidth":0,"height":750,"fillColor":"#56b8e7"}}]},{"type":"Button","props":{"y":284,"x":360,"width":155,"var":"single","skin":"comp/button.png","labelSize":36,"labelFont":"SimSun","label":"开始","height":72}},{"type":"Button","props":{"y":283,"x":712,"width":155,"var":"rule","skin":"comp/button.png","labelSize":36,"labelFont":"SimSun","label":"说明","height":72}},{"type":"Text","props":{"y":679,"x":450,"text":"Powered by LayaAir Engine","fontSize":26,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"y":639,"x":543,"text":"作者：天河","fontSize":26,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Box","props":{"y":0,"x":0,"visible":false,"var":"mock"},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":1334,"lineWidth":0,"height":750,"fillColor":"#000000"}}]},{"type":"Box","props":{"y":71,"x":414,"visible":false,"var":"ruleBox"},"child":[{"type":"Panel","props":{"y":0,"x":-79,"width":617,"height":521},"child":[{"type":"Text","props":{"y":0,"x":0,"width":617,"var":"ruleText","text":"地","leading":8,"fontSize":24,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}}]},{"type":"Button","props":{"y":554,"x":175,"width":110,"var":"ruleClose","skin":"comp/button.png","labelSize":24,"labelFont":"SimSun","label":"知道了","height":45}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.enterUI.uiView);

        }

    }
}

module ui {
    export class loginUI extends View {

        public static  uiView:any ={"type":"View","props":{"width":1334,"height":750,"centerY":0.5,"centerX":0.5},"child":[{"type":"Box","props":{"y":0,"x":0},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":1334,"lineWidth":0,"height":750,"fillColor":"#56b8e7"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.loginUI.uiView);

        }

    }
}

module ui {
    export class roomUI extends View {
		public background:Laya.Box;
		public leftSeat:Laya.Box;
		public mySeat:Laya.Box;
		public rightSeat:Laya.Box;
		public oppositeSeat:Laya.Box;
		public handCard:Laya.Box;
		public tips:laya.display.Text;
		public cardOutButton:Laya.Button;
		public mock:Laya.Box;
		public result:Laya.Box;
		public multiple:laya.display.Text;
		public mainType:laya.display.Text;
		public score:laya.display.Text;

        public static  uiView:any ={"type":"View","props":{"width":1334,"height":750,"centerY":0.5,"centerX":0.5},"child":[{"type":"Box","props":{"y":0,"x":0,"var":"background"},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":1334,"lineWidth":0,"height":750,"fillColor":"#56b8e7"}}]},{"type":"Box","props":{"y":269,"x":163,"var":"leftSeat"},"child":[{"type":"Box","props":{"name":"back"},"child":[{"type":"Rect","props":{"width":120,"lineWidth":0,"height":180,"fillColor":"#11829f"}}]},{"type":"Image","props":{"y":10,"x":10,"width":100,"name":"avatar","height":100}},{"type":"Text","props":{"y":118,"x":11,"width":98,"text":"你的","name":"nickname","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":146,"x":8,"width":98,"text":"111","name":"score","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":-4,"x":118,"width":38,"text":"12","name":"cardNum","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}},{"type":"Box","props":{"y":-27,"x":216,"width":105,"name":"outCard","height":219}},{"type":"Text","props":{"y":-35,"x":48,"width":38,"text":"庄","name":"dealer","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}}]},{"type":"Box","props":{"y":532,"x":160,"var":"mySeat"},"child":[{"type":"Box","props":{"name":"back"},"child":[{"type":"Rect","props":{"width":120,"lineWidth":0,"height":180,"fillColor":"#11829f"}}]},{"type":"Image","props":{"y":10,"x":10,"width":100,"name":"avatar","height":100}},{"type":"Text","props":{"y":118,"x":11,"width":98,"text":"你的","name":"nickname","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":146,"x":8,"width":98,"text":"111","name":"score","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":-4,"x":118,"width":38,"text":"12","name":"cardNum","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}},{"type":"Box","props":{"y":-150,"x":425,"width":316,"name":"outCard","height":150}},{"type":"Text","props":{"y":-33,"x":50,"width":38,"text":"庄","name":"dealer","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}}]},{"type":"Box","props":{"y":266,"x":1126,"var":"rightSeat"},"child":[{"type":"Box","props":{"name":"back"},"child":[{"type":"Rect","props":{"width":120,"lineWidth":0,"height":180,"fillColor":"#11829f"}}]},{"type":"Image","props":{"y":10,"x":10,"width":100,"name":"avatar","height":100}},{"type":"Text","props":{"y":118,"x":11,"width":98,"text":"你的","name":"nickname","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":146,"x":8,"width":98,"text":"111","name":"score","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":-5,"x":-42,"width":38,"text":"12","name":"cardNum","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"right"}},{"type":"Box","props":{"y":-20,"x":-168,"width":105,"name":"outCard","height":234}},{"type":"Text","props":{"y":-31,"x":49,"width":38,"text":"庄","name":"dealer","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}}]},{"type":"Box","props":{"y":7,"x":639,"var":"oppositeSeat"},"child":[{"type":"Box","props":{"name":"back"},"child":[{"type":"Rect","props":{"width":120,"lineWidth":0,"height":180,"fillColor":"#11829f"}}]},{"type":"Image","props":{"y":10,"x":10,"width":100,"name":"avatar","height":100}},{"type":"Text","props":{"y":118,"x":11,"width":98,"text":"你的","name":"nickname","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":146,"x":8,"width":98,"text":"111","name":"score","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"center"}},{"type":"Text","props":{"y":-4,"x":118,"width":38,"text":"12","name":"cardNum","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}},{"type":"Box","props":{"y":192,"x":-56,"width":295,"name":"outCard","height":150}},{"type":"Text","props":{"y":34,"x":-33,"width":38,"text":"庄","name":"dealer","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}}]},{"type":"Box","props":{"y":555,"x":327,"width":962,"var":"handCard","height":150}},{"type":"Text","props":{"y":56,"x":258,"var":"tips","text":"text","fontSize":24,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Button","props":{"y":423,"x":611,"width":123,"visible":false,"var":"cardOutButton","skin":"comp/button.png","name":"出牌","labelSize":30,"labelFont":"SimHei","label":"出牌","height":53}},{"type":"Box","props":{"y":0,"x":0,"visible":false,"var":"mock"},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":1334,"lineWidth":0,"height":750,"fillColor":"#000000"}}]},{"type":"Box","props":{"y":119,"x":527,"visible":false,"var":"result"},"child":[{"type":"Text","props":{"x":53,"text":"本局得分","fontSize":32,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"List","props":{"y":61,"width":206,"spaceY":10,"name":"resultList","height":161},"child":[{"type":"Box","props":{"renderType":"render"},"child":[{"type":"Text","props":{"text":"昵称","name":"nickname","fontSize":32,"font":"Microsoft YaHei","color":"#ffffff"}},{"type":"Text","props":{"x":142,"text":"得分","name":"score","fontSize":32,"font":"Microsoft YaHei","color":"#ffffff"}}]}]},{"type":"Button","props":{"y":265,"x":56,"width":123,"visible":false,"skin":"comp/button.png","name":"confirm","labelSize":30,"labelFont":"SimHei","label":"确定","height":53}}]},{"type":"Text","props":{"y":39,"x":1075,"width":127,"var":"multiple","text":"倍数：X0","height":40,"fontSize":28,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}},{"type":"Text","props":{"y":83,"x":1074,"width":127,"var":"mainType","text":"主：无主","height":40,"fontSize":28,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}},{"type":"Text","props":{"y":129,"x":1075,"width":127,"var":"score","text":"闲家分数：0","height":40,"fontSize":28,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.roomUI.uiView);

        }

    }
}
