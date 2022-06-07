import axios from 'axios';
export default{
    state: ()=>({
      users:[],
      preloader: true,
    }),
    getters: {
    },
    mutations: {
        setPreloader(state, preloader){
            setTimeout(()=>{
                state.preloader = preloader
            },800)
            
        },
        setUsers(state,allUsers){
            state.users = allUsers
        },
    },
    actions: {
        fetchUsers({commit}){
                commit('setPreloader', false)
                return axios.get('http://jsonplaceholder.typicode.com/users')
                .then(response=>{
                    commit('setUsers', response.data)
                })
                .catch(e => console.log("ошибка в запросе getUsers:" + e))
                
        },
    },
}