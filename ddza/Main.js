import {ResourceLoader} from "./js/base/ResourceLoader.js";
import {Director} from "./js/Director.js";
import {BackGround} from "./js/runtime/BackGround.js";
import {DataStore} from "./js/base/DataStore.js";
import {Touxiang} from "./js/runtime/Touxiang.js";
import {gameButton} from "./js/runtime/gameButton.js";
import {Score} from "./js/player/Score.js";
import {HandOne} from "./js/player/HandOne.js";
import {gameWin} from "./js/player/gameWin.js";
import {HandTwo} from "./js/player/HandTwo.js";
import {gameLose} from "./js/player/gameLose.js";
import {Start} from "./js/runtime/Start.js";

export class Main {
    constructor() {
        this.canvas = wx.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.dataStore = DataStore.getInstance();
        this.director = Director.getInstance();
        const loader = ResourceLoader.create();
        loader.onLoaded(map => this.onResourceFirstLoaded(map));


    }

    onResourceFirstLoaded(map) {
        this.director.isGameStart = true;
        this.dataStore.canvas = this.canvas;
        this.dataStore.ctx = this.ctx;
        this.dataStore.res = map;
        this.init();

    }

    init() {
        this.dataStore
            .put('bg', BackGround)
            .put('logo', Start)
            .put('keys', [])
            .put('portrait', Touxiang)
            .put('button', gameButton)
            .put('hand1',HandOne)
            .put('win',gameWin)
            .put('hand2',HandTwo)
            .put('lose',gameLose)
            .put('score', Score);
        this.director.run();
    }
}