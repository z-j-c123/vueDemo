<template >
  <div>
    <el-form ref="form" :model="form">
      <el-main>
        <el-row>
          <el-col :span="6" class="el_row_style">
            <span>工号</span>
          </el-col>
          <el-col :span="6" style="height: 50px">
            <el-form-item class="el_row_style">
              <span>{{ form.job_num }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="el_row_style">
            <span>姓名</span>
          </el-col>
          <el-col :span="6" class="el_row_style">
            <span>{{ form.username }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="el_row_style">
            <span>填表日期</span>
          </el-col>
          <el-col :span="4" style="height: 50px">
            <el-form-item class="el_row_style">
              <span>{{ form.nowDate }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="el_row_style">
            <span>入职时间</span>
          </el-col>
          <el-col :span="4" style="height: 50px">
            <el-form-item class="el_row_style">
              <span>{{ form.job_time }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="el_row_style">
            <span>劳务关系</span>
          </el-col>
          <el-col :span="4" style="height: 50px">
            <el-form-item class="el_row_style">
              <span>{{ form.job_type }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="el_row_style">
            <span>请假类型</span>
          </el-col>
          <el-col :span="10" style="height: 50px">
            <el-form-item class="el_row_style">
              <el-radio-group v-model="form.radio">
                <el-radio :label="1">事假</el-radio>
                <el-radio :label="2">病假</el-radio>
                <el-radio :label="3">婚假</el-radio>
                <el-radio :label="4">丧假</el-radio>
                <el-radio :label="5">产假</el-radio>
                <el-radio :label="6">年假</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="el_row_style">
            <span>假期年度余额</span>
          </el-col>
          <el-col :span="6" style="height: 50px">
            <el-form-item class="el_row_style">
              <span>{{ form.sur_vac }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="el_row_style">
            <span>请假原因</span>
          </el-col>
          <el-col :span="20" style="height: 50px">
            <el-form-item class="el_row_style">
              <el-input
                resize="none"
                type="textarea"
                placeholder="请输入内容"
                v-model="form.textarea"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="el_row_style">
            <span>请假时间</span>
          </el-col>
          <el-col :span="8" style="height: 50px">
            <el-form-item class="el_row_style">
              <el-date-picker
                style="width: auto"
                v-model="form.leave_time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="el_row_style">
            <span>联系方式</span>
          </el-col>
          <el-col :span="6" style="height: 50px">
            <el-form-item class="el_row_style">
              <span>{{ form.phone }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-main>
      <el-footer style="margin-top: 50px" v-show="isfooter">
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" plain @click="resetForm('form')"
                >重置</el-button
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="success" plain @click="submitForm('form')"
                >提交</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-footer>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "LeaveTable",
  props: {
    isfooter: {
      type: Boolean,
    },
    form: {
      type: Object,
    },
  },
  data() {
    return {
      sonFrom: {},
    };
  },
  watch: {
    form: {
      deep: true, // 深度监听
      handler(newVal) {
        let leave_type = JSON.parse(
          sessionStorage.getItem("user_info")
        ).leave_type;
        let new_le = [];
        leave_type.filter(function (type) {
          if (type.type === newVal.radio) {
            return (new_le = type);
          }
        });
        this.form.radio_name = new_le.leave_name;
        this.form.sur_vac = new_le.sur_vac;
      },
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            jobnum: this.form.job_num,
            leave: [
              {
                leave_nowdate: this.form.nowDate,
                leave_reason: this.form.textarea,
                leave_start: this.form.leave_time[0],
                leave_end: this.form.leave_time[1],
                type_radio: this.form.radio,
                type_name: this.form.radio_name,
                leave_state: 0,
              },
            ],
          };
          this.$axios.post("/leave", data).then((result) => {
            this.$router.replace({ path: "/LeaveList", query: { power: '0' } });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.form.leave_time = [];
      this.form.radio = "";
      this.form.textarea = "";
      this.form.sur_vac = 0;
    },
  },
};
</script>
<style >
.el_row_style {
  min-height: 50px;
  text-align: center;
  border: 1px solid gray;
  line-height: 50px;
}
.el-form-item {
  margin-bottom: 0px;
}
.el-form-item__content {
  line-height: 50px;
  position: relative;
  font-size: 14px;
  min-height: 50px;
}
textarea {
  height: 50px;
  font-size: 20px;
}
.el-textarea__inner {
  font-size: 16px;
}
</style>