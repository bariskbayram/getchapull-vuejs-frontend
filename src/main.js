import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import SignUp from './components/Signup.vue'
import BaseContent from './components/BaseContent.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

Vue.prototype.$url = "http://localhost:8080";

const router = new VueRouter({
  routes: [
    { path: '/', component: Login},
    { path: '/login', component: Login},
    { path: '/signup', component: SignUp},
    { path: '/:username', component: BaseContent}
  ],
  mode: 'history'
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
