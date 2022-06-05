import paper from "paper";
import Base from './base';


export default class Pencil extends Base {
    toolId = 'pencil';
    toolName = '铅笔';

    onMouseDown = (event) => {
        this._tmp = new paper.Path({
            strokeColor: this.borderColor,
            strokeJoin: 'round',
            strokeWidth: this.borderSize,
        })
        this._tmp.add(event.point);
        console.log(`${this.toolName} MouseDown`)
    }
    onMouseDrag = (event) => {
        this._tmp.add(event.point);
    }
    onMouseUp = (event) => {
        this._tmp.add(event.point);
        this._tmp = null;
    }

}