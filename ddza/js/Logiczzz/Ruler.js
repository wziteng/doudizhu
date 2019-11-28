import {ResourceLoader} from "../ResourceLoader.js";



export class Ruler{

    constructor(){
       
        this.pockers=[];
        for(let key of  ResourceLoader.getInstance().map.keys()){
           this.pockers.push(key);
        }
    }

    random_poker(){
        const arrayCards=[];        
     
        const len=this.pockers.length;
        for(let i=0;i<len;i++){
            let index = Math.floor(Math.random() * (len - i));
           ;





      
            arrayCards[i]= this.pockers[index];
           
            this.pockers.splice(index,1);
        }
        return arrayCards;
    }


   
    dealCards(){
        let arrayCards=this.random_poker();
        const poker=[];
        poker[0]=arrayCards.slice(0,17);
        poker[1]=arrayCards.slice(17,34);
        poker[2]=arrayCards.slice(34,51);
        poker[3]=arrayCards.slice(51,54);
        return poker;
    }




     activePutPoker(play,key){

         if(key.length===1){
             const putPoker=this.put_poker(play,1,key);
             return putPoker;
         }

         else if(key.length===2)
         {
             if(key[0]===key[1]){

                 const putPoker=this.put_poker(play,2,key);
                 return putPoker;
             }
             else if((key[0]==='16_small' && key[1]==='17_big') ||
                 (key[1]==='16_small' && key[0]==='17_big')) {
                 const putPoker=this.put_poker(play,8,key);
                 return putPoker;
             }
             else{
                
                 return null;
             }

         }//两张牌判断完毕

         else if(key.length===4){
            
             if((key[1]===key[2] && key[3]!==key[2]) || (key[1]!==key[0] && key[3]===key[2])){
                 const putPoker=this.put_poker(play, 3, key);
                 return putPoker;
             }

             
             else if(key[0]===key[1] &&key[0]===key[2] &&key[3]===key[0]){

                 const putPoker=this.put_poker(play, 7, key);
                 return putPoker;
             }
             else{
                 return null;
             }
         }

         else if(key.length>=5){

             let isType5=true;
             let isType6=true;
             let isType4=true;
             let values=[];

             
            
            for(let i=0;i<key.length;i++){
               
                values.push(parseInt((key[i].split("_"))[0]));
                //console.log(values[i]);
                if(i>=1 && values[i-1]+1!==values[i]){
                    isType5=false;
                   break;
                }
            }

            if(isType5){
               
                const putPoker=this.put_poker(play, 5, key);
                return putPoker;
            }


            
             values.splice(0,values.length);       
             if(key.length%2===0){
                 for(let i=0;i<key.length;i++){
                     values.push(parseInt((key[i].split("_"))[0]));
                     

                     if(i>=1 && i%2===1 && values[i-1]===values[i]){
                         if(i!==1 && i%2===1 ){
                             if(values[i-2]+1!==values[i]){
                                 isType6=false;
                         
                                 break;
                             }
                         }
                     }else if(i>=1 && i%2===1 && values[i-1]!==values[i]){
                         isType6=false;
                 
                         break;
                     }
                 }
             }
             else{
                 isType6=false;
             }
             if(isType6){
                 console.log("是连对");
                 const putPoker=this.put_poker(play, 6, key);
                 return putPoker;
             }


          
            
             values.splice(0,values.length);      
             if(key.length===6){
                    for(let i=0;i<key.length;i++){
                        values.push(parseInt((key[i].split("_"))[0]));
                    }

                    if(key[2]===key[3]){
                        if(key[1]===key[2] ||key[3]===key[4]){
                            if(key[1]!==key[0] || key[4]!==key[5]){
                                isType4=false;
                             
                            }
                        } else{
                            isType4=false;
                         
                        }
                     }
                 else{
                     isType4=false;
                  
                 }

             }
             else{
                 isType4=false;
                
             }
             if(isType4){
                 console.log("是4个带2个");
                 const putPoker=this.put_poker(play, 4, key);
                 return putPoker;
             }

             return null;

         }

     }


   
    passivePutPoker(play_1,play_2,putPoker_1,putPoker_2){


        console.log("putPoker_1.type:"+putPoker_1.type);
        console.log("putPoker_2.type:"+putPoker_2.type);

      
        if(putPoker_1.type!==putPoker_2.type ){
            if(putPoker_2.type!==7 && putPoker_2.type!==8 ){
                return false;
            }
        }

       
        if(putPoker_1.type===8){
            return false;
        }
        else if(putPoker_2.type===8){
            return true;
        }


      
        let keyA;
        let keyB;
        
        keyA=this.getKeysArray(putPoker_1);
        keyB=this.getKeysArray(putPoker_2);


       

        if(putPoker_1.type!==7 && putPoker_1.type!==8 && putPoker_2.type===7){
            return true;
        }
        else if(putPoker_1.type===7 && putPoker_2.type===7 && keyA[0]>keyB[0]){
            return false;
        }
        else if(putPoker_1.type===7 && putPoker_2.type===7 && keyA[0]<keyB[0]){
            return true;
        }

        if(keyA.length!==keyB.length){
          
            return false;
        }


       

         switch (putPoker_1.type) {

            
             case 1:
                console.log("测试单张牌");

              
             case 2:
                 console.log("测试对子");
                 if(keyA[0]<keyB[0]){
                  
                     return true;
                 }
                 else{
                   
                     return false;
                 }

            
             case 3:
               
                 if(keyA[0]===keyA[1] && keyB[0]===keyB[0]&& keyA[0]<keyB[0] ){
                     return true;
                 }
                 
                 else if(keyA[0]===keyA[1] && keyB[(keyB.length-1)]===keyB[(keyB.length-2)] &&
                         keyA[0]<keyB[keyB.length-1]){
                     return true;
                 }
                
                 else if(keyA[(keyA.length-1)]===keyA[(keyA.length-2)] && keyB[(keyB.length-1)]===keyB[(keyB.length-2)] &&
                         keyA[keyA.length-1]<keyB[keyB.length-1]){
                     return true;
                 }
                
                 else if(keyA[(keyA.length-1)]===keyA[(keyA.length-2)] && keyB[0]===keyB[1] &&
                        keyA[keyA.length-1]<keyB[0]){
                     return true;
                 }
                 return false;

            
             case 4:
                 console.log("测试4个带两个");
                 if(keyA[keyA.length-3]<keyB[keyB.length-3]){
                     return true;
                 }
                 return false;

           
             case 5:
                 console.log("测试顺子情况");

             
             case 6:
                 console.log("测试连对情况");
                 if(keyA[0]<keyB[0]){
                     return true;
                 }
                 return false;
         }
    }

    
    put_poker(play,type,key){
       
        const putPoker=new PutPoker(type,key);
      
        for(let i=0;i<key.length;i++){
            const index=play.indexOf(key[i]);
            play.splice(index,1);
        }
        return putPoker;
    }

   

    getKeysArray(putPoker){
        const key=[];
        for(let data of putPoker.map.keys()){
          
            key.push(parseInt(data.value.split("_")));
        }
        return  key;
    }

}
