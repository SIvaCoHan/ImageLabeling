<template>
  <div>
    <canvas :id="elementID" class="canvas-style" resize/>
    <div>
      <button v-for="t in toolList" v-bind:key="t.toolId" @click="activateTool(t)">{{t.toolName}}</button>
    </div>
    <div>
      <button v-for="t in commonToolList" v-bind:key="t.toolId" @click="activateTool(t)">{{t.toolName}}</button>
      <button>!撤销</button>
      <button>!重做</button>
      <button @click="scope.project.clear()">清空</button>
      颜色: <input type="color" v-model="color"/>
    </div>
  </div>
</template>

<script>
import paper from 'paper'
import Pencil from "@/imagelabeling/tools/pencil";
import Line from "@/imagelabeling/tools/line";
import Arrow from "@/imagelabeling/tools/arrow";
import Circle from "@/imagelabeling/tools/circle";
import Select from "@/imagelabeling/tools/select";
import Delete from "@/imagelabeling/tools/delete";

export default {
  name: "index-vue",
  data: () => ({
    elementID: "canvas-id",
    scope: null,
    color: 'black',
    currentTool: null,
    toolList: [],
    commonToolList: [],
    undoList: [],
    redoList: [],
  }),
  watch: {
    // 自动更新颜色
    color: function (){
      console.log('trigger', this.currentTool)
      if (this.currentTool){
        // TODO 修改path颜色怎么处理
        this.activateTool(this.currentTool);
      }
    }
  },
  methods: {
    loadTools(scope) {
      // 配置 tool
      const _toolList = [Pencil, Line, Arrow, Circle];
      const _commonToolList = [Select, Delete];

      // 加载 tool
      for(const t of _commonToolList){
        this.commonToolList.push(new t(scope));
      }

      for(const t of _toolList){
        this.toolList.push(new t(scope));
      }

    },
    activateTool(tool){
      this.currentTool = tool;
      tool.activate({borderSize: 3, borderColor: this.color})
    }
  },
  mounted() {
    this.scope = new paper.PaperScope();
    this.scope.setup(this.elementID);
    this.scope.framerate=120
    this.loadTools(this.scope)
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
