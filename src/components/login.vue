<template>
    <div>
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="/login.html">会员登录</a>
            </div>
        </div>
        <div class="section">
            <div class="wrapper">
                <div class="bg-wrap">
                    <div class="nav-tit">
                        <a class="selected" href="javascript:;">账户登录</a>
                        <i>|</i>
                        <a href="/register.html">免费注册</a>
                    </div>

                    <div id="loginform" name="loginform" class="login-box">
                        <div class="input-box">
                            <input id="txtUserName" v-model.trim="username" name="txtUserName" type="text" placeholder="用户名/手机/邮箱" maxlength="50">
                        </div>
                        <div class="input-box">
                            <input id="txtPassword" v-model.trim="password" name="txtPassword" type="password" placeholder="输入登录密码" maxlength="16">
                        </div>
                        <div class="btn-box">
                            <input id="btnSubmit" name="btnSubmit" type="submit" value="立即登录" @click="login">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: "login",
  data: function() {
    return {
      //用户名
      username: "",
      // 密码
      password: ""
    };
  },
  //事件触发
  methods: {
    //登录
    login() {
      //发送请求
      this.$axios
        .post("site/account/login", {
          user_name: this.username,
          password: this.password
        })
        .then(response => {
          // console.log(response);

          if (response.data.status == 1) {
            this.$message.warning("登录失败");
          } else {
            this.$message.success("登录成功");
            // this.$router.push("/checkOrder");
            //把登录状态改为true
            this.$store.commit("changeLoginState", true);
            this.$router.back();
          }
        });
    }
  }
};
</script>

