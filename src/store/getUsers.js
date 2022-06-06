import axios from 'axios';
export default{
    state: ()=>({
      users:[],
    }),
    getters: {
    },
    mutations: {
        setUsers(state,allUsers){
            state.users = allUsers
        },
    },
    actions: {
        fetchUsers({commit}){
                return axios.get('http://jsonplaceholder.typicode.com/users')
                .then(response=>{
                    commit('setUsers', response.data)
                })
                .catch(e => console.log("ошибка в запросе getUsers:" + e))
 
        },
    },
}