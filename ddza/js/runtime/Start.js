import { Sprite } from "../base/Sprite.js";
import { DataStore } from "../base/DataStore.js";

export class Start extends Sprite {
  constructor() {
    const image = Sprite.getImage('logo');
    super(image,
      0, 0,
      120, 320,
      200, 180,
      120,320);
  }
 
}