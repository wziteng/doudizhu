import {DataStore} from "./base/DataStore.js";
import {Poker} from "./runtime/Poker.js";
import {Position} from "./runtime/Position.js";
import {GameRun} from "./Logiczzz/GameRun.js";
import {Play} from "./Logiczzz/Play.js";



export class Director {
    static getInstance() {
        if (Director.instance) {
        } else {
            Director.instance = new Director();
        }
        return Director.instance;
    }

    constructor() {
        this.dataStore = DataStore.getInstance();
        this.canvas = wx.createCanvas();
        this.cxt = this.canvas.getContext('2d');
        this.newCard1 = [];
        this.newCard2 = [];
        this.newCard3 = [];
        this.key = [];//存放key
        this.data = [];

        this.score = 0;
        this.last = [];
        this.outcards = [];
        this.keysArr = [];
        this.GameRun = new GameRun();
        this.playA = new Play();
        this.playB = new Play();
        this.playC = new Play();
        this.rectangleCardInfo = [];

        this.pointaiA = parseInt(Math.random() * 3 + 1);
        this.pointaiB = parseInt(Math.random() * 3);

        this.cards = [
            302, 301,

            224, 223, 222, 221,
            214, 213, 212, 211,
            134, 133, 132, 131,//K
            124, 123, 122, 121,//Q
            114, 113, 112, 111,//J
            104, 103, 102, 101,//10
            94, 93, 92, 91,//9
            84, 83, 82, 81,//8
            74, 73, 72, 71,//7
            64, 63, 62, 61,//6
            54, 53, 52, 51,//5
            44, 43, 42, 41,//4
            34, 33, 32, 31//3
        ];

        this.sureBotton = 0;

        this.notBotton = 0;

        this.remindBotton = 0;

        this.remindReadyBotton = 0;

        this.outcards_num = [];

        this.isWin = false;

    }

    //洗牌方法
    static Shuffle(arr) {
        let len = arr.length;
        for (let i = 0; i < len - 1; i++) {
            let index = parseInt(Math.random() * (len - i));
            let temp = arr[index];
            arr[index] = arr[len - i - 1];
            arr[len - i - 1] = temp;
        }
    }


    static sortCards(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] < arr[j + 1]) {
                    let temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    }


    pointB() {
        if (this.pointaiB === 0) {
            this.dataStore.get('button').drawPaoX();
            this.dataStore.get('score').drawnonumber( 293, 510);
        }
        if (this.pointaiB === 1) {
            this.dataStore.get('button').drawPaoX();
            this.dataStore.get('score').drawnumber(1, 293, 512);
        }
        if (this.pointaiB === 2) {
            this.dataStore.get('button').drawPaoX();
            this.dataStore.get('score').drawnumber(2, 293, 512);
        }
    }

    pointA() {
        if (this.pointaiA === 3) {
            this.dataStore.get('button').drawPaoS();
            this.dataStore.get('score').drawnumber(3, 280, 115);
        }
        if (this.pointaiA === 1) {
            this.dataStore.get('button').drawPaoS();
            this.dataStore.get('score').drawnumber(1, 280, 115);
        }
        if (this.pointaiA === 2) {
            this.dataStore.get('button').drawPaoS();
            this.dataStore.get('score').drawnumber(2, 280, 115);
        }
    }


    upPoker() {
        Director.Shuffle(this.cards);//洗牌
        let playerA = this.cards.slice(0, 17);
        let playerB = this.cards.slice(17, 34);
        let playerC = this.cards.slice(34, 51);
        let last = this.cards.slice(51, 54);


        this.newCard1 = playerA;
        this.newCard2 = playerB;
        this.newCard3 = playerC;
        this.last = last;

        Director.sortCards(this.newCard1);
        Director.sortCards(this.newCard2);
        Director.sortCards(this.newCard3);

        let keydata = [].concat(this.newCard1);

        for (let i = 0; i < keydata.length; i++) {
            this.data.unshift(keydata[i]);
        }
        for (let i = 0; i < this.data.length; i++) {
            let num = this.data[i].toString();
            this.key.unshift(num);
        }
        this.keys = [].concat(this.key);

        let outcards = [];
        let multiple = 1;//倍数
        let Bottom_point = 3;//底分
        let arr_new = [];

        let isTurn = false;
        this.keysArr = this.dataStore.get('keys');
        for (let i = 0; i < this.keys.length; i++) {
            this.keysArr.push(new Poker(this.keys[i], i * 20, 0, 180, 3, false));//默认boolean值为false
            let data = {x: 8, y: 180 + i * 20, width: 100, height: 70};
            this.rectangleCardInfo.push(data);
        }

        let points = [{x: 145, y: 190, w: 170, h: 240},
            {x: 145, y: 260, w: 170, h: 310},
            {x: 145, y: 330, w: 170, h: 380},
            {x: 145, y: 400, w: 170, h: 450}
        ];

        let self = this;
        wx.onTouchStart(function (evt) {
                self.score = Position.getPoint(evt, points);
                let q = self.score;
                if (q !== undefined && isTurn === false) {
                    let repeat = 2;
                    let again = 2;
                    let i = setTimeout(function () {
                            if (repeat === 1) {
                                clearTimeout(i);
                            } else {
                                repeat--;
                                self.pointB();
                                let n = setTimeout(function () {
                                    self.dataStore.get('bg').drawRepeat(275, 495, 50, 70);
                                    clearTimeout(n);
                                }, 1000);
                            }
                        }
                        , 1500);

                    let j = setInterval(function () {
                        if (again === 1) {
                            clearInterval(j);
                        } else {
                            again--;
                            self.pointA();
                            let m = setInterval(function () {
                                self.dataStore.get('bg').drawRepeat(262, 100, 50, 70);
                                clearInterval(m);
                            }, 1000);
                        }
                    }, 3500);


                    setTimeout(function () {
                        if (q >= self.pointaiA && q >= self.pointaiB) {
                            self.dataStore.get('portrait').drawHuangkuangA();
                            self.dataStore.get('portrait').draw();
                            self.dataStore.get('portrait').drawdizhu1();
                            self.dataStore.get('portrait').drawA1();
                            self.dataStore.get('portrait').drawB1();

                            self.keys.splice(0, self.keys.length);
                            self.key.splice(0, self.key.length);
                            self.data.splice(0, self.data.length);
                            self.keysArr.splice(0, self.keysArr.length);
                            self.rectangleCardInfo.splice(0, self.rectangleCardInfo.length);

                            self.cxt.clearRect(8, 180, 120, 580);//仅仅重绘一个大矩形

                            let lastPoket = [];

                            self.newCard1 = playerA.concat(last);
                            self.newCard2 = playerB;
                            self.newCard3 = playerC;
                            Director.sortCards(self.newCard1);

                            self.GameRun.landlordID = 0;
                            self.playA.gameRole = 0;
                            self.playA.turnPutCards = true;
                            self.playA.isLimitState = false;
                            self.playB.gameRole = 1;
                            self.playC.gameRole = -1;
                            self.GameRun.computerFlag = false;

                            let index_data = Director.getindex(self.newCard1, last);

                            let keydata = [].concat(self.newCard1);
                            console.log(keydata);
                            for (let i = 0; i < keydata.length; i++) {
                                self.data.unshift(keydata[i]);
                            }
                            for (let i = 0; i < self.data.length; i++) {
                                let num = self.data[i].toString();//转换成字符串
                                self.key.unshift(num);
                            }
                            self.keys = [].concat(self.key);


                            let object_data = Director.getObject(self.keys, index_data);


                            for (let i = 0; i < self.keys.length; i++) {
                                self.keysArr.push(new Poker(self.keys[i], i * 20, 0, 180, 3, false));//默认boolean值为false
                                let data = {x: 8, y: 180 + i * 20, width: 100, height: 70};
                                self.rectangleCardInfo.push(data);

                            }


                            for (let i = 0; i < object_data.length; i++) {
                                lastPoket.push(new Poker(object_data[i], i * 15, 327, 277, 7, false));
                            }

                            lastPoket.forEach(evt => {
                                evt.draw();
                            });

                            self.keysArr.forEach(evt => {
                                evt.draw();
                            });

                            self.dataStore.get('score').drawword(363, 340, '倍数:', multiple);
                            self.dataStore.get('score').drawword(342, 340, '底分:', Bottom_point);

                        } else if (q < self.pointaiA && self.pointaiA >= self.pointaiB) {  //给电脑A
                            self.dataStore.get('portrait').drawHuangkuangB();
                            self.dataStore.get('portrait').draw();
                            self.dataStore.get('portrait').drawdizhu2();
                            self.dataStore.get('portrait').drawC1();
                            self.dataStore.get('portrait').drawB1();

                            let data = [];
                            let key = [];
                            let lastPoket = [];

                            self.newCard1 = playerA;
                            self.newCard2 = playerB.concat(last);
                            self.newCard3 = playerC;

                            self.GameRun.landlordID = 1;
                            self.playA.gameRole = -1;
                            self.playB.gameRole = 0;
                            self.playB.turnPutCards = true;
                            self.playB.isLimitState = false;
                            self.playC.gameRole = 1;
                            self.GameRun.computerFlag = true;


                            let keydata = [].concat(last);
                            for (let i = 0; i < keydata.length; i++) {
                                data.unshift(keydata[i]);
                            }
                            for (let i = 0; i < data.length; i++) {
                                let num = data[i].toString();//转换成字符串
                                key.unshift(num);
                            }

                            for (let i = 0; i < key.length; i++) {
                                lastPoket.push(new Poker(key[i], i * 15, 327, 277, 7, false));
                            }

                            lastPoket.forEach(evt => {
                                evt.draw();
                            });

                            self.dataStore.get('score').drawword(363, 340, '倍数:', multiple);
                            self.dataStore.get('score').drawword(342, 340, '底分:', Bottom_point);


                        } else if (q < self.pointaiB && self.pointaiA < self.pointaiB) {
                            self.dataStore.get('portrait').drawHuangkuangC();
                            self.dataStore.get('portrait').draw();
                            self.dataStore.get('portrait').drawdizhu3();
                            self.dataStore.get('portrait').drawA1();
                            self.dataStore.get('portrait').drawC1();

                            self.newCard1 = playerA;
                            self.newCard2 = playerB;
                            self.newCard3 = playerC.concat(last);

                            self.GameRun.landlordID = 2;
                            self.playA.gameRole = 1;
                            self.playB.gameRole = -1;
                            self.playC.gameRole = 0;
                            self.playC.turnPutCards = true;
                            self.playC.isLimitState = false;
                            self.GameRun.computerFlag = true;

                            let data = [];
                            let key = [];
                            let lastPoket = [];

                            let keydata = [].concat(last);
                            for (let i = 0; i < keydata.length; i++) {
                                data.unshift(keydata[i]);
                            }
                            for (let i = 0; i < data.length; i++) {
                                let num = data[i].toString();
                                key.unshift(num);
                            }

                            for (let i = 0; i < key.length; i++) {
                                lastPoket.push(new Poker(key[i], i * 15, 327, 277, 7, false));
                            }

                            lastPoket.forEach(evt => {
                                evt.draw();
                            });


                            self.dataStore.get('score').drawword(363, 340, '倍数:', multiple);
                            self.dataStore.get('score').drawword(342, 340, '底分:', Bottom_point);
                        }
                    }, 5000);


                    self.dataStore.get('button').drawGame();
                    isTurn = true;


                    self.playA.handCardData.sumCardsArray = self.GameRun.coversionCard.transformFlowerToNumber(self.newCard1);
                    self.playA.flowerCard = self.newCard1;


                    self.playB.handCardData.sumCardsArray = self.GameRun.coversionCard.transformFlowerToNumber(self.newCard2);
                    self.playB.flowerCard = self.newCard2;


                    self.playC.handCardData.sumCardsArray = self.GameRun.coversionCard.transformFlowerToNumber(self.newCard3);
                    self.playC.flowerCard = self.newCard3;


                    GameRun.setHandData(self.playA);
                    GameRun.setHandData(self.playB);
                    GameRun.setHandData(self.playC);
                    self.GameRun.toPlay(self.playA, self.playB, self.playC, self.GameRun, self);

                }
            }
        );


        wx.onTouchStart(function (evt) {
            if (self.rectangleCardInfo.length !== 0) {

                let p = Position.getEventPosition(evt, self.rectangleCardInfo);
                if (p !== undefined && isTurn === true) {

                    if (self.keysArr[p].boolean === false) {
                        let object = new Poker(self.keys[p], p * 20, 20, 180, 3, true);
                        Director.deleteindex(self.keysArr, p, object);
                        self.outcards_num.push(p);
                        self.dataStore.get('bg').drawRepeat(self.rectangleCardInfo[p].x, self.rectangleCardInfo[p].y, self.rectangleCardInfo[p].width, self.rectangleCardInfo[p].height);//仅仅重绘一个矩形区域
                        self.keysArr.forEach(evt => {
                            evt.draw();
                        });

                    } else if (self.keysArr[p].boolean === true) {
                        let object = new Poker(self.keys[p], p * 20, 0, 180, 3, false);
                        Director.deleteindex(self.keysArr, p, object);
                        Director.remove(self.outcards_num, p);
                        self.dataStore.get('bg').drawRepeat(self.rectangleCardInfo[p].x, self.rectangleCardInfo[p].y, self.rectangleCardInfo[p].width + 20, self.rectangleCardInfo[p].height);
                        self.keysArr.forEach(evt => {
                            evt.draw();
                        });
                    }

                }


                let b = Position.getPoint(evt, points);
                let k = [];
                let k2 = [];
                if (b !== undefined) {
                    if (b === 1) {
                        if (self.outcards_num.length !== 0) {
                            console.log(self.outcards_num);
                            let outobj = [];
                            for (let i = 0; i < self.outcards_num.length; i++) {
                                console.log(self.outcards_num[i]);
                                let p2 = self.outcards_num[i];
                                let object = new Poker(self.keys[p2], i * 10, 210, 230, 4, true);
                                outobj.push(object);
                            }
                            self.outcards = [].concat(Director.getkey(self.keys, self.outcards_num));

                            Director.remove_index(self.keys, self.outcards_num);
                            Director.remove_index(self.keysArr, self.outcards_num);
                            Director.remove_index(self.rectangleCardInfo, self.outcards_num);
                            Director.delArr(self.keys, null);
                            Director.delArr(self.keysArr, null);
                            Director.delArr(self.rectangleCardInfo, null);


                            self.dataStore.get('bg').drawRepeat(8, 180, 120, 580);
                            self.dataStore.get('bg').drawRepeat(218, 230, 75, 400);


                            for (let i = 0; i < self.keys.length; i++) {
                                k.unshift(self.keys[i]);
                            }
                            for (let i = 0; i < k.length; i++) {
                                let num = k[i].toString();
                                k2.unshift(num);
                            }
                            self.rectangleCardInfo.splice(0, self.rectangleCardInfo.length);//清空数组
                            arr_new.splice(0, arr_new.length);
                            self.outcards_num.splice(0, self.outcards_num.length);
                            self.keysArr.splice(0, self.keysArr.length);
                            self.keys.splice(0, self.keys.length);
                            for (let i = 0; i < k2.length; i++) {
                                self.keysArr.push(new Poker(k2[i], i * 20, 0, 180, 3, false));
                                let data = {x: 8, y: 180 + i * 20, width: 100, height: 70};
                                arr_new.push(data)
                            }
                            console.log(k2);
                            self.keys = [].concat(k2);
                            console.log(self.keys);
                            self.rectangleCardInfo = [].concat(arr_new);
                            console.log(self.rectangleCardInfo);
                            self.keysArr.forEach(evt => {
                                evt.draw();
                            });
                            console.log(self.keysArr);
                            self.sureBotton = 1;
                        }
                    }


                    if (b === 2) {
                        self.remindBotton = 1;
                    }


                    if (b === 3) {
                        console.log('重选');
                        for (let i = 0; i < outcards.length; i++) {
                            let p = outcards[i];
                            let object = new Poker(self.keys[p], p * 20, 0, 180, 3, false);
                            Director.deleteindex(self.keysArr, p, object);
                            self.dataStore.get('bg').drawRepeat(self.rectangleCardInfo[p].x, self.rectangleCardInfo[p].y, self.rectangleCardInfo[p].width + 20, self.rectangleCardInfo[p].height);//仅仅重绘一个矩形区域
                        }
                        outcards.splice(0, outcards.length);//清空
                        self.keysArr.forEach(evt => {
                            evt.draw();
                        });
                    }


                    if (b === 0) {
                        console.log('不出');
                        for (let i = 0; i < outcards.length; i++) {
                            let p = outcards[i];
                            let object = new Poker(self.keys[p], p * 20, 0, 180, 3, false);
                            Director.deleteindex(self.keysArr, p, object);
                            self.dataStore.get('bg').drawRepeat(self.rectangleCardInfo[p].x, self.rectangleCardInfo[p].y, self.rectangleCardInfo[p].width + 20, self.rectangleCardInfo[p].height);//仅仅重绘一个矩形区域
                        }
                        outcards.splice(0, outcards.length);//清空
                        self.keysArr.forEach(evt => {
                            evt.draw();
                        });

                        self.notBotton = 1;
                    }
                }
            } else {
                console.log('牌出完啦！');
            }
        });

    }


    static getkey(arr, arr2) {
        let key = [];
        for (let i = 0; i < arr2.length; i++) {
            key.push(arr[arr2[i]]);
        }
        return key;
    }


    static getindex(arr, arr2) {
        let index = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr2.length; j++) {
                if (arr2[j] === arr[i]) {
                    index.push(i);
                }
            }
        }
        return index;
    }


    static getObject(arr, arr2) {
        let object = [];
        for (let i = 0; i < arr2.length; i++) {
            object.push(arr[i]);
        }
        return object;
    }


    static remove(arr, val) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === val) {
                arr.splice(i, 1);
                break;
            }
        }
    }


    static delArr(arr, s) {
        let i = arr.length;
        while (i--) if (arr[i] === s) arr.splice(i, 1);
        return arr;

    }


    static remove_index(arr, arr1) {
        for (let i = 0; i < arr1.length; i++) {
            let index = arr1[i];
            arr.splice(index, 1, null);
        }
        return arr;
    }


    static deleteindex(arr, val, object) {//替换对象
        arr.splice(val, 1, object);
        return arr;
    }


    Imgdraw() {
        this.dataStore.get('keys').forEach(function (values) {//循环实现
            values.draw();
        });
    }

    handDown() {

        if (this.isWin) {
            this.dataStore.get('win').drawWin();
            this.dataStore.get('hand1').drawDown();
        } else {
            this.dataStore.get('lose').drawLose();
            this.dataStore.get('hand2').drawDown();
        }
        let self = this;
        setTimeout(function () {
            self.dataStore.get('bg').drawRepeat(135, 162, 182, 350);
            self.handUp();
        }, 100)

    }

    handUp() {
        let self = this;
        setTimeout(function () {

            self.dataStore.get('bg').drawRepeat(135, 162, 182, 350);
            self.handDown()
        }, 100);
        if (this.isWin) {
            this.dataStore.get('win').drawWin();
            this.dataStore.get('hand1').drawUp();
        } else {
            this.dataStore.get('lose').drawLose();
            this.dataStore.get('hand2').drawUp();
        }
    }

    run() {
        //开始界面
        this.dataStore.get('bg').draw();
        this.dataStore.get('logo').draw();
        this.dataStore.get('button').drawGameStart();
        this.dataStore.get('score').drawStart();
        let self = this;
        let repeat = 2;
        let i = setTimeout(function () {
                if (repeat === 1) {
                    clearTimeout(i);
                } else {
                    repeat--;
                    self.dataStore.get('bg').draw();
                    self.dataStore.get('portrait').draw();
                    self.upPoker();
                    self.Imgdraw();
                    self.dataStore.get('button').draw();
                    self.dataStore.get('button').drawPaikuang();
                }
            }
            , 3000);

    }
}