<template>
    <div>
        <!-- 头部部分 -->
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="/cart.html">购物车</a>
            </div>
        </div>

        <div class="section">
            <div class="wrapper">
                <div class="bg-wrap">
                    <!--购物车头部-->
                    <div class="cart-head clearfix">
                        <h2>
                            <i class="iconfont icon-cart"></i>我的购物车</h2>
                        <div class="cart-setp">
                            <ul>
                                <li class="first active">
                                    <div class="progress">
                                        <span>1</span>
                                        放进购物车
                                    </div>
                                </li>
                                <li>
                                    <div class="progress">
                                        <span>2</span>
                                        填写订单信息
                                    </div>
                                </li>
                                <li class="last">
                                    <div class="progress">
                                        <span>3</span>
                                        支付/确认订单
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--购物车头部-->
                    <!--商品列表-->
                    <div class="cart-box">
                        <input id="jsondata" name="jsondata" type="hidden">
                        <table width="100%" align="center" class="cart-table" border="0" cellspacing="0" cellpadding="8">
                            <tbody>
                                <tr>
                                    <th width="48" align="center">
                                        <a>选择</a>
                                    </th>
                                    <th align="left" colspan="2">商品信息</th>
                                    <th width="84" align="left">单价</th>
                                    <th width="104" align="center">数量</th>
                                    <th width="104" align="left">金额(元)</th>
                                    <th width="54" align="center">操作</th>
                                </tr>
                                <!-- 购物车无商品 -->
                                <tr v-show="messages.length==0">
                                    <td colspan="10">
                                        <div class="msg-tips">
                                            <div class="icon warning">
                                                <i class="iconfont icon-tip"></i>
                                            </div>
                                            <div class="info">
                                                <strong>购物车没有商品！</strong>
                                                <p>您的购物车为空，
                                                    <a href="/index.html">马上去购物</a>吧！</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                               <!-- 购物车有商品 -->
                                 <tr v-for="item in messages" :key="item.id" v-show="messages.length!=0">
                                     <td>
                                             <el-switch v-model="item.selected" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                             </td>
                                             <td>
                                                 <img :src="item.img_url" alt="" style="width: 65px;">
                                                 </td>
                                                 <td> {{item.title}}</td>
                                                 <td>{{item.sell_price}}</td>
                                                 <td>
                                                     <!-- <div class="el-input-number el-input-number--mini">
                                                     <span role="button" class="el-input-number__decrease">
                                                         <i class="el-icon-minus"></i>
                                                         </span>
                                                         <span role="button" class="el-input-number__increase">
                                                             <i class="el-icon-plus"></i>
                                                             </span>
                                                             <div class="el-input el-input--mini">
                                                                 <input type="text" autocomplete="off" max="Infinity" min="0" role="spinbutton" aria-valuemax="Infinity" aria-valuemin="0" aria-valuenow="7" aria-disabled="undefined" class="el-input__inner">
                                                                 </div>
                                                                 </div> -->
                                                                   <el-input-number v-model="item.buycount" @change="countChange(item.id,$event)" :min="1"  label="描述文字"></el-input-number>
                                                                 </td>
                                                                 <td>{{item.buycount*item.sell_price}}</td>
                                                                 <td>
                                                                     <button type="button" class="el-button el-button--danger is-circle" @click="deleteOne(item.id)">
                                                                         <i class="el-icon-delete"></i></button>
                                                                         </td>
                                                                         </tr>
                                <tr>
                                    <th align="right" colspan="8">
                                        已选择商品
                                        <b class="red" id="totalQuantity">{{totalNum}}</b> 件 &nbsp;&nbsp;&nbsp; 商品总金额（不含运费）：
                                        <span class="red">￥</span>
                                        <b class="red" id="totalAmount">{{totalPrice}}</b>元
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--/商品列表-->
                    <!--购物车底部-->
                    <div class="cart-foot clearfix">
                        <div class="right-box">
                               <router-link to="/index">
                            <button class="button">继续购物</button>
                             </router-link>
                            <router-link to="/checkOrder">
                            <button class="submit" >立即结算</button>
                            </router-link>
                        </div>
                    </div>
                    <!--购物车底部-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "shopCart",
  data: function() {
    return {
      //购物车数据信息
      messages: []
    };
  },
  //    发送请求
  created() {
    //根据id获取购物车商品数据
    //  console.log(this.$store.state.shopCartData);
    //获取id
    let shopCartData = this.$store.state.shopCartData;
    // console.log(cartData);
    let ids = "";
    for (const key in shopCartData) {
      ids += key;
      ids += ",";
    }
    ids = ids.slice(0, -1);
    // console.log(ids);
    this.$axios(`site/comment/getshopcargoods/${ids}`).then(response => {
      //   console.log(response);
      //   this.messages=response.data.message;
      response.data.message.forEach(v => {
        v.buycount = shopCartData[v.id];
        v.selected = true;
      });
      this.messages = response.data.message;
    });
  },
  computed: {
    //总价格
    totalPrice() {
      let totalPrice = 0;
      this.messages.forEach(v => {
        //   console.log(v);
        if (v.selected == true) {
          totalPrice += v.sell_price * v.buycount;
        }
      });

      return totalPrice;
    },
    //总数量
    totalNum() {
      let totalNum = 0;
      this.messages.forEach(v => {
        //   console.log(v);
        if (v.selected == true) {
          totalNum += v.buycount;
        }
      });

      return totalNum;
    }
  },
  methods: {
    //计数器数据改变
    countChange(id, newCount) {
      this.$store.commit("updateCart", {
        id,
        newCount
      });
    },
    //删除商品
    deleteOne(id) {
      this.$confirm("库存不多啦,不买没有啦!!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.commit("delById", id);
          //遍历messages
          this.messages.forEach((v, i) => {
            //   console.log(v);
            //   console.log(i);
            if (v.id == id) {
              this.messages.splice(i, 1);
            }
          });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style>

</style>

