<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-header>
      <el-row>
        <el-col :span="6">
          <span style="text-align: left">
            <i class="el-icon-user"></i>
            {{ user_name }}小可爱 欢迎进入系统啦
          </span>
        </el-col>
        <el-col :span="6" :offset="12">
          <span>个人信息</span>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="5">
          <el-aside
            style="height: 100%; width: 240px; border: 1px solid #d3dce6"
          >
            <el-menu>
              <el-submenu index="1">
                <template slot="title">这是签到打卡哦</template>
                <el-menu-item-group>
                  <el-menu-item index="1-1" @click="comRouter('/Calendar')"
                    >签到日历卡</el-menu-item
                  >
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">我需要请假</template>
                <el-menu-item-group>
                  <el-menu-item index="2-1" @click="comRouter('/Leave')"
                    >请假表单</el-menu-item
                  >
                  <el-menu-item index="2-2" @click="comRouter('/LeaveList', power)"
                    >请假列表</el-menu-item
                  >
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">薪资</template>
                <el-menu-item-group>
                  <el-menu-item index="3-1" @click="comRouter('/SalaryList')"
                    >薪资卡</el-menu-item
                  >
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="4">
                <template slot="title">劳务关系</template>
                <el-menu-item-group>
                  <el-menu-item index="4-1" @click="comRouter('/StaffType')">劳务申请</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="5" v-show="power === 1">
                <template slot="title">人事专栏</template>
                <el-menu-item-group>
                  <template slot="title">请假</template>
                  <el-menu-item index="1-1" @click="comRouter('/LeaveList', power)"
                    >请假审批</el-menu-item
                  >
                </el-menu-item-group>
                <el-menu-item-group title="薪资核算">
                  <el-menu-item index="1-3" @click="comRouter('/SalaryTable')">员工薪资列表</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                  <template slot="title">劳务关系</template>
                  <el-menu-item index="1-4-1" @click="comRouter('/StaffList')">劳务审批</el-menu-item>
                </el-submenu>
                <el-submenu index="1-5">
                  <template slot="title">全体成员</template>
                  <el-menu-item index="1-5-1" @click="comRouter('/allUser')">员工总列表</el-menu-item>
                </el-submenu>
              </el-submenu>
            </el-menu>
          </el-aside>
        </el-col>
        <el-col :span="16">
          <div class="com_main">
            <router-view></router-view>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>



<script>
export default {
  name: "Main",
  data() {
    return {
		power: JSON.parse(sessionStorage.getItem("user_info")).power,
      user_name: JSON.parse(sessionStorage.getItem("user_info")).username,
    };
  },
  methods: {
    comRouter(names, power) {
        this.$router.replace({ path: names, query: { power: power } });
    },
  },
  
};
</script>
<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.com_main {
  background-color: aliceblue;
  /* width: 100%; */
  margin-top: 20px;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  height: 100%;
}

.el-main {
  color: #333;
  text-align: center;

  padding: 0;
}
</style>