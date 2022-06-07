import axios from 'axios';
export default{
    state: ()=>({
        images:[],
        textStar:[],
        arrayForStarImagePage: (JSON.parse(localStorage.getItem('favoritePhotos')))? JSON.parse(localStorage.getItem('favoritePhotos')) : [],
        visibilityText: false

    }),
    getters: {
    },
    mutations: {
        // setImagesAll
        setImages(state, images){
            if(Array.isArray(images)){
                state.images= images
            }
            if(images.constructor === Object){
                state.images.push(images)
                return;
            }
        },
        // add obj in arrayForStarImagePage
        addImagesStar(state, image){
            state.arrayForStarImagePage.push(image)
            localStorage.setItem('favoritePhotos',JSON.stringify(state.arrayForStarImagePage))
        // delete obj in arrayForStarImagePage
        },
        removeImagesStar(state, image){
                state.arrayForStarImagePage = state.arrayForStarImagePage.filter((img)=>{
                    return image.url != img.url 
                })
                localStorage.setItem('favoritePhotos',JSON.stringify(state.arrayForStarImagePage))
        }

    },
    actions: {
        // get image
        fetchImages({commit},id){
                return axios.get(`https://jsonplaceholder.typicode.com/photos?albumId=${id}`)
                .then(response=>{
                    commit('setImages', response.data)
                    
                })
                .catch(e => console.log("ошибка в запросе getImages :" + e))
 
        },
        // fetch on add obj STAR
        fetchAddImagesStar({commit}, image){
            commit('addImagesStar', image)
        },
        // fetch on Delete obj STAR
        fetchRemoveImagesStar({commit}, image){
            commit('removeImagesStar', image)
        },
    },
}