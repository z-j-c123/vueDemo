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
          v-loading="loading"
          element-loading-spinner="el-icon-loading"
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
          <el-table-column label="性别" prop="sex"> </el-table-column>
          <el-table-column label="手机号" prop="tel"> </el-table-column>
          <el-table-column label="破壳日">
            <template v-slot="scope">
              {{ $moment(scope.row.birthday).format("YYYY-MM-DD") }}
            </template>
          </el-table-column>
          <el-table-column label="入职时间" prop="job_time"> </el-table-column>
          <el-table-column label="基本工资" prop="wages"> </el-table-column>
          <el-table-column label="状态">
            <!-- v-slot=“scope” 作用域插槽中定义一个对象(这里对象被定义为scope)来存储插槽上绑定的数据的用法 -->
            <template v-slot="scope">
              <!-- scope.row  当前行数据的获取也会用到插槽,scope相当于一行的数据， scope.row相当于当前行的数据对象-->
              <span v-if="scope.row.job_type === 0">试用期</span>
              <span v-else-if="scope.row.job_type === 1">正式工</span>
              <span v-else>离职</span>
            </template>
          </el-table-column>
          <el-table-column label="权限" prop="power">
            <template slot-scope="scope">
              <el-select
                v-model="power"
                v-if="scope.row.isSelected"
                placeholder="请选择"
                @change="selectChanged(scope.row)"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <p @dblclick="cellClick(scope.row)" v-else>
                {{ scope.row.power === 0 ? "普通员工" : "人事" }}
              </p>
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
  inject: ["reload"],
  name: "SalaryTable",
  data() {
    return {
      search: "",
      all_wages_List: [],
      currentPage: 1,
      pagesize: 10,
      isupdata_wages: false,
      power: undefined,
      options: [
        {
          value: 1,
          label: "人事",
        },
        {
          value: 0,
          label: "普通员工",
        },
      ],
      loading: true,
    };
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector(".el-input__inner").focus();
      },
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let data = [];
      this.$axios.get("/leavelistall", {}).then((result) => {
        data = result.data;
        this.all_wages_List = data.map((item) => {
          return { ...item, isSelected: false };
        });
        this.loading = false;
      });
    },
    selectChanged(row) {
      row.isSelected = !row.isSelected;
      if (this.power !== row.power) {
        this.loading = true;
        this.$axios
          .post("/upadat_power", {
            jobnum: row.jobnum,
            power: this.power,
          })
          .then((result) => {
            this.init();
          });
      }
      this.power = undefined;
    },
    cellClick(row) {
      row.isSelected = !row.isSelected;
    },
    searchFn() {
      this.loading = true;
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
            this.loading = false;
          });
      } else {
        this.init();
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