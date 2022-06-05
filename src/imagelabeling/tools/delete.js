// import paper from "paper";
import Base from './base';


export default class Delete extends Base {
    toolId = 'delete';
    toolName = '删除';

    activate(property) {
        super.activate(property);
        for(const item of this.scope.project.selectedItems){
            item.remove();
        }
    }

}