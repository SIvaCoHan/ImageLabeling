import paper from "paper";
import Base from './base';


export default class Line extends Base {
    toolId = 'line';
    toolName = '直线';

    onMouseDown = (event) => {
        if (this._tmp === null){
            this._tmp = new paper.Path.Line({
                from: event.point,
                to: event.point,
                strokeWidth: this.borderSize,
                strokeColor: this.borderColor,
            })
        } else {
            this._tmp.segments[1].point = event.point
            this._tmp = null;
        }
        console.log(this._tmp)
    }

    onMouseDrag = (event) => {
        if(this._tmp != null){
            this._tmp.segments[1].point = event.point
        }
    }
    onMouseMove = (event) => {
        if(this._tmp != null){
            this._tmp.segments[1].point = event.point
        }
    }

    activate(property) {
        super.activate(property);
        this._tmp = null;
    }

}