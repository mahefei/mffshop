<template>
  <el-container class="container">
    <el-header>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="../assets/logo.png" alt>
          </div>
        </el-col>
        <el-col :span="19" class="middle">
          <div class="grid-content bg-purple-light">
            <h2>电商后台管理系统</h2>
          </div>
        </el-col>
        <el-col :span="1">
          <a href="#" class="log" @click="handleLoginout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
       
          <el-menu default-active="2" class="el-menu-vertical-demo" :unique-opened="true" :router="true">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="users">
                  <i class="el-icon-menu"></i>
                  <span>用户列表</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="roles">
                  <i class="el-icon-menu"></i>
                  <span>角色列表</span>
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <el-menu-item index="rights">
                  <i class="el-icon-menu"></i>
                  <span>权限列表</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="1-1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="goods">
                  <i class="el-icon-menu"></i>
                  <span>商品列表</span>
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <el-menu-item index="params">
                  <i class="el-icon-menu"></i>
                  <span>分类参数</span>
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <el-menu-item index="categories">
                  <i class="el-icon-menu"></i>
                  <span>商品分类</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1">
                  <i class="el-icon-menu"></i>
                  <span>订单列表</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>数据统计</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1">
                  <i class="el-icon-menu"></i>
                  <span>数据报表</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
      
      </el-aside>
      <el-main class="main">
        <router-view>

        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  beforeMount(){
    if(!localStorage.getItem('token')){
      this.$router.push({
        name:'login'
      })
      this.$message.warning('请先登录');
    }
  },
  methods:{
    handleLoginout(){
      localStorage.clear();
      this.$router.push({
        name:'login'
      })
      this.$message.warning("退出成功")
    }
  }
};
</script>

<style>
.container {
  height: 100%;
  background-color: #b3c0d1;
}
.aside {
  background-color: white;
}
.main {
  background-color: gray;
}
.middle {
  line-height: 60px;
  text-align: center;
  color: aliceblue;
}
.log {
  line-height: 60px;
  text-decoration: none;
}
</style>
