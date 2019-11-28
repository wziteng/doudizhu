import {Poker} from "./Poker.js";
import {Director} from "../Director.js";


export class OutCards {
    constructor() {

    }

    static outcards(arr, cxt) {//arr 字符串类型
        let outobject = [];
        console.log(arr);
        for (let i = 0; i < arr.length; i++) {
            outobject.push(new Poker(arr[i], i * 10, 210, 230, 4, true))
        }
        cxt.clearRect(218, 230, 75, 400);
        outobject.forEach(evt => {
            evt.draw();
        });
        return 1;
    }

    static reMind(arr, keysArr, keys,director) {
        let index = [];
        for (let i = 0; i < keys.length; i++) {
            for (let j = 0; j < arr.length; j++) {
                if (arr[j] === keys[i]) {
                    index.push(i);
                }
            }
        }
        for (let i = 0; i < index.length; i++) {
            let object = new Poker(keys[index[i]], index[i] * 20, 20, 180, 3, true);
            Director.deleteindex(keysArr, index[i], object);
        }
        keysArr.forEach(function (value) {
           value.draw();
        });
        director.outcards_num=[].concat(index);
        console.log(director.outcards_num);

    }


}