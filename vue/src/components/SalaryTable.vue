<template>
  <el-container style="background-color: white">
    <el-main>
      <el-row>
        <el-col :span="6">
          <el-input
            placeholder="请输入工号或者姓名"
            v-model="search"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchFn()"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <template style="">
        <el-table
          :data="
            all_wages_List.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
          "
          style="width: 100%; margin-top: 30px"
          border
        >
          <el-table-column label="姓名" prop="username"> </el-table-column>
          <el-table-column label="工号" prop="jobnum"> </el-table-column>
          <el-table-column label="基本工资">
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.isSelected"
                v-model="scope.row.wages"
                @focus="focusEvent(scope.row)"
                @blur="blurEvent(scope.row)"
                v-focus
                onkeyup="value=value.replace(/[^\d]/g,'')"
                placeholder="请输入数字"
              ></el-input>
              <p @dblclick="cellClick(scope.row)" v-else>
                {{ scope.row.wages }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <!-- v-slot=“scope” 作用域插槽中定义一个对象(这里对象被定义为scope)来存储插槽上绑定的数据的用法 -->
            <template v-slot="scope">
              <!-- scope.row  当前行数据的获取也会用到插槽,scope相当于一行的数据， scope.row相当于当前行的数据对象-->
              <span v-if="scope.row.job_type === 0">试用期</span>
              <span v-else-if="scope.row.job_type === 1">正式工</span>
              <span v-else>离职</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 10, 20, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="all_wages_List.length"
        >
        </el-pagination>
      </template>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "SalaryTable",
  data() {
    return {
      search: "",
      all_wages_List: [],
      currentPage: 1,
      pagesize: 10,
      isupdata_wages: false,
    };
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector("input").focus();
      },
    },
  },
  created() {
    let data = [];
    this.$axios.get("/leavelistall", {}).then((result) => {
      data = result.data;
      this.all_wages_List = data.map((item) => {
        return { ...item, isSelected: false };
      });
    });
  },
  methods: {
    focusEvent(row) {
      row.oldName = row.name;
    },
    blurEvent(row) {
      row.isSelected = !row.isSelected;
      let oldrow = [];
      this.all_wages_List.filter((item) => {
        if (item.jobnum === row.jobnum) {
          oldrow = item;
        }
      });
      if (Number(row.wages) !== Number(oldrow.wages)) {
        this.$axios
          .post("/updata_wages", {
            jobnum: row.jobnum,
            wages: row.wages,
          })
          .then((result) => {
            this.$message({
              message: "修改成功",
              type: "success",
              duration: 1000,
            });
          });
      }
    },

    cellClick(row) {
      row.isSelected = !row.isSelected;
    },
    searchFn() {
      this.all_wages_List = [];
      if (this.search) {
        let jobnum = undefined;
        let username =
          Number(this.search) !== Number(this.search)
            ? (username = this.search)
            : (jobnum = this.search);
        this.$axios
          .get("/search", {
            params: {
              jobnum: jobnum,
              username: username,
            },
          })
          .then((result) => {
            this.all_wages_List.push(result.data);
            // this.leavaList_leave = result.data.leave;
          });
      } else {
        this.all_wages_List = JSON.parse(sessionStorage.getItem("all_user"));
      }
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
    },
  },
};
</script>
<style>
</style>