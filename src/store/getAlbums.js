import axios from 'axios';
export default{
    state: ()=>({
        albums:[],
    }),
    getters: {
    },
    mutations: {
        setAlbums(state, albums){
            state.albums= albums
        },
    },
    actions: {
        fetchAlbums({commit},id){
                return axios.get(`http://jsonplaceholder.typicode.com/albums?userId=${id}`)
                .then(response=>{
                    commit('setAlbums', response.data)
                })
                .catch(e => console.log("ошибка в запросе gettAlbums :" + e))
 
        },
    },
}