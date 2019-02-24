<template>
  <el-card class="box">
    <cus-bread level1="商品管理" level2="商品列表"></cus-bread>
    <el-alert class="alert" title="消息提示的文案" type="info" center show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active*1" align-center>
      <el-step title="基本信息" description></el-step>
      <el-step title="商品参数" description></el-step>
      <el-step title="商品属性" description></el-step>
      <el-step title="商品图片" description></el-step>
      <el-step title="商品内容" description></el-step>
    </el-steps>

    <!-- 标签页 -->
    <el-form class="form" label-position="top" label-width="80px" :model="form">
      <el-tabs v-model="active" @tab-click="changetab()" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 表单元素 -->
            {{selectedOptions}}
            <el-cascader
              clearable
              expand-trigger="hover"
              :options="options"
              :props="defaultprop"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDy" :key="item1.attr_id">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox :label="item2" border v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrstatic" :key="item.id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-upload
            action="http://localhost:8888/api/private/v1/upload"
            :headers="headers"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
            <el-button @click="addgoods">添加商品</el-button>
            <quill-editor v-model="form.goods_introduce" class="richtext"></quill-editor>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor} from 'vue-quill-editor'
export default {
  components:{
    quillEditor
  },
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      //   级联使用的数据
      options: [],
      selectedOptions: [],
      defaultprop: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      //   动态参数数组
      arrDy: [],
      // 静态数组
      arrstatic: [],
      headers:{
        Authorization:localStorage.getItem('token')
      }
    };
  },
  created() {
    this.getgoodscate();
  },
  methods: {
    // 添加商品
    async addgoods(){
      // this.form_cat
      this.form.goods_cat=this.selectedOptions.join(",");
      // pics
      const arr1 = this.arrDy.map((item)=>{
        return {attr_id:item.attr_id,attr_value:item.attr_vals}
      })
      // console.log(arr1)
      // const res = await this.$http.post(`goods`,this.form);
      const arr2 = this.arrstatic.map((item)=>{
        return {attr_id:item.attr_id,attr_value:item.attr_vals}
      })
      this.form.attrs = [...arr1,...arr2];
      const res = await this.$http.post(`goods`,this.form)
      // console.log(res)
      const {
            meta: { msg, status },
            data
          } = res.data;
          if (status === 201) {
            this.$message.success(msg);
            this.$router.push({
              name:"goods"
            })
          }else{
            this.$message.err(msg)
          }

    },
    // 图片上传方法

    // 移除时的方法
    handleRemove(file,filelist) {
      // console.log(file);
      // file.response.data.tem_path;
      const index =  this.form.pics.findIndex((item)=>{
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(index,1);
      // console.log(this.form.pics)
    },

    // 成功时的方法
    handleSuccess(response,file,filelist) { 
      // console.log(response)
      this.form.pics.push({
        pic:response.data.tmp_path
      });
      // console.log(this.form.pics)
    },

    //   点击tab触发事件
    async changetab() {
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          // 提示
          this.$message.error("先选择三级分类");
          return;
        }
        // 获取静态数据
        if (this.active === "3") {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          console.log(res);
          const {
            meta: { msg, status },
            data
          } = res.data;
          if (status === 200) {
            this.arrstatic = data;
            console.log(this.arrstatic);
            if (this.arrstatic.length === 0) {
              this.$message.error("该商品属性为空");
            }
          }
        }
        // 获取动态数据
        if (this.active === "2") {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          console.log(res);
          const {
            meta: { msg, status },
            data
          } = res.data;
          if (status === 200) {
            if (data.length === 0) {
              alert("该商品参数为空");
            }
            this.arrDy = data;

            this.arrDy.forEach(item => {
              if (item.attr_vals.trim().length === 0) {
                item.attr_vals = [];
              } else {
                item.attr_vals = item.attr_vals.trim().split(",");
              }
            });
          }
        }
      }
    },
    //   获取三级分类的数据
    async getgoodscate() {
      const res = await this.$http.get(`categories?type=3`);
      console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.options = data;
      }
    },
    handleChange() {}
  }
};
</script>

<style>
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.form {
  height: 350px;
  overflow: auto;
}
.ql-editor,
.ql-blankm{
  min-height:200px ;
}
</style>
 