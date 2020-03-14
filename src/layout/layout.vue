<template>
  <div id="app">
    <div class="background-wrapper">
      <div class="background-header">
        <div class="logoWrapper">
          <div class="logoImg" :style="{backgroundImage: `url(${imageUrl})`}"></div>
        </div>
        <div class="system-name">
          基金学习项目
        </div>
        <div class="background-right">
          <div class="nickname">{{ nickname }}</div>
          <div class="quitWrapper">退出</div>
        </div>
      </div>
      <div ref="menuContainer" class="menu-wrapper">
        <div class="left-wrapper" :style="{height: leftHeight}">
          <el-row class="tac">
            <el-col :span="24">
              <el-menu
                default-active="1"
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                router
              >
                <el-submenu v-for="sub in menu" :key="sub.index" :index="sub.index">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{ sub.title }}</span>
                  </template>
                  <el-menu-item
                    v-for="item in sub.children"
                    :key="item.name"
                    :index="item.index"
                    :route="item.route"
                  >{{ item.name }}</el-menu-item>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
        </div>
        <div class="content-wrapper">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import menu from "../api/menu"
export default {
  data() {
    return {
      nickname: "张三12313",
      menu: menu,
      // imageUrl: "https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top-e3b63a0b1b.png",
      imageUrl: '',
      leftHeight: ''
    }
  },
  mounted() {
    this.leftHeight = window.innerHeight - 46 + "px"
  }
}
</script>
<style lang="scss" scoped>
.background-wrapper {
  background-color: white;
  width: 100%;
}

.background-header {
  background-color: #333333;
  display: flex;
  justify-content: space-between;
  height: 3rem;
  .system-name {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    color: #FFFFFF;
    padding-left: 1rem;
    letter-spacing: 2px;
  }
  .logoWrapper {
    width: 11rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .logoImg {
      cursor: pointer;
      width: 6.5rem;
      height: 2rem;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
  .background-right {
    display: flex;
    color: #fff;
    display: flex;
    align-items: center;
    font-size: 1rem;
    .nickname {
      border-left-style: solid;
      border-right-style: solid;
      border-color: #E4E4E4;
      width: 10rem;
      text-align: center;
    }
    .quitWrapper {
      cursor: pointer;
      width: 6rem;
      text-align: center;
    }
  }
}
.menu-wrapper {
  display: flex;
  .left-wrapper {
    width: 200px;
    background-color: #545C64;
  }
}

.contentWrapper {
  width: 100%;
}
</style>