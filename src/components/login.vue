<template id='boardRoot'>

  <div id='board'>
      <p id='changeBoard'>CHANGE BOARD</p>
			<p id='changeBoard_2'>启嘉网看板系统</p>
			<hr id='boardLine'>
			<v-input name='account' placeholder='Account' v-model='Account' style='width: 336px; height: 38px; position: absolute; top: 192px; left: 32px;'></v-input>
			<v-input onkeyup="value=value.replace(/[\W]/g,'') " onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))" type='password' name='pw' placeholder='Password' v-model='Password' style='width: 336px; height: 38px; position: absolute; top: 246px; left: 32px;'></v-input>
			<hr id='boardLine_2'>
			<v-button type="primary" id = 'loginButton' @click='getUserData'>Login</v-button>
      
  </div>
  
</template>

<script>
import md5 from "js-md5";
import axios from "axios";

export default {
  name: "login",
  data: function() {
    return {
      Account: "", //获取用户的账号密码，双向绑定
      Password: ""
    };
  },
  methods: {
    qwe: function() {
      alert("aaa");
    },
    getUserData: function() {
      var element = {
        user: this.Account,
        password: md5(this.Password)
      };
      //axios给后端传输用户输入的账号的密码
      axios
        .post("/api/login?t = " + new Date().getTime(), element) //实时变化的地址，后台不会接收?t=，这样不会受到缓存的干扰
        .then(response => {
          console.log(response);
          // console.log('请求成功' + eval(response));
          if (response.data.login == true) {
            this.$router.push("/index"); //路由跳转到首页
          } else {
            alert("登录失败");
          }
        })
        .catch(function(error) {
          alert("请求失败" + error);
        });
    }
  }
};
</script>

<style>
#board {
  width: 400px;
  height: 451px;
  background: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.07), 0 1px 2px 0 rgba(0, 0, 0, 0.24);
  border-radius: 2px;
  text-align: center;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
#changeBoard {
  font-family: PingFangSC-Semibold;
  font-size: 24px;
  color: #03a9f4;
  text-align: center;
  position: absolute;
  top: 48px;
  left: 102px;
  margin: 0 auto;
  height: 33px;
}
#changeBoard_2 {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #9e9e9e;
  text-align: center;
  margin: 0 auto;
  height: 22px;
  width: 144px;
  position: absolute;
  top: 89px;
  left: 129px;
}
#boardLine {
  border: 1px dashed #eeeeee;
  width: 336px;
  margin: 0 auto;
  position: absolute;
  top: 159px;
  left: 32px;
}
#boardLine_2 {
  border: 1px dashed #eeeeee;
  width: 336px;
  margin: 0 auto;
  position: absolute;
  top: 316px;
  left: 32px;
}
#loginButton {
  border-radius: 2px;
  width: 320px;
  height: 22px;
  padding: 8px;
  position: absolute;
  top: 361px;
  left: 32px;
  text-align: center;
}
</style>
