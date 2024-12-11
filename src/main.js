import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Login from './components/Login.vue';
import SignUp from './components/Signup.vue';
import NavComponent from './components/NavBarComponent.vue';
import BaseContent from './components/ProfileBaseComponent.vue';
import EditProfile from './components/EditProfileComponent.vue';
import MainPage from './components/MainPage.vue';
import { BASE_URL, apiClient } from './api/axiosClient.js';
import { isTokenExpired } from './api/tokenVerification.js';
import { Buffer } from 'buffer';

import '../public/global.css';
import './assets/styles.css';

window.Buffer = Buffer;

const routes = [
  { path: '/login', component: Login },
  { path: '/signup', component: SignUp },
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
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (isTokenExpired(localStorage.getItem('userToken'))) next(() => {
    localStorage.clear();
  })

  if (to.path !== '/login' && !localStorage.getItem('isLoggedIn')) next( () => {
    router.push('/login')
  })
  else next()
});

const app = createApp(App);
app.config.globalProperties.$url = BASE_URL;
app.config.globalProperties.$apiClient = apiClient;

app.use(router);
app.mount('#app');
