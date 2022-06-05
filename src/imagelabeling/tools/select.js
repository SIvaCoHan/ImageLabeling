// import paper from "paper";
import Base from './base';


export default class Select extends Base {
    toolId = 'select';
    toolName = '选择';

    onMouseDown = (event) => {
        this.scope.project.deselectAll();
        // TODO hit test 需要给一个大一点大空间
        // TODO 一次碰到多个 Item 需要只选择一个
        const test_result = this.scope.project.hitTest(event.point);
        if (test_result){
            test_result.item.selected = true;
            test_result.item.bounds;
        }
        console.log('碰撞检测:', test_result);
    }

    onKeyDown = (event) => {
        if(event.key === 'delete'){
            for(const item of this.scope.project.selectedItems){
                item.remove();
            }
        }
    }
}