import paper from 'paper'

export default class Base{
    toolId = 'toolId';
    toolName = '工具名称';

    constructor(scope) {
        this.scope = scope;
        this._tool = new paper.Tool();
        this._tool.onMouseDown= (event) => this.onMouseDown(event);
        this._tool.onMouseDrag= (event) => this.onMouseDrag(event);
        this._tool.onMouseUp= (event) => this.onMouseUp(event);
        this._tool.onMouseMove =(event) => this.onMouseMove(event);
        this._tool.onClick =(event) => this.onClick(event);
        this._tool.onKeyUp =(event) => this.onKeyUp(event);
        this._tool.onKeyDown =(event) => this.onKeyDown(event);
        console.log('构建tool', this.toolId, this.toolName, this._tool);
        this.init();
    }

    init(){
        this.borderSize = 3;
        this.borderColor = '#000000';
        this._tmp = null;
    }

    onMouseDown(){}
    onMouseMove(){}
    onMouseDrag(){}
    onMouseUp(){}
    onClick(){}
    onKeyUp(){}
    onKeyDown(){}

    activate(property){
        const {borderSize, borderColor } = property;
        this.borderSize = borderSize ?borderSize: this.borderSize ;
        this.borderColor = borderColor ?borderColor: this.borderColor ;
        this._tool.activate()
    }
}