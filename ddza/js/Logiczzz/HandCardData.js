import {OutCardType} from "./OutCardType.js";
import {HandValue} from "./HandValue.js";
import {CardsType} from "./CardsType.js";

export class HandCardData {



    constructor() {
        this.canvas = wx.createCanvas();

        this.canvas.testCount=0;

        this.nHandCardsArray = [];


        this.aHandCardsArray = [];


        this.sumCardsArray = [];


        this.handCardsCount = 0;


        this.cardsType = new CardsType();


        this.putCardsType = new OutCardType();


        this.handCardValue = new HandValue();
    }


    clearNHandCardsArray() {

        if (this.nHandCardsArray.length !== 0) {
            this.nHandCardsArray;
            this.nHandCardsArray.splice(0, this.nHandCardsArray.length);
        }
    }



    getOutCardType(ctType, minCard, count) {
        const cardsType = new CardsType();
        let cardGroupData = new OutCardType();
        cardGroupData.cardsType = ctType;
        cardGroupData.nMinCard = minCard;
        cardGroupData.count = count;

        //不出牌类型
        if (ctType === cardsType.ctZero)
            cardGroupData.value = 0;

        //出一张牌
        else if (ctType === cardsType.ctSingle)
            cardGroupData.value = minCard - 10;

        //对牌类型
        else if (ctType === cardsType.ctDouble)
            cardGroupData.value = minCard - 10;

        //三条类型
        else if (ctType === cardsType.ctThree)
            cardGroupData.value = minCard - 10;

        //单连类型
        else if (ctType === cardsType.ctSingleLine)
            cardGroupData.value = minCard - 10 + 1;

        //对连类型
        else if (ctType === cardsType.ctDoubleLine)
            cardGroupData.value = minCard - 10 + 1;

        //三连类型
        else if (ctType === cardsType.ctThreeLine)
            cardGroupData.value = (minCard - 3 + 1) / 2;

        //三个带一个
        else if (ctType === cardsType.ctThreeTakeOne)
            cardGroupData.value = minCard - 10;

        //三个带两个
        else if (ctType === cardsType.ctThreeTakeTwo)
            cardGroupData.value = minCard - 10;

        //三个带一连
        else if (ctType === cardsType.ctThreeTakeOneLine)
            cardGroupData.value = (minCard - 3 + 1) / 2;

        //三个带一对连
        else if (ctType === cardsType.ctThreeTakeTwoLine)
            cardGroupData.value = (minCard - 3 + 1) / 2;

        //四个带两单
        else if (ctType === cardsType.ctFourTakeOnes)
            cardGroupData.value = (minCard - 3) / 2;

        //四个带一对
        else if (ctType === cardsType.ctFourTakeTwo)
            cardGroupData.value = (minCard - 3) / 2;

        //炸弹
        else if (ctType === cardsType.ctBomb)
            cardGroupData.value = minCard - 3 + 7;

        //王炸
        else if (ctType === cardsType.ctKing)
            cardGroupData.value = 20;

        //出牌类型错误
        else
            cardGroupData.value = 0;

        return cardGroupData;
    }




    getHandCardsValue(clsHandCardData) {

        clsHandCardData.clearNHandCardsArray();

        let uctHandCardValue = new HandValue();

        //回溯的出口
        if (clsHandCardData.handCardsCount === 0) {
            uctHandCardValue.sumValue = 0;
            uctHandCardValue.needRound = 0;

            return uctHandCardValue;
        }


        const uctOutCardType = this.ins_SurCardsType(clsHandCardData.aHandCardsArray);


        //这里也算是回溯的出口，因为可以将一手牌出完了
        if (uctOutCardType.cardsType !== this.cardsType.ctError &&
            uctOutCardType.cardsType !== this.cardsType.ctFourTakeOnes &&
            uctOutCardType.cardsType !== this.cardsType.ctFourTakeTwo) {

            uctHandCardValue.sumValue = uctOutCardType.value;
            uctHandCardValue.needRound = 1;

            return uctHandCardValue;
        }



        this.getPutCardList(clsHandCardData);

        let nowPutCardType={};
        nowPutCardType=this.deepClone(clsHandCardData.putCardsType,nowPutCardType);

        //实现数组间的深拷贝
        const nowPutCardArray = [].concat(clsHandCardData.nHandCardsArray);


        if (clsHandCardData.putCardsType=== this.cardsType.ctError) {
            console.log("出现错误");
        }

        //更改手牌中aHandCardsArray数组，为了就是给后面的回溯函数调用做准备
        for (let i = 0; i < nowPutCardArray.length; i++) {
            clsHandCardData.aHandCardsArray[nowPutCardArray[i]]--;
        }

        clsHandCardData.handCardsCount -= nowPutCardType.count;


        let tmp_SurValue = this.getHandCardsValue(clsHandCardData);


        for (let i = 0; i < nowPutCardArray.length; i++) {
            clsHandCardData.aHandCardsArray[nowPutCardArray[i]]++;
        }
        clsHandCardData.handCardsCount += nowPutCardType.count;



        uctHandCardValue.sumValue = nowPutCardType.value + tmp_SurValue.sumValue;
        uctHandCardValue.needRound = tmp_SurValue.needRound + 1;


        return uctHandCardValue;

    }


    ins_SurCardsType(array) {


        let nCount = 0;

        for (let i = 3; i < array.length; i++) {
            nCount += array[i];
        }

        let retCardGroupData = new OutCardType();
        retCardGroupData.count = nCount;
        //用于验证的变量
        let prov1 = 0;
        let prov2=0;
        let sumValue = 0;

        //单牌类型
        if (nCount === 1) {
            prov1 = 0;
            sumValue = 0;
            for (let i = 3; i < 18; i++) {
                if (array[i] === 1) {
                    sumValue = i - 10;
                    prov1++;
                    retCardGroupData.nMinCard = i;
                }
            }

            if (prov1 === 1) {
                retCardGroupData.cardsType = this.cardsType.ctSingle;
                retCardGroupData.value = sumValue;
                return retCardGroupData;
            }
        }

        //双牌类型
        if (nCount === 2) {
            prov1 = 0;
            sumValue = 0;
            for (let i = 3; i < 16; i++) {
                if (array[i] === 2) {
                    sumValue = i - 10;
                    prov1++;
                    retCardGroupData.nMinCard = i;
                }
            }

            if (prov1 === 1) {
                retCardGroupData.value = sumValue;
                retCardGroupData.cardsType = this.cardsType.ctDouble;
                return retCardGroupData;
            }
        }

        //三条类型
        if (nCount === 3) {
            sumValue = 0;
            prov1 = 0;
            for (let i = 3; i < 16; i++) {
                if (array[i] === 3) {
                    sumValue = i - 10;
                    prov1++;
                    retCardGroupData.nMinCard = i;
                }
            }
            if (prov1 === 1) {
                retCardGroupData.cardsType = this.cardsType.ctThree;
                retCardGroupData.value = sumValue;
                return retCardGroupData;
            }
        }

        //三带一单
        if (nCount === 4) {
            prov1 = 0;
            sumValue = 0;
            prov2 = 0;

            for (let i = 3; i < 18; i++) {
                if (array[i] === 3) {
                    sumValue = i - 10;
                    prov1++;
                    retCardGroupData.nMinCard = i;
                }

                if (array[i] === 1) {
                    prov2++;
                }

                if (prov1 === 1 && prov2 === 1) {
                    retCardGroupData.cardsType = this.cardsType.ctThreeTakeOne;
                    retCardGroupData.value = sumValue;
                    return retCardGroupData;
                }
            }
        }


        //三带一对
        if (nCount === 5) {
            prov1 = 0;
            prov2 = 0;
            sumValue = 0;

            for (let i = 3; i < 16; i++) {
                if (array[i] === 3) {
                    sumValue = i - 10;
                    retCardGroupData.nMinCard = i;
                    prov1++;
                }

                if (array[i] === 2) {
                    prov2 = 1;
                }
            }

            if (prov1 === 1 && prov2 === 1) {
                retCardGroupData.cardsType = this.cardsType.ctThreeTakeTwo;
                retCardGroupData.value = sumValue;
                return retCardGroupData;
            }
        }


        //四带两单
        if (nCount === 6) {
            prov1 = 0;
            prov2 = 0;
            sumValue = 0;
            for (let i = 3; i < 16; i++) {
                if (array[i] === 4) {
                    sumValue = (i - 3) / 2;
                    prov1++;
                    retCardGroupData.nMinCard = i;
                }

                //这个if语句写的也是十分巧妙了
                if (array[i] === 1 || array[i] === 2) {
                    prov2 += array[i];
                }

            }
            if (prov1 === 1 && prov2 === 2) {
                retCardGroupData.value = sumValue;
                retCardGroupData.cardsType = this.cardsType.ctFourTakeOnes;
                return retCardGroupData;
            }
        }

        //四带两对
        if (nCount === 8) {
            prov1 = 0;
            prov2 = 0;
            sumValue = 0;

            for (let i = 3; i < 16; i++) {
                if (array[i] === 4) {
                    sumValue = (i - 3) / 2 + 7;
                    retCardGroupData.nMinCard = i;
                    prov1++;
                }

                //我这里就没有考虑把两个炸弹拆成4带2出的，两个炸弹作为后面的炸弹情况考虑了
                if (array[i] === 2) {
                    prov2++;
                }
            }

            if (prov1 === 1 && prov2 === 2) {
                retCardGroupData.cardsType = this.cardsType.ctFourTakeTwo;
                retCardGroupData.value = sumValue;
                return retCardGroupData;
            }
        }

        //炸弹
        //因为可能有多个炸弹
        if (nCount /4) {
            prov1 = 0;
            sumValue = 0;
            for (let i = 3; i < 16; i++) {
                if (array[i] === 4) {
                    prov1++;

                    retCardGroupData.nMinCard = i;
                    sumValue = i - 3 + 7;
                }

                if (prov1 >= nCount/4) {
                    retCardGroupData.value = sumValue;
                    retCardGroupData.cardsType = this.cardsType.ctBomb;
                    return retCardGroupData;
                }
            }
        }

        //王炸
        if (nCount === 2) {
            sumValue = 0;
            if (array[17] > 0 && array[16] > 0) {
                sumValue = 20;
                retCardGroupData.cardsType = this.cardsType.ctKing;
                retCardGroupData.value = sumValue;
                return retCardGroupData;
            }
        }

        //单连类型
        if (nCount >= 5) {
            prov1 = 0;
            sumValue=0;
            let i;
            for ( i= 3; i < 15; i++) {
                if (array[i] === 1) {
                    prov1++;
                }


                else {
                   
                    if (prov1 !== 0) {
                        break;
                    }
                }
            }

            if (prov1 === nCount) {
                sumValue = i - 10;
                retCardGroupData.nMinCard = i - 1;
                retCardGroupData.cardsType = this.cardsType.ctSingleLine;
                retCardGroupData.value = sumValue;
                return retCardGroupData;
            }
        }

        //对连类型
        if (nCount >= 6) {
            prov1 = 0;
            sumValue = 0;
            let i;
            for (i = 3; i < 15; i++) {
                if (array[i] === 2) {
                    prov1++;
                } else {
                    if (prov1 !== 0) {
                        break;
                    }
                }
            }

            if (prov1 * 2 === nCount) {
                sumValue = i - 10;
                retCardGroupData.nMinCard = i - 1;
                retCardGroupData.cardsType = this.cardsType.ctDoubleLine;
                retCardGroupData.value = sumValue;
                return retCardGroupData;
            }
        }

        //三连类型
        if (nCount >= 6) {
            prov1 = 0;
            sumValue = 0;

            let i;
            for (i = 3; i < 15; i++) {
                if (array[i] === 3) {
                    prov1++;
                } else {
                    if (array[i] !== 0) {
                        break;
                    }
                }

            }

            if (prov1 * 3 === nCount) {

              //反正我觉得sumValue在进入三连类型之后。计算的都是有点问题的
                sumValue = (i - 3) / 2;
                retCardGroupData.nMinCard = i - 1;
                retCardGroupData.cardsType = this.cardsType.ctThreeLine;
                retCardGroupData.value = sumValue;
                return retCardGroupData;
            }
        }

        //三带一连模型
        if (nCount >= 8) {
            prov1 = 0;
            sumValue = 0;
            let i;
            for (i = 3; i < 15; i++) {
                if (array[i] >=3) {
                    prov1++;
                } else {
                    if (prov1 !== 0) {
                        break;
                    }
                }
            }

            if (prov1 * 4 === nCount) {
                sumValue = (i - 3) / 2;
                retCardGroupData.nMinCard = i - 1;
                retCardGroupData.cardsType = this.cardsType.ctThreeTakeOneLine;
                retCardGroupData.value = sumValue;
                return retCardGroupData;
            }
        }

        //三带两连模型
        if (nCount >= 10) {
            prov1 = 0;
            prov2 = 0;
            sumValue = 0;
            let i , j ;
            for (i = 3; i < 15; i++) {
                if (array[i] === 3) {
                    prov1++;
                } else {
                    if (prov1 !== 0) {
                        break;
                    }
                }
            }
            for (j = 3; j < 16; j++) {
                if (array[j] === 2) {
                    prov2++;
                }
            }

            if (prov1 === prov2 && prov1 * 5 === nCount) {
                sumValue = (i - 3) / 2;
                retCardGroupData.nMinCard = i - 1;
                retCardGroupData.cardsType = this.cardsType.ctThreeTakeTwoLine;
                retCardGroupData.value = sumValue;
                return retCardGroupData;
            }
        }

        //若以上情况都没有，证明无法将自己的牌一次性出出去
        retCardGroupData.cardsType = this.cardsType.ctError;
        return retCardGroupData;
    }


    conversionDataArray(array) {


        let conArray = new Array(array.length+1).fill(0);
        for (let i = 0; i < array.length; i++) {
            conArray[array[i]]++;
        }
        return conArray;
    }


    getPutCardList(clsHandCardData) {

        clsHandCardData.clearNHandCardsArray();

        const SurCardGroupData = this.ins_SurCardsType( clsHandCardData.aHandCardsArray);

        //能够将一手牌直接出去
        if (SurCardGroupData.cardsType !== this.cardsType.ctError) {
            this.putAllSurCards(this,SurCardGroupData);
            return;
        }



        //暂存最佳价值
        let bestHandCardValue = new HandValue();
        bestHandCardValue.needRound = 20;
        bestHandCardValue.sumValue = 0;
        //我们认为不出牌的话会让对手一个轮次，即权值减少7
        bestHandCardValue.needRound += 1;

        //暂存最佳组合
        let bestCardGroup = new OutCardType();

        //可能会带出去的牌
        let tmp_1 = 0, tmp_2 = 0, tmp_3 = 0, tmp_4 = 0;

        //临时的最佳权值
        let tmpHandCardValue = new HandValue();

        //第一策略：优先处理三牌，飞机等
        for (let i = 3; i < 16; i++) {

            //这里的版本是不会拆分炸弹的
            if (clsHandCardData.aHandCardsArray[i] === 3) {

                //出三带一
                if (clsHandCardData.aHandCardsArray[i] === 3) {
                    //找到了要出的三牌，将其从aHandCardsArray数组中移除
                    clsHandCardData.aHandCardsArray[i] -= 3;
                    clsHandCardData.handCardsCount-=3;
                    //然后找到一张适合被带出去的牌（我觉得的带太大的不好）
                    for (let j = 3; j < 14; j++) {
                        //其实我一开始写的是===1，但是发现有的时候把对子拆开也是可以的
                        if (clsHandCardData.aHandCardsArray[j]>0) {
                            //找到了合适的带出的牌
                            clsHandCardData.aHandCardsArray[j] -= 1;
                            //然后把手牌数量减4
                            clsHandCardData.handCardsCount -= 1;
                            tmpHandCardValue = this.getHandCardsValue(clsHandCardData);
                            //console.log("计算bestGroupCard,寻找最佳的出牌");
                            //计算了一种情况后，先回复到之前的状态，然后计算别的值
                            clsHandCardData.aHandCardsArray[j] += 1;
                            clsHandCardData.handCardsCount += 1;
                            //选取总权值-轮次*7值最高的策略  因为我们认为剩余的手牌需要n次控手的机会才能出完，
                            // 若轮次牌型很大（如炸弹） 则其-7的价值也会为正
                            if ((bestHandCardValue.sumValue - (bestHandCardValue.needRound * 7)) <= (tmpHandCardValue
                                .sumValue - (tmpHandCardValue.needRound * 7))) {
                                bestHandCardValue = tmpHandCardValue;
                                bestCardGroup = this.getOutCardType(this.cardsType.ctThreeTakeOne, i, 4);
                                tmp_1=j;
                            }
                        }
                    }
                    clsHandCardData.aHandCardsArray[i] += 3;
                    clsHandCardData.handCardsCount+=3;
                }

                //上面的if语句过了之后，要么没有三个，要么就是获得了一个新的bestCardGroup的牌组
                //出三带一对
                if (clsHandCardData.aHandCardsArray[i] === 3) {
                    //因为我觉得带一个太大的对子出去，不合理，所以这里将其范围减小
                    for (let j = 3; j < 13; j++) {
                        clsHandCardData.aHandCardsArray[i] -= 3;
                        clsHandCardData.handCardsCount-=3;
                        if (clsHandCardData.aHandCardsArray[j] === 2) {
                            clsHandCardData.aHandCardsArray[j] -= 2;
                            clsHandCardData.handCardsCount -= 2;
                            tmpHandCardValue = this.getHandCardsValue(clsHandCardData);
                            clsHandCardData.aHandCardsArray[j] += 2;
                            clsHandCardData.handCardsCount += 2;
                            if ((bestHandCardValue.sumValue - (bestHandCardValue.needRound * 7)) <= (tmpHandCardValue
                                .sumValue - (tmpHandCardValue.needRound * 7))) {
                                bestHandCardValue = tmpHandCardValue;
                                bestCardGroup = this.getOutCardType(this.cardsType.ctThreeTakeTwo, i, 5);
                                tmp_1 = j;
                            }
                        }
                        clsHandCardData.aHandCardsArray[i] += 3;
                        clsHandCardData.handCardsCount+=3;
                    }
                }

                //四带二单
                if (clsHandCardData.aHandCardsArray[i] > 3) {
                    //该策略中主动出牌不拆分炸弹
                }
                //四带两对
                if (clsHandCardData.aHandCardsArray[i] > 3) {
                    //该策略中主动出牌不拆分炸弹
                }
                //三带一单连
                /*
                 * 其实这里的 i j 相当于飞机中的首和尾
                 * 例如：444 555 666 777 在这里：i=4;j=7;
                 * 所以说，i,j的作用域也是非常大的
                 */
                if (clsHandCardData.aHandCardsArray[i] > 2) {
                    let prov = 0;
                    for (let j = i; j < 15; j++) {
                        if (clsHandCardData.aHandCardsArray[j] > 2) {
                            prov++;
                        } else {
                            break;
                        }

                        //为两连飞机
                        if (prov === 2) {
                            for (let k = i; k <= j; k++) {
                                clsHandCardData.aHandCardsArray[k] -= 3;
                            }
                            clsHandCardData.handCardsCount -= prov * 4;
                            for (let tmp1 = 3; tmp1 < 18; tmp1++) {

                                if (clsHandCardData.aHandCardsArray[tmp1] > 0) {

                                    clsHandCardData.aHandCardsArray[tmp1] -= 1;
                                    for (let tmp2 = tmp1; tmp2 < 18; tmp2++) {

                                        if (clsHandCardData.aHandCardsArray[tmp2] > 0) {

                                            clsHandCardData.aHandCardsArray[tmp2] -= 1;
                                            tmpHandCardValue = this.getHandCardsValue(clsHandCardData);
                                            if ((bestHandCardValue.sumValue - (bestHandCardValue.needRound * 7)) <= (tmpHandCardValue
                                                .sumValue - (tmpHandCardValue.needRound * 7))) {

                                                bestHandCardValue = tmpHandCardValue;
                                                //这里的nMinCards是j
                                                bestCardGroup = this.getOutCardType(this.cardsType.ctThreeTakeOneLine, j, 4);
                                                tmp_1 = tmp1;
                                                tmp_2 = tmp2;
                                            }
                                            clsHandCardData.aHandCardsArray[tmp2] += 1;
                                        }

                                    }
                                    clsHandCardData.aHandCardsArray[tmp1] += 1;
                                }
                            }
                            for (let k = i; k <= j; k++) {
                                clsHandCardData.aHandCardsArray[k] += 3;
                            }
                            clsHandCardData.handCardsCount += prov * 4;
                        }

                        //为三连飞机
                        if (prov === 3) {
                            /*
                             * 这里已经把所有 有三张牌的都移除了，
                             * 所以不用担心后面选择只有一张牌的时候，会选择到他们
                             */
                            for (let k = i; k <= j; k++) {
                                clsHandCardData.aHandCardsArray[k] -= 3;
                            }
                            clsHandCardData.handCardsCount -= prov * 4;
                            for (let tmp1 = 3; tmp1 < 18; tmp1++) {
                                if (clsHandCardData.aHandCardsArray[tmp1] > 0) {
                                    clsHandCardData.aHandCardsArray[tmp1] -= 1;
                                    for (let tmp2 = tmp1; tmp2 < 18; tmp2++) {
                                        if (clsHandCardData.aHandCardsArray[tmp2] > 0) {
                                            clsHandCardData.aHandCardsArray[tmp2] -= 1;
                                            for (let tmp3 = tmp2; tmp3 < 18; tmp3++) {
                                                if (clsHandCardData.aHandCardsArray[tmp3] > 0) {
                                                    clsHandCardData.aHandCardsArray[tmp3] -= 1;

                                                    tmpHandCardValue = this.getHandCardsValue(clsHandCardData);
                                                    if ((bestHandCardValue.sumValue - (bestHandCardValue.needRound * 7))
                                                        <= (tmpHandCardValue.sumValue - (tmpHandCardValue.needRound * 7))) {

                                                        bestHandCardValue = tmpHandCardValue;
                                                        bestCardGroup = this.getOutCardType(this.cardsType.ctThreeTakeOneLine, j, prov * 4);
                                                        tmp_1 = tmp1;
                                                        tmp_2 = tmp2;
                                                        tmp_3 = tmp3;

                                                    }
                                                    clsHandCardData.aHandCardsArray[tmp3] += 1;
                                                }
                                            }
                                            clsHandCardData.aHandCardsArray[tmp2] += 1;
                                        }
                                    }
                                    clsHandCardData.aHandCardsArray[tmp1] += 1;
                                }
                            }
                            for (let k = i; k <= j; k++) {
                                clsHandCardData.aHandCardsArray[k] += 3;
                            }
                            clsHandCardData.handCardsCount += prov * 4;
                        }

                        //为四连飞机
                        if (prov === 4) {
                            for (let k = i; k <= j; k++) {
                                clsHandCardData.aHandCardsArray[k] -= 3;
                            }
                            clsHandCardData.handCardsCount -= prov * 4;
                            for (let tmp1 = 3; tmp1 < 18; tmp1++) {
                                if (clsHandCardData.aHandCardsArray[tmp1] > 0) {
                                    clsHandCardData.aHandCardsArray[tmp1] -= 1;
                                    for (let tmp2 = tmp1; tmp2 < 18; tmp2++) {
                                        if (clsHandCardData.aHandCardsArray[tmp2] > 0) {
                                            clsHandCardData.aHandCardsArray[tmp2] -= 1;
                                            for (let tmp3 = tmp2; tmp3 < 18; tmp3++) {
                                                if (clsHandCardData.aHandCardsArray[tmp3] > 0) {
                                                    clsHandCardData.aHandCardsArray[tmp3] -= 1;
                                                    for (let tmp4 = tmp3; tmp4 < 18; tmp4++) {
                                                        if (clsHandCardData.aHandCardsArray[tmp4] > 0) {
                                                            clsHandCardData.aHandCardsArray[tmp4] -= 1;
                                                            tmpHandCardValue = this.getHandCardsValue(clsHandCardData);
                                                            if ((bestHandCardValue.sumValue - (bestHandCardValue.needRound * 7))
                                                                <= (tmpHandCardValue.sumValue - (tmpHandCardValue.needRound * 7))) {
                                                                bestHandCardValue = tmpHandCardValue;
                                                                bestCardGroup = this.getOutCardType(this.cardsType.ctThreeTakeOneLine, j, prov * 4);
                                                                tmp_1 = tmp1;
                                                                tmp_2 = tmp2;
                                                                tmp_3 = tmp3;
                                                                tmp_4 = tmp4;
                                                            }
                                                            clsHandCardData.aHandCardsArray[tmp4] += 1;
                                                        }
                                                    }
                                                    clsHandCardData.aHandCardsArray[tmp3] += 1;
                                                }
                                            }
                                            clsHandCardData.aHandCardsArray[tmp2] += 1;
                                        }
                                    }
                                    clsHandCardData.aHandCardsArray[tmp1] += 1;
                                }
                            }
                            for (let k = i; k <= j; k++) {
                                clsHandCardData.aHandCardsArray[k] += 3;
                            }
                            clsHandCardData.handCardsCount += prov * 4;
                        }

                        //若prov==5的话，在一次性可以出20张牌，可以一次性走了
                    }
                }

                //三带一双连
                if (clsHandCardData.aHandCardsArray[i] > 2) {
                    let prov = 0;
                    for (let j = i; j < 15; j++) {
                        if (clsHandCardData.aHandCardsArray[j] > 2) {
                            prov++;
                        } else {
                            break;
                        }

                        //两连飞机
                        if (prov === 2) {
                            for (let k = i; k <= j; k++) {
                                clsHandCardData.aHandCardsArray[k] -= 3;
                            }
                            clsHandCardData.handCardsCount -= prov * 5;

                            for (let tmp1 = 3; tmp1 < 16; tmp1++) {
                                if (clsHandCardData.aHandCardsArray[tmp1] > 1) {
                                    clsHandCardData.aHandCardsArray[tmp1] -= 2;
                                    for (let tmp2 = tmp1; tmp2 < 16; tmp2++) {
                                        if (clsHandCardData.aHandCardsArray[tmp2] > 1) {
                                            clsHandCardData.aHandCardsArray[tmp2] -= 2;
                                            tmpHandCardValue = this.getHandCardsValue(clsHandCardData);
                                            if ((bestHandCardValue.sumValue - (bestHandCardValue.needRound * 7))
                                                <= (tmpHandCardValue - (tmpHandCardValue.needRound * 7))) {
                                                bestHandCardValue = tmpHandCardValue;
                                                bestCardGroup = this.getOutCardType(this.cardsType.ctThreeTakeTwoLine, j, prov * 5);
                                                tmp_1 = tmp1;
                                                tmp_2 = tmp2;
                                            }
                                            clsHandCardData.aHandCardsArray[tmp2] += 2;
                                        }

                                    }
                                    clsHandCardData.aHandCardsArray[tmp1] += 2;
                                }
                            }
                            for (let k = i; k <= j; k++) {
                                clsHandCardData.aHandCardsArray[k] += 3;
                            }
                            clsHandCardData.handCardsCount += prov * 5;
                        }

                        //三连飞机
                        if (prov === 3) {
                            for (let k = i; k <= j; j++) {
                                clsHandCardData.aHandCardsArray[k] -= 3;
                            }
                            clsHandCardData.handCardsCount -= prov * 5;
                            for (let tmp1 = 3; tmp1 < 16; tmp1++) {
                                if (clsHandCardData.aHandCardsArray[tmp1] > 1) {
                                    clsHandCardData.aHandCardsArray[tmp1] -= 2;
                                    for (let tmp2 = tmp1; tmp2 < 16; tmp2++) {
                                        if (clsHandCardData.aHandCardsArray[tmp2] > 1) {
                                            clsHandCardData.aHandCardsArray[tmp2] -= 2;
                                            for (let tmp3 = tmp2; tmp3 < 16; tmp3++) {
                                                if (clsHandCardData.aHandCardsArray[tmp3] > 1) {
                                                    clsHandCardData.aHandCardsArray[tmp3] -= 2;
                                                    tmpHandCardValue = this.getHandCardsValue(clsHandCardData);
                                                    if ((bestHandCardValue.sumValue - (bestHandCardValue.needRound * 7))
                                                        <= (tmpHandCardValue - (tmpHandCardValue.needRound * 7))) {
                                                        bestHandCardValue = tmpHandCardValue;
                                                        bestCardGroup = this.getOutCardType(this.cardsType.ctThreeTakeTwoLine, j, prov * 5);
                                                        tmp_1 = tmp1;
                                                        tmp_2 = tmp2;
                                                        tmp_3 = tmp3;
                                                    }
                                                    clsHandCardData.aHandCardsArray[tmp3] += 2;
                                                }
                                            }
                                            clsHandCardData.aHandCardsArray[tmp2] += 2;
                                        }
                                    }
                                    clsHandCardData.aHandCardsArray[tmp1] += 2;
                                }
                            }
                            for (let k = i; k <= j; k++) {
                                clsHandCardData.aHandCardsArray[k] += 3;
                            }
                            clsHandCardData.handCardsCount += prov * 5;
                        }

                        //若prov===4，是地主就可以直接出去了
                    }
                }

            }
        }
        /*
         * 这部分的出牌放到循环外面,因为这里会枚举所有出牌类型
         * 如果没有上面的出牌，下面的if也不会执行
         * 因为是放在后面，所以不像出单个一样。这个是会将所有的牌都遍历后
         * 去判断最好的是出牌的三个是什么
         */
        if (bestCardGroup.cardsType === this.cardsType.ctThreeTakeOne) {
            clsHandCardData.clearNHandCardsArray();
            clsHandCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
            clsHandCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
            clsHandCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
            clsHandCardData.nHandCardsArray.push(tmp_1);
            clsHandCardData.putCardsType = bestCardGroup;
            return;

        }
        else if (bestCardGroup.cardsType === this.cardsType.ctThreeTakeTwo) {
            clsHandCardData.clearNHandCardsArray();
            clsHandCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
            clsHandCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
            clsHandCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
            clsHandCardData.nHandCardsArray.push(tmp_1);
            clsHandCardData.nHandCardsArray.push(tmp_1);
            clsHandCardData.putCardsType = bestCardGroup;
            return;
        }
        /*
         * 我是觉得这个里的判断是有问题的
         * 问题就在这个for循环这里。j的初始值计算是错误的
         * 还得注意一个问题，在三连出牌中，nMinCard是最大的一个数
         * 例如：333 444 555 中nMinCard是5
         * 对于顺子和飞机来说，nMinCard是最大的那个数
        */
        else if (bestCardGroup.cardsType === this.cardsType.ctThreeTakeOneLine) {
            clsHandCardData.clearNHandCardsArray();
            for (let j = bestCardGroup.nMinCard - (bestCardGroup.count / 4) + 1; j <= bestCardGroup.nMinCard; j++) {
                clsHandCardData.nHandCardsArray.push(j);
                clsHandCardData.nHandCardsArray.push(j);
                clsHandCardData.nHandCardsArray.push(j);

            }
            //两连
            if (bestCardGroup.count / 4 === 2) {
                clsHandCardData.nHandCardsArray.push(tmp_1);
                clsHandCardData.nHandCardsArray.push(tmp_2);
            }
            //三连
            else if (bestCardGroup.count / 4 === 3) {
                clsHandCardData.nHandCardsArray.push(tmp_1);
                clsHandCardData.nHandCardsArray.push(tmp_2);
                clsHandCardData.nHandCardsArray.push(tmp_3);
            }
            //四连
            else if (bestCardGroup.count / 4 === 4) {
                clsHandCardData.nHandCardsArray.push(tmp_1);
                clsHandCardData.nHandCardsArray.push(tmp_2);
                clsHandCardData.nHandCardsArray.push(tmp_3);
                clsHandCardData.nHandCardsArray.push(tmp_4);
            }
            //如果都没有的话，证明没有带牌出去，仅仅出了个飞机
            clsHandCardData.putCardsType = bestCardGroup;
            return;
        }
        else if (bestCardGroup.cardsType === this.cardsType.ctThreeTakeTwoLine) {
            clsHandCardData.clearNHandCardsArray();
            for (let j = bestCardGroup.nMinCard - (bestCardGroup.count / 5) + 1; j <= bestCardGroup.nMinCard; j++) {
                clsHandCardData.nHandCardsArray.push(j);
                clsHandCardData.nHandCardsArray.push(j);
                clsHandCardData.nHandCardsArray.push(j);
            }
            if (bestCardGroup.count / 5 === 2) {
                clsHandCardData.nHandCardsArray.push(tmp_1);
                clsHandCardData.nHandCardsArray.push(tmp_1);
                clsHandCardData.nHandCardsArray.push(tmp_2);
                clsHandCardData.nHandCardsArray.push(tmp_2);
            } else if (bestCardGroup.count / 5 === 3) {
                clsHandCardData.nHandCardsArray.push(tmp_1);
                clsHandCardData.nHandCardsArray.push(tmp_1);
                clsHandCardData.nHandCardsArray.push(tmp_2);
                clsHandCardData.nHandCardsArray.push(tmp_2);
                clsHandCardData.nHandCardsArray.push(tmp_3);
                clsHandCardData.nHandCardsArray.push(tmp_3);
            }
            //同理，如果没有选择的话，证明没有带牌
            clsHandCardData.putCardsType = bestCardGroup;
            return;
        }

        //第二策略：次之的策略是当前价值最低的牌，现在不用考虑这个牌是否会被三牌带出
        //如果第一策略没有出牌的话，那优先处理当前最小的一张牌
        for (let i = 3; i < 16; i++) {
            if (clsHandCardData.aHandCardsArray[i] !== 0 && clsHandCardData.aHandCardsArray[i] !== 4) {

                //出单牌
                /* 可以看到判断的条件不是===1,而是>0,这个意味着可能对子也会被当成单牌出
                 * 好处是可以得到更多的权值，但是其实是不是也太浪费时间了
                 * 因为毕竟上把对牌拆分成单个出的情况蛮少
                */
                if (clsHandCardData.aHandCardsArray[i] === 1) {
                    clsHandCardData.aHandCardsArray[i] -= 1;
                    clsHandCardData.handCardsCount--;
                    tmpHandCardValue = this.getHandCardsValue(clsHandCardData);
                    clsHandCardData.aHandCardsArray[i] += 1;
                    clsHandCardData.handCardsCount++;
                    if ((bestHandCardValue.sumValue - (bestHandCardValue.needRound * 7))
                        <= (tmpHandCardValue.sumValue - (tmpHandCardValue.needRound * 7))) {
                        bestHandCardValue = tmpHandCardValue;
                        bestCardGroup = this.getOutCardType(this.cardsType.ctSingle, i, 1);
                    }
                }

                //出对牌
                /*
                 * 博主写的条件是 >1，但是我觉得还是写===2好
                 * 经过测试，我觉得还是就写成 >1 比较好
                 */
                if (clsHandCardData.aHandCardsArray[i] > 1) {
                    //尝试打出对牌计算剩余手牌价值
                    clsHandCardData.aHandCardsArray[i] -= 2;
                    clsHandCardData.handCardsCount -= 2;
                    tmpHandCardValue = this.getHandCardsValue(clsHandCardData);
                    clsHandCardData.aHandCardsArray[i] += 2;
                    clsHandCardData.handCardsCount += 2;
                    if ((bestHandCardValue.sumValue - (bestHandCardValue.needRound * 7))
                        <= (tmpHandCardValue.sumValue - (tmpHandCardValue.needRound * 7))) {
                        bestHandCardValue = tmpHandCardValue;
                        bestCardGroup = this.getOutCardType(this.cardsType.ctDouble, i, 2);
                    }
                }

                //出三牌
                if (clsHandCardData.aHandCardsArray[i] > 2) {
                    clsHandCardData.aHandCardsArray[i] -= 3;
                    clsHandCardData.handCardsCount -= 3;
                    tmpHandCardValue = this.getHandCardsValue(clsHandCardData);
                    clsHandCardData.aHandCardsArray[i] += 3;
                    clsHandCardData.handCardsCount += 3;
                    if ((bestHandCardValue.sumValue - (bestHandCardValue.needRound * 7))
                        <= (tmpHandCardValue.sumValue - (tmpHandCardValue.needRound * 7))) {
                        bestHandCardValue = tmpHandCardValue;
                        bestCardGroup = this.getOutCardType(this.cardsType.ctThree, i, 3);
                    }
                }

                //出单顺
                if (clsHandCardData.aHandCardsArray[i] > 0) {
                    let prov = 0;
                    for (let j = i; j < 15; j++) {
                        //我觉得这里写成 >0 就是很有必要的，因为有时候为了凑成顺子，需要对子拆开
                        if (clsHandCardData.aHandCardsArray[j] > 0) {
                            prov++;
                        } else {
                            break;
                        }
                        if (prov >= 5) {
                            for (let k = i; k <= j; k++) {
                                clsHandCardData.aHandCardsArray[k]--;
                            }
                            clsHandCardData.handCardsCount -= prov;
                            tmpHandCardValue = this.getHandCardsValue(clsHandCardData);
                            for (let k = i; k <= j; k++) {
                                clsHandCardData.aHandCardsArray[k]++;
                            }
                            clsHandCardData.handCardsCount += prov;
                            if ((bestHandCardValue.sumValue - (bestHandCardValue.needRound * 7))
                                <= (tmpHandCardValue.sumValue - (tmpHandCardValue.needRound * 7))) {
                                bestHandCardValue = tmpHandCardValue;
                                bestCardGroup = this.getOutCardType(this.cardsType.ctSingleLine, j, prov);
                            }
                        }
                    }
                }

                //出双顺
                if (clsHandCardData.aHandCardsArray[i] > 1) {
                    let prov = 0;
                    for (let j = i; j < 15; j++) {
                        if (clsHandCardData.aHandCardsArray[j] > 1) {
                            prov++;
                        } else {
                            break;
                        }
                        if (prov >= 3) {
                            for (let k = i; k <= j; k++) {
                                clsHandCardData.aHandCardsArray[k] -= 2;
                            }
                            clsHandCardData.handCardsCount -= prov * 2;
                            tmpHandCardValue = this.getHandCardsValue(clsHandCardData);
                            for (let k = i; k <= j; k++) {
                                clsHandCardData.aHandCardsArray[k] += 2;
                            }
                            clsHandCardData.handCardsCount += prov * 2;
                            if ((bestHandCardValue.sumValue - (bestHandCardValue.needRound * 7))
                                <= (tmpHandCardValue.sumValue - (tmpHandCardValue.needRound * 7))) {
                                bestHandCardValue = tmpHandCardValue;
                                bestCardGroup = this.getOutCardType(this.cardsType.ctDoubleLine, j, prov * 2);
                            }
                        }
                    }
                }

                //出三顺
                if (clsHandCardData.aHandCardsArray[i] > 2) {
                    let prov = 0;
                    for (let j = i; j < 15; j++) {
                        if (clsHandCardData.aHandCardsArray[i] > 2) {
                            prov++;
                        } else {
                            break;
                        }
                        if (prov >= 2) {
                            for (let k = i; k <= j; k++) {
                                clsHandCardData.aHandCardsArray[k] -= 3;
                            }
                            clsHandCardData.handCardsCount -= prov * 3;
                            tmpHandCardValue = this.getHandCardsValue(clsHandCardData);
                            for (let k = i; k <= j; k++) {
                                clsHandCardData.aHandCardsArray[k] += 3;
                            }
                            clsHandCardData.handCardsCount += prov * 3;
                            if ((bestHandCardValue.sumValue - (bestHandCardValue.needRound * 7))
                                <= (tmpHandCardValue.sumValue - (tmpHandCardValue.needRound * 7))) {
                                bestHandCardValue = tmpHandCardValue;
                                bestCardGroup = this.getOutCardType(this.cardsType.ctThreeLine, j, prov * 3);
                            }
                        }
                    }
                }

                /*
                 * 将处理放在if之内，也就是说，此时必然会返回一个值
                 * 还有，如果发现出3可以的话，就不会去判断4了
                 * 因为他放在if之内
                 * i一旦确定了一个数据后，就会执行下面的if语句，而且就是直接return了
                 */
                if (bestCardGroup.cardsType === this.cardsType.ctError) {
                    console.log("出现了一次错误牌，原因未知");
                }
                else if (bestCardGroup.cardsType === this.cardsType.ctSingle) {
                    clsHandCardData.clearNHandCardsArray();
                    clsHandCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
                    clsHandCardData.putCardsType = bestCardGroup;
                }
                else if (bestCardGroup.cardsType === this.cardsType.ctDouble) {
                    clsHandCardData.clearNHandCardsArray();
                    clsHandCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
                    clsHandCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
                    clsHandCardData.putCardsType = bestCardGroup;
                }
                else if (bestCardGroup.cardsType === this.cardsType.ctThree) {
                    clsHandCardData.clearNHandCardsArray();
                    clsHandCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
                    clsHandCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
                    clsHandCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
                    clsHandCardData.putCardsType = bestCardGroup;
                }
                else if (bestCardGroup.cardsType === this.cardsType.ctSingleLine) {
                    clsHandCardData.clearNHandCardsArray();
                    for (let j = bestCardGroup.nMinCard - bestCardGroup.count + 1; j <= bestCardGroup.nMinCard; j++) {
                        clsHandCardData.nHandCardsArray.push(j);
                    }
                    clsHandCardData.putCardsType = bestCardGroup;
                }
                else if (bestCardGroup.cardsType === this.cardsType.ctDoubleLine) {
                    clsHandCardData.clearNHandCardsArray();
                    for (let j = bestCardGroup.nMinCard - (bestCardGroup.count / 2) + 1; j <= bestCardGroup.nMinCard; j++) {
                        clsHandCardData.nHandCardsArray.push(j);
                        clsHandCardData.nHandCardsArray.push(j);
                    }
                    clsHandCardData.putCardsType = bestCardGroup;
                }
                return;
            }
        }

        //第三策略：如果没有3-2的非炸牌，则看看有没有单王
        if (clsHandCardData.aHandCardsArray[16] === 1 && clsHandCardData.aHandCardsArray[17] === 0) {
            clsHandCardData.clearNHandCardsArray();
            clsHandCardData.nHandCardsArray.push(16);
            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctSingle, 16, 1);
        }
        else if (clsHandCardData.aHandCardsArray[16] === 0 && clsHandCardData.aHandCardsArray[17] === 1) {
            clsHandCardData.clearNHandCardsArray();
            clsHandCardData.nHandCardsArray.push(17);
            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctSingle, 17, 1);
        }


        //第四策略：单王没有，出炸弹
        for (let i = 3; i < 16; i++) {

            if(clsHandCardData.aHandCardsArray[i]===4){
                clsHandCardData.clearNHandCardsArray();
                clsHandCardData.nHandCardsArray.push(i);
                clsHandCardData.nHandCardsArray.push(i);
                clsHandCardData.nHandCardsArray.push(i);
                clsHandCardData.nHandCardsArray.push(i);
                clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctBomb, i, 4);
                return;
            }
        }

        //王炸策略
        if (clsHandCardData.nHandCardsArray[17] > 0 && clsHandCardData.nHandCardsArray[16] > 0) {
            clsHandCardData.nHandCardsArray.push(16);
            clsHandCardData.nHandCardsArray.push(17);
            clsHandCardData.putCardsType=this.cardsType.ctKing;
            return;
        }
        //异常错误
        clsHandCardData.putCardsType = this.getOutCardType(this.cardsType.ctError, 0, 0);
        return;
    }


    getPutCardListLimit(clsGameSituation,clsHandCardData){


        clsHandCardData.clearNHandCardsArray();



        let surCardGroupData=this.ins_SurCardsType(clsHandCardData.aHandCardsArray);
        if(surCardGroupData.cardsType!==this.cardsType.ctError){
            if(surCardGroupData.cardsType===clsGameSituation.uctNowOutCardType.cardsType &&
                surCardGroupData.nMinCard>clsGameSituation.uctNowOutCardType.nMinCard &&
                surCardGroupData.count===clsGameSituation.uctNowOutCardType.count){
                this.putAllSurCards(this,surCardGroupData);
                return ;
            }
            else if(surCardGroupData.cardsType===this.cardsType.ctKing ||
                surCardGroupData.cardsType===this.cardsType.ctBomb){
                this.putAllSurCards(this,surCardGroupData);
                return ;
            }
        }




        let bestHandCardValue=this.getHandCardsValue(clsHandCardData);

        let tmpHandCardValue=new HandValue();

        bestHandCardValue.needRound+=1;

        let bestMaxCard=0;

        let putCards=false;

        let prov=0;

        let start_i=0;

        let end_i=0;

        let length=clsGameSituation.uctNowOutCardType.count;

        let tmp_1=0,tmp_2=0,tmp_3=0,tmp_4=0;


        if(clsGameSituation.uctNowOutCardType.cardsType===this.cardsType.ctSingle){

            putCards=false;

            for(let i=clsGameSituation.uctNowOutCardType.nMinCard+1;i<18;i++){
                if(clsHandCardData.aHandCardsArray[i]>0){

                    clsHandCardData.aHandCardsArray[i]-=1;
                    clsHandCardData.handCardsCount--;
                    tmpHandCardValue=this.getHandCardsValue(clsHandCardData);
                    clsHandCardData.aHandCardsArray[i]+=1;
                    clsHandCardData.handCardsCount++;


                    if((bestHandCardValue.sumValue-(bestHandCardValue.needRound*7))
                        <=(tmpHandCardValue.sumValue-(tmpHandCardValue.needRound*7))){
                        bestHandCardValue=tmpHandCardValue;
                        bestMaxCard=i;
                        putCards=true;
                    }
                }
            }
            if(putCards){
                clsHandCardData.clearNHandCardsArray();
                clsHandCardData.nHandCardsArray.push(bestMaxCard);
                clsHandCardData.putCardsType=clsGameSituation.uctNowOutCardType
                    =this.getOutCardType(this.cardsType.ctSingle,bestMaxCard,1);
                return;
            }

        }


        else if(clsGameSituation.uctNowOutCardType.cardsType===this.cardsType.ctDouble){

            putCards=false;

            for(let i=clsGameSituation.uctNowOutCardType.nMinCard+1;i<16;i++){
                if(clsHandCardData.aHandCardsArray[i]>1){

                    clsHandCardData.aHandCardsArray[i]-=2;
                    clsHandCardData.handCardsCount-=2;
                    tmpHandCardValue=this.getHandCardsValue(clsHandCardData);
                    clsHandCardData.aHandCardsArray[i]+=2;
                    clsHandCardData.handCardsCount+=2;


                    if((bestHandCardValue.sumValue-(bestHandCardValue.needRound*7))
                        <=(tmpHandCardValue.sumValue-(tmpHandCardValue.needRound*7))){
                        bestHandCardValue=tmpHandCardValue;
                        bestMaxCard=i;

                        putCards=true;
                    }
                }
            }
            if(putCards) {
                clsHandCardData.clearNHandCardsArray();
                clsHandCardData.nHandCardsArray.push(bestMaxCard);
                clsHandCardData.nHandCardsArray.push(bestMaxCard);
                clsHandCardData.putCardsType = clsGameSituation.uctNowOutCardType
                    = this.getOutCardType(this.cardsType.ctDouble, bestMaxCard, 2);
                return;
            }

            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctZero,0,0);
            return;
        }


        else if(clsGameSituation.uctNowOutCardType.cardsType===this.cardsType.ctThree){

            putCards=false;

            for(let i=clsGameSituation.uctNowOutCardType.nMinCard+1;i<16;i++){
                if(clsHandCardData.aHandCardsArray[i]===3){


                    clsHandCardData.aHandCardsArray[i]-=3;
                    clsHandCardData.handCardsCount-=3;
                    tmpHandCardValue=this.getHandCardsValue(clsHandCardData);
                    clsHandCardData.aHandCardsArray[i]+=3;
                    clsHandCardData.handCardsCount+=3;

                    if((bestHandCardValue.sumValue-(bestHandCardValue.needRound*7))
                        <=(tmpHandCardValue.sumValue-(tmpHandCardValue.needRound*7))){
                        bestHandCardValue=tmpHandCardValue;
                        bestMaxCard=i;
                        putCards=true;
                    }
                }
            }
            if(putCards){
                clsHandCardData.clearNHandCardsArray();
                clsHandCardData.nHandCardsArray.push(bestMaxCard);
                clsHandCardData.nHandCardsArray.push(bestMaxCard);
                clsHandCardData.nHandCardsArray.push(bestMaxCard);
                clsHandCardData.putCardsType=clsGameSituation.uctNowOutCardType
                    =this.getOutCardType(this.cardsType.ctThree,bestMaxCard,3);
                return;
            }

            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctZero,0,0);
            return;
        }


        else if(clsGameSituation.uctNowOutCardType.cardsType===this.cardsType.ctSingleLine){

            putCards=false;

            for(let i=clsGameSituation.uctNowOutCardType.nMinCard-length+2;i<15;i++){
                if(clsHandCardData.aHandCardsArray[i]>0){
                    prov++;
                }
                else{
                    prov=0;
                }

                if(prov>=length){
                    end_i=i;
                    start_i=i-length+1;

                    for(let j=start_i;j<=end_i;j++){
                        clsHandCardData.aHandCardsArray[j]--;
                    }
                    clsHandCardData.handCardsCount-=clsGameSituation.uctNowOutCardType.count;
                    tmpHandCardValue=this.getHandCardsValue(clsHandCardData);
                    for(let j=start_i;j<=end_i;j++){
                        clsHandCardData.aHandCardsArray[j]++;
                    }
                    clsHandCardData.handCardsCount+=clsGameSituation.uctNowOutCardType.count;
                    //判断该价值情况
                    if((bestHandCardValue.sumValue-(bestHandCardValue.needRound*7))
                        <=(tmpHandCardValue.sumValue-(tmpHandCardValue.needRound*7))){
                        bestHandCardValue=tmpHandCardValue;

                        bestMaxCard=end_i;
                        putCards=true;
                    }
                }
            }
            if(putCards){
                clsHandCardData.clearNHandCardsArray();
                for(let j=start_i;j<=end_i;j++){
                    clsHandCardData.nHandCardsArray.push(j);
                }
                clsHandCardData.putCardsType=clsGameSituation.uctNowOutCardType
                =this.getOutCardType(this.cardsType.ctSingleLine,bestMaxCard,end_i-start_i+1);
                return;
            }


            if(this.putBomb(clsHandCardData,tmpHandCardValue,bestHandCardValue,bestMaxCard,putCards)){
                return;
            }

            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctZero,0,0);
            return;

        }


        else if(clsGameSituation.uctNowOutCardType.cardsType===this.cardsType.ctDoubleLine){

            putCards=false;

            prov=0;
            start_i=0;
            end_i=0;
            length=clsGameSituation.uctNowOutCardType.count/2;

            for(let i=clsGameSituation.uctNowOutCardType.nMinCard-length+2;i<15;i++){
                if(clsHandCardData.aHandCardsArray[i]>1){
                    prov++;
                }
                else
                {
                    prov=0;
                }
                if(prov>=length){
                    end_i=i;
                    start_i=i-length+1;
                    for(let j=start_i;j<=end_i;j++){
                        clsHandCardData.aHandCardsArray[i]-=2;
                    }
                    clsHandCardData.handCardsCount-=clsGameSituation.uctNowOutCardType.count;
                    tmpHandCardValue=this.getHandCardsValue(clsHandCardData);
                    for(let j=start_i;j<=end_i;j++){
                        clsHandCardData.aHandCardsArray[i]+=2;
                    }
                    clsHandCardData.handCardsCount+=clsGameSituation.uctNowOutCardType.count;
                    if((bestHandCardValue.sumValue-(bestHandCardValue.needRound*7))
                        <=(tmpHandCardValue.sumValue-(tmpHandCardValue.needRound*7))){
                        bestHandCardValue=tmpHandCardValue;
                        bestMaxCard=end_i;
                        putCards=true;
                    }
                }
            }
            if(putCards){
                clsHandCardData.clearNHandCardsArray();
                for(let i=start_i;i<=end_i;i++){
                    clsHandCardData.nHandCardsArray.push(i);
                    clsHandCardData.nHandCardsArray.push(i);
                }
                clsHandCardData.putCardsType = clsGameSituation.uctNowOutCardType
                    = this.getOutCardType(this.cardsType.ctDoubleLine, bestMaxCard, 2*(end_i-start_i+1));
                return;
            }

            if(this.putBomb(clsHandCardData,tmpHandCardValue,bestHandCardValue,bestMaxCard,putCards)){
                return;
            }

            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctZero,0,0);
            return;
        }


        else if(clsGameSituation.uctNowOutCardType.cardsType===this.cardsType.ctThreeLine){

            putCards=false;
            prov=0;
            start_i=0;
            end_i=0;
            length=clsGameSituation.uctNowOutCardType.count/3;

            for(let i=clsGameSituation.uctNowOutCardType.nMinCard-length+2;i<15;i++){
                if(clsHandCardData.aHandCardsArray[i]>2){
                    prov++;
                }
                else{
                    prov=0;
                }
                if(prov>=length){
                    end_i=i;
                    start_i=i-length+1;
                    for(let j=start_i;j<=end_i;j++){
                        clsGameSituation.aHandCardsArray[i]-=3;
                    }
                    clsHandCardData.handCardsCount-=clsGameSituation.uctNowOutCardType.count;
                    tmpHandCardValue=this.getHandCardsValue(clsHandCardData);
                    for(let j=start_i;j<=end_i;j++){
                        clsGameSituation.aHandCardsArray[i]+=3;
                    }
                    clsHandCardData.handCardsCount+=clsGameSituation.uctNowOutCardType.count;
                    if((bestHandCardValue.sumValue-(bestHandCardValue.needRound*7))
                        <=(tmpHandCardValue.sumValue-(tmpHandCardValue.needRound*7))){
                        bestHandCardValue=tmpHandCardValue;
                        bestMaxCard=end_i;
                        putCards=true;
                    }
                }
            }
            if(putCards){
                clsHandCardData.clearNHandCardsArray();
                for(let i=start_i;i<=end_i;i++){
                    clsHandCardData.nHandCardsArray.push(i);
                    clsHandCardData.nHandCardsArray.push(i);
                    clsHandCardData.nHandCardsArray.push(i);
                }
                clsHandCardData.putCardsType = clsGameSituation.uctNowOutCardType
                    = this.getOutCardType(this.cardsType.ctThreeLine, bestMaxCard, 3*(end_i-start_i+1));
                return;
            }

            if(this.putBomb(clsHandCardData,tmpHandCardValue,bestHandCardValue,bestMaxCard,putCards)){
                return;
            }

            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctZero,0,0);
            return;
        }


        else if(clsGameSituation.uctNowOutCardType.cardsType===this.cardsType.ctThreeTakeOne){

            putCards=false;

            for(let i=clsGameSituation.uctNowOutCardType.nMinCard+1;i<16;i++){
                if(clsHandCardData.aHandCardsArray[i]>2){
                    for(let j=3;j<18;j++){


                        if(clsHandCardData.aHandCardsArray[j]>0 &&j!==i){
                            clsHandCardData.aHandCardsArray[i]-=3;
                            clsHandCardData.aHandCardsArray[j]-=1;
                            clsHandCardData.handCardsCount-=4;
                            tmpHandCardValue=this.getHandCardsValue(clsHandCardData);
                            clsHandCardData.aHandCardsArray[i]+=3;
                            clsHandCardData.aHandCardsArray[j]+=1;
                            clsHandCardData.handCardsCount+=4;
                            if((bestHandCardValue.sumValue-(bestHandCardValue.needRound*7))
                                <=(tmpHandCardValue.sumValue-(tmpHandCardValue.needRound*7))){
                                bestHandCardValue=tmpHandCardValue;
                                bestMaxCard=i;
                                tmp_1=j;
                                putCards=true;
                            }
                        }
                    }
                }
            }

            if(putCards){
                clsHandCardData.clearNHandCardsArray();
                clsHandCardData.nHandCardsArray.push(bestMaxCard);
                clsHandCardData.nHandCardsArray.push(bestMaxCard);
                clsHandCardData.nHandCardsArray.push(bestMaxCard);
                clsHandCardData.nHandCardsArray.push(tmp_1);
                clsGameSituation.putCardsType = this.getOutCardType(this.cardsType.ctThreeTakeOne, bestMaxCard, 4);
                clsHandCardData.putCardsType = clsGameSituation.uctNowOutCardType;
                return;
            }

            if(this.putBomb(clsHandCardData,tmpHandCardValue,bestHandCardValue,bestMaxCard,putCards)){
                return;
            }

            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctZero,0,0);
            return;
        }


        else if(clsGameSituation.uctNowOutCardType.cardsType===this.cardsType.ctThreeTakeTwo){

            for(let i=clsGameSituation.uctNowOutCardType.nMinCard+1;i<16;i++){
                if(clsHandCardData.aHandCardsArray[i]>2){
                    for(let j=3;j<16;j++){

                        if(clsHandCardData.aHandCardsArray[j]>1&&j!==i){
                            clsHandCardData.aHandCardsArray[i]-=3;
                            clsHandCardData.aHandCardsArray[j]-=2;
                            clsHandCardData.handCardsCount-=5;
                            tmpHandCardValue=this.getHandCardsValue(clsHandCardData);
                            clsHandCardData.aHandCardsArray[i]+=3;
                            clsHandCardData.aHandCardsArray[j]+=2;
                            clsHandCardData.handCardsCount+=5;
                            if((bestHandCardValue.sumValue-(bestHandCardValue.needRound*7))
                                <=(tmpHandCardValue.sumValue-(tmpHandCardValue.needRound*7))){
                                bestHandCardValue=tmpHandCardValue;
                                bestMaxCard=i;
                                tmp_1=j;
                                putCards=true;
                            }
                        }
                    }
                }
            }
            if(putCards){
                clsHandCardData.clearNHandCardsArray();
                clsHandCardData.nHandCardsArray.push(bestMaxCard);
                clsHandCardData.nHandCardsArray.push(bestMaxCard);
                clsHandCardData.nHandCardsArray.push(bestMaxCard);
                clsHandCardData.nHandCardsArray.push(tmp_1);
                clsHandCardData.nHandCardsArray.push(tmp_1);
                clsHandCardData.putCardsType=clsGameSituation.uctNowOutCardType
                =this.getOutCardType(this.cardsType.ctThreeTakeTwo,bestMaxCard,5);
                return ;
            }

            if(this.putBomb(clsHandCardData,tmpHandCardValue,bestHandCardValue,bestMaxCard,putCards)){
                return;
            }

            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctZero,0,0);
            return;
        }


        else if(clsGameSituation.uctNowOutCardType.cardsType===this.cardsType.ctThreeTakeOneLine){
            tmp_1=0;
            tmp_2=0;
            tmp_3=0;
            tmp_4=0;
            prov=0;
            start_i=0;
            end_i=0;
            putCards=false;
            length=clsGameSituation.uctNowOutCardType.count/4;

            for(let i=clsGameSituation.uctNowOutCardType.nMinCard-length+2;i<15;i++){
                if(clsHandCardData.aHandCardsArray[i]>2){
                    prov++;
                }
                else{
                    prov=0;
                }
                if(prov>=length){
                    end_i=i;
                    start_i=i-length+1;
                    for(let j=start_i;j<=end_i;j++){
                        clsHandCardData.aHandCardsArray[j]-=3;
                    }
                    clsHandCardData.count-=clsGameSituation.uctNowOutCardType.count;


                    if(length===2){
                        for(let j=3;j<18;j++){

                            if(clsHandCardData.aHandCardsArray[j]>0)
                            {
                                clsHandCardData.aHandCardsArray[j]-=1;
                                for(let k=3;k<18;k++){
                                    if(clsHandCardData.aHandCardsArray[k]>0)
                                    {
                                        clsHandCardData.aHandCardsArray[k]-=1;
                                        tmpHandCardValue=this.getHandCardsValue(clsHandCardData);
                                        clsHandCardData.aHandCardsArray[k]+=1;
                                        if ((bestHandCardValue.sumValue - (bestHandCardValue.needRound * 7))
                                            <= (tmpHandCardValue.sumValue - (tmpHandCardValue.needRound * 7)))
                                        {
                                            bestHandCardValue = tmpHandCardValue;
                                            bestMaxCard = end_i;
                                            tmp_1 = j;
                                            tmp_2 = k;
                                            putCards = true;
                                        }
                                    }
                                }
                                clsHandCardData.aHandCardsArray[j]+=1;
                            }
                        }
                    }

                    if(length===3){
                        for(let j=3;j<18;j++){
                            if(clsHandCardData.aHandCardsArray[j]>0){
                                clsHandCardData.aHandCardsArray[j]-=1;
                                for(let k=3;k<18;k++){
                                    if(clsHandCardData.aHandCardsArray[k]>0)
                                    {
                                        clsHandCardData.aHandCardsArray[k]-=1;
                                        for(let l=3;l<18;l++){
                                            if(clsHandCardData.aHandCardsArray[l]>0){
                                                clsHandCardData.aHandCardsArray[l]-=1;
                                                tmpHandCardValue=this.getHandCardsValue(clsHandCardData);
                                                if ((bestHandCardValue.sumValue - (bestHandCardValue.needRound * 7))
                                                    <= (tmpHandCardValue.sumValue - (tmpHandCardValue.needRound * 7)))
                                                {
                                                    bestHandCardValue = tmpHandCardValue;
                                                    bestMaxCard = end_i;
                                                    tmp_1 = j;
                                                    tmp_2 = k;
                                                    tmp_3 = l;
                                                    putCards = true;
                                                }
                                                clsHandCardData.aHandCardsArray[l]+=1;
                                            }

                                        }
                                        clsHandCardData.aHandCardsArray[k]+=1;
                                    }
                                }
                                clsHandCardData.aHandCardsArray[j]+=1;
                            }
                        }
                    }


                    if(length===4){
                        for(let j=3;j<18;j++){
                            if(clsHandCardData.aHandCardsArray[j]>0){
                                clsHandCardData.aHandCardsArray[j]-=1;
                                for(let k=3;k<18;k++){
                                    if(clsHandCardData.aHandCardsArray[k]>0){
                                        clsHandCardData.aHandCardsArray[k]-=1;
                                        for(let l=3;l<18;l++){
                                            if(clsHandCardData.aHandCardsArray[l]>0){
                                                clsHandCardData.aHandCardsArray[l]-=1;
                                                for(let m=3;m<18;m++){
                                                    if(clsHandCardData.aHandCardsArray[m]>0){
                                                        clsHandCardData.aHandCardsArray[m]-=1;
                                                        tmpHandCardValue=this.getHandCardsValue(clsHandCardData);
                                                        if ((bestHandCardValue.sumValue - (bestHandCardValue.needRound * 7))
                                                            <= (tmpHandCardValue.sumValue - (tmpHandCardValue.needRound * 7)))
                                                        {
                                                            bestHandCardValue = tmpHandCardValue;
                                                            bestMaxCard = end_i;
                                                            tmp_1 = j;
                                                            tmp_2 = k;
                                                            tmp_3 = l;
                                                            tmp_4 = m;
                                                            putCards = true;
                                                        }
                                                        clsHandCardData.aHandCardsArray[m]+=1;
                                                    }
                                                }
                                                clsHandCardData.aHandCardsArray[l]+=1;
                                            }
                                        }
                                        clsHandCardData.aHandCardsArray[k]+=1;
                                    }
                                }
                                clsHandCardData.aHandCardsArray[j]+=1;
                            }
                        }
                    }
                    for(let j=start_i;j<=end_i;j++){
                        clsHandCardData.aHandCardsArray[j]+=3;
                    }
                    clsHandCardData.handCardsCount+=clsGameSituation.uctNowOutCardType.count;
                }
            }

            if(putCards){
                clsHandCardData.clearNHandCardsArray();
                for(let j=start_i;j<=end_i;j++){
                    clsHandCardData.nHandCardsArray.push(j);
                    clsHandCardData.nHandCardsArray.push(j);
                    clsHandCardData.nHandCardsArray.push(j);
                }
                if(length===2){
                    clsHandCardData.nHandCardsArray.push(tmp_1);
                    clsHandCardData.nHandCardsArray.push(tmp_2);
                }
                else if(length===3){
                    clsHandCardData.nHandCardsArray.push(tmp_1);
                    clsHandCardData.nHandCardsArray.push(tmp_2);
                    clsHandCardData.nHandCardsArray.push(tmp_3);
                }
                else if(length===4){
                    clsHandCardData.nHandCardsArray.push(tmp_1);
                    clsHandCardData.nHandCardsArray.push(tmp_2);
                    clsHandCardData.nHandCardsArray.push(tmp_3);
                    clsHandCardData.nHandCardsArray.push(tmp_4);
                }
                clsHandCardData.putCardsType=clsGameSituation.uctNowOutCardType
                =this.getOutCardType(this.cardsType.ctThreeTakeOneLine,bestMaxCard,clsGameSituation.uctNowOutCardType.count);
                return;
            }

            if(this.putBomb(clsHandCardData,tmpHandCardValue,bestHandCardValue,bestMaxCard,putCards)){
                return;
            }

            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctZero,0,0);
            return;
        }


        else if(clsGameSituation.uctNowOutCardType.cardsType===this.cardsType.ctThreeTakeTwoLine){
            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctZero,0,0);
            return;
        }


        else if(clsGameSituation.uctNowOutCardType.cardsType===this.cardsType.ctFourTakeOnes){
            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctZero,0,0);
            return;
        }

        //四带两对
        else if(clsGameSituation.uctNowOutCardType.cardsType===this.cardsType.ctFourTakeTwo){
            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctZero,0,0);
            return;
        }


        else if(clsGameSituation.uctNowOutCardType.cardsType===this.cardsType.ctBomb){

            clsHandCardData.clearNHandCardsArray();
            for(let i=clsGameSituation.nMinCard+1;i<16;i++){
                if(clsHandCardData.aHandCardsArray[i]===4){
                    clsHandCardData.nHandCardsArray.push(i);
                    clsHandCardData.nHandCardsArray.push(i);
                    clsHandCardData.nHandCardsArray.push(i);
                    clsHandCardData.nHandCardsArray.push(i);
                    clsHandCardData.putCardsType=clsGameSituation.uctNowOutCardType
                    =this.getOutCardType(this.cardsType.ctBomb,i,4);
                    return;
                }
            }

            if(clsHandCardData.aHandCardsArray[16]>0 && clsHandCardData.aHandCardsArray[17]>0){
                if (bestHandCardValue.sumValue > 20)
                {
                    clsHandCardData.clearNHandCardsArray();
                    clsHandCardData.aHandCardsArray.push(17);
                    clsHandCardData.aHandCardsArray.push(16);
                    clsHandCardData.uctPutCardType = clsGameSituation.uctNowOutCardType
                        = this.getOutCardType(this.cardsType.ctKing, 17, 2);
                    return;
                }
            }
            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctZero,0,0);
            return;
        }


        else if(clsGameSituation.uctNowOutCardType.cardsType===this.cardsType.ctKing){
            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctZero,0,0);
            return;
        }



        else if(clsGameSituation.uctNowOutCardType.cardsType===this.cardsType.ctError){
            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctError,0,0);
            return;
        }


        else{
            clsHandCardData.putCardsType=this.getOutCardType(this.cardsType.ctZero,0,0);
            return;
        }

    }


    putBomb(clsHandCardData,clsGameSituation,tmpHandCardValue,bestHandCardValue,bestMaxCard,putCards){
        for(let i=3;i<16;i++){
            if(clsHandCardData.aHandCardsArray[i]===4){
                //尝试打出炸弹，然后计算剩余价值
                clsHandCardData.aHandCardsArray[i]-=4;
                clsHandCardData.handCardsCount-=4;
                tmpHandCardValue=this.getHandCardsValue(clsHandCardData);
                clsHandCardData.aHandCardsArray[i]+=4;
                clsHandCardData.handCardsCount+=4;
                if(((bestHandCardValue.sumValue-(bestHandCardValue.needRound*7))
                    <=(tmpHandCardValue.sumValue-(tmpHandCardValue.needRound*7)))
                    ||tmpHandCardValue.sumValue>0){
                    bestHandCardValue=tmpHandCardValue;
                    bestMaxCard=i;
                    putCards=true;
                }
            }
        }
        if(putCards){
            clsHandCardData.clearNHandCardsArray();
            clsHandCardData.nHandCardsArray.push(bestMaxCard);
            clsHandCardData.nHandCardsArray.push(bestMaxCard);
            clsHandCardData.nHandCardsArray.push(bestMaxCard);
            clsHandCardData.nHandCardsArray.push(bestMaxCard);
            clsHandCardData.putCardsType=clsGameSituation.uctNowOutCardType
                =this.getOutCardType(this.cardsType.ctBomb,bestMaxCard,4);
            return true;
        }
        if(clsHandCardData.aHandCardsArray[16]>0 && clsHandCardData.aHandCardsArray[17]>0){
            if (bestHandCardValue.sumValue > 20)
            {
                clsHandCardData.clearNHandCardsArray();
                clsHandCardData.nHandCardsArray.push(17);
                clsHandCardData.nHandCardsArray.push(16);
                clsHandCardData.uctPutCardType = clsGameSituation.uctNowOutCardType
                    = this.getOutCardType(this.cardsType.ctKing, 17, 2);
                return true;
            }
        }
    }




    putAllSurCards(clsHandData,SurCardGroupData){
        clsHandData.clearNHandCardsArray();
        for(let i=0;i<18;i++){
            for(let j=0;j<clsHandData.aHandCardsArray[i];j++){
                clsHandData.nHandCardsArray.push(i);
            }
        }
        clsHandData.putCardsType=SurCardGroupData;
    }



    deepClone(sourceObj,finalObj){
        let obj=finalObj || {};
        for(let i in sourceObj){
            let prop=sourceObj[i];
            if(prop===obj){
                continue;
            }
            if(typeof  prop==='object'){
                obj[i]=(prop.constructor===Array)?[]:Object.create(prop);
            }else{
                obj[i]=prop;
            }
        }
        return obj;
    }
}