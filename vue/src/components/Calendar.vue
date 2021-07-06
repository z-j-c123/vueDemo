<template>
  <div class="main">
    <!-- defaultView：表示当前默认使用的是月份视图，就是看到的是一个月的视图。还有日视图和周视图等。 -->
    <!-- locale：本地化，我们使用中文简体。 -->
    <!-- firstDay：一周的第一天，我们中文习惯是星期一是一周的第一天。 -->
    <!-- weekNumberCalculation：与firstDay配合，设置成ISO，一周第一天为星期一。 -->
    <!-- header：日历的头部设置，包括标题，左右按钮设置等。 等同于data中的heard  -->
    <!-- events：日程事件内容。 -->
    <FullCalendar
      defaultView="dayGridMonth"
      locale="zh-cn"
      firstDay="1"
      weekNumberCalculation="ISO"
      :eventTimeFormat="evnetTime"
      :header="header"
      @dateClick="handleDateClick"
      :plugins="calendarPlugins"
      :events="calendarEvents"
      @eventClick="handleEventClick"
    />
    <el-dialog title="日常" :visible.sync="dialogFormVisible">
      <div v-show="isDay">
        <p>选择你的操作</p>
        <div style="margin-top: 40px">
          <el-button type="primary" @click="Sign('签到', new Date())" plain
            >签到</el-button
          >
          <el-button type="danger" @click="Sign('签退', new Date())" plain
            >签退</el-button
          >
          <el-button
            type="success"
            plain
            @click="(isLeave = true), (isDay = false)"
            >请假</el-button
          >
        </div>
      </div>
      <div v-show="isLeave">
        <LeaveTable
          ref="leave_table"
          :isfooter="isfooter"
          :form="form"
        ></LeaveTable>
        <div slot="footer" class="dialog-footer" style="margin-top: 40px">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="leaveForm()">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>	
<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/core/main.css";
import LeaveTable from "@/components/LeaveTable";
export default {
  name: "Calendar",
  components: {
    FullCalendar,
    LeaveTable,
  },
  data() {
    return {
      form: {
        username: JSON.parse(sessionStorage.getItem("user_info")).username,
        job_num: JSON.parse(sessionStorage.getItem("user_info")).jobnum,
        nowDate: "",
        job_time: "2021/5/25",
        job_type: "转正",
        radio: "",
        sur_vac: 0,
        phone: JSON.parse(sessionStorage.getItem("user_info")).tel,
        leave_time: "",
        textarea: "",
        radio_name: "",
      },
      isDay: true,
      isfooter: false,
      isLeave: false,
      dialogFormVisible: false,
      calendarPlugins: [
        dayGridPlugin,
        interactionPlugin, // dateClick点击内容触发的事件需要引用这个插件
      ],
      customButtons: {
        myCustomButton: {
          text: "自定义按钮",
          click: function () {
            alert("点击了自定义按钮!");
          },
        },
      },
      header: {
        left: "prev,next today  myCustomButton",
        center: "title",
        right: "dayGridMonth",
      },
      evnetTime: {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      },
      calendarEvents: [],
    };
  },
  mounted() {},
  created() {
    this.init();
  },
  methods: {
    init() {
      let sign = [];
      let leave =[]
      let jobnum = JSON.parse(sessionStorage.getItem("user_info")).jobnum;
      this.$axios
        .get("/leavelist", {
          params: {
            jobnum: jobnum,
          },
        })
        .then((result) => {
          sign = result.data.sgin;
          leave = result.data.leave;
          if (sign.length > 0) {
            sign.forEach((item, index, array) => {
              this.calendarEvents.push(item);
            });
          }
          if (leave.length > 0) {
            leave.forEach((item) => {
              if (item.leave_state === 1) {
                let data = {
                  title:item.type_name,
                  start:item.leave_start,
                  end:item.leave_end
                }
                this.calendarEvents.push(data);
              }
            });
          }
          sessionStorage.setItem(
            "user_sign_wages",
            JSON.stringify(result.data)
          );
        });
    },
    Sign(type, time) {
      let istime = this.$moment(time).format("YYYY-MM-DD");
      let item_time = "";
      // every遍历数组, 每一项都是true, 则返回true, 只要有一个是false, 就返回false
      let isdata = this.calendarEvents.every((item) => {
        item_time = this.$moment(item.start).format("YYYY-MM-DD");
        if (istime === item_time && type == item.title) {
          return false;
        } else {
          return true;
        }
      });
      if (isdata) {
        let data = {
          jobnum: this.form.job_num,
          sgin: [
            {
              title: type,
              start: time,
            },
          ],
        };
        this.$axios.post("/sign", data).then((result) => {
          this.dialogFormVisible = false;
          this.calendarEvents.push({
            title: type,
            start: time,
          });
        });
      } else {
        this.dialogFormVisible = false;
        this.$message.error("请勿重复执行" + type + "操作");
      }
    },
    leaveForm() {
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
        this.dialogFormVisible = false;
      });
    },
    handleDateClick(arg) {
      this.form.leave_time = [];
      this.form.radio = "";
      this.form.textarea = "";
      this.form.sur_vac = 0;
      let day = this.$moment().format("YYYY-MM-DD");
      if (arg.dateStr === day) {
        this.isLeave = false;
        this.isDay = true;
      } else {
        this.isLeave = true;
        this.isDay = false;
      }
      this.dialogFormVisible = true;
      let t = this.$moment(new Date()).format("h:mm:ss a");
      this.form.nowDate = day;
    },
    handleEventClick(info) {
      alert("Event: " + info.event.title);
      info.el.style.borderColor = "red";
    },
  },
};
</script>
<style >
.el-message-box {
  width: auto;
}
.el-dialog {
  width: fit-content;
}
</style>