import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import SignUp from './components/Signup.vue'
import NavComponent from './components/NavBarComponent.vue'
import BaseContent from './components/ProfileBaseComponent.vue'
import EditProfile from './components/EditProfileComponent.vue'
import MainPage from './components/MainPage.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

// Vue.prototype.$url = "https://metal-review-spring.herokuapp.com";
Vue.prototype.$url = "http://localhost:8080";

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login},
    { path: '/signup', component: SignUp},
    { path: '/', component: NavComponent,
      children: [
        {
          path: '',
          component: MainPage
        },
        {
          path: ':username',
          component: BaseContent
        },
        {
          path: ':username/edit-profile',
          component: EditProfile
        }
      ]
    }
  ],
  mode: 'history'
})

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

router.beforeEach( (to, from, next) => {
  const expirationDate = localStorage.getItem('expirationDate');
  const now = new Date();
  if( now >= expirationDate) next( () => {
    localStorage.clear();
  })
  if (to.path !== '/login' && !localStorage.getItem('isLoggedIn')) next( () => {
    router.push('/login')
  })
  else next()
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
