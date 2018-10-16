import Vue from 'vue'
import App from './App.vue'
import index from './components/index.vue'
import detail from './components/detail.vue'
import shopCart from './components/shopCart.vue'
import checkOrder from './components/checkOrder.vue'
import login from './components/login.vue'
Vue.config.productionTip = false



//axios插件
import axios from 'axios'
axios.defaults.withCredentials = true; //让ajax携带cookie
// 需把axios挂载到Vue的原型里
Vue.prototype.$axios = axios;
axios.defaults.baseURL = 'http://111.230.232.110:8899';
//时间插件
import moment from 'moment'
//设置全局过滤器
Vue.filter('beautifyTime', function (value, str1, str2, str3) {

  return moment(value).format(`YYYY${str1}MM${str2}DD${str3}`);
})
Vue.filter('beautifyTimePro', function (value, formatStr) {

  return moment(value).format(formatStr);
})

// element-ui插件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//iview的插件
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

//引入懒加载插件
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  preLoad: 1.3,
  // error: require('dist/error.png'),
  loading: require('./assets/images/loading.jpg'),
  attempt: 1
})

//引入放大镜效果插件
import ProductZoomer from 'vue-product-zoomer'
Vue.use(ProductZoomer)

//引入vuex
import Vuex from 'vuex'
Vue.use(Vuex)
//store是一个仓库
const store = new Vuex.Store({
  //state类似data
  state: {
    shopCartData: JSON.parse(window.localStorage.getItem('cartData')) || {},
    isLogin: false
  },
  //类似methods 驱动应用的数据源
  mutations: {
    //加入购物车
    addCart(state, opt) {
      //没有加入购物车,新增
      if (state.shopCartData[opt.id] == undefined) {
        // Vue.set(vm.someObject, 'b', 2)
        Vue.set(state.shopCartData, opt.id, opt.buyCount)
      } else {
        //  已加入了购物车,添加
        state.shopCartData[opt.id] += opt.buyCount;
      }
    },
    updateCart(state, opt) {
      // 覆盖之前的id值
      state.shopCartData[opt.id] = opt.newCount;

    },
    //根据id删除购物商品
    delById(state, id) {
      Vue.delete(state.shopCartData, id);
    },
    //更改登录状态
    changeLoginState(state, newState) {
      state.isLogin = newState;
    }

  },
  // 类似计算属性 computed
  getters: {
    cartGoodCount(state) {
      //如果没有加入购物车,应为0
      if (state.shopCartData == undefined) {
        return 0;
      } else {
        //加入了购物车才能是加入的数量
        let totalCount = 0;
        for (const key in state.shopCartData) {
          totalCount += state.shopCartData[key]

        }
        return totalCount;
      }

    }
  }
})

//vue-router插件
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [{
    path: "/",
    component: index,
    meta:{
      zhName:"首页"
    }
  },
  {
    path: "/index",
    component: index,
    meta:{
      zhName:"首页"
    }
  },
  {
    path: "/detail/:goodsid",
    component: detail,
    meta:{
      zhName:"商品详情"
    }
  },
  {
    path: "/shopCart",
    component: shopCart,
    meta:{
      zhName:"购物车"
    }
  },
  {
    path: "/checkOrder",
    component: checkOrder,
    meta:{
      zhName:"订单详情"
    }
  },
  {
    path: "/login",
    component: login,
    meta:{
      zhName:"登录"
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // console.log(to);
  window.document.title=to.meta.zhName
  if (to.path == "/checkOrder") {
    // 发送请求判断是登录
    axios('site/account/islogin').then(response => {
      // console.log(response);
      //没有登录返回登录页面重新登录
      if (response.data.code == "nologin") {
        //打回登录页
        Vue.prototype.$message.info('还没登录呢,要登录哦');
        router.push('/login')
      } else {
        //登录了就进行下一步
        next();
      }

    })
  } else {
    next();
  }

})

new Vue({
  render: h => h(App),
  router,
  store,
  //更改数据
  created() {
    axios.get("site/account/islogin").then(response => {
      // console.log(response);
      if (response.data.code == "logined") {
        store.commit("changeLoginState", true)
      } else {
        store.commit("changeLoginState", false)
      }

    })
  }
}).$mount('#app')

window.onbeforeunload = function () {
  // window.localStorage.clear();
  window.localStorage.setItem('cartData', JSON.stringify(store.state.shopCartData))
}