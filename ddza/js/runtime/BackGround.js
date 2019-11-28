import {Sprite} from "../base/Sprite.js";
import {DataStore} from "../base/DataStore.js";

export class BackGround extends Sprite{
    constructor() {
        const image = Sprite.getImage('bg');
        super(image,
            0, 0,
            image.width, image.height,
            0, 0,
            DataStore.getInstance().canvas.width, DataStore.getInstance().canvas.height);
    }
  drawRepeat(x, y, width, heigth) {
    super.draw(this.img,
      x,
      y,
      width,
      heigth,
      x,
      y,
      width,
      heigth)
  }
}