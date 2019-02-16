<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索添加 -->
    <el-row class="search">
      <el-col>
        <!-- 输入框 -->
        <el-input placeholder="请输入内容" v-model="query" class="inputself">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <!-- 按钮 -->
        <el-button type="success">搜索</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <!-- 分页 -->
  </el-card>
</template>

<script>
export default {
    data(){
        return {
            query:''
        }
    }
};
</script>

<style>
.box {
  height: 100%;
}
.search{
    padding-top: 20px;
}
.inputself{
    width: 400px;
}
</style>
