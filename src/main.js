import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Login from './components/Login.vue';
import SignUp from './components/Signup.vue';
import NavBar from './components/NavBar.vue';
import ProfileComponent from './components/Profile/ProfileComponent.vue';
import EditProfileComponent from './components/Profile/EditProfileComponent.vue';
import MainComponent from './components/MainComponent.vue';
import { BASE_URL, apiClient } from './api/axiosClient.js';
import { isTokenExpired } from './api/tokenVerification.js';
import { Buffer } from 'buffer';

import '../public/global.css';
import './assets/styles.css';

window.Buffer = Buffer;

const routes = [
  { path: '/login', component: Login },
  { path: '/signup', component: SignUp },
  { path: '/', component: NavBar,
    children: [
      {
        path: '',
        component: MainComponent
      },
      {
        path: ':username',
        component: ProfileComponent
      },
      {
        path: ':username/edit-profile',
        component: EditProfileComponent
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
