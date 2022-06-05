import paper from "paper";
import Base from './base';


export default class Circle extends Base {
    toolId = 'circle';
    toolName = '圆形';

    onMouseDrag = (event) => {
        const start = event.downPoint
        const end = event.point

        this._tmp = new paper.Group([
            new paper.Path.Circle({
                center: start.add(end.subtract(start).divide(2)),
                radius: end.subtract(start).length/2,
            }),
        ]);
        this._tmp.strokeColor = this.borderColor
        this._tmp.strokeWidth = this.borderSize
        this._tmp.removeOn({
            drag: true
        })
    }

}