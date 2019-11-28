//计分器类

import {DataStore} from "../base/DataStore.js";

export class Score {

    constructor() {
        this.ctx = DataStore.getInstance().ctx;
        //因为canvas刷新的很快，所以需要一个变量控制加分，只加一次
    }

    drawnumber(point,x,y) {
        this.ctx.save();
        this.ctx.translate(x,y);
        this.ctx.rotate(90*Math.PI/180);
        this.ctx.font = '23px Arial';
        this.ctx.fillStyle = '#fafafa';
        this.ctx.fillText(
            point+"分",
            0,
            0,
            1000
        );
        this.ctx.restore();
    }
    drawnonumber(x,y) {
        this.ctx.save();
        this.ctx.translate(x,y);
        this.ctx.rotate(90*Math.PI/180);
        this.ctx.font = '23px Arial';
        this.ctx.fillStyle = '#fafafa';
        this.ctx.fillText(
            "不叫",
            0,
            0,
            1000
        );
        this.ctx.restore();
    }
    drawbuchu(x,y) {
        this.ctx.save();
        this.ctx.translate(x,y);
        this.ctx.rotate(90*Math.PI/180);
        this.ctx.font = '23px Arial';
        this.ctx.fillStyle = '#fafafa';
        this.ctx.fillText(
            "不出",
            0,
            0,
            1000
        );
        this.ctx.restore();
    }

    drawPaiNumber(number,x,y){
        this.ctx.save();
        this.ctx.translate(x,y);
        this.ctx.rotate(90*Math.PI/180);
        this.ctx.font = '18px Arial';
        this.ctx.strokeStyle = '#fafafa';
        this.ctx.strokeText(
            number,
            0,
            0,
            100
        );
        this.ctx.restore();
    }
    clear(x,y,width,heigth){
        this.ctx.clearRect(x, y, width, heigth);
    }

    drawword( x, y, text, number) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(90 * Math.PI / 180);
        this.ctx.font = '15px Arial';
        this.ctx.fillStyle = '#fafafa';
        this.ctx.fillText(
            text + number,
            0,
            0,
            1000
        );
        this.ctx.restore();
    }
    drawYaobuqi(x, y) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(90 * Math.PI / 180);
        this.ctx.font = '23px Arial';
        this.ctx.strokeStyle = '#fafafa';
        this.ctx.strokeText(
            "你没有牌大过它",
            0,
            0,
            100
        );
        this.ctx.restore();
    }
    drawStart() {
        this.ctx.save();
        this.ctx.translate(108,328 );
        this.ctx.rotate(90 * Math.PI / 180);
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = '#fafafa';
        this.ctx.fillText(
            "开始",
            0,
            0,
            1000
        );
        this.ctx.restore();
    }
}