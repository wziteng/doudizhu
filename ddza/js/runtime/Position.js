export class Position {
    constructor(){
    }

    static getEventPosition(evt, arr) {
        let mx = evt.changedTouches[0].clientX;
        let my = evt.changedTouches[0].clientY;
        mx=parseInt(mx);
        my=parseInt(my);
        let index;
        for (let i = 0; i < arr.length -1; i++) {
            if (mx > arr[i].x && mx < arr[i].x + arr[i].width && my > arr[i].y && my < arr[i].y + 20) {
                index = i;
            }
        }
        if (mx > arr[arr.length - 1].x && mx < arr[arr.length - 1].x + arr[arr.length - 1].width && my > arr[arr.length - 1].y && my < arr[arr.length - 1].y + arr[arr.length - 1].height) {
            index = (arr.length - 1);
        }

        return index;
    }

    static getPoint(evt, points) {
        let mx = evt.changedTouches[0].clientX;
        let my = evt.changedTouches[0].clientY;
        mx=parseInt(mx);
        my=parseInt(my);
        let point;
        if (mx >= points[0].x && mx <= points[0].w && my >= points[0].y && my <= points[0].h) {
            point = 1;
        } else if (mx >= points[1].x && mx <= points[1].w && my >= points[1].y && my <= points[1].h) {
            point = 2;
        } else if (mx >= points[2].x && mx <= points[2].w && my >= points[2].y && my <= points[2].h) {
            point = 3;
        } else if (mx >= points[3].x && mx <= points[3].w && my >= points[3].y && my <= points[3].h) {
            point = 0;
        }
        return point;
    }
}