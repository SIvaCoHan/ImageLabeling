<template>
  <div>
    <canvas :id="elementID" class="canvas-style" resize/>
    <div>
      <button @click="tools.select.activate">选择工具</button>
      <button @click="tools.pencil.activate">铅笔</button>
      <button @click="tools.line.activate">直线</button>
      <button @click="changeColor">修改颜色</button>
      <button @click="clearProject">清空</button>
      <button @click="tools.simplify.activate">简化</button>
      <button @click="tools.text.activate">文本</button>
      <button @click="tools.circle.activate">圆形</button>
      <button @click="tools.rectangle.activate">矩形</button>
      <button @click="tools.arrow.activate">箭头</button>
    </div>
  </div>
</template>

<script>
import paper from 'paper'

function simplifyTool(self, scope){
  // FIXME 简化不能无限制重复，否则会导致图像严重变形。
  scope.activate();
  let tool = new paper.Tool();
  tool.onMouseDown = (event) => {
    console.log('simplify test');
    const test_result = scope.project.hitTest(event.point);
    if (test_result){
      scope.project.deselectAll();
      test_result.item.selected = true;
      test_result.item.simplify();
    }
    console.log('成功:', test_result);
  }
  self.tools.simplify = tool;
}

function textTool(self, scope){
  scope.activate();
  let tool = new paper.Tool();
  tool.onMouseDown = (event) => {
    new paper.PointText({
      point: event.point,
      content: 'hello\nworld',
      fillColor: self.color,
      fontFamily: 'PingFang SC',
      fontWeight: 'bold',
      fontSize: 25,
    });
  }
  self.tools.text = tool;
}

function lineTool(self, scope){
  scope.activate();
  let tool = new paper.Tool();

  tool.onMouseDrag = (event) => {
    const tmp = new paper.Path.Line({
      from: event.downPoint,
      to: event.point,
      strokeColor: self.color,
    });
    console.log(tmp);
    // tmp.removeOn({
    //   drag: true
    // })
  }
  self.tools.line = tool;
}

function arrowTool(self, scope){
  // TODO Arrow 怎么画呢？
  scope.activate();
  let tool = new paper.Tool();

  tool.onMouseDrag = (event) => {
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

    const arrow = new paper.Group([
      new paper.Path([start, end]),
      new paper.Path([
        end.add(headLine.rotate(headAngle, oPoint)),
        end,
        end.add(headLine.rotate(-headAngle, oPoint))
      ])
    ])
    arrow.data.name = 'arrow'
    arrow.strokeColor = self.color
    arrow.removeOn({
      drag: true
    })
  }

  self.tools.arrow = tool;
}

function circleTool(self, scope){
  scope.activate();
  let tool = new paper.Tool();
  tool.onMouseDown = (event) => {
    self.temp = new paper.Path.Circle({
      center: event.downPoint,
      radius: 0,
      strokeColor: self.color
    });
  }
  tool.onMouseDrag = (event) => {
    self.temp.remove();
    self.temp = new paper.Path.Circle({
      center: event.downPoint,
      radius: event.point.subtract(event.downPoint).length,
      strokeColor: self.color
    });
  }
  self.tools.circle = tool;
}

function rectangleTool(self, scope){
  scope.activate();
  const tool = new paper.Tool();
  tool.onMouseDown = (event) => {
    self.temp = new paper.Path.Rectangle({
      from: event.point,
      to: event.point,
      strokeColor: self.color
    })
  }
  tool.onMouseDrag = (event) => {
    self.temp.remove();
    self.temp = new paper.Path.Rectangle({
      from: event.downPoint,
      to: event.point,
      strokeColor: self.color
    })
  }
  self.tools.rectangle = tool;
}

export default {
  name: "index-vue",
  data: () => ({
    elementID: "canvas-id",

    scope: null,
    color: 'black',
    tools: {
      // TODO 如何动态加载tools
      pencil: null,
      select: null,
    },
    temp: null,
  }),
  methods: {
    // 通用属性
    clearProject(){
      this.scope.project.clear();
    },
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
      // FIXME 选择工具一次可以选择几个？什么场景下需要同时选中多个对象？
      scope.activate();
      let tool = new paper.Tool();
      // const self = this;
      tool.onMouseDown = (event) => {
        console.log('select test');
        const test_result = scope.project.hitTest(event.point);
        if (test_result){
          scope.project.deselectAll();
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
        self.temp = new paper.Path({
          strokeColor: this.color,
          strokeJoin: 'round',
          strokeWidth: 1.5
        });
        self.temp.add(event.point);
      }
      tool.onMouseDrag = (event) => {
        self.temp.add(event.point);
      }
      tool.onMouseUp = (event) => {
        self.temp.add(event.point);
        // TODO 启用简化模式，通过删除path中部分point来提高整体性能。
        //  删除的时候会导致path略微变形，需要评估后才能使用。
        // self.temp.simplify();
      }
      this.tools.pencil = tool;
    },
    loadTools(scope){
      // FIXME: 首个加载的tool是默认启用的tool，因此要设计接口，默认启用哪个tool
      this.createPencilTool(scope);
      this.createSelectTool(scope);
      simplifyTool(this, scope);
      textTool(this, scope);
      lineTool(this, scope);
      arrowTool(this, scope);
      circleTool(this, scope);
      rectangleTool(this, scope);
    },
  },
  mounted() {
    // TODO 我们使用的是一个 scope 只有一个 project 的方式, 暂时没有想好我们是否要支持一个scope 是否要支持多个project
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
