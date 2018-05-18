<template>
  <div ref="item">
  	<div class="list-item" v-for="(item,index) in this.$store.state.projectlist" :key="index" @click="itemClick">
  		{{item}}
  
  	</div>
  </div>
</template>
<script>
  export default {
    name: 'listitem',
    props: {
      number: Number //接受的参数为数字类型
    },
    props: {
      list: Array
    },
    data() {
      return {
        projectlist: [] //接收共享数据中的列表名称
      }
    },
    methods: {
      //进行porject列表选中渲染蓝色样式
      itemClick(e) {
        //获取点击元素的子元素集合
        let items = this.$refs.item.childNodes
        if (e.target.classList.contains('list-item')) {
          for (let i = 0; i < items.length; i++) {
            //如果循环的子元素与目前点击的元素相同
            if (e.target == items[i]) {
              //先判断点击元素是否存在style样式为蓝色的css
              if (e.target.classList.contains('adBlue')) {
                //有不执行任何操作
              } else {
                //没有？ 进行加入css样式 这里的.rrr class样式为了判断当前选中的内容是哪个
                e.target.classList.add('adBlue', 'rrr')
                this.$store.state.xuanzhong = true //选中为真才能进行增加分类按钮的点击
                /**这里进行字符串分割 */
  
                let string = document.querySelector('.rrr').innerText
  
                var str = string.replace(' 删除', '')
                this.$store.commit('a', str) //发送一个a消息表示将其选中按钮的内容发送到Vuex中
              }
            } else {
              //如果遍历的不是当前选中的元素则 对其进行蓝色的CSS样式删除
              items[i].classList.remove('adBlue', 'rrr')
            }
          }
        }
      }
      //删除project项目及其所有东西
    }
  }
</script>
<style lang="less" scoped>
  @import "../GeneralStyle/style.less";
  .list-item {
    cursor: pointer;
    position: relative;
    padding-left: 10px;
    width: 272px;
    height: 50px; /*54px*/
    line-height: 54px;
    transition-duration: 0.2s;
    border-radius: 6px;
    .overflow(); /*超出部分隐藏*/
    white-space: nowrap; /*不换行*/
    text-overflow: ellipsis; /*超出部分文字以...显示*/
  }
  .adBlue {
    background: @change_Blue !important;
    color: #fff;
  }
  .list-item:hover {
    background: #efefef;
  }
  .guanli_delete {
    width: 215px !important;
    height: 10px !important;
    line-height: 10px !important;
    text-align: center !important;
    position: absolute !important;
    top: 50px !important;
    left: 10px !important;
  }
</style>
