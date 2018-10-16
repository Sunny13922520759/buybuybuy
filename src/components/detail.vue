<template>
    <div>
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="/goods.html">购物商城</a> &gt;
                <a href="/goods/42/1.html">商品详情</a>
            </div>
        </div>
        <div class="section">
            <div class="wrapper clearfix">
                <div class="wrap-box">
                    <div class="left-925">
                        <div class="goods-box clearfix">
                            <div class="pic-box" v-if="images.normal_size.length!=0">
                                <ProductZoomer :base-images="images" :base-zoomer-options="zoomerOptions" />
                            </div>
                            <div class="goods-spec">
                                <h1>{{goodsinfo.title}}</h1>
                                <p class="subtitle">{{goodsinfo.sub_title}}</p>
                                <div class="spec-box">
                                    <dl>
                                        <dt>货号</dt>
                                        <dd id="commodityGoodsNo">{{goodsinfo.goods_no}}</dd>
                                    </dl>
                                    <dl>
                                        <dt>市场价</dt>
                                        <dd>
                                            <s id="commodityMarketPrice">¥{{goodsinfo.market_price}}</s>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>销售价</dt>
                                        <dd>
                                            <em id="commoditySellPrice" class="price">¥{{goodsinfo.sell_price}}</em>
                                        </dd>
                                    </dl>
                                </div>
                                <div class="spec-box">
                                    <dl>
                                        <dt>购买数量</dt>
                                        <dd>
                                            <div class="stock-box">
                                                <el-input-number v-model="productNum" @change="updateNum" :min="1" :max="goodsinfo.stock_quantity" label="描述文字"></el-input-number>
                                            </div>
                                            <span class="stock-txt">
                                                库存
                                                <em id="commodityStockNum">{{goodsinfo.stock_quantity}}</em>件
                                            </span>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dd>
                                            <div id="buyButton" class="btn-buy">
                                                <button onclick="cartAdd(this,'/',1,'/shopping.html');" class="buy">立即购买</button>
                                                <button @click="cartAdd" ref="toCart" class="add">加入购物车</button>
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div id="goodsTabs" class="goods-tab bg-wrap">
                        <!-- 图钉 -->
                            <Affix>
                            <div id="tabHead" class="tab-head" style="position: static; top: 517px; width: 925px;">
                                <ul>
                                    <li>
                                        <a href="javascript:;" :class="{selected:saleIndex==1}" @click='saleIndex=1'>商品介绍</a>
                                    </li>
                                    <li>
                                        <a href="javascript:;" @click='saleIndex=0' :class="{selected:saleIndex==0}">商品评论</a>
                                    </li>
                                </ul>
                            </div>
                            </Affix>

                            <!-- 商品介绍 -->
                            <div class="tab-content entry"  v-show="saleIndex==1" v-html="goodsinfo.content"></div>
                           <!-- 商品评论 -->
                            <div class="tab-content"  v-show="saleIndex==0">
                                <div class="comment-box">
                                    <div id="commentForm" name="commentForm" class="form-box">
                                        <div class="avatar-box">
                                            <i class="iconfont icon-user-full"></i>
                                        </div>
                                        <div class="conn-box">
                                            <div class="editor">
                                                <textarea id="txtContent" name="txtContent" sucmsg=" " datatype="*10-1000" nullmsg="请填写评论内容！" v-model.trim="commenttxt"></textarea>
                                                <span class="Validform_checktip"></span>
                                            </div>
                                            <div class="subcon">
                                                <input id="btnSubmit" name="submit" type="submit" value="提交评论" class="submit" @click="sendComments">
                                                <span class="Validform_checktip"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <ul id="commentList" class="list-box">
                                        <p style="margin: 5px 0px 15px 69px; line-height: 42px; text-align: center; border: 1px solid rgb(247, 247, 247);" v-show="comments.length==0" >暂无评论，快来抢沙发吧！</p>
                                        <li v-for="item in comments" :key="item.goodsid" v-show="comments.length!=0">
                                            <div class="avatar-box">
                                                <i class="iconfont icon-user-full"></i>
                                            </div>
                                            <div class="inner-box">
                                                <div class="info">
                                                    <span>{{item.user_name}}</span>
                                                    <span>{{item.add_time | beautifyTimePro('YYYY-MM-DD hh:mm:ss')}}</span>
                                                </div>
                                                <p>{{item.content}}</p>
                                            </div>
                                        </li>
                                    </ul>
                                    <div class="page-box" style="margin: 5px 0px 0px 62px;">
 <Page :total="totalcount" :page-size="pageSize" :current="pageIndex" @on-change="handlePageIndex" @on-page-size-change="handlePageSize" :page-size-opts="[6,16,26,36]"  placement="top" show-elevator show-sizer show-total />
                                 </div>
                              </div>
                            </div>
                        </div> 
                    </div>
                      <!-- 热卖商品列表 -->
                    <div class="left-220">
                        <div class="bg-wrap nobg">
                            <div class="sidebar-box">
                                <h4>推荐商品</h4>
                                <ul class="side-img-list">
                                    <li v-for="item in hotgoodslist" :key="item.id">
                                        <div class="img-box">
                                            <!-- <a href="#/site/goodsinfo/90" class=""> -->
                                            <router-link :to="/detail/+item.id">
                                                <img :src="item.img_url">
                                                </router-link>
                                            <!-- </a> -->
                                        </div>
                                        <div class="txt-box">
                                            <!-- <a href="#/site/goodsinfo/90" class=""> -->
                                          <router-link :to="/detail/+item.id">
                                            {{item.title}}
                                            <!-- </a> -->
                                             </router-link>
                                            <span>{{item.add_time | beautifyTime('年','月','日')}}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <img class="fly_img" :src="imglist[0].original_path"  v-if="imglist.length!=0" ref="flyImg" alt="">
    </div>
</template>

<script>
import $ from "jquery";
export default {
  name: "detail",
  //初始化数据
  data: function() {
    return {
      //    商品id
      goodsid: "",
      //商品信息
      goodsinfo: "",
      // 热卖商品列表
      hotgoodslist: [],
      //图片列表
      imglist: [],
      //默认为商品介绍
      saleIndex: 1,
      //默认产品个数为1
      productNum: 1,
      //评论总条数
      totalcount: 0,
      //页码数
      pageIndex: 1,
      //默认页容量为6
      pageSize: 6,
      //评论信息
      comments: [],
      //   发表评论
      commenttxt: "",
      //放大镜图片数据
      images: {
        normal_size: [
          {
            id: 1,
            url:
              "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1203699916,3423550376&fm=11&gp=0.jpg"
          },
          {
            id: 2,
            url:
              "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=226493350,1788007705&fm=11&gp=0.jpg"
          }
        ]
      },
      zoomerOptions: {
        zoomFactor: 4,
        pane: "container-round",
        hoverDelay: 300,
        namespace: "inline-zoomer",
        move_by_click: true,
        scroll_items: 5,
        choosed_thumb_border_color: "#bbdefb"
      },
      isFinish: true
    };
  },
  methods: {
    // 根据id发送请求获取数据
    getProductId() {
      this.images.normal_size = [];
      this.$axios("site/goods/getgoodsinfo/" + this.goodsid).then(response => {
        // console.log(response);
        //商品信息
        this.goodsinfo = response.data.message.goodsinfo;
        //热卖商品列表
        this.hotgoodslist = response.data.message.hotgoodslist;
        //图片列表
        this.imglist = response.data.message.imglist;
        let tem_normal_size = [];
        this.imglist.forEach(v => {
          tem_normal_size.push({
            id: v.id,
            url: v.thumb_path
          });
        });
        this.images.normal_size = tem_normal_size;
      });
    },

    // 点击页码数
    handlePageIndex(pageIndex) {
      //获取当前页码
      this.pageIndex = pageIndex;
      // 获取数据
      this.getCommitsData();
    },

    //点击页容量
    handlePageSize(pageSize) {
      this.pageSize = pageSize;
      this.pageIndex = 1;
      this.getCommitsData();
    },

    //根据id和页码,页容量获得评论数据
    getCommitsData() {
      this.$axios(
        `site/comment/getbypage/goods/${this.goodsid}?pageIndex=${
          this.pageIndex
        }&pageSize=${this.pageSize}`
      ).then(response => {
        // console.log(response);
        //评论总条数
        this.totalcount = response.data.totalcount;
        // 页数
        this.pageIndex = response.data.pageIndex;
        // 页容量
        this.pageSize = response.data.pageSize;
        //评论信息
        this.comments = response.data.message;
      });
    },

    // 点击计数器数量改变
    updateNum() {
      // console.log('123');
    },

    //发表评论
    sendComments() {
      // console.log('123');
      if (this.commenttxt == "") {
        this.$Message.warning("还是写点什么吧");
        return;
      } else {
        this.$axios
          .post("site/validate/comment/post/goods/" + this.goodsid, {
            commenttxt: this.commenttxt
          })
          .then(response => {
            // console.log(response);
            if (response.data.message == "评论成功") {
              this.getCommitsData();
              this.pageIndex = 1;
              this.commenttxt = "";
            }
          });
      }
    },
    //加入购物车
    cartAdd() {
        //
      if (this.isFinish == false) {
        return;
      }
      this.isFinish = true;
    $(this.$refs.toCart).addClass("disabled");
    //   this.$store.commit("addCart", {
    //     id: this.goodsid,
    //     buyCount: this.productNum
    //   });
      // console.log(this.$refs.toCart);
      let startPos = $ (this.$refs.toCart).offset();
      //   console.log(startPos);
      let targetPos = $(this.$parent.$refs.cart).offset();
      //   console.log(targetPos);
      $(this.$refs.flyImg)
        .stop()
        .show()
        .addClass("animate")
        .css(startPos)
        .animate(
          {
            left: targetPos.left,
            top: targetPos.top
          },
          1000,
          () => {
            $(this.$refs.flyImg)
              .hide()
              .removeClass("animate");
            this.$store.commit("addCart", {
              id: this.goodsid,
              buyCount: this.productNum
            });
            this.isFinish = true;
            // 移除类名
            $(this.$refs.toCart).removeClass("disabled");
          }
        );
    }
  },

  // 发送请求
  created() {
    //获取地址id
    this.goodsid = this.$route.params.goodsid;
    //调用根据id发送请求获取数据
    this.getProductId();
    //根据id和页码,页容量获得评论数据
    this.getCommitsData();
  },

  //侦听数据改变
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    $route: function(to) {
      // console.log(to);
      // console.log(from);
      this.goodsid = to.params.goodsid;
      //默认为是商品介绍
      this.saleIndex = 1;
      //调用根据id发送请求获取数据
      this.getProductId();
      //根据id和页码,页容量获得评论数据
      this.getCommitsData();
      //默认产品个数为1
      this.productNum = 1;
      // 默认的页数是1
      this.pageIndex = 1;
    }
  }
};
</script>

<style>
/* 商品介绍的图片样式  */
#goodsTabs .tab-content img {
  display: block;
}
/* 放大镜的样式 */
.pic-box {
  width: 320px;
}
.inline-zoomer-zoomer-box {
  width: 300px;
  height: 300px;
}
.preview-box {
  width: 300px;
  height: 250px;
}
.preview-box > img {
  height: 250px;
}
.control-box {
  width: 300px;
  height: 50px;
}
.control-box > div {
  float: left;
  height: 50px;
}

.control {
  margin: 0 auto;
}
.control-box .thumb-list img {
  width: 50px;
  height: 50px;
  float: left;
}
/* 购物车图片动画 */
.fly_img {
  width: 60px;
  height: 60px;
  position: absolute;
  /* display: none; */
}
.fly_img.animate {
  transform: rotate(3600deg) scale(0.5, 0.5);
  opacity: 0;
    /* transition:all 1s; */
  transition: transform 1s, opacity 2s;
}
.goods-spec .spec-box .btn-buy .add.disabled{
  background-color: gray;
  cursor: not-allowed;
}
</style>


