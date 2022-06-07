<template>
    <div class="content">
        <div class="clearPage" v-if="!arrayImages.length">
            <div class="clearPage__image">
                <img :src="clearPage.srcImage" alt="">
            </div>
            <div class="clearPage__info">
                <h3 class="clearPage__title">{{clearPage.titleImage}}</h3>
                <p class="clearPage__text">{{clearPage.textImage}}</p>
            </div>
        </div>
        <div class="images" v-else>
            <div class="images-block" v-for="image in arrayImages" :key="image.id">
                <div class="images__item">
                    <img class="images__img" :src="image.url" alt="image" @click="deleteImg(image)">
                    <p class="images__name">{{image.title}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions, mapState} from 'vuex'
export default {
    data:()=>({        
        clearPage:{
            srcImage: require('@/assets/images/clearList.png'),
            titleImage:'Список избранного пуст',
            textImage:'Добавляйте изображения нажимая на звездочку',
        }
    }),
    computed: {
        ...mapState({
            arrayImages: state => state.getImages.arrayForStarImagePage
        })
    },
    methods:{
        //запрос на удаление картинки по клику
        ...mapActions(["fetchRemoveImagesStar"]),
        deleteImg(image){
            this.fetchRemoveImagesStar(image)
        }
    }
}
</script>
<style lang="scss" scoped>


.clearPage{
    padding-top: 30px;
    width: 385px;
    margin: 0 auto;
    @media(max-width: 480px){
        width: 240px;
    }
    &__clearPage__image{
        width: 100%;
        margin:0 auto;
    }
    &__image{
        width:100%;
        margin-bottom: 15px;
    }
    & img{
        display: block;
        width: 80%;
        margin: 0 auto;
        object-fit: cover;
        object-position: center;
        @media(max-width: 480px){
            width: 100%;
        }
    }
    &__info{
        text-align: center;
    }
    &__title{
        margin-bottom: 15px;
        padding: 0 6px;

    }
    &__text{
        padding: 0 6px;
    }
}
.images{
    position: relative;
    padding-top: 30px;
    display: grid;
    grid-template-columns: 150px 150px 150px;
    justify-content: center;
    grid-gap: 60px;
    @media(max-width: 620px){
        grid-template-columns: 150px 150px;
    }
    @media(max-width: 480px){
        grid-template-columns: 290px;
    }
    &-block{
        max-width: 100%;
        overflow:hidden;
        @media(max-width: 480px){
            height: 290px;
        }
    }
    &__item{
        width: 100%;
    }
    &__name{
        padding-top: 6px;
        opacity: .7;
    }
    &__img{
        display: block;
        width: 100%;
        border-radius: 16px;
        object-fit: cover;
        object-position: center;
    }
}
</style>