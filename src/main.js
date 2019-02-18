// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/base.css'
import HttpServer from '@/http.js'
import App from './App'
import cusBread from './components/cusbread.vue'
import router from './router'
import moment from 'moment'
Vue.use(ElementUI);
Vue.component("cusBread",cusBread);
Vue.config.productionTip = false
Vue.use(HttpServer);



Vue.filter('fmtdate',(v)=>{
  return moment(v).format('YYYY-MM-DD');
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
