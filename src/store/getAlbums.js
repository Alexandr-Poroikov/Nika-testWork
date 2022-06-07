import axios from 'axios';
export default{
    state: ()=>({
        albums:[],
    }),
    getters: {
    },
    mutations: {
        setAlbums(state, albums){
            if(Array.isArray(albums)){
                state.albums = albums
                
            }else{
                state.albums.push(albums)
            }
            // if(albums.constructor === Object){
            //     state.albums.push(albums)
            //     return;
            // }
                
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