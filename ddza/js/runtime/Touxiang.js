//显示玩家的头像
import {Sprite} from "../base/Sprite.js";
import { DataStore } from "../base/DataStore.js";

export class Touxiang extends Sprite{
    constructor(index) {
        const image = Sprite.getImage('portrait');

        super(image, 0, 0,
            image.width, image.height,
            0, 0,
            image.width, image.height);


        this.kuangx= [20,290,290];
        this.kuangy = [5,5,575];
        this.huangx = [21,290,290];
        this.huangy = [2,2,572];

        this.index = index ;

    }




    drawHuangkuangA() {
            super.draw(this.img,
                175,
                10,
                95,
                95,
                this.huangx[0],
                this.huangy[0],
                95,
                95);
    }

    drawHuangkuangB() {
        super.draw(this.img,
            175,
            10,
            95,
            95,
            this.huangx[1],
            this.huangy[1],
            95,
            95);
    }

    drawHuangkuangC() {
        super.draw(this.img,
            175,
            10,
            95,
            95,
            this.huangx[2],
            this.huangy[2],
            95,
            95);
    }

    draw(){
                for (let i = 0 ;i<=2 ;i++){
                super.draw(this.img,
                    270,
                    5,
                    80,
                    80,
                    this.kuangx[i],
                    this.kuangy[i],
                    80,
                80 );

                  }
            }

    drawdizhu1(){
        super.draw(this.img,
            285,
            145,
            75,
            60,
            28,
            10,
            75,
            60 );

    }

    drawdizhu2(){
        super.draw(this.img,
            285,
            145,
            75,
            60,
            297,
            15,
            75,
            60 );

    }

    drawdizhu3(){
        super.draw(this.img,
            285,
            145,
            75,
            60,
            297,
            585,
            75,
            60 );

    }

    drawA1(){
        super.draw(this.img,
            285,
            205,
            75,
            60,
            297,
            13,
            75,
            60 );

    }


    drawB1(){
        super.draw(this.img,
            285,
            80,
            75,
            60,
            297,
            580,
            75,
            60 );

    }

    drawC1(){
        super.draw(this.img,
            285,
            80,
            75,
            60,
            28,
            10,
            75,
            60 );

    }



}