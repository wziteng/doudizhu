import {SourceMatch} from "./SourceMatch.js";

export class CoversionCard{

    constructor(){

        this.map=new Map(SourceMatch);
}


    transformFlowerToNumber(flowerCardArray){
        let numberCard=[];
        let valueArray=[];



        for(let key of this.map.keys()){

            valueArray.push(key);

        }
        for(let i=0;i<flowerCardArray.length;i++){
            if(valueArray.indexOf(flowerCardArray[i])){

                numberCard.push(this.map.get(flowerCardArray[i]+''));

            }
        }

        return numberCard;
    }


}