<template>
  <div id="app">
    <div class="main">
      <div class="pagePreloader" v-if="pagePreloader">
          <!-- preloader (start) -->
        <div class="pagePreloader__image">
            <img src="@/assets/images/loading.gif" alt="loading">
        </div>
        <!-- (end) -->
      </div>
      <div class="users">

        <div class="users__buttons">
          <div class="users__catalog users__buttons--active"
            ref="catalogBtn"
            @click="activePageCatalog">
            Каталог
          </div>
          
          <div class="users__star" @click="activePageStar" ref="imageBtn" exact>
            <div class="users__wrapImage">
              <img class="users__img"
                ref="usersImg"
                :src="arrayForStarImagePage.length ? starBlock.activeUrl : starBlock.inActiveUrl"
                alt="page Star"/>
            </div>
            <div class="users__text">Избранное</div>
          </div>
        </div>

        <div class="users__persons">
            <router-view></router-view>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

import { mapState } from "vuex";
export default {
  data: () => ({
    starBlock: {
      inActiveUrl: require("@/assets/images/icons/star.svg"),
      activeUrl: require("@/assets/images/icons/star-yellow.svg"),
    },
  }),
  computed: {
    //для проверки на наличие элементов в массиве, чтобы сделать ЗВЕЗДУ активной/неактивной
    ...mapState({
      arrayForStarImagePage: (state) => state.getImages.arrayForStarImagePage,
        pagePreloader: (state) => state.getUsers.preloader
    }),
  },
  methods: {
    //   ...mapActions(['setPreloader']),
    activePageStar() {
      //активный раздел страницы
      if (!this.$refs.imageBtn.classList.contains("users--active")) {
        //убираем активный раздел страницы "Каталог"
        this.$refs.catalogBtn.classList.remove("users__buttons--active");
        //делаем активный раздел страницы "Избранное"
        this.$refs.imageBtn.classList.add("users__buttons--active");

        //редирект на страницу "Избранное"
        this.$router.push("/imagesPage").catch(() => {});
        return;
      }
    },

    activePageCatalog() {
      //убираем активный раздел страницы "Избранное"
      this.$refs.imageBtn.classList.remove("users__buttons--active");
      //делаем активный раздел страницы "Каталог"
      this.$refs.catalogBtn.classList.add("users__buttons--active");
      //редирект на страницу "Каталог"
      this.$router.push("/").catch(() => {});
      return;
    },
  },
  mounted() {
    // перейти на активный раздел страницы при перезагрузке
    if (this.$refs.catalogBtn.classList.contains("users__buttons--active")) {
      this.$router.push("/").catch(() => {});
    }
  },
};
</script>

<style lang="scss">
@import "@/assets/css/normalize.css";
html,
body {
  width: 100%;
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
}
*,
*::after,
*::before {
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
.main {
  margin: 0 auto;
  width: 100%;
  min-height: 100%;
  padding-bottom: 50px;
  padding-top: 30px;
  background-color: #cfebf1;
}
//preloader page
.pagePreloader{
    position:fixed;
    top: 0;
    left:0;
    right: 0;
    bottom: 0;
    background: #f3ffff;
    text-align: center;
    z-index: 1000;
    &__image{
        width: 200px;
        height: 200px;
        margin: 0 auto;
        margin-top: 50vh;
        transform: translateY(-50%);
        & img{
            width:100%;
        }
    }
}
@keyframes preloader-rotate {
  100% {
    transform: rotate(600deg);
  }
}
//main block
.users {
  background-color: #e6f6ff;
  margin: 0 auto;
  max-width: 998px;
  border-radius: 15px;
  height: 100%;
  &__buttons {
    display: flex;
    justify-content: space-between;
    text-align: center;
    width: 100%;
    &--active {
      background-color: #f8fcfe;
      border-radius: 15px;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  &__catalog,
  &__star {
    flex: 1 0 50%;
    padding: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__wrapImage {
    width: 16px;
  }
  &__img {
    width: 100%;
  }
  &__text {
    margin-left: 6px;
  }
  &__persons {
    padding-top: 15px;
    min-height: 600px;
    height: 100%;
    background-color: #f5f9ff;
    text-align: start;
    padding-bottom: 30px;

    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
}
.content {
  max-width: 1920px;
  margin: 0 auto;
  height: 100%;
}
</style>
