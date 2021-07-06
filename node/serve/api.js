const user = require('./db');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs')
let app = express();
// app.use(express.static(path.resolve(__dirname, '../dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// 采用设置所有均可访问的方法解决跨域问题
app.all('*', function (req, res, next) {
    // 设置允许跨域的域名，*代表允许任意域名跨域
    res.header('Access-Control-Allow-Origin', '*');
    // 允许的header类型
    res.header('Access-Control-Allow-Headers', 'content-type');
    // 跨域允许的请求方式
    res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
    if (req.method.toLowerCase() === 'options') {
        res.send(200); // 让options尝试请求快速结束
    } else {
        next();
    }
});


app.post('/register', function (req, res, next) {
    user.create({ ...req.body }, function () {
        res.end('{"success": "true"}');
    })
})
app.get('/usercount', function (req, res, next) {
    user.find().then((result) => {
        res.end(`${result.length}`)
    })
})
app.post('/login', function (req, res, next) {
    user.findOne({
        jobnum: req.body.jobnum
    }).then((reslut) => {
        if (reslut) {
            if (reslut.pwd === req.body.pwd) {
                res.json(reslut)
            } else {
                res.send('密码错误');
            }
        } else {
            res.send('没有该工号请注册一下');
        }
    })
})
app.post('/leave', function (req, res, next) {
    user.updateOne({
        jobnum: req.body.jobnum
    }, {
        $push: { leave: req.body.leave }
    }).then((reslut) => {
        res.json(reslut)
    })
})
app.get('/leavelist', function (req, res, next) {
    user.findOne({
        jobnum: req.query.jobnum
    }).then((result) => {
        res.send(result)
    })
})
app.get('/leavelistall', function (req, res, next) {
    user.find().then((result) => {
        res.send(result)
    })
})
app.post('/sign', function (req, res, next) {
    user.updateOne({
        jobnum: req.body.jobnum
    }, {
        $push: { sgin: req.body.sgin }
    }).then((reslut) => {
        res.json(reslut)
    })
})
app.get('/search', function (req, res, next) {
    console.log(req.query);
    user.findOne({
        $or: [
            {
                jobnum: req.query.jobnum
            }, {
                username: req.query.username
            }
        ]

    }).then((result) => {
        res.send(result)
    })
})
app.post('/updata_wages', function (req, res, next) {
    user.updateOne({
        jobnum: req.body.jobnum
    }, {
        $set: {
            wages: req.body.wages
        }
    }).then((result) => {
        res.send(result)
    })
})
app.post('/upadat_power', function (req, res, next) {
    user.updateOne({
        jobnum: req.body.jobnum
    }, {
        $set: {
            power: req.body.power
        }
    }).then((result) => {
        res.send(result)
    })
})
app.post('/labor_relations', function (req, res, next) {
    user.updateOne({
        jobnum: req.body.jobnum
    }, {
        $push: { labor_relations: req.body.labor_relations }
    }).then((reslut) => {
        res.json(reslut)
    })
})
app.post('/updata_leave_status', function (req, res, next) {
    user.updateOne({
        jobnum: req.body.jobnum
    }, {
        $set: { "leave.$[element].leave_state": req.body.leave.leave_state }
    }, {
        arrayFilters: [{ "element.leave_start": { $eq: req.body.leave.leave_start }, "element.leave_end": { $eq: req.body.leave.leave_end } }]
    }
    ).then((result) => {
        res.json(result)
    })
})
app.post('/updata_labor_status', function (req, res, next) {
    console.log(req.body);
    user.updateOne({
        jobnum: req.body.jobnum
    }, {
        $set: { "labor_relations.$[element].labor_state": req.body.labor.labor_state, job_type: req.body.job_type }
    }, {
        arrayFilters: [{ "element.labor_reason": { $eq: req.body.labor.labor_reason } }]
    }
    ).then((result) => {
        // console.log(result);
        res.json(result)
    })
})
app.listen(3000, () => {
    console.log("服务器启动");
})
