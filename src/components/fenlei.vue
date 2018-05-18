<template>
  <div>
  	<div v-for="(items,index) in this.$store.state.fenleilist" :key="index">
  		<div class="fenlei-item" v-if="items.cont == kanban" :style="{background:index%2==0?'#fff':'#fafafa'}" v-for="(item,index) in items.ar"
  		 :key="index" @drop='drop($event)' @dragover='allowDrop($event)'>
  
  			<div class="fenlei-title">{{item.title}}
  
  			</div>
  
  			<transition-group name="fade">
  				<!-- 点击卡片查看详细信息 -->
  				<v-card level="0" hover="false" v-for="i in item.fenlei" :key="i.title" class="card" draggable="true" @click.native="details(i.title,i.content)"
  				 @dragstart.native="drapStartMove($event)" id="cardd">
  					<v-title>
  						<p style="font-family: PingFangSC-Regular;
  							font-size: 20px;
  							color: #03A9F4;
  							letter-spacing: 0;">
  							{{i.title}}
  						</p>
  						<h2>详细内容</h2>
  						<div style="width:225px;
  							height:85px;
  							overflow: hidden;
  							text-overflow: ellipsis;
  							display: -webkit-box;
  							-webkit-line-clamp: 4;
  							-webkit-box-orient: vertical;">
  							{{i.content}}
  						</div>
  						<!-- <a href="#" class="chakanxq">查看详情</a> -->
  					</v-title>
  
  				</v-card>
  
  			</transition-group>
  			<a href="#" class="addContent" @click="addContent($event)">＋增加内容</a>
  		</div>
  	</div>
  	<v-modal name="addContentModal">
  		<div class="modal-div1">
  			<div class="modal-div1-select">
  				<h2>添加内容 - Add Content</h2>
  				<v-group name="group_dropdown">
  					<v-dropdown class="drop" name="q1" v-on:change="result" style="width:330px;">
  						<v-item>添加任务卡片</v-item>
  						<v-item>添加1...</v-item>
  						<v-item>添加2...</v-item>
  					</v-dropdown>
  				</v-group>
  			</div>
  			<transition name="fade">
  				<div class="modal-div1-view" v-show="isShow">
  					<h3>标题 - Title</h3>
  					<v-input style="width:330px;" v-model="textTitle"></v-input>
  					<p>详细任务</p>
  					<textarea name="text-content" id="" cols="44" rows="10" v-model="textArea"></textarea>
  				</div>
  			</transition>
  			<div class="modal-div1-btn">
  				<v-button type="primary" class="btn-item-div1" @click="addSure">确认添加</v-button>
  			</div>
  		</div>
  	</v-modal>
  	<v-modal name="detailsModal" class="detailsModal">
  		<!-- 详细信息卡片 -->
  		<v-card id="detailsCard">
  			<v-title>
  				<p style="font-family: PingFangSC-Regular;
  							font-size: 20px;
  							color: #03A9F4;
  							letter-spacing: 0;">{{detailsTitle}}</p>
  				<h2>详细内容</h2>
  				<div class="detailsDiv1">
  					{{detailsContent}}
  				</div>
  			</v-title>
  		</v-card>
  	</v-modal>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "fenlei",
  props: {
    kanban: String //接受某个父元素传入得数据
  },
  data() {
    return {
      textTitle: "", //卡片任务标题
      textArea: "",
      isShow: false, //判断当前是否选中添加卡片内容的选项卡
      nowPitchTitle: null, //当前选中的分类标题
      Floatleft: "left",
      detailsTitle: "", //删除
      detailsContent: "",
      dom: null,
      DragAndDropTitle: "", //表示被拖拽的标题title
      DragAndDropContent: "", //表示被拖拽的内容
      formerClassify: "" //原被拖放元素分类标题
    };
  },
  methods: {
    bu() {},
    addContent(e) {
      this.nowPitchTitle = e.target.parentNode.childNodes[0].innerText; //获取当前标题 用于Vuex对当前点击的是哪个分类进行判断
      this.youth.open("addContentModal"); //打开添加内容的模态窗
    },
    //youth选项卡的操作函数
    result(data) {
      //显示隐藏任务卡片
      if (data.value == "添加任务卡片") {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    //确认添加内容按钮
    addSure() {
      //判断开关是否开启
      if (this.isShow) {
        //判断标题和内容不能为空的
        
        if (this.textTitle != "" && this.textArea != "") {
          for(let i = 0;i<this.$store.state.fenleilist.length;i++){
            if(this.$store.state.fenleilist[i].cont==this.kanban){
              for(let j = 0;j<this.$store.state.fenleilist[i].ar.length;j++){
                if(this.$store.state.fenleilist[i].ar[j].title==this.nowPitchTitle){
                  for(let k = 0;k<this.$store.state.fenleilist[i].ar[j].fenlei.length;k++){
                    if(this.$store.state.fenleilist[i].ar[j].fenlei[k].title==this.textTitle){
                      this.youth.toast("内容标题不能一致哦！")
                      return;

                    }
                  }
                }
              }
            } 
          }
          this.youth.close("addContentModal"); //打开增加内容窗口
          
          let that = this;
          //创建一个对象 对对象进行加工
          let a = {
            title: that.textTitle,
            content: that.textArea
          };
          let b = [this.nowPitchTitle, a, this.kanban]; //将获取到的当前标题加入
          axios
            .post("/api/content", {
              project: this.kanban,
              class: this.nowPitchTitle,
              title: that.textTitle,
              content: that.textArea
            })
            .then(response => {
              this.youth.toast("创建成功")
            });
          this.$store.commit("addfenlei", b); //发送到Vuex全局中
        } else {
          this.youth.toast("标题或任务内容不能为空的！", true);
        }
      }
    },
    details(title, content) {
      this.detailsTitle = title;
      this.detailsContent = content;
      this.youth.open("detailsModal");
    },
    //开始拖动卡片
    drapStartMove(e) {
      this.dom = e.currentTarget;
      e.dataTransfer.setData("text", ""); //由于要求火狐必须设置有拖拽数据才可以展示拖拽
      console.log(this.dom);
      //层级关系 this.dom.childNodes[0]表示v-title标签
      //this.dom.childNodes[0].childNodes[0] 表示v-title下面的p标签 也就是title标题
      //this.dom.childNodes[0].childNodes[4] 表示v-title下面的div标签 也就是content标题
      //最初我也不知道为什么这个明明是在第三个位置却变成了5 因为浏览器解析的是前面加了2个text标签》。。。。。 这很迷
      this.DragAndDropTitle = this.dom.childNodes[0].childNodes[0].innerText;
      this.DragAndDropContent = this.dom.childNodes[0].childNodes[4].innerText;
      this.formerClassify = this.dom.parentNode.parentNode.childNodes[0].innerText; //原拖放标题

      console.log(this.DragAndDropTitle);
      console.log(this.DragAndDropContent);
    },
    //拖动期间执行判断任务
    drop(e) {
      e.preventDefault();
      //第一个是拖放的目标元素 第二个是左侧project选中的项
      let obj = {
        nowPitchProjectTitle: document.querySelector(".rrr").innerText, //表示当前project项标题
        placeTheTitle: e.target.childNodes[0].innerText, //拖放到的分类标题
        DragAndDropTitle: this.DragAndDropTitle, //拖拽元素标题
        DragAndDropContent: this.DragAndDropContent, //拖拽元素内容
        formerClassify: this.formerClassify //原拖放标题
      };
      axios
        .post("/api/move", {
          nowPitchProjectTitle: document.querySelector(".rrr").innerText, //表示当前project项标题
          placeTheTitle: e.target.childNodes[0].innerText, //拖放到的分类标题
          DragAndDropTitle: this.DragAndDropTitle, //拖拽元素标题
          DragAndDropContent: this.DragAndDropContent, //拖拽元素内容
          formerClassify: this.formerClassify //原拖放标题
        })
        .then(response => {
          if (response.data) {
            console.log(response.data)
            this.$store.commit("dragAndDrop", obj);
            this.youth.toast("移动完成！");
          }
        });

      console.log(e.target.childNodes[0].innerText);
      console.log(document.querySelector(".rrr").innerText);
    },
    //放置类型 必须判断放置的div不然就会放到别处而引发bug
    allowDrop(e) {
      if (e.target.classList.contains("fenlei-item")) {
        e.preventDefault();
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../GeneralStyle/style.less";
.fenlei-item::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 3px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 3px;
}
.fenlei-item::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px @change_Blue;
  background: @change_Blue;
}
.fenlei-item::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}

.fenlei-item {
  width: 314px;
  height: 826px;
  margin-right: 10px;
  .relative;
  display: inline-block;
  .overflow(@hid, auto);
}
.fenlei-title {
  width: 314px;
  height: 40px;
  font-size: 16px;
  text-align: center;

  z-index: 10;
  background: #fff;
  .relative;
  top: 0;
  overflow: hidden;
}
.drop {
  width: 265px;
  height: 40px;
}
.addContent {
  color: @change_Blue;
  cursor: pointer;
  text-decoration: none;
  .relative;
  top: 50px;
  left: 113px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: @change_Blue;
  text-align: justify;
  font-weight: 800;
}
.modal-div1 {
  height: 500px;
  width: 400px;
  .relative;
  border-radius: 10px;
}
.modal-div1-select {
  margin-left: 35px;
  border-bottom: solid 1px #eeeeee;
  height: 125px;
  width: 330px;
}
.drop {
  width: 265px;
  height: 40px;
}
.modal-div1-view {
  margin-left: 35px;
  width: 330px;
  border-bottom: solid 1px #eeeeee;
  height: 300px;
}
.modal-div1-btn {
  margin-left: 35px;

  width: 330px;
  .absolute;
  height: 40px;
  top: 450px;
}
.btn-item-div1 {
  width: 286px;
  text-align: center;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.card {
  height: 200px;
  width: 250px;
  margin: 0 auto;
  text-align: left;
  background-color: #ffff;
  cursor: pointer;
  position: relative;
  z-index: 100;
  display: block;
}
.chakanxq {
  text-decoration: none;
  background: #fff;
  color: black;
  padding: 5px;
  font-size: 13px;
  margin-left: 160px;
  .relative;
  top: 10px;
  border: solid 1px #eeeeee;
  transition-duration: 0.2s;
}
.chakanxq:hover {
  background: @change_Blue;
  color: #fff;
}
#detailsCard {
  width: 400px;
  height: 600px;
  margin-top: -30px;
}
.detailsModal {
}
.detailsDiv1 {
  width: 360px;
  height: 520px;
  border: solid 1px;
  overflow: auto;
  border: solid 1px #eeeeee;
  padding: 5px;
}
.detailsDiv1::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 3px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 3px;
}
.detailsDiv1::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px @change_Blue;
  background: @change_Blue;
}
.detailsDiv1::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
</style>
