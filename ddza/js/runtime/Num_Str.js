import {Director} from "../Director.js";

export class Num_Str {
    constructor(){

    }

    static Num_str(arr){
        Director.sortCards(arr);
        let index=[];
        let key=[];
        let data=[].concat(arr);
        for (let i=0;i<arr.length;i++){
            index.unshift(data[i]);
        }
        for (let i=0;i<index.length;i++){
            let num=index[i];
            key.unshift(num);
        }

        return key;
    }
}