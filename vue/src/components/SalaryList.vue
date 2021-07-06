<template>
  <el-container style="background-color: white">
    <el-main>
      <el-row>
        <el-col :span="6">
          <el-date-picker
            v-model="search_time"
            ref="search_time"
            type="month"
            placeholder="选择月"
            style="float: left"
          >
          </el-date-picker>
          <el-button
            style="float: left"
            icon="el-icon-search"
            @click="searchFn()"
          ></el-button>
        </el-col>
      </el-row>
      <template style="">
        <el-table :data="groups" border style="width: 100%; margin-top: 30px">
          <el-table-column fixed prop="" label="工资月份" sortable>
            {{ sgin_YM }}
          </el-table-column>
          <el-table-column label="姓名"
            >{{ wageList.username }}
          </el-table-column>
          <el-table-column label="工号">{{ wageList.jobnum }}</el-table-column>
          <el-table-column prop="" label="应打卡天数">
            {{ must_sign }}</el-table-column
          >
          <el-table-column prop="" label="打卡天数">{{
            sgin_day
          }}</el-table-column>
          <el-table-column label="扣除工资"
            >{{ deduct_wages }}
          </el-table-column>
          <el-table-column label="本月工资">{{ month_wages }} </el-table-column>
        </el-table>
      </template>
    </el-main></el-container
  >
</template>

<script>
export default {
  name: "SalaryList",
  components: {},
  created() {
    this.wageList = JSON.parse(sessionStorage.getItem("user_sign_wages"));
    this.init(new Date());
  },
  data() {
    return {
      search_time: "",
      search: null,
      currentTab: this.options,
      wageList: "",
      input: "",
      currentPage: 1,
      pagesize: 10,
      leavaList_leave: [],
      must_sign: 0,
      groups: [],
      sgin_YM: "",
      sgin_day: 0,
      month_wages: 0,
      deduct_wages: 0,
    };
  },
  methods: {
    init(times) {
        let time = this.$moment(times).format("YYYY-MM");
      this.groups = [];
      var groups = [];
      var user_sign = this.wageList.sgin;
      user_sign.forEach((o) => {
        var group = this.$moment(o.start).format("YYYY-MM");
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      let nowMonth = this.$moment(time).format("MM");
      let nowYear = this.$moment(time).format("YYYY");
      this.sgin_YM = nowYear + "-" + nowMonth;
      this.groups.push(groups);
      if (groups[time]) {
        this.sgin_day = groups[this.sgin_YM].length / 2;
        let daycount = this.$custom.mGetDate(nowYear, nowMonth);
        this.must_sign = this.$custom.countWorkDay(
          nowYear + "-" + nowMonth + "-01",
          nowYear + "-" + nowMonth + "-" + daycount
        );
        let month_wages =
          (this.wageList.wages / this.must_sign) * this.sgin_day;
        this.month_wages = Math.floor(month_wages * 100) / 100;
        this.deduct_wages = this.wageList.wages - this.month_wages;
      } else {
        this.groups = [];
        this.$message.error(time + "没有工资信息");
      }
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
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
      if (this.search_time) {
        this.init(this.search_time);
      }else{
          this.$message.error("请选择月份");
      }
    },
  },
};
</script>