import Vue from 'vue'
import Vuex from 'vuex'
import getUsers from '@/store/getUsers'
import getAlbums from '@/store/getAlbums'
import getImages from '@/store/getImages'
// import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
    state: ()=>({
        watchImage: false
      }),
      getters: {

      },
      mutations: {

      },
  modules: {
    getUsers,
    getAlbums,
    getImages
  }
})
