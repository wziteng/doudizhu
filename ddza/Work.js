import {Director} from "./js/Directo.js";

let director=Director.getInstance();
this.onmessage=function (e) {
    if(director.sureBotton===1){
        e.data=1;
        this.close();
    }
}