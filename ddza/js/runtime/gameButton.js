//游戏界面的按钮问题
import {Sprite} from "../base/Sprite.js";

export class gameButton extends Sprite{
    constructor(){
        const image = Sprite.getImage('button');
        super(image, 0,0,image.width,image.height,
            0 , 0  , image.width,image.height);
        //开始界面的资源
        this.clingX = [
            125,    //上面放牌的下部分
            51,   //下部分
            301, 300, 325,    //1分  按钮  分  数
            325,   //2分
            325,   //3分
            362,  //不叫
            303,   //出牌
            323,   //提示
            343,   //重选
            363,   //不出
            51,   //放牌框
            125,
            175   //气泡
        ] ;
        this.clingY = [10,20,
            13,120,78,
            89,
            100,
            70,
            155,     //不出  提示  重选   出牌
            20,
            10,
            290    //气泡
            ] ;
        this.pointWidth = [55,55,
            33,20,10,
            12,
            12,
            16,
            50,
            60    //气泡
            ] ;
        this.pointHeight = [195,195,
            55,15,12,
            12,
            12,
            40,
            200,
            75   //气泡
            ] ;
        this.pointx = [330,330,
            150,152,157,
            157,
            157,
            157,
            326,    //放牌框
            265,    //气泡
            235
            ] ;
        this.pointy = [130,322,
            190,223,203,
            260,295,273,
            330,365,343,
            400,403,403,
            203,273,343,410,    //不出 出牌  重选  提示
            326,   //放牌框
            130,
            90,    //气泡
            590
            ] ;


    }

    draw(){
        //画按钮
        for (let i = 2; i <= 5; i++) {
            super.draw(this.img,
                this.clingX[2],
                this.clingY[2],
                this.pointWidth[2],
                this.pointHeight[2],
                this.pointx[2],
                this.pointy[2+(i-2)*3],
                this.pointWidth[2],
                this.pointHeight[2]);
        }

        //画分
        for (let j = 3; j <= 5; j++) {
            super.draw(this.img,
                this.clingX[3],
                this.clingY[3],
                this.pointWidth[3],
                this.pointHeight[3],
                this.pointx[3],
                this.pointy[3+(j-3)*3],
                this.pointWidth[3],
                this.pointHeight[3]);
        }

        //画123和不叫
        for (let n = 4; n <= 7; n++) {
                    super.draw(this.img,
                        this.clingX[n],
                        this.clingY[n],
                        this.pointWidth[n],
                        this.pointHeight[n],
                        this.pointx[n],
                        this.pointy[4+(n-4)*3],
                        this.pointWidth[n],
                        this.pointHeight[n]);
                }

    }


    drawGame(){

        //画按钮
        for (let i = 2; i <= 5; i++) {
            super.draw(this.img,
                this.clingX[2],
                this.clingY[2],
                this.pointWidth[2],
                this.pointHeight[2],
                this.pointx[2],
                this.pointy[2+(i-2)*3],
                this.pointWidth[2],
                this.pointHeight[2]);
        }

        for (let n = 8; n <= 11; n++) {
            super.draw(this.img,
                this.clingX[n],
                this.clingY[8],
                this.pointWidth[7],
                this.pointHeight[7],
                this.pointx[7],
                this.pointy[n+6],
                this.pointWidth[7],
                this.pointHeight[7]);
        }
    }

    drawPaikuang(){
        for (let n = 12; n <= 13; n++) {
            super.draw(this.img,
                this.clingX[n],
                this.clingY[n-3],
                this.pointWidth[8],
                this.pointHeight[8],
                this.pointx[8],
                this.pointy[n+6],
                this.pointWidth[8],
                this.pointHeight[8]);
        }
    }

    //上面的叫分按钮
    drawPaoS(){
        super.draw(this.img,
            this.clingX[14],
            this.clingY[11],
            this.pointWidth[9],
            this.pointHeight[9],
            this.pointx[9],
            this.pointy[20],
            this.pointWidth[9],
            this.pointHeight[9]);
    }

    //下面的叫分按钮
    drawPaoX() {
        this.ctx.save();
        this.ctx.translate(325, 570);
        this.ctx.rotate(180 * Math.PI / 180);
        super.draw(this.img,
            this.clingX[14],
            this.clingY[11],
            this.pointWidth[9],
            this.pointHeight[9],
            0,
            0,
            this.pointWidth[9],
            this.pointHeight[9]);
        this.ctx.restore();
    }
    //画开始按钮
    drawGameStart() {
        //画按钮
        for (let i = 2; i <= 5; i++) {
            super.draw(this.img,
                this.clingX[2],
                this.clingY[2],
                this.pointWidth[2],
                this.pointHeight[2],
                100,
                320,
                this.pointWidth[2],
                this.pointHeight[2]);
        }
    }


}