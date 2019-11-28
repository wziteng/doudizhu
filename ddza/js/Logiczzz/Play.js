import {HandCardData} from "./HandCardData.js";

export class Play{
    constructor(){
        this.handCardData=new HandCardData();
       
        this.gameRole = 2;
       
        this.ownIndex = -1;
        
        this.turnPutCards=false;
       
        this.isLimitState=true;
        
        this.isPutCards=false;
        
        this.flowerCard=[];
       
        this.outFlowerCard=[];
       
        this.putCardResult=1;
       
        this.sureBotton=0;
    }

}