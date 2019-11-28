import { OutCardType } from "./OutCardType.js";
import { CoversionCard } from "./CoversionCard.js";
import { OutCards } from "../runtime/OutCards.js";

export class GameRun {

  constructor() {

    this.landlordID = -1;

    this.score = 0;

    this.outCardArray = [];

    this.uctNowOutCardType = new OutCardType();

    this.gameOver = false;

    this.computerFlag = false;

    this.notPutCount = 0;




    this.coversionCard = new CoversionCard();
    this.canvas = wx.createCanvas();
    this.cxt = this.canvas.getContext('2d');

    this.canvas.timeCount = 0;

  }




  toPlay(playA, playB, playC, GameSituation, director) {

    this.canvas.timeCount++;
    console.log("程序执行中");
    let self = this;
    let intervalID;

    intervalID = setTimeout(function () {
      self.toPlay(playA, playB, playC, self, director);
    }, 2000);
    if (GameSituation.gameOver) {
      for (let i = 0; i < this.canvas.timeCount; i++) {
        clearTimeout(intervalID);
      }
    }


    if (playA.turnPutCards) {

      playA.handCardData.clearNHandCardsArray();

      if (GameSituation.notPutCount === 2) {
        playA.isLimitState = false;
      }

      if (director.sureBotton && director.outcards.length) {
        console.log("点击出牌");
        let putCardArray = GameSituation.coversionCard.transformFlowerToNumber(director.outcards);
        let result = 0;
        //提示按钮没有被点击
        if (!director.remindReadyBotton) {

          if (!playA.isLimitState) {

            if (!GameSituation.judgePutCard(putCardArray, playA)) {
              console.log("出牌不合规范");

            }
            //出牌符合规范
            else {
              GameSituation.putCards(playA.handCardData, GameSituation, playA);
              result = OutCards.outcards(playA.outFlowerCard, this.cxt);
              playA.isPutCards = true;
              playB.isLimitState = true;
              playC.isLimitState = true;
            }
          }

          else if (playA.isLimitState) {
            if (!GameSituation.judgePutCardLimit(putCardArray, playA, GameSituation)) {
              console.log("出牌不合规范");
            }

            else {
              GameSituation.putCards(playA.handCardData, GameSituation, playA);
              result = OutCards.outcards(playA.outFlowerCard, this.cxt);
              playA.isPutCards = true;
              playB.isLimitState = true;
              playC.isLimitState = true;
            }
          }
        }
        //提示按钮被点击
        else if (director.remindReadyBotton) {
          result = OutCards.outcards(playA.outFlowerCard, this.cxt);
          director.remindReadyBotton = 0;
        }




        if (result) {
          console.log("进入玩家A成功出牌");
          GameSituation.notPutCount = 0;
          playA.turnPutCards = false;
          playB.turnPutCards = true;

          if (playA.handCardData.handCardsCount === 0) {
            GameSituation.gameOver = true;
            if (playA.gameRole === 0) {
              console.log("地主获胜");
              director.isWin = true;
              director.handDown();
            } else {
              director.handDown();
              console.log("农民获胜");
            }
          }

        }

        director.sureBotton = 0;
      }


      if (director.remindBotton) {
        console.log("playA.handCardData.nHandCardsArray.length==" + playA.handCardData.nHandCardsArray.length);
        playA.handCardData.getPutCardListLimit(GameSituation, playA.handCardData);
        //证明可以管上
        if (playA.handCardData.nHandCardsArray.length !== 0) {
          console.log('ssssss');
          GameSituation.putCards(playA.handCardData, GameSituation, playA);
          OutCards.reMind(playA.outFlowerCard, director.keysArr, director.keys, director);
        }
        //证明管不上
        else {
          director.dataStore.get('score').drawYaobuqi(130, 30);

          setTimeout(function () {
            director.dataStore.get('bg').drawRepeat(120, 30, 180, 120);
          }
            , 3000);
        }
        director.remindReadyBotton = 1;
        director.remindBotton = 0;

      }


      if (director.notBotton) {
        GameSituation.notPutCount++;
        playA.isPutCards = false;
        playA.turnPutCards = false;
        playB.turnPutCards = true;

        director.notBotton = 0;
      }

    }
    else if (playB.turnPutCards) {
      director.dataStore.get('score').drawPaiNumber(playB.handCardData.handCardsCount, 270, 608);   //下家
      console.log("进入玩家B出牌阶段");
      let result = 0;
      playB.handCardData.clearNHandCardsArray();
      if (GameSituation.notPutCount === 2) {
        playB.isLimitState = false;
      }
      if (!playB.isLimitState) {
        playB.handCardData.getPutCardList(playB.handCardData);
        GameSituation.putCards(playB.handCardData, GameSituation, playB);
        result = OutCards.outcards(playB.outFlowerCard, this.cxt);
        console.log("玩家B出牌：" + playB.handCardData.nHandCardsArray);
        playB.isPutCards = true;
        playA.isLimitState = true;
        playC.isLimitState = true;
      }
      else if (playB.isLimitState) {
        playB.handCardData.getPutCardListLimit(GameSituation, playB.handCardData);
        if (playB.handCardData.nHandCardsArray.length !== 0) {
          GameSituation.putCards(playB.handCardData, GameSituation, playB);
          result = OutCards.outcards(playB.outFlowerCard, this.cxt);
          console.log("玩家B出牌：" + playB.handCardData.nHandCardsArray);
          playB.isPutCards = true;
          //因为playB主动出牌了，所以要把其他玩家设置为被动出牌
          playA.isLimitState = true;
          playC.isLimitState = true;
        }

        else {
          console.log("玩家B不要");
          director.dataStore.get('score').drawPaiNumber(playC.handCardData.handCardsCount, 270, 33);   //上家
          director.dataStore.get('button').drawPaoX();
          director.dataStore.get('score').drawbuchu(295, 508);
          let m = setTimeout(function () {
            director.dataStore.get('bg').drawRepeat(275, 495, 50, 70);
            clearTimeout(m);
          }, 400);
          playB.isPutCards = false;
          playB.turnPutCards = false;
          playC.turnPutCards = true;
          GameSituation.notPutCount++;
        }
      }
      if (result) {
        console.log("进入玩家B出牌成功");
        director.dataStore.get('bg').drawRepeat(255, 608, 25, 30);
        director.dataStore.get('score').drawPaiNumber(playB.handCardData.handCardsCount, 270, 608);   //下家
        GameSituation.notPutCount = 0;
        playB.turnPutCards = false;
        playC.turnPutCards = true;
        if (playB.handCardData.handCardsCount === 0) {
          GameSituation.gameOver = true;
          if (playB.gameRole === 0) {
            director.isWin = true;
            director.handDown();
            console.log("地主获胜");
          } else {
            director.handDown();
            console.log("农民获胜");
          }
        }
      }

    }
    else if (playC.turnPutCards) {
      director.dataStore.get('score').drawPaiNumber(playC.handCardData.handCardsCount, 270, 33);   //上家
      console.log("进入玩家C出牌阶段");
      let result = 0;
      playC.handCardData.clearNHandCardsArray();
      if (GameSituation.notPutCount === 2) {
        playC.isLimitState = false;
      }
      if (!playC.isLimitState) {
        playC.handCardData.getPutCardList(playC.handCardData);
        GameSituation.putCards(playC.handCardData, GameSituation, playC);
        result = OutCards.outcards(playC.outFlowerCard, this.cxt);
        console.log("玩家C出牌：" + playC.handCardData.nHandCardsArray);
        playC.isPutCards = true;
        playA.isLimitState = true;
        playB.isLimitState = true;
      }
      else if (playC.isLimitState) {
        playC.handCardData.getPutCardListLimit(GameSituation, playC.handCardData);
        if (playC.handCardData.nHandCardsArray.length !== 0) {
          GameSituation.putCards(playC.handCardData, GameSituation, playC);
          result = OutCards.outcards(playC.outFlowerCard, this.cxt);
          console.log("玩家C出牌：" + playC.handCardData.nHandCardsArray);
          playC.isPutCards = true;
          playA.isLimitState = true;
          playB.isLimitState = true;
        }
        else {
          console.log("玩家C不要");
          director.dataStore.get('score').drawPaiNumber(playC.handCardData.handCardsCount, 270, 33);   //上家
          director.dataStore.get('score').drawbuchu(280, 109);
          director.dataStore.get('button').drawPaoS();
          let m = setTimeout(function () {
            director.dataStore.get('bg').drawRepeat(262, 100, 50, 70);
            clearTimeout(m);
          }, 600);
        }
        playC.isPutCards = false;
        playC.turnPutCards = false;
        playA.turnPutCards = true;
        GameSituation.notPutCount++;
      }
      if (result) {
        console.log("进入玩家C成功出牌");
        director.dataStore.get('bg').drawRepeat(265, 33, 25, 25);
        director.dataStore.get('score').drawPaiNumber(playC.handCardData.handCardsCount, 270, 33);   //上家
        GameSituation.notPutCount = 0;
        playC.turnPutCards = false;
        playA.turnPutCards = true;
        if (playC.handCardData.handCardsCount === 0) {
          GameSituation.gameOver = true;
          if (playC.gameRole === 0) {
            director.isWin = true;
            director.handDown();
            console.log("地主获胜");
          } else {
            director.handDown();
            console.log("农民获胜");
          }
        }
      }
    }


  }

  static setHandData(play) {

    play.handCardData.aHandCardsArray = GameRun.conversionDataArray(play.handCardData.sumCardsArray);
    console.log("play.handCardData.aHandCardsArray: " + play.handCardData.aHandCardsArray);


    play.handCardData.handCardsCount = play.handCardData.sumCardsArray.length;

  }


  static conversionDataArray(array) {

    let conArray = new Array(18).fill(0);
    for (let i = 0; i < array.length; i++) {
      conArray[array[i]]++;
    }
    return conArray;
  }

  putCards(clsHandCardData, GameSituation, play) {

    let nowPutCardType = clsHandCardData.putCardsType;
    let nowPutCardArray = clsHandCardData.nHandCardsArray;

    play.outFlowerCard.splice(0, play.outFlowerCard.length);

    for (let i = 0; i < nowPutCardArray.length; i++) {
      let index_1 = -1;
      let index_2 = -1;
      if ((index_1 = clsHandCardData.sumCardsArray.indexOf(nowPutCardArray[i])) !== -1) {

        let keyArray = GameSituation.getNumberKey(GameSituation, nowPutCardArray[i]);
        for (let j = 0; j < keyArray.length; j++) {
          if ((index_2 = play.flowerCard.indexOf(Number(keyArray[j]))) !== -1) {

            play.outFlowerCard.push(keyArray[j]);

            play.flowerCard.splice(index_2, 1);

            break;
          }
        }

        clsHandCardData.sumCardsArray.splice(index_1, 1);

        GameSituation.outCardArray.push(nowPutCardArray[i]);
      }
    }


    clsHandCardData.aHandCardsArray.splice(0, clsHandCardData.aHandCardsArray.length);
    clsHandCardData.aHandCardsArray = [].concat(GameRun.conversionDataArray(clsHandCardData.sumCardsArray));



    clsHandCardData.handCardsCount -= nowPutCardType.count;


    GameSituation.uctNowOutCardType = nowPutCardType;
  }




  getNumberKey(GameSituation, value) {
    let key = [];
    for (let i of GameSituation.coversionCard.map.keys()) {
      if (Number(GameSituation.coversionCard.map.get(i + '')) === value) {
        key.push(i);
      }
    }
    return key;
  }




  judgePutCard(putCardArray, play) {


    let result = 0;

    let count = 0;

    let sumEqual = 0;
    let bestCardGroup = new OutCardType();
    putCardArray.sort(function (value1, value2) {
      if (value1 < value2) {
        return -1;
      } else if (value1 > value2) {
        return 1;
      } else {
        return 0;
      }
    });
    console.log("putCardArray:" + putCardArray);
    switch (putCardArray.length) {

      case 0:
        return result;

      case 1:

        play.handCardData.clearNHandCardsArray();
        bestCardGroup = play.handCardData
          .getOutCardType(play.handCardData.cardsType.ctSingle, putCardArray[0], 1);
        play.handCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
        play.handCardData.putCardsType = bestCardGroup;
        result = 1;
        return result;

      case 2:
        if (putCardArray[0] === putCardArray[1]) {

          play.handCardData.clearNHandCardsArray();
          bestCardGroup = play.handCardData
            .getOutCardType(play.handCardData.cardsType.ctDouble, putCardArray[0], 2);
          play.handCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
          play.handCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
          play.handCardData.putCardsType = bestCardGroup;
          result = 1;
        } else if (putCardArray[0] === 16 && putCardArray[1] === 17) {

          play.handCardData.clearNHandCardsArray();
          bestCardGroup = play.handCardData
            .getOutCardType(play.handCardData.cardsType.ctKing, putCardArray[0], 2);
          for (let i = 0; i < putCardArray.length; i++) {
            play.handCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
          }
          play.handCardData.putCardsType = bestCardGroup;
          result = 1;
        }
        return result;

      case 3:
        if (putCardArray[0] === putCardArray[1] && putCardArray[0] === putCardArray[2]) {

          play.handCardData.clearNHandCardsArray();
          bestCardGroup = play.handCardData
            .getOutCardType(play.handCardData.cardsType.ctThree, putCardArray[0], 3);
          for (let i = 0; i < putCardArray.length; i++) {
            play.handCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
          }
          play.handCardData.putCardsType = bestCardGroup;
          result = 1;
        }
        return result;

      case 4:

        if (putCardArray[0] === putCardArray[1] && putCardArray[1] === putCardArray[2]) {

          play.handCardData.clearNHandCardsArray();
          bestCardGroup = play.handCardData
            .getOutCardType(play.handCardData.cardsType.ctThreeTakeOne, putCardArray[0], 4);
          for (let i = 0; i < putCardArray.length - 1; i++) {
            play.handCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
          }
          play.handCardData.nHandCardsArray.push(putCardArray[3]);
          play.handCardData.putCardsType = bestCardGroup;
          result = 1;
        }

        else if (putCardArray[1] === putCardArray[2] && putCardArray[2] === putCardArray[3]) {

          play.handCardData.clearNHandCardsArray();
          bestCardGroup = play.handCardData
            .getOutCardType(play.handCardData.cardsType.ctThreeTakeOne, putCardArray[1], 4);
          for (let i = 0; i < putCardArray.length - 1; i++) {
            play.handCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
          }
          play.handCardData.nHandCardsArray.push(putCardArray[0]);
          play.handCardData.putCardsType = bestCardGroup;
          result = 1;
        }

        else if (putCardArray[0] === putCardArray[1] && putCardArray[1] === putCardArray[2] &&
          putCardArray[2] === putCardArray[3]) {


          play.handCardData.clearNHandCardsArray();
          bestCardGroup = play.handCardData
            .getOutCardType(play.handCardData.cardsType.ctBomb, putCardArray[0], 4);
          for (let i = 0; i < putCardArray.length; i++) {
            play.handCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
          }
          play.handCardData.putCardsType = bestCardGroup;
          result = 1;
        }
        return result;

      case 5:

        if (putCardArray[0] === putCardArray[1] && putCardArray[1] === putCardArray[2] && putCardArray[3] === putCardArray[4]) {

          play.handCardData.clearNHandCardsArray();
          bestCardGroup = play.handCardData
            .getOutCardType(play.handCardData.cardsType.ctThreeTakeTwo, putCardArray[0], 5);
          for (let i = 0; i < putCardArray.length; i++) {
            play.handCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
          }
          play.handCardData.nHandCardsArray.push(putCardArray[3]);
          play.handCardData.nHandCardsArray.push(putCardArray[4]);
          play.handCardData.putCardsType = bestCardGroup;
          result = 1;
        }

        else if (putCardArray[0] === putCardArray[1] && putCardArray[2] === putCardArray[3] && putCardArray[3] === putCardArray[4]) {

          play.handCardData.clearNHandCardsArray();
          bestCardGroup = play.handCardData
            .getOutCardType(play.handCardData.cardsType.ctThreeTakeTwo, putCardArray[2], 5);
          for (let i = 0; i < putCardArray.length; i++) {
            play.handCardData.nHandCardsArray.push(bestCardGroup.nMinCard);
          }
          play.handCardData.nHandCardsArray.push(putCardArray[0]);
          play.handCardData.nHandCardsArray.push(putCardArray[1]);
          play.handCardData.putCardsType = bestCardGroup;
          result = 1;
        }

        else if (putCardArray[0] + 1 === putCardArray[1] && putCardArray[1] + 1 === putCardArray[2] &&
          putCardArray[2] + 1 === putCardArray[3] && putCardArray[3] + 1 === putCardArray[4] &&
          putCardArray[4] !== 15) {


          play.handCardData.clearNHandCardsArray();
          bestCardGroup = play.handCardData
            .getOutCardType(play.handCardData.cardsType.ctSingleLine, putCardArray[4], 5);
          for (let i = 0; i < putCardArray.length; i++) {
            play.handCardData.nHandCardsArray.push(putCardArray[i]);
          }
          play.handCardData.putCardsType = bestCardGroup;
          result = 1;
        }
        return result;

      default:

        count = 1;
        for (let i = 0; i < putCardArray.length; i++) {
          if (putCardArray[i] + 1 !== putCardArray[i + 1])
            break;
          if (putCardArray[putCardArray.length - 1] === 15)
            break;
          count++;
        }
        console.log(putCardArray.length);
        console.log(count);

        if (count === putCardArray.length) {

          play.handCardData.clearNHandCardsArray();
          bestCardGroup = play.handCardData
            .getOutCardType(play.handCardData.cardsType.ctSingleLine, putCardArray[putCardArray.length - 1], putCardArray.length);
          for (let i = 0; i < putCardArray.length; i++) {
            play.handCardData.nHandCardsArray.push(putCardArray[i]);
          }
          play.handCardData.putCardsType = bestCardGroup;
          result = 1;
          return result;
        }


        count = 0;


        for (let i = 0; i < putCardArray.length; i++) {
          if (putCardArray[i] === putCardArray[i + 1]) {
            count++;

            i += 1;
          } else
            break;
          if (putCardArray[i] + 1 === putCardArray[i + 2]) {
            sumEqual++;
          }
        }

        console.log("进入判断是不是双顺：count::" + count);

        if (count >= 3 && count === putCardArray.length / 2 && sumEqual === count - 1) {

          play.handCardData.clearNHandCardsArray();
          bestCardGroup = play.handCardData
            .getOutCardType(play.handCardData.cardsType.ctDoubleLine, putCardArray[putCardArray.length - 1], putCardArray.length);
          for (let i = 0; i < putCardArray.length; i++) {
            play.handCardData.nHandCardsArray.push(putCardArray[i]);
          }
          play.handCardData.putCardsType = bestCardGroup;
          result = 1;
          return result;
        }


        count = 0;
        sumEqual = 0;

        for (let i = 0; i < putCardArray.length; i++) {
          if (putCardArray[i] === putCardArray[i + 1] && putCardArray[i + 1] === putCardArray[i + 2]) {
            count++;
            i += 2;
          } else {
            break;
          }
          if (putCardArray[i] + 1 === putCardArray[i + 3]) {
            sumEqual++;
          }
        }

        if (count >= 2 && count === putCardArray.length / 3 && sumEqual + 1 === count) {

          play.handCardData.clearNHandCardsArray();
          bestCardGroup = play.handCardData
            .getOutCardType(play.handCardData.cardsType.ctThreeLine, putCardArray[putCardArray.length - 1], putCardArray.length);
          for (let i = 0; i < putCardArray.length; i++) {
            play.handCardData.nHandCardsArray.push(putCardArray[i]);
          }
          play.handCardData.putCardsType = bestCardGroup;
          result = 1;
          return result;
        }


        count = 0;

        if (putCardArray.length === 6) {
          play.handCardData.clearNHandCardsArray();

          if (putCardArray[0] === putCardArray[1] && putCardArray[1] === putCardArray[2] && putCardArray[2] === putCardArray[3]) {

            count = 1;
            bestCardGroup = play.handCardData
              .getOutCardType(play.handCardData.cardsType.ctFourTakeOnes, putCardArray[0], putCardArray.length);
          }

          else if (putCardArray[2] === putCardArray[3] && putCardArray[3] === putCardArray[4] && putCardArray[4] === putCardArray[5]) {

            count = 1;
            bestCardGroup = play.handCardData
              .getOutCardType(play.handCardData.cardsType.ctFourTakeOnes, putCardArray[2], putCardArray.length);
          }

          else if (putCardArray[1] === putCardArray[2] && putCardArray[2] === putCardArray[3] && putCardArray[3] === putCardArray[4]) {

            count = 1;
            bestCardGroup = play.handCardData
              .getOutCardType(play.handCardData.cardsType.ctFourTakeOnes, putCardArray[1], putCardArray.length);
          }
        }

        if (count === 1) {


          for (let i = 0; i < putCardArray.length; i++) {
            play.handCardData.nHandCardsArray.push(putCardArray[i]);
          }
          play.handCardData.putCardsType = bestCardGroup;
          result = 1;
          return result;
        }


        count = 0;
        if (putCardArray.length === 8) {

          if (putCardArray[0] === putCardArray[1] && putCardArray[1] === putCardArray[2] && putCardArray[2] === putCardArray[3]) {

            count = 1;
            bestCardGroup = play.handCardData
              .getOutCardType(play.handCardData.cardsType.ctFourTakeTwo, putCardArray[0], putCardArray.length);
          }

          else if (putCardArray[2] === putCardArray[3] && putCardArray[3] === putCardArray[4] && putCardArray[4] === putCardArray[5]) {

            count = 1;
            bestCardGroup = play.handCardData
              .getOutCardType(play.handCardData.cardsType.ctFourTakeTwo, putCardArray[2], putCardArray.length);
          }

          else if (putCardArray[4] === putCardArray[5] && putCardArray[5] === putCardArray[6] && putCardArray[6] === putCardArray[7]) {

            count = 1;
            bestCardGroup = play.handCardData
              .getOutCardType(play.handCardData.cardsType.ctFourTakeTwo, putCardArray[4], putCardArray.length);
          }
        }

        if (count === 1) {
          result = 1;


          for (let i = 0; i < putCardArray.length; i++) {
            play.handCardData.nHandCardsArray.push(putCardArray[i]);
          }
          play.handCardData.putCardsType = bestCardGroup;
          result = 1;
          return result;
        }
        count = 0;
        sumEqual = 0;


        if (putCardArray.length >= 8) {
          let dataArray = [];

          let nMinCard = 2;
          dataArray = GameRun.conversionDataArray(putCardArray);
          for (let i = 3; i < 15; i++) {

            if (dataArray[i] === 3 && i === nMinCard + 1) {
              count++;
              nMinCard = i;
            } else {
              if (count === 1) {
                break;
              }
            }
            if (i === nMinCard + 1) {
              sumEqual++;
            }
          }

          if (count >= 2 && sumEqual + 1 === count) {

            play.handCardData.clearNHandCardsArray();

            if (putCardArray.length / 5 === 0) {
              bestCardGroup = play.handCardData
                .getOutCardType(play.handCardData.cardsType.ctThreeTakeOneLine, nMinCard, putCardArray.length);
            }

            else if (putCardArray.length / 4 === 0) {
              bestCardGroup = play.handCardData
                .getOutCardType(play.handCardData.cardsType.ctThreeTakeTwoLine, nMinCard, putCardArray.length);
            }

            else {
              return result;
            }

            for (let i = 0; i < putCardArray.length; i++) {
              play.handCardData.nHandCardsArray.push(putCardArray[i]);
            }
            play.handCardData.putCardsType = bestCardGroup;
            result = 1;
            return result;
          }
        }
        return result;
    }
  }




  judgePutCardLimit(putCardArray, play, GameSituation) {
    let result = 0;

    let tmpResult = GameSituation.judgePutCard(putCardArray, play);

    console.log("play.handCardData.putCardsType.cardsType" + play.handCardData.putCardsType.cardsType);
    console.log("GameSituation.uctNowOutCardType.cardsType" + GameSituation.uctNowOutCardType.cardsType);
    if (tmpResult !== 1) {
      return result;
    }


    if (play.handCardData.putCardsType.cardsType === GameSituation.uctNowOutCardType.cardsType) {

      console.log("play.handCardData.putCardsType.nMinCard" + play.handCardData.putCardsType.nMinCard);
      console.log("GameSituation.uctNowOutCardType.nMinCard" + GameSituation.uctNowOutCardType.nMinCard);
      if (play.handCardData.putCardsType.nMinCard > GameSituation.uctNowOutCardType.nMinCard) {
        console.log("1234444");
        result = 1;
        return result;
      }
    }

    else if ((play.handCardData.putCardsType.cardsType === 13
      || play.handCardData.putCardsType.cardsType === 14)
      && GameSituation.uctNowOutCardType.cardsType !== 14) {
      result = 1;
      return result;
    }

    else if (GameSituation.uctNowOutCardType.cardsType === 14) {
      return result;
    }
  }



}