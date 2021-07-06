<template>
  <el-container style="background-color: white">
    <el-main>
      <el-row v-if="$route.query.power === '1'">
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
            prop="leave.leave_nowdate"
            label="填表日期"
            sortable
          >
          </el-table-column>
          <el-table-column prop="username" label="姓名"> </el-table-column>
          <el-table-column prop="jobnum" label="工号"></el-table-column>
          <el-table-column prop="leave.type_name" label="请假类型">
          </el-table-column>
          <el-table-column label="请假开始时间">
            <template v-slot="scope">
              {{
                $moment(scope.row.leave.leave_start).format(
                  "YYYY-MM-DD H:mm:ss"
                )
              }}
            </template>
          </el-table-column>
          <el-table-column label="请假结束时间">
            <template v-slot="scope">
              {{
                $moment(scope.row.leave.leave_end).format("YYYY-MM-DD H:mm:ss")
              }}
            </template>
          </el-table-column>
          <el-table-column prop="leave.leave_reason" label="请假理由">
          </el-table-column>
          <el-table-column label="状态">
            <!-- v-slot=“scope” 作用域插槽中定义一个对象(这里对象被定义为scope)来存储插槽上绑定的数据的用法 -->
            <template v-slot="scope">
              <!-- scope.row  当前行数据的获取也会用到插槽,scope相当于一行的数据， scope.row相当于当前行的数据对象-->
              <span v-if="scope.row.leave.leave_state === 0">审核中</span>
              <span v-else-if ="scope.row.leave.leave_state === 1">通过</span>
              <span v-else>拒绝</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                v-if="$route.query.power === '0'"
                @click="handleClick(scope.row, -1)"
                type="text"
                :disabled="scope.row.leave.leave_state === 0 ? false : true"
                >撤销</el-button
              >
              <div v-else-if="$route.query.power === '1'">
                <el-button
                  @click="handleClick(scope.row, 1)"
                  type="text"
                  :disabled="scope.row.leave.leave_state === 0 ? false : true"
                  >通过</el-button
                >
                <el-button
                  @click="handleClick(scope.row, 2)"
                  type="text"
                  :disabled="scope.row.leave.leave_state === 0 ? false : true"
                  >拒绝</el-button
                >
              </div>
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
// let
export default {
  inject: ["reload"],
  name: "LeaveList",
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
      let data_jobnum = JSON.parse(sessionStorage.getItem("user_info")).jobnum;
      if (this.$route.query.power === "0") {
        this.$axios
          .get("/leavelist", {
            params: {
              jobnum: data_jobnum,
            },
          })
          .then((result) => {
            result.data.leave.filter((item) => {
              if (item.leave_state !== -1 ) {
                let data = {
                  username: result.data.username,
                  jobnum: result.data.jobnum,
                  leave: item,
                };
                this.leavaList.push(data);
              }
            });
          });
      } else {
        this.$axios.get("/leavelistall", {}).then((result) => {
          result.data.forEach((item, index) => {
            item.leave.forEach((item_L) => {
              if (item_L.leave_state !== -1 || item_L.leave_state == 2) {
                if (item.leave_state === 1) {
                  this.disabled = true;
                }
                let data = {
                  username: result.data[index].username,
                  jobnum: result.data[index].jobnum,
                  leave: item_L,
                };
                this.leavaList.push(data);
              }
            });
          });
        });
      }
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
            result.data.leave.forEach((item) => {
              let data = {
                username: result.data.username,
                jobnum: result.data.jobnum,
                leave: item,
              };
              this.leavaList.push(data);
            });
          });
      } else {
        this.init();
      }
    },
    handleClick(row, type) {
      let data = {
        leave: {
          leave_state: type,
          leave_nowdate: row.leave.leave_nowdate,
          leave_reason: row.leave.leave_reason,
          leave_start: row.leave.leave_start,
          leave_end: row.leave.leave_end,
          type_radio: row.leave.type_radio,
          type_name: row.leave.type_name,
        },
        jobnum: row.jobnum,
      };
      this.$axios.post("/updata_leave_status", data).then((result) => {
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