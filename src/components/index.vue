<template>
  <div id="MainDiv">
  	<!-- 左侧 -->
  	<div id="LeftDiv">
  		<div class="autoDiv">
  			<!-- Projects文字 -->
  			<div id="pText">Projects</div>
  			<!-- 项目列表组件 -->
  			<div class="prjList">
  				<projectlist :list="this.$store.state.projectlist" :number="70">
  				</projectlist>
  			</div>
  			<div class="gnBtn">
  				<v-button type="primary" class="btn1" @click="addKanBan">新增看板</v-button>
  				<v-button type="default" class="btn2">管理看板</v-button>
  			</div>
  			<!-- 用户 -->
  			<div class="user">
  				<!-- http://static.change.tm/upload/avatar/9n9MckFUr21521594249.jpg -->
  				<v-avatar id="user-tx" size="large" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1041521719,4046775256&fm=27&gp=0.jpg"></v-avatar>
  				<!-- 信息/操作 -->
  				<div id="xx-cz">
  					<p>撒旦先生</p>
  					<p><a href="#">退出登录</a></p>
  				</div>
  			</div>
  		</div>
  	</div>
  	<!-- header -->
  	<div class="TopDiv">
  		<v-button class="topbtn1">全部标记为已读</v-button>
  		<v-button type="primary" class="topbtn2">查看日志</v-button>
  		<v-button type="primary" class="topbtn3" @click="addfenlei">新增分类</v-button>
  	</div>
  	<!-- 分类 -->
  	<div id="BottomDiv" ref="botDiv">
  		<fenlei :kanban="this.$store.state.danqian"></fenlei>
  	</div>
  	<v-modal name="addKanBanModal">
  		<div class="modal1">
  			<v-group>
  				<div class="shuru">
  					<p style="font-family: Verdana-Bold;font-size: 32px; color: #9e9e9e;text-align: left;">项目名称 - Project</p>
  					项目名称：
  					<v-input v-model="projectName" style="width:276px;"></v-input>
  					<v-button @click="addProject" type="primary" style="margin-top:10px;width:314px;text-align:center;">确定</v-button>
  				</div>
  			</v-group>
  		</div>
  	</v-modal>
  	<v-modal name="addFenLeiModal" class="select-modal">
  		<div class="select-fenlei">
  			<div class="panelSelect">
  				<p>分类名称 - </p>
  				<v-input v-model="fenleiName"></v-input>
  
  			</div>
  			<div class="panel_btn">
  				<v-button type="primary" class="btn" @click="sureCreate">确认创建</v-button>
  			</div>
  
  		</div>
  	</v-modal>
  
  </div>
</template>
<script>
import projectlist from "./project_list";
import fenlei from "./fenlei";
import axios from "axios";
export default {
  name: "Index",
  components: {
    //组件
    projectlist,
    fenlei
  },
  data() {
    return {
      projectName: "",
      fenleiName: "",
      isGuanLi: false
    };
  },
  data() {
    return {
      isDelete: true
    };
  },
  methods: {
    addKanBan() {
      this.youth.open("addKanBanModal");
    },
    addProject() {
      //添加向项目列表
      if (this.projectName.length != 0) {
       

        
        let projectName = this.projectName;
        //判断不能有重复名称
        for (let i = 0; i < this.$store.state.fenleilist.length; i++) {
          if (this.$store.state.fenleilist[i].cont == projectName) {
            this.youth.toast("不能有重复名称!", true);
            return;     //如果有直接返回不给任何机会
          }
        }
        console.log(this.$store.state.fenleilist);
        this.$store.commit("changeProjectlist", this.projectName);
         this.youth.close("addKanBanModal");
        axios
          .post("/api/project", {
            project: this.projectName
          })
          .then(
            data => {
              alert(data);
              this.youth.close("addKanBanModal");
            },
            data => {
              alert("发送失败！");
            }
          );
      } else {
        this.youth.toast("Project名称不能为空的！", true);
      }
    },
    //增加分类按钮
    addfenlei() {
      if (this.$store.state.xuanzhong) {
        this.youth.open("addFenLeiModal");
      } else {
        this.youth.toast("你还没有选择一个项目，请选择!");
      }
    },
    // 确认创建分类按钮
    sureCreate() {
      if (this.fenleiName.length != 0) {
        //当前选中的porject列表项，和分类名字

        let string = document.querySelector(".rrr").innerText;
        //删除字符串 因为后面带有 删除的字样
        var str = string.replace(" 删除", "");
        //将其打包成arr数组
        var arr = [str, this.fenleiName];
        for (let i = 0; i < this.$store.state.fenleilist.length; i++) {
          if (this.$store.state.fenleilist[i].cont == str) {
            for(let j = 0;j<this.$store.state.fenleilist[i].ar.length;j++){
              if(this.$store.state.fenleilist[i].ar[j].title==this.fenleiName){
                 this.youth.toast("分类-不能有重复名称!", true);
                return;
              }
            }
           
          }
        }
        axios.post(
          "/api/class",
          {
            project: str,
            class: this.fenleiName
          },
          data => {
            alert(data);
          },
          erro => {
            alert("发送失败：" + erro);
          }
        );

        this.$store.commit("changeFenlei", arr); //发送数组 进行创建添加 并显示到视图当中

        //点击一下 自动加一个314px的宽度 因为我设置的是float:left （PS：我的思路是这样的 不按照做的话可能会崩掉....））

        let width = parseInt(this.$refs.botDiv.offsetWidth);
        width += 314;
        this.$refs.botDiv.style.width = width + "px";

        this.youth.close("addFenLeiModal");

        this.youth.toast("创建成功！");
      } else {
        this.youth.toast("创建失败！名称不能是空的");
      }
    },
    //管理看板
    guanliKanBan() {
      var item_list = document.getElementsByClassName("list-item"); //获取所有类名的这个div
      if (this.isGuanLi) {
        //相当于一个开关
        //遍历一遍div然后高度变化 显示删除按钮
        for (let i = 0; i < item_list.length; i++) {
          item_list[i].style.height = "50px";
        }
        this.isGuanLi = false;
      } else {
        for (let i = 0; i < item_list.length; i++) {
          item_list[i].style.height = "85px";
        }
        this.isGuanLi = true;
      }
    },
    //初始化获取数据
    getAllData() {
      axios
        .post("/api/load", {
          get: "getData"
        })
        .then(
          data => {
            this.$store.commit("getAllData", data.data);
            this.youth.toast("获取数据成功!");
          },
          error => {
            alert("发送失败 : " + error);
          }
        );
    }
  },
  created() {
    this.getAllData();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "../GeneralStyle/style.less";
#MainDiv {
  width: 1900px;
  height: 940px;
  .overflow();
}
#LeftDiv {
  width: 320px;
  height: 920px;
  background: #ffffff;
  box-shadow: 0 0px 40px 0 rgba(0, 0, 0, 0.07);
  border-radius: 2px;
  position: fixed;
  z-index: 15;
  left: 0px;
}
#pText {
  width: 148px;
  height: 39px;
  font-family: Verdana-Bold;
  font-size: 32px;
  color: #9e9e9e;
  text-align: justify;
  .relative;
  top: 47px;
  height: 32px;
}
.autoDiv {
  margin: 0 auto;
  width: 280px;
  height: 870px;
  .relative;
  top: 20px;
}
.prjList {
  width: 289px;
  height: 300px;
  .relative;
  top: 80px;
  border-bottom: 1px solid #eeeeee;
  .overflow(@hid, auto);
}
.prjList::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 3px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 3px;
}
.prjList::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px @change_Blue;
  background: @change_Blue;
}
.prjList::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.gnBtn {
  width: 100%;
  height: 100px;
  .relative;
  top: 110px;

  .btn1 {
    width: 231px;
    .textCenter;
    margin-bottom: 15px;
  }

  .btn2 {
    width: 231px;
    .textCenter;
  }
}

.user {
  width: 100%;
  height: 150px;
  border-top: solid 1px #efefef;
  .relative;
  top: 316px;
}
#user-tx {
  .relative;
  top: 40px;
  left: 50px;
}
#xx-cz {
  width: 100px;
  height: 70px;
  .relative;
  left: 130px;
  top: -40px;
}
#xx-cz a {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #e91e63;
  text-align: justify;
}
#xx-cz p {
  font-family: PingFangSC-Regular;
  font-size: 16px;
}
.modal1 {
  height: 170px;
  width: 400px;
  border-radius: 10px;
}
.shuru {
  margin-left: 20px;
}
.TopDiv {
  position: fixed;
  top: -30px;
  left: 0px;
  width: 1550px;
  height: 100px;

  .topbtn1 {
    .absolute;
    top: 48px;
    left: 1050px;
  }
  .topbtn2 {
    .absolute;
    top: 48px;
    left: 1060px;
  }
  .topbtn3 {
    .absolute;
    top: 48px;
    left: 1100px;
  }
}

#BottomDiv {
  width: 1575px;
  height: 828px;

  .absolute;
  top: 100px;
  left: 330px;
  overflow-y: hidden;
  overflow-x: auto;
}
#BottomDiv::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 7px;
}
#BottomDiv::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px @change_Blue;
  background: @change_Blue;
}
#BottomDiv::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.select-fenlei {
  .relative;
  z-index: 100;
  height: 140px;
  width: 300px;

  .panelSelect {
    font-family: Verdana-Bold;

    color: #9e9e9e;
    margin-left: 30px;
    height: 80px;
    width: 230px;
    border-bottom: solid 1px #eeeeee;
  }
  .panel_btn {
    margin-left: 30px;
    margin-top: 10px;
  }
  .btn {
    width: 170px;
    .textCenter;
  }
}
</style>
