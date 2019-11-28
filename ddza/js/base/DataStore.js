//存储长期保存的变量
export class DataStore {
    static getInstance(){
        if (!DataStore.instance){
            DataStore.instance = new DataStore();
        }
        return DataStore.instance;
    }

    constructor(){
        this.map = new Map();
    }

    put(key,value){
        if (typeof value === 'function'){
            value = new value() ;
        }
        this.map.set(key,value);
        return this;
    }

    get(key) {
        return this.map.get(key);
    }

    //清空资源
    destroy() {
        for (let value of this.map.values()) {
            value = null;
        }
    }
}