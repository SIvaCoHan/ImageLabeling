import paper from "paper";
import Base from './base';


export default class Arrow extends Base {
    toolId = 'arrow';
    toolName = '箭头';

    onMouseDrag = (event) => {
        const start = event.downPoint
        const end = event.point
        const tailVector = end.subtract(start)
        if (tailVector.length < 10){
            // 如果拖动长度不足，则不展示箭头
            return
        }
        const headLine = tailVector.normalize(10)
        const headAngle = 150;
        const oPoint = new paper.Point(0, 0);

        this._tmp = new paper.Group([
            new paper.Path([start, end]),
            new paper.Path([
                end.add(headLine.rotate(headAngle, oPoint)),
                end,
                end.add(headLine.rotate(-headAngle, oPoint))
            ])
        ])
        this._tmp.strokeColor = this.borderColor
        this._tmp.strokeWidth = this.borderSize
        this._tmp.removeOn({
            drag: true
        })
    }

}