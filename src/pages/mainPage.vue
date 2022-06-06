<template>
  <div class="content">
    <div class="modal-Image" ref="modal">
      <div class="modal-Image__wrapper">
        <div class="modal-Image__close" @click="closeModal"></div>
        <div class="modal-Image__content">
          <img class="modal-Image__img"
            src="#"
            ref="modalImg"
            alt="previevImage"/>
        </div>
      </div>
    </div>
    <!-- users -->
    <ul class="persons" v-for="user in users" :key="user.id">
      <li class="persons__item">
        <div class="persons__name" @click="showAlbums(user.id)">
          <span class="persons__icon" ref="personsIcon"></span>{{ user.name }}
        </div>
    <!-- albums -->
        <ul class="album"
          v-for="album in albums"
          :key="album.id"
          :data-idalbums="user.id"
          ref="blockAlbums"
          :style="{ display: album.userId === user.id ? 'block' : 'none' }">
          <li class="album__item">
            <div class="album__title" @click="showImages(album.id)">
              <span class="album__icon" ref="albumsIcon"></span
              >{{ album.title }}
            </div>
    <!-- images -->
            <ul class="images"
              ref="blockImages"
              :data-index="album.id - 1"
              :data-parentIndex="album.userId">
              <li class="images__item" v-for="image in images" :key="image.id">
                <div class="images__star" @click="addImage(image)">
                    <img class="images__star-img" ref="imgStar" :src="starBlock.inActiveUrl" :data-act="image.id"  alt="star" >
                </div>

                <img class="images__img"
                  @click="reviewImage(image.id)"
                  ref="img"
                  :src="image.url"
                  alt="image"
                  :title="image.title"
                  :style="{ display: image.albumId === album.userId }? 'block': 'none'"/>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "mainPage",
  data: () => ({
      toggleAlbum: false,
    starBlock: {
        inActiveUrl: require("@/assets/images/icons/star_for_all_images.svg"),
         activeUrl: require("@/assets/images/icons/star_for_all_images-yellow.svg"),
    }
  }),
  computed: {
    ...mapState({
      users: (state) => state.getUsers.users,
      albums: (state) => state.getAlbums.albums,
      images: (state) => state.getImages.images,
      //для работы с добавлением изображения в раздел "Избранное"
      arrayForStarImagePage: (state) => state.getImages.arrayForStarImagePage,
    }),
  },
  methods: {
    ...mapActions(["fetchUsers", "fetchAlbums", "fetchImages", "fetchAddImagesStar", "fetchRemoveImagesStar"]),

//---request Albums---
   async showAlbums(id) {
      //корректируем ID для вывода на странице  
      let personId = id - 1;
      //условие повторного нажатия на USERS. Закрываем вкладку и выходим без срабатыв. дальнейшего скрипта
      if(this.$refs.personsIcon[personId].classList.contains("persons__icon--active")){
        this.$refs.personsIcon[personId].classList.remove("persons__icon--active")
        // закрытие всех альбомов
        for (let i = 0; i < this.$refs.blockAlbums.length; i++) {
            this.$refs.blockAlbums[i].style.display = "none";     
        }
      return;
      }           
      //отправка запроса в STORE на вывод названий альбома       
      await this.fetchAlbums(id);

      //открытие нужных альбомов
      for (let i = 0; i < this.$refs.blockAlbums.length; i++) {
        //сравниваем название альбомов с записанным id USERS
        if(this.$refs.blockAlbums[i].dataset.idalbums == id){
            this.$refs.blockAlbums[i].style.display = "block"
        }    
      }
    // предварительно, убираем активный класс с иконок названий USERS
      for (let i = 0; i < this.$refs.personsIcon.length; i++) {
        this.$refs.personsIcon[i].classList.remove("persons__icon--active");
      } 
      // вешаем активный класс на иконки названий USERS
      this.$refs.personsIcon[personId].classList.add("persons__icon--active");
    },

//---request Images---
    async showImages(id) {
      // закрытие всех UL элементов, содержащие изображения в альбоме.
      for (let i = 0; i < this.$refs.blockImages.length; i++) {
        this.$refs.blockImages[i].style.display = "none";     
      }
      //корректируем ID для открытия/закрытия альбомов на странице  
      let newIdAlbums = id - 1;
      //условие повторного нажатия на альбом. Закрываем вкладку и выходим без срабатыв. дальнейшего скрипта
      if(this.$refs.albumsIcon[newIdAlbums].classList.contains("album__icon--active")){
        this.$refs.albumsIcon[newIdAlbums].classList.remove("album__icon--active")
      return
      }
      //отправка запроса в STORE на вывод изображений по клику на альбом 
      await this.fetchImages(id);
      //Логика , отвечающая за запоминание активных иконок STARS при открытии/закрытии других альбомов 
      //перебираем массив изображ. во вкладке "избранное" и массив вывода изображ. в альбоме
      for (let i = 0; i < this.arrayForStarImagePage.length; i++) {
        for (let j = 0; j < this.images.length; j++)
        //находим совпадающие элементы по ID
          if (this.arrayForStarImagePage[i].id == this.images[j].id) {
            //корректируем ID  для поиская элемента в альбоме
              let positionOnThePage = this.images[j].id - 1
              //находим нужную звезду по Скоррект. ID и заменяем иконку на АКТИВНУЮ
              this.$refs.imgStar[positionOnThePage].src = this.starBlock.activeUrl
          }
      }
      // открытие нужного UL элемента для изображений в альбоме по скорректированному ID
      this.$refs.blockImages[newIdAlbums].style.display = "grid";
      // убираем активный класс с иконки названия альбома. Возвращая в закрытое состояние
      for (let i = 0; i < this.$refs.albumsIcon.length; i++) {
        this.$refs.albumsIcon[i].classList.remove("album__icon--active");
      }
      // вешаем активный класс на иконку названия альбома. Создавая эффект открытого состояния
      this.$refs.albumsIcon[newIdAlbums].classList.add("album__icon--active");
    },
//---reviewImage in Modal---
    reviewImage(id) {
      let idImage = id - 1;
      //activeModal and srcActve
      this.$refs.modal.classList.add("modal-Image--active");
      this.$refs.modalImg.src = this.$refs.img[idImage].src;
    },

//---addImage in albums---
    addImage(image){
        //корректируем ID для вывода на странице 
        let idImage = image.id - 1
        //условие проверки на пуской массив и добавления изображений в "Избранное"
        if(this.arrayForStarImagePage.length){
            //узнаем, есть ли дублирующий элемент в массивее, который находиться в Избранное""
            let doubleObj = this.arrayForStarImagePage.find(item=>{
                return item.url == image.url
            })
            //проверяем , если дублир.элемент есть(это происх. при повторном клике), тогда:
            if(doubleObj){
                //отправляем запрос в STORE на удаление этого элемента(эффект отмены добавления)
                this.fetchRemoveImagesStar(doubleObj)
                //меняем иконку STAR на неактивную
                this.$refs.imgStar[idImage].src = this.starBlock.inActiveUrl
            }else{
                //отправляем запрос в STORE на добавление этого элемента
                this.fetchAddImagesStar(image)
                //делаем иконку STAR активной
                this.$refs.imgStar[idImage].src = this.starBlock.activeUrl
           }
        }else{
            //делаем иконку STAR активной
            this.$refs.imgStar[idImage].src = this.starBlock.activeUrl
             //отправляем запрос в STORE на добавление этого элемента
            this.fetchAddImagesStar(image)// add in store
        }
    },

//---closeImage---
    closeModal() {
    //закрываем модальное окно большого изображения, убирая активный класс
      this.$refs.modal.classList.remove("modal-Image--active");
    },
  },
  async mounted(){
    await this.fetchUsers();

    //во время открытого списка, при переходе на др страницу и обратно, закрываем все списки.
    // Решает проблему открытого списка, но неактивной иконки USERS
    if(this.$refs.blockAlbums !=undefined){
        for (let i = 0; i < this.$refs.blockAlbums.length; i++) {
            this.$refs.blockAlbums[i].style.display = "none";     
        }
    }
  }
};
</script>
<style lang="scss" scoped>

.modal-Image {
  position: fixed;
  pointer-events: none;
  opacity: 0;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  background-color: #0000008c;
  z-index: 5;
  transition: opacity 0.3s ease-in-out;
  &__wrapper {
    width: 100%;
    height: 100%;
  }
  &__close {
    position: relative;
    width: 35px;
    height: 35px;
    top: 35px;
    margin-right: 50px;
    margin-left: auto;
    cursor: pointer;
    &:after {
      content: "";
      position: absolute;
      position: absolute;
      top: 16px;
      left: 0px;
      width: 34px;
      transform: rotate(50deg);
      height: 2px;
      background-color: #fff;
    }
    &:before {
      content: "";
      position: absolute;
      position: absolute;
      top: 16px;
      left: 0px;
      width: 34px;
      transform: rotate(-50deg);
      height: 2px;
      background-color: #fff;
    }
  }

  &__content {
    width: 600px;
    height: 600px;

    background-color: #fff;
    margin: 0 auto;
    margin-top: 15px;
    border-radius: 16px;
    overflow: hidden;
  }
  &__img {
    display: block;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
  &--active {
    opacity: 1;
    pointer-events: auto;
  }
}

.persons {
  &__name {
    font-weight: 700;
    border-bottom: 1px solid #e5e0e069;
    padding: 16px 0px;
    padding-left: 80px;
    padding-right: 20px;
    position: relative;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.2s ease-in;
    &:hover {
      background-color: #cfebf161;
    }
  }
  &__icon {
    width: 24px;
    height: 23px;
    display: inline-block;
    border: 1px solid black;
    position: absolute;
    top: calc(50% - 13px);
    left: 40px;
    border-radius: 50%;
    background-color: #4c6ba6;
    &:after {
      content: "";
      width: 10px;
      height: 2px;
      display: inline-block;
      border: 1px solid #fff;
      position: absolute;
      top: 10px;
      left: 6px;
      background: #fff;
    }
    &:before {
      content: "";
      width: 10px;
      height: 2px;
      transform: rotate(90deg);
      display: inline-block;
      border: 1px solid #fff;
      position: absolute;
      top: 10px;
      left: 6px;
      background: #fff;
      z-index: 1;
      transition: transform 0.1s ease;
    }
    &--active {
      background: #aba644;
      &:before {
        transform: rotate(180deg);
      }
    }
  }
}
.album {
  padding: 0 20px;
  display: none;
  cursor: pointer;
  &__title {
    border-bottom: 1px solid #e5e0e069;
    padding: 12px;
    padding-left: 80px;
    padding-right: 20px;
    position: relative;
    margin-bottom: 16px;
    transition: all 0.2s ease-in;
    &:hover {
      background-color: #cfebf161;
    }
  }
  &__icon {
    width: 24px;
    height: 23px;
    display: inline-block;
    border: 1px solid black;
    position: absolute;
    top: calc(50% - 13px);
    left: 40px;
    border-radius: 50%;
    background-color: #4c6ba6;
    &:after {
      content: "";
      width: 10px;
      height: 2px;
      display: inline-block;
      border: 1px solid #fff;
      position: absolute;
      top: 10px;
      left: 6px;
      background: #fff;
    }
    &:before {
      content: "";
      width: 10px;
      height: 2px;
      transform: rotate(90deg);
      display: inline-block;
      border: 1px solid #fff;
      position: absolute;
      top: 10px;
      left: 6px;
      background: #fff;
      z-index: 1;
      transition: transform 0.1s ease;
    }
    &--active {
      background: #aba644;
      &:before {
        transform: rotate(180deg);
      }
    }
  }
}
.images {
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
  &__item {
    position: relative;
    border: 1px solid black;
    border-radius: 10px;
    height: 150px;
    cursor: pointer;
    overflow: hidden;
    @media(max-width: 480px){
        height: 290px;
    }
  }
  &__star{
        position: absolute;
      top: 5px;
      right: 5px;
      width: 25px;
      height: 25px;
      &-img{
          display:block;
          width: 100%;
      }
  }
  &__icon {
    position: absolute;
    top: 5px;
    right: 5px;
  }
  &__img {
    display: block;
    object-fit: cover;
    width: 100%;
  }
}
</style>