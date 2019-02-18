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
        <el-input
          placeholder="请输入内容"
          v-model="query"
          class="inputself"
          clearable
          @clear="getallusers()"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchuser()"></el-button>
        </el-input>
        <!-- 按钮 -->
        <el-button type="success" @click="showtable()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table height="350px" :data="list" style="width: 100%">
      <el-table-column prop="id" label="#" width="120"></el-table-column>
      <el-table-column prop="username" label="姓名" width="160"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column label="创建日期" width="180">
        <template slot-scope="scope">{{scope.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="180">
        <template slot-scope="scope">
          <el-switch
            @change="changestate(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="showedittable(scope.row)"
            icon="el-icon-edit"
            circle
            plain
          ></el-button>
          <el-button type="success" @click="showsetrole(scope.row)" icon="el-icon-check" circle plain></el-button>
          <el-button
            type="danger"
            @click="showmsgbox(scope.row)"
            icon="el-icon-delete"
            circle
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addusers()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editusers()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 设置角色对话框 -->
    <!-- {{selectVal}} -->
    <el-dialog title="设置角色" :visible.sync="dialogFormVisiblerole">
      <el-form :model="formdata" label-position="left" label-width="80px" >
        <el-form-item label="用户名" >
          {{formdata.username}}
        </el-form-item>
        <el-form-item label="角色" >
          <el-select v-model="selectVal" placeholder="请选择">
            <el-option label="请选择" disabled :value="selectVal"></el-option>
            <el-option v-for="(item,i) in roles" :key="item.id"
            :label="item.roleName"  :value="item.id" 
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblerole = false">取 消</el-button>
        <el-button type="primary" @click="setrole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      list: [],
      total: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisiblerole:false,
      formdata: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 分配角色数据
      selectVal:-1,
      roles:[],
      roleid:1
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 发送请求修改角色
    async setrole(){
      const res = await this.$http.put(`users/${this.roleid}/role`,{rid:this.selectVal});
       const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisiblerole=false;
      }
    },
    // 显示设置对话框
    async showsetrole(user) {
      this.formdata.username=user.username;
      this.roleid=user.id;
      this.dialogFormVisiblerole=true;
      const res = await this.$http.get(`roles`);
      this.roles=res.data.data;
      const res2 = await this.$http.get(`users/${user.id}`);
      this.selectVal=res2.data.data.rid;
      
      console.log(res2.data);
    },

    // 改变用户状态
    async changestate(user) {
      console.log(user);
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      console.log(res);
    },
    // 发送编辑请求
    async editusers() {
      const res = await this.$http.put(
        `users/${this.formdata.id}`,
        this.formdata
      );
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        this.getTableData();
        this.dialogFormVisibleEdit = false;
      }
    },
    // 显示编辑对话框
    showedittable(user) {
      this.formdata = user;
      this.dialogFormVisibleEdit = true;
    },

    // 显示删除弹出框
    showmsgbox(user) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${user.id}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success(msg);
            this.pagenum = 1;
            this.getTableData();
          }
          this.$message.success("删除成功!");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 添加用户
    async addusers() {
      const res = await this.$http.post(`users`, this.formdata);
      console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        this.dialogFormVisibleAdd = false;
        this.getTableData();
      }
    },
    //   显示对话框
    showtable() {
      this.dialogFormVisibleAdd = true;
      this.formdata = {};
    },
    getallusers() {
      this.getTableData();
    },
    //   搜索用户
    searchuser() {
      this.pagenum = 1;
      this.getTableData();
    },
    //   分页的方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getTableData();
    },
    //   获取表格数据
    async getTableData() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.total = data.total;
        this.list = data.users;
        console.log(res);
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.search {
  padding-top: 20px;
}
.inputself {
  width: 400px;
}
</style>
