// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../static/youth/youth.css'
import youthjs from '../static/youth/youth.js'
import vueDrag from 'vue-dragging'
Vue.use(vueDrag);
Vue.use(youthjs)
Vue.config.productionTip = false
import store from './store/index.js'
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store: store,
    components: { App },
    template: '<App/>'
})