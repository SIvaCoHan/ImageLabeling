<template>
  <div>
    <canvas :id="elementID" class="canvas-style" resize/>
    <div>
      <button @click="activeTool('select') ">选择工具</button>
      <button @click="activeTool('pencil')">铅笔</button>
      <button @click="changeColor">修改颜色</button>
    </div>
  </div>
</template>

<script>
import paper from 'paper'

export default {
  name: "index-vue",
  data: () => ({
    elementID: "canvas-id",

    scope: null,
    color: 'black',
    tools: {
      pencil: null,
      select: null,
    },
    temp: {
      path: null,
    },
  }),
  methods: {
    // 通用属性
    changeColor(){
      if(this.color==='black'){
        this.color = 'red';
      } else {
        this.color = 'black';
      }
    },

    // 工具方法
    createSelectTool(scope){
      // FIXME 选择工具的设计是一个难点
      // FIXME 选择工具不能只是一个点，应该是鼠标拖动后，可以画一个矩形，矩形区域内的碰撞物体，就是我们要选的物体。
      scope.activate();
      let tool = new paper.Tool();
      // const self = this;
      tool.onMouseDown = (event) => {
        console.log('select test');
        const test_result = scope.project.hitTest(event.point);
        if (test_result){
          test_result.item.selected = true;
        }
        console.log('碰撞检测:', test_result);
      }
      this.tools.select = tool;
    },
    createPencilTool(scope) {
      scope.activate();
      let tool = new paper.Tool();
      const self = this;
      tool.onMouseDown = (event) => {
        console.log('mouse down');
        self.temp.path = new paper.Path({
          strokeColor: this.color,
          strokeJoin: 'round',
          strokeWidth: 1.5
        });
        self.temp.path.add(event.point);
      }
      tool.onMouseDrag = (event) => {
        self.temp.path.add(event.point);
      }
      tool.onMouseUp = (event) => {
        self.temp.path.add(event.point);
      }
      this.tools.pencil = tool;
    },
    loadTools(scope){
      // FIXME: 首个加载的tool是默认启用的tool，因此要设计接口，默认启用哪个tool
      this.createPencilTool(scope);
      this.createSelectTool(scope);
    },
    activeTool(toolName){
      if(toolName === 'pencil'){
        this.tools.pencil.activate();
      }
      if(toolName === 'select'){
        this.tools.select.activate();
      }
    }
  },
  mounted() {
    this.scope = new paper.PaperScope();
    this.scope.setup(this.elementID);
    this.loadTools(this.scope);
  }
}
</script>


<style scoped>
.canvas-style {
  cursor: crosshair;
  width: 100% !important;
  height: 500px !important;
  border: 5px solid black;
  border-radius: 10px;
  display: block;
  margin: auto;
  box-shadow: 0 10px 8px -8px black;
}

canvas[resize] {
  width: 100%;
  height: 100%;
}
</style>
