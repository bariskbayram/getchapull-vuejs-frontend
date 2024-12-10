import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router'; // VueRouter yerine bu import edilir
import Login from './components/Login.vue';
import SignUp from './components/Signup.vue';
import NavComponent from './components/NavBarComponent.vue';
import BaseContent from './components/ProfileBaseComponent.vue';
import EditProfile from './components/EditProfileComponent.vue';
import MainPage from './components/MainPage.vue';
import { Buffer } from 'buffer';
import '../public/global.css';
import './assets/styles.css';

window.Buffer = Buffer;
const BASE_URL = process.env.VUE_APP_API_URL;

const routes = [
  { path: '/login', component: Login },
  { path: '/signup', component: SignUp },
  {path: '/', component: NavComponent,
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
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

Date.prototype.addDays = function(days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

router.beforeEach((to, from, next) => {
  const expirationDate = localStorage.getItem('expirationDate');
  const now = new Date();
  if( now >= expirationDate) next( () => {
    localStorage.clear();
  })
  if (to.path !== '/login' && !localStorage.getItem('isLoggedIn')) next( () => {
    router.push('/login')
  })
  else next()
});

const app = createApp(App);

app.config.globalProperties.$url = BASE_URL;

app.use(router);
app.mount('#app');
