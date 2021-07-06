const mongoose = require('mongoose')//引入数据库模板
const Schema = mongoose.Schema;//创建一个表规则构造函数

//地址 + 数据库的名字 
mongoose.connect('mongodb://127.0.0.1:27017/oaVue', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('连接成功');
}).catch(() => {
    console.log('连接失败');
})

//设置 数据限制
let userSchema = new Schema({
    jobnum: Number,
    username: String,
    pwd: String,
    sex: String,
    birthday: String,
    tel: Number,
    email: String,
    job_time: String,//入职时间  
    job_type: Number,//劳务关系 
    leave_type: Object,
    leave: [],
    sgin: [],
    wages:Number,
    labor_relations:Array,
    power:Number
})

//创建一个表  并且遵循数据限制
let user = mongoose.model("user", userSchema)
module.exports = user;