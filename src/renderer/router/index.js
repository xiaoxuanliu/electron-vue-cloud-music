import Vue from 'vue'
import store from '@/store/index.js'
import Router from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout'

import { recommendRoutes } from './modules/recommend'
import { myMusicRoutes } from './modules/myMusic'
import { playlistRoutes } from './modules/playlist'
import { artistRoutes } from './modules/artist'
import { albumRoutes } from './modules/album'
import { djRoutes } from './modules/dj'
import { rankRoutes } from './modules/rank'
import { settingRoutes } from './modules/setting'
import { searchRoutes } from './modules/search'
import { videoRoutes } from './modules/video'
import { userRoutes } from './modules/user'
import { ipcRenderer } from 'electron'

Vue.use(Router)

const router = new Router({
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/',
      name: 'index',
      component: BasicLayout,
      redirect: '/home',
      children: [
        ...recommendRoutes,
        ...rankRoutes,
        ...myMusicRoutes,
        ...playlistRoutes,
        ...artistRoutes,
        ...albumRoutes,
        ...searchRoutes,
        ...videoRoutes,
        ...userRoutes,
        ...settingRoutes,
        ...djRoutes,
        {
          path: '/offline',
          name: 'offline',
          component: function (resolve) {
            require(['@/views/Offline/index.vue'], resolve)
          }
        }
      ]
    },
    {
      path: '/mini',
      name: 'mini',
      component: function (resolve) {
        require(['@/views/Mini/index.vue'], resolve)
      }
    },
    {
      name: 'tray',
      path: '/tray',
      component: function (resolve) {
        require(['@/views/Tray.vue'], resolve)
      }
    },
    {
      name: 'desktopLyric',
      path: '/desktop-lyric',
      component: function (resolve) {
        require(['@/views/DesktopLyric.vue'], resolve)
      }
    },
    {
      name: 'fullscreen',
      path: '/fullscreen',
      component: function (resolve) {
        require(['@/views/Video/fullscreen.vue'], resolve)
      }
    },
    {
      name: 'update',
      path: '/update',
      component: function (resolve) {
        require(['@/views/Update/index.vue'], resolve)
      }
    }
    // {
    //   path: '*',
    //   redirect: '/'
    // }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.auth) {
    const userId = localStorage.getItem('userId')
    if (userId) {
      next()
    } else {
      store.commit('User/SET_SHOW_LOGIN', true)
      store.commit('App/SET_REDIRECT', to.fullPath)
    }
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  if (to.meta && to.meta.title) {
    ipcRenderer.send('set-tray-title', to.meta.title)
  }
})
export default router
