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
            leavaList.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
          "
          border
          :default-sort="{ prop: 'leave_nowdate', order: 'descending' }"
          style="width: 100%; margin-top: 30px"
        >
          <el-table-column
            fixed
            prop="labor_relations.labor_nowdate"
            label="填表日期"
            sortable
          >
          </el-table-column>
          <el-table-column prop="username" label="姓名"> </el-table-column>
          <el-table-column prop="jobnum" label="工号"></el-table-column>
          <el-table-column  label="申请类型">
              <template v-slot="scope">
              <!-- scope.row  当前行数据的获取也会用到插槽,scope相当于一行的数据， scope.row相当于当前行的数据对象-->
              <span v-if="scope.row.labor_relations.type_radio === 1">转正</span>
              <span v-else>离职</span>
            </template>
          </el-table-column>
          <el-table-column prop="labor_relations.labor_reason" label="申请理由">
          </el-table-column>
          <el-table-column label="状态">
            <!-- v-slot=“scope” 作用域插槽中定义一个对象(这里对象被定义为scope)来存储插槽上绑定的数据的用法 -->
            <template v-slot="scope">
              <!-- scope.row  当前行数据的获取也会用到插槽,scope相当于一行的数据， scope.row相当于当前行的数据对象-->
              <span v-if="scope.row.labor_relations.labor_state === 0">审核中</span>
              <span v-else>通过</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              
                <el-button @click="handleClick(scope.row,1)" type="text" :disabled="scope.row.labor_relations.labor_state === 0 ? false : true"
                  >通过</el-button
                >
                <el-button @click="handleClick(scope.row,2)" type="text" :disabled="scope.row.labor_relations.labor_state === 0 ? false : true"
                  >拒绝</el-button
                >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="leavaList.length"
        >
        </el-pagination> </template></el-main
  ></el-container>
</template>

<script>
export default {
  inject: ["reload"],
  name: "StaffList",
  components: {},
  created() {
    this.init();
  },
  data() {
    return {
      search: "",
      currentTab: this.options,
      leavaList: [],
      input: "",
      currentPage: 1,
      pagesize: 10,
      leavaList_leave: [],
    };
  },
  methods: {
    init() {
      this.leavaList = [];
      this.$axios.get("/leavelistall", {}).then((result) => {
        result.data.forEach((item, index) => {
          item.labor_relations.forEach((item_L) => {
            let data = {
              username: result.data[index].username,
              jobnum: result.data[index].jobnum,
              labor_relations: item_L,
            };
            this.leavaList.push(data);
          });
        });
      });
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
    },
    selectChanged(value) {
      this.placeholder = "请输入" + value;
    },
    searchFn() {
      this.leavaList = [];
      this.leavaList_leave = [];
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
            result.data.labor_relations.forEach((item) => {
              let data = {
                username: result.data.username,
                jobnum: result.data.jobnum,
                labor_relations: item,
              };
              this.leavaList.push(data);
            });
          });
      } else {
        this.init();
      }
    },
    handleClick(row, type) {
      console.log(row);
      let data = {
        labor: {
          labor_state: type,
          labor_nowdate: row.labor_relations.labor_nowdate,
          labor_reason: row.labor_relations.labor_reason,
        },
        jobnum: row.jobnum,
        job_type:row.labor_relations.type_radio
      };
      console.log(data);
      this.$axios.post("/updata_labor_status", data).then((result) => {
        this.init();
      });
    },
  },
  watch: {
    $route: {
      deep: true,
      handler(newdata, old) {
        if (newdata.fullPath !== old.fullPath) {
          this.init();
        }
      },
    },
  },
};
</script>
<style>
.el-button--text {
  color: #409eff;
  background: 0 0;
}
</style>