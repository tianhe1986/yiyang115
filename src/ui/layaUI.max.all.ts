
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

        public static  uiView:any ={"type":"View","props":{"width":1334,"height":750,"centerY":0.5,"centerX":0.5}};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.roomUI.uiView);

        }

    }
}
