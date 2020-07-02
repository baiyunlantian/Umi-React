import mockjs from 'mockjs';
export default {
    'POST /mock/user/doLogin': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        //学校账号
        const schoolData = mockjs.mock({
            'token': /[a-zA-Z0-9.]{8,10}/,
            'campus': {
                'campusId': null,
                'schoolId|1-100': 12,
                'schoolName': '阿萨德',
                'campusList|5': [
                    {
                        'campusId|1-10000': 11,
                        'campusName': /[a-zA-Z0-9]{5}/,
                    }
                ],
            }
        });
        //校区账号
        const campusData = mockjs.mock({
            'token': /[a-zA-Z0-9.]{8,10}/,
            'campus': {
                'campusId|1-10': 3,
                'schoolId|1-100': 12,
                'schoolName': '阿萨德',
                'campusList|5': [
                    {
                        'campusId|1-10': 2,
                        'campusName': /[a-zA-Z0-9]{5}/,
                    }
                ],
            }
        });
        console.log(body);
        if (body.username === "weizhilian" && body.password === "123456") {
            res.end(JSON.stringify({ data: campusData }));
        }
        else if (body.username === "vtouch" && body.password === "123456") {
            res.end(JSON.stringify({ data: schoolData }));
        }
        else {
            res.statusCode = 500;
            res.end(JSON.stringify({ msg: '账户名或密码错误！' }));
        }
    },
    'GET /mock/users': { users: [1, 2] },
    // GET 可忽略
    '/mock/users/1': { id: 1 },
    // 支持自定义函数，API 参考 express@4
    'POST /mock/users/create': (req, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end('ok');
    },
    //获取总校区--校区人数
    'POST /mock/getCampusTotalPerson': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        const data = mockjs.mock({
            "totalPersonNumber|5000-20000": 5000,
            "increaseRate": "+12%",
            "list|3-8": [
                {
                    'id': '@id',
                    'campusName': /^[\u4e00-\u9fa5]+校区$/,
                    "personTotal|1000-3000": 1000
                }
            ]
        });
        res.end(JSON.stringify({ data }));
    },
    //获取总校区--考勤人数
    'POST /mock/getCampusTotalAttendance': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        const data = mockjs.mock({
            'total|10000-20000': 15000,
            'isAttendance|5000-10000': 7500,
            'notAttendance|2500-5000': 3000,
        });
        res.end(JSON.stringify(data));
    },
    //获取总校区--体温统计
    'POST /mock/getCampusTotalAnimalHeat': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        const data = mockjs.mock({
            'total|10000-20000': 15000,
            'normal|5000-10000': 7500,
            'exception|5000-10000': 7500,
            'list|4': [
                {
                    'roleId|1-10': 1,
                    'roleName|+1': ['学生', '老师', '后勤', '访客'],
                    'count|1-100': 45
                }
            ]
        });
        res.end(JSON.stringify(data));
    },
    //获取总校区数据--访客统计
    'POST /mock/getCampusTotalVisitor': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        const data = mockjs.mock({
            'list|2': [
                {
                    'isVisitor|1-2': true,
                    "increaseRate": '+1.65%',
                    'count|200-500': 45
                }
            ]
        });
        res.end(JSON.stringify(data));
    },
    //获取某校区--实时在校人数
    'POST /mock/getCampusPerson': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        const data = mockjs.mock({
            'time': [
                mockjs.mock('@time("H:mm")'),
                mockjs.mock('@time("H:mm")'),
                mockjs.mock('@time("H:mm")'),
                mockjs.mock('@time("H:mm")'),
                mockjs.mock('@time("H:mm")'),
                mockjs.mock('@time("H:mm")'),
                mockjs.mock('@time("H:mm")'),
                mockjs.mock('@time("H:mm")'),
                mockjs.mock('@time("H:mm")'),
                mockjs.mock('@time("H:mm")'),
                mockjs.mock('@time("H:mm")'),
                mockjs.mock('@time("H:mm")'),
                mockjs.mock('@time("H:mm")'),
            ],
            "personCount": [
                100,
                200,
                315,
                436,
                161,
                64,
                644,
                213,
                432,
                99,
                42,
                413,
                300,
            ],
            "totalPerson|500-1500": 644
        });
        res.end(JSON.stringify(data));
    },
    //获取某校区--实时访客统计
    'POST /mock/getCampusVisitor': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        const data = mockjs.mock({
            "visitorCount|100-300": 164,
            "appointmentCount|100-300": 164,
            "visitorIncreaseRate": '+4%',
            "appointmentIncreaseRate": '-4%',
        });
        res.end(JSON.stringify(data));
    },
    //获取某校区--实时考勤统计
    'POST /mock/getCampusAttendance': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        const data = mockjs.mock({
            'total|10000-20000': 15000,
            'isAttendance|5000-10000': 7500,
            'notAttendance|2500-5000': 3000,
        });
        res.end(JSON.stringify(data));
    },
    //获取某校区--实时体温统计
    'POST /mock/getCampusAnimalHeat': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        const data = mockjs.mock({
            'total|10000-20000': 15000,
            'normal|5000-10000': 7500,
            'exception|2000-7000': 3000,
            'list|4': [
                {
                    'roleId|1-10': 1,
                    'roleName|+1': ['学生', '老师', '后勤', '访客'],
                    'count|1-100': 45
                }
            ]
        });
        res.end(JSON.stringify(data));
    },
    //获取某校区--实时异常体温统计
    'POST /mock/getCampusExceptionAnimalHeat': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        const data = mockjs.mock({
            'animalHeat': [35.6, 36.2, 36.4, 36.8, 39.1, 37.2, 38.8, 38.0, 37.1, 36.7, 35.6, 36.2, 36.4, 36.8, 39.1, 37.2, 38.8, 38.0, 37.1, 36.7],
            "name|20": ['张某某'],
        });
        res.end(JSON.stringify(data));
    },
    //获取总校区的校区列表
    'POST /mock/getCampusList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        const data = mockjs.mock({
            "campusList|3-8": [
                {
                    'campusId': '@id',
                    'campusName|+1': ['东校区', '南校区', '西校区', '北校区'],
                    'account': /[0-9]{6}/,
                    'password': /[a-zA-Z0-9]{8}/,
                }
            ],
            "schoolName": '中山大学',
            "schoolId|1-100": 2
        });
        res.end(JSON.stringify(data));
    },
    //删除校区信息
    'POST /mock/scene/delCampus': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        if (body.id) {
            res.end(JSON.stringify({ data: true, msg: '删除成功' }));
        }
        else {
            res.end(JSON.stringify({ data: false, msg: '删除失败原因' }));
        }
    },
    //更新校区信息
    'POST /mock/scene/updateCampus': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        if (body.id && body.name) {
            res.end(JSON.stringify({ data: true, msg: '更新成功' }));
        }
        else {
            res.end(JSON.stringify({ data: false, msg: '更新失败原因' }));
        }
    },
    //新增校区信息
    'POST /mock/scene/addCampus': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        if (body.name && body.username && body.password) {
            res.end(JSON.stringify({ data: true, msg: '新增成功' }));
        }
        else {
            res.end(JSON.stringify({ data: false, msg: '新增失败原因' }));
        }
    },
    //场景管理--获取校区列表里
    'POST /mock/scene/findCampus': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        const data = mockjs.mock({
            "campusList|2-4": [
                {
                    "id|1-1000000": 100001,
                    "name|+1": ["南校区", "东校区", "北校区", "西校区"],
                    "username": "weizhilian",
                    "password": "123456",
                }
            ]
        });
        res.end(JSON.stringify({ data }));
    },
    //异常查询--信息统计
    'POST /mock/getExceptionInfo': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'todayExceptionCount|100-200': 146,
            'todayExceptionIncreaseRate': '+1.3%',
            'todayTotalCount|400-1000': 562,
            'realTimeExceptionCount|2500-3500': 2846,
            'realTimeExceptionIncreaseRate': '-0.03%',
        });
        res.end(JSON.stringify(data));
    },
    //异常查询--角色分析
    'POST /mock/getExceptionRoleAnalyze': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'studentNum': 1,
            'teacherNum': 0,
            'workerNum': 0,
            'guestNum': 0,
        });
        res.end(JSON.stringify(data));
    },
    //异常查询--人员信息列表
    'POST /mock/getExceptionPersonList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list|8': [
                {
                    'accessId|1-200': 1,
                    'personId|1-1000': 1,
                    'imgUrl': /[a-z][A-Z][0-9]{5}/,
                    'name': /[a-z][A-Z][0-9]/,
                    'sex|0-1': 1,
                    'ipNum': /[0-9]{18}/,
                    'phone': /[0-9]{11}/,
                    'classroom': /[(初中部)|(高中部)]-[(三年级)|(二年级)]-[(001班)|(002班)]/,
                    'roleId|1-4': 1,
                    'roleName|+1': ['学生', '老师', '后勤', '访客'],
                    'latelyCheckTime': mockjs.mock('@datetime'),
                    'temp|36-39.1': 36.7,
                    'bodyState|0-1': 1,
                    'code|1-30': 1
                }
            ],
            'page': {
                'pageNum': body.pageNum,
                'pageSize': 8,
                'total': 12,
                'pages': 2
            },
        });
        res.end(JSON.stringify({ data }));
    },
    //异常查询--人员信息详情
    'POST /mock/getExceptionPersonDetail': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        let data = null;
        //学生
        if (body.roleId === 1) {
            data = mockjs.mock({
                'personId': 1,
                'imgUrl': /[a-z][A-Z][0-9]{5}/,
                'name': /[a-z][A-Z][0-9]/,
                'sex|0-1': 1,
                'ipNum': /[0-9]{18}/,
                'mobile': /[0-9]{11}/,
                'className': /[(初中部)|(高中部)]-[(三年级)|(二年级)]-[(001班)|(002班)]/,
                'roleId': 1,
                'measureTime': mockjs.mock('@datetime'),
                'animalHeat|36-39.1': 36.7,
                'status|0-1': 1,
                'studentId|1-40': 2,
                'remark': /[a-z][A-Z][0-9]{5}/,
                'teacher': /[a-z][A-Z][0-9]{5}/,
                'teacherMobile': /[0-9]{11}/,
            });
        }
        //老师
        else if (body.roleId === 2) {
            data = mockjs.mock({
                'personId': 2,
                'imgUrl': /[a-z][A-Z][0-9]{5}/,
                'name': /[a-z][A-Z][0-9]/,
                'sex|0-1': 1,
                'ipNum': /[0-9]{18}/,
                'mobile': /[0-9]{11}/,
                'roleId': 2,
                'post': /(班主任)|(学校领导)/,
                'measureTime': mockjs.mock('@datetime'),
                'animalHeat|36-39.1': 36.7,
                'status|0-1': 1,
                'workId|1-40': 2,
                'remark': /[a-z][A-Z][0-9]{5}/,
            });
        }
        //后勤
        else if (body.roleId === 3) {
            data = mockjs.mock({
                'personId': 3,
                'imgUrl': /[a-z][A-Z][0-9]{5}/,
                'name': /[a-z][A-Z][0-9]/,
                'sex|0-1': 1,
                'ipNum': /[0-9]{18}/,
                'mobile': /[0-9]{11}/,
                'roleId': 3,
                'measureTime': mockjs.mock('@datetime'),
                'animalHeat|36-39.1': 36.7,
                'status|0-1': 1,
                'workId|1-40': 2,
                'remark': /[a-z][A-Z][0-9]{5}/,
            });
        }
        //访客
        else if (body.roleId === 4) {
            data = mockjs.mock({
                'personId': 4,
                'imgUrl': /[a-z][A-Z][0-9]{5}/,
                'name': /[a-z][A-Z][0-9]/,
                'sex|0-1': 1,
                'ipNum': /[0-9]{18}/,
                'mobile': /[0-9]{11}/,
                'roleId': 4,
                'measureTime': mockjs.mock('@datetime'),
                'visitTime': mockjs.mock('@datetime'),
                'visitReason': '来访事由',
                'animalHeat|36-39.1': 36.7,
                'status|0-1': 1,
                'remark': /[a-z][A-Z][0-9]{5}/,
            });
        }
        res.end(JSON.stringify(data));
    },
    //异常查询--修改人员信息状态
    'POST /mock/exceptionQuery/update': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        res.end(JSON.stringify({ data: true, msg: '更新成功' }));
    },
    //异常查询--删除人员信息
    'POST /mock/delExceptionPerson': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        res.end(JSON.stringify({ status: 200, msg: '删除成功' }));
    },
    //健康管理--今日体温统计
    'POST /mock/getHealthLeft': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'exceptionTotal|1000-10000': 2451,
            'ratioAllTotal': '+5%',
            'normalTotal|500-1500': 750,
            'ratioNormalTotal': '-5%',
            'allTotal|100-500': 434,
            'ratioExceptionTotal': '+5%',
        });
        res.end(JSON.stringify({ data }));
    },
    //健康管理--今日体温角色分析
    'POST /mock/getHealthRight': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list|2': [
                {
                    'bodyState|0-1': 1,
                    'total|1-20': 1,
                    'roleName|+1': ['学生', '教师', '后勤', '访客'],
                }
            ],
        });
        res.end(JSON.stringify({ data }));
    },
    //健康管理--人员列表
    'POST /mock/getHealthList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list|10': [
                {
                    'className|+1': ['(初中部)三年级五班', '(初中部)二年级五班', '(初中部)三年级一班'],
                    'name': '张某漠',
                    'sex|0-1': 1,
                    'ipNum': /[0-9]{18}/,
                    'animalHeat|36-39.1': 36.0,
                    'measureTime': mockjs.mock('@datetime'),
                    'status|0-1': 1,
                    'roleId|1-4': 1,
                    'personId|1-1000': 1
                }
            ],
            'page': {
                'pageNum': 1,
                'pageSize|5-10': 7,
                'total': 10,
                'pages': 1
            },
        });
        res.end(JSON.stringify({ data }));
    },
    //健康管理--删除人员信息
    'POST /mock/delHealthPersonInfo': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        let data = null;
        res.end(JSON.stringify({ status: 200, msg: '删除成功' }));
    },
    //健康管理--查看人员详情
    'POST /mock/getHealthPersonDetail': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        let data = null;
        if (body.roleId == 1) {
            data = mockjs.mock({
                'personInfo': {
                    'className|+1': ['(初中部)三年级五班', '(初中部)二年级五班', '(初中部)三年级一班'],
                    'name': '张某漠',
                    'sex|0-1': 1,
                    'ipNum': /[0-9]{18}/,
                    'roleId': 1,
                    'personId|1-1000': 1,
                    'mobile': /[0-9]{11}/,
                    'studentId|1-40': 1,
                    'teacher': /[a-zA-Z]{5}/,
                    'teacherMobile': /[0-9]{11}/,
                    'remark': /[a-zA-Z]{5}/,
                },
                'healthAnalysis': {
                    'allTotal|1-30': 15,
                    'ratioAllTotal': '+4%',
                    'exceptionTotal|1-10': 2,
                    'ratioExceptionTotal': '-4%',
                },
            });
        }
        else if (body.roleId == 2) {
            data = mockjs.mock({
                'personInfo': {
                    'name': '张某漠',
                    'sex|0-1': 1,
                    'ipNum': /[0-9]{18}/,
                    'roleId': 2,
                    'personId|1-1000': 1,
                    'mobile': /[0-9]{11}/,
                    'workId|1-40': 1,
                    'remark': /[a-zA-Z]{5}/,
                },
                'healthAnalysis': {
                    'allTotal|1-30': 15,
                    'ratioAllTotal': '+4%',
                    'exceptionTotal|1-10': 2,
                    'ratioExceptionTotal': '-4%',
                },
            });
        }
        else if (body.roleId == 3) {
            data = mockjs.mock({
                'personInfo': {
                    'name': '张某漠',
                    'sex|0-1': 1,
                    'ipNum': /[0-9]{18}/,
                    'roleId': 3,
                    'personId|1-1000': 1,
                    'mobile': /[0-9]{11}/,
                    'workId|1-40': 1,
                    'remark': /[a-zA-Z]{5}/,
                },
                'healthAnalysis': {
                    'allTotal|1-30': 15,
                    'ratioAllTotal': '+4%',
                    'exceptionTotal|1-10': 2,
                    'ratioExceptionTotal': '-4%',
                },
            });
        }
        else if (body.roleId == 4) {
            data = mockjs.mock({
                'personInfo': {
                    'name': '张某漠',
                    'sex|0-1': 1,
                    'ipNum': /[0-9]{18}/,
                    'roleId': 4,
                    'personId|1-1000': 1,
                    'mobile': /[0-9]{11}/,
                    'workId|1-40': 1,
                    'visitTime': mockjs.mock('@date("MM-dd")'),
                    'visitReason': /[a-zA-Z]{5}/,
                    'remark': /[a-zA-Z]{5}/,
                },
                'healthAnalysis': {
                    'allTotal|1-30': 15,
                    'ratioAllTotal': '+4%',
                    'exceptionTotal|1-10': 2,
                    'ratioExceptionTotal': '-4%',
                },
            });
        }
        res.end(JSON.stringify({ data }));
    },
    //健康管理--获取体温趋势图
    'POST /mock/getPersonAnimalHeatList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list|15': [
                {
                    'animalHeat|36-39.1': 36.0,
                    'time|+1': [
                        mockjs.mock('@date("MM-dd")'),
                        mockjs.mock('@date("MM-dd")'),
                        mockjs.mock('@date("MM-dd")'),
                        mockjs.mock('@date("MM-dd")'),
                        mockjs.mock('@date("MM-dd")'),
                        mockjs.mock('@date("MM-dd")'),
                        mockjs.mock('@date("MM-dd")'),
                        mockjs.mock('@date("MM-dd")'),
                        mockjs.mock('@date("MM-dd")'),
                        mockjs.mock('@date("MM-dd")'),
                        mockjs.mock('@date("MM-dd")'),
                        mockjs.mock('@date("MM-dd")'),
                        mockjs.mock('@date("MM-dd")'),
                        mockjs.mock('@date("MM-dd")'),
                        mockjs.mock('@date("MM-dd")'),
                    ]
                }
            ]
        });
        res.end(JSON.stringify(data.list));
    },
    //访客管理--实时访客统计
    'POST /mock/getRealTimeVisitorInfo': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'visitorPeronCount|1-200': 66,
            'visitorIncreaseRate': '+4%',
            'appointmentPeronCount|1-200': 106,
            'appointmentIncreaseRate': '-4%',
            'waitAuditPersonCount|1-200': 47
        });
        res.end(JSON.stringify(data));
    },
    //访客管理--待审核信息列表
    'POST /mock/visitor/WaitAuditList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list|11': [
                {
                    'imgUrl': /[a-zA-Z0-9]{6}/,
                    'name': '张某漠',
                    'sex|0-1': 1,
                    'ipNum': /[0-9]{18}/,
                    'phone': /[0-9]{11}/,
                    'sendTime': mockjs.mock('@datetime'),
                    'startVisitTime': mockjs.mock('@datetime'),
                    'endVisitTime': mockjs.mock('@datetime'),
                    'reason': /[a-zA-Z0-9]{6}/,
                    'personId|1-1000': 1,
                    'guestId|1-1000': 1
                }
            ],
            'page': {
                'pageNum': 1,
                'pageSize': 10,
                'total': 11,
                'pages': 1
            },
        });
        res.end(JSON.stringify({ data }));
    },
    //访客管理--来访信息列表
    'POST /mock/visitor/VisitorList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list|8': [
                {
                    'imgUrl': /[a-zA-Z0-9]{6}/,
                    'name': '张某漠',
                    'sex|0-1': 1,
                    'ipNum': /[0-9]{18}/,
                    'phone': /[0-9]{11}/,
                    'arriveTime': mockjs.mock('@datetime'),
                    'leaveTime': mockjs.mock('@datetime'),
                    'temp|36-39.1': 36.0,
                    'bodyState|0-1': 1,
                    'reason': /[a-zA-Z0-9]{6}/,
                    'personId|1-1000': 1,
                    'guestId|1-1000': 1
                }
            ],
            'page': {
                'pageNum': 1,
                'pageSize|5-10': 7,
                'total': 10,
                'pages': 1
            },
        });
        res.end(JSON.stringify({ data }));
    },
    //访客管理--预约信息列表
    'POST /mock/visitor/AppointmentList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list|8': [
                {
                    'imgUrl': /[a-zA-Z0-9]{6}/,
                    'name': '张某漠',
                    'sex|0-1': 1,
                    'ipNum': /[0-9]{18}/,
                    'phone': /[0-9]{11}/,
                    'sendTime': mockjs.mock('@datetime'),
                    'startVisitTime': mockjs.mock('@datetime'),
                    'endVisitTime': mockjs.mock('@datetime'),
                    'visitReason': /[a-zA-Z0-9]{6}/,
                    'personId|1-1000': 1,
                    'guestId|1-1000': 1
                }
            ],
            'page': {
                'pageNum': 1,
                'pageSize|5-10': 7,
                'total': 10,
                'pages': 1
            },
        });
        res.end(JSON.stringify({ data }));
    },
    //考勤管理--考勤信息统计
    'POST /mock/getAttendanceInfo': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'totalCount|1000-3000': 2411,
            'normalCount|1000-3000': 2411,
            'normalIncreaseRate': '+0.4%',
            'lateCount|100-300': 91,
            'lateIncreaseRate': '-0.2%',
            'notAttendanceCount|1000-3000': 211,
            'notAttendanceIncreaseRate': '-0.4%',
        });
        res.end(JSON.stringify(data));
    },
    //考勤管理--考勤信息统计
    'POST /mock/ruleAttendance/timeArrangeSelectList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list': [
                {
                    'startTime': mockjs.mock('@time(HH:mm:ss)'),
                    'endTime': mockjs.mock('@time(HH:mm:ss)'),
                    'type': 1,
                },
                {
                    'startTime': mockjs.mock('@time(HH:mm:ss)'),
                    'endTime': mockjs.mock('@time(HH:mm:ss)'),
                    'type': 0,
                },
                {
                    'startTime': mockjs.mock('@time(HH:mm:ss)'),
                    'endTime': '23:59:59',
                    'type': 1,
                }
            ],
        });
        res.end(JSON.stringify({ data }));
    },
    //考勤管理--校园人员列表
    'POST /mock/attendance/personInCampusAttendanceList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list|10': [
                {
                    'classroom|+1': ['(初中部)三年级五班', '(初中部)二年级五班', '(初中部)三年级一班'],
                    'name': '张某漠',
                    'sex|0-1': 1,
                    'ipNum': /[0-9]{18}/,
                    'code|1-40': 1,
                    'schoolTime': mockjs.mock('@datetime'),
                    'homeTime': mockjs.mock('@datetime'),
                    'personId|1-1000': 1,
                }
            ],
            'page': {
                'pageNum': 1,
                'pageSize': 10,
                'total': 10,
                'pages': 1
            },
        });
        res.end(JSON.stringify({ data }));
    },
    //考勤管理--考勤查询--班级信息
    'POST /mock/getAttendanceClassInfo': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'className|+1': ['(初中部)三年级五班', '(初中部)二年级五班', '(初中部)三年级一班'],
            'teacher': '某某某',
            'mobile': /[0-9]{11}/,
            'totalPersonCount|40-60': 45,
            'boyCount|20-30': 21,
            'girlCount|20-30': 28,
            'totalAttendanceDays|1-100': 70,
            'attendanceRate': '95.3%',
            'lateRate': '5.3%',
            'leaveEarlyRate': '1.3%',
        });
        res.end(JSON.stringify(data));
    },
    //考勤管理--考勤查询--班级学生列表
    'POST /mock/getAttendanceStudentList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list|10': [
                {
                    'name': '张某漠',
                    'sex|0-1': 1,
                    'ipNum': /[0-9]{18}/,
                    'attendanceTimes|1-100': 74,
                    'studentId|1-40': 1,
                    'lastGotoSchoolTime': mockjs.mock('@datetime'),
                    'lastAfterSchoolTime': mockjs.mock('@datetime'),
                    'personId|1-1000': 1
                }
            ],
            'page': {
                'pageNum': 1,
                'pageSize|5-10': 7,
                'total': 10,
                'pages': 1
            },
        });
        res.end(JSON.stringify({ data }));
    },
    //考勤管理--个人考勤详情
    'POST /mock/getAttendancePersonDetail': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'name': '张三',
            'sex|0-1': 1,
            'ipNum': /[0-9]{18}/,
            'mobile': /[0-9]{11}/,
            'className|+1': ['(初中部)三年级五班', '(初中部)二年级五班', '(初中部)三年级一班'],
            'studentId|1-40': 1,
            'teacher': '陈某某',
            'teacherMobile': /[0-9]{11}/,
            'guardian1': '监护人1',
            'relation1': '关系1',
            'guardian1Mobile': /[0-9]{11}/,
            'guardian1WeChat': /[a-zA-z0-9]{11}/,
            'totalAttendanceDays|1-100': 70,
            'actualAttendanceDays|1-100': 43,
            'recessDays|1-100': 13,
            'totalAttendanceTimes|1-100': 70,
            'lateTimes|1-50': 1,
            'leaveEarlyTimes|1-50': 1,
            'attendanceRate|0-0.2': 0,
        });
        res.end(JSON.stringify(data));
    },
    //考勤管理--个人考勤详情列表
    'POST /mock/getAttendancePersonList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list|10': [
                {
                    'date': mockjs.mock('@date()'),
                    'studentId|1-40': 1,
                    'gotoSchoolTime': mockjs.mock('@time()'),
                    'afterSchoolTime': mockjs.mock('@time()'),
                    'status|0-1': 1,
                    'personId|1-1000': 1
                }
            ],
            'page': {
                'pageNum': 1,
                'pageSize|5-10': 7,
                'total': 10,
                'pages': 1
            },
        });
        res.end(JSON.stringify({ data }));
    },
    //人员管理--人员统计
    'POST /mock/getPersonStatistics': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'totalCount|3000-5000': 2355,
            'studentCount|1000-2500': 1633,
            'teacherCount|500-800': 633,
            'logisticsCount|100-30': 163,
        });
        res.end(JSON.stringify(data));
    },
    //人员管理--人员列表
    'POST /mock/person/personList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list|10': [
                {
                    'foreignId|1-1000': 1,
                    'personId|1-1000': 1,
                    'studentId|1-1000': 1,
                    'name': /[a-z][A-Z][0-9]/,
                    'sex|0-1': 1,
                    'ipNum': /[0-9]{18}/,
                    'mobile': /[0-9]{11}/,
                    'roleId|1-4': 1,
                    'remark': /[a-z][A-Z][0-9]{3}/,
                }
            ],
            'page': {
                'pageNum': 1,
                'pageSize|5-10': 7,
                'total': 10,
                'pages': 1
            },
        });
        res.end(JSON.stringify({ data }));
    },
    //人员管理--获取人员详情信息
    'POST /mock/getPersonDetailInfo': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        let data = {};
        //学生
        if (body.roleId == 1) {
            data = mockjs.mock({
                'file': /[0-9]{11}/,
                'name': '张三',
                'sex|0-1': 1,
                'roleId': 1,
                'ipNum': /[0-9]{18}/,
                'mobile': /[0-9]{11}/,
                'className|+1': ['(初中部)三年级五班', '(初中部)二年级五班', '(初中部)三年级一班'],
                'studentId|1-40': 1,
                'teacher': '陈某某',
                'teacherMobile': /[0-9]{11}/,
                'MultipartFile1': /[0-9]{11}/,
                'guardian1': '监护人1',
                'relation1': '关系1',
                'guardian1Mobile': /[0-9]{11}/,
                'guardian1WeChat': /[a-zA-z0-9]{11}/,
                'MultipartFile2': /[0-9]{11}/,
                'guardian2': '监护人1',
                'relation2': '关系1',
                'guardian2Mobile': /[0-9]{11}/,
                'guardian2WeChat': /[a-zA-z0-9]{11}/,
            });
        }
        else if (body.roleId == 2) {
            data = mockjs.mock({
                'file': /[0-9]{11}/,
                'name': '张三',
                'sex|0-1': 1,
                'ipNum': /[0-9]{18}/,
                'className|+1': ['(初中部)三年级五班', '(初中部)二年级五班', '(初中部)三年级一班'],
                'mobile': /[0-9]{11}/,
                'post': 'teacher',
                'roleId': 2,
            });
        }
        else if (body.roleId == 3) {
            data = mockjs.mock({
                'file': /[0-9]{11}/,
                'name': '张三',
                'sex|0-1': 1,
                'ipNum': /[0-9]{18}/,
                'workId|1-40': 1,
                'mobile': /[0-9]{11}/,
                'post': 'teacher',
                'roleId': 2,
            });
        }
        res.end(JSON.stringify(data));
    },
    //人员管理--新增后勤
    'POST /mock/addLogistics': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'imgUrl': /[a-zA-Z0-9]{6}/,
            'name': '张某漠',
            'sex|0-1': 1,
            'ipNum': /[0-9]{18}/,
            'mobile': /[0-9]{11}/,
            'roleId': 3,
            'workId|1-100': 1,
            'remark': /[a-zA-Z0-9]{6}/,
        });
        res.end(JSON.stringify(data));
    },
    //人员管理--新增老师(班主任)
    'POST /mock/addHeadTeacher': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'imgUrl': /[a-zA-Z0-9]{6}/,
            'name': '张某漠',
            'sex|0-1': 1,
            'ipNum': /[0-9]{18}/,
            'mobile': /[0-9]{11}/,
            'roleId': 3,
            'workId|1-100': 1,
            'postId': 1,
            'managementClassId|1-10': 2,
            'remark': /[a-zA-Z0-9]{6}/,
        });
        res.end(JSON.stringify(data));
    },
    //人员管理--新增老师(学校领导)
    'POST /mock/addSchoolLeader': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'imgUrl': /[a-zA-Z0-9]{6}/,
            'name': '张某漠',
            'sex|0-1': 1,
            'ipNum': /[0-9]{18}/,
            'mobile': /[0-9]{11}/,
            'roleId': 3,
            'postId': 0,
            'workId|1-100': 1,
            'remark': /[a-zA-Z0-9]{6}/,
        });
        res.end(JSON.stringify(data));
    },
    //人员管理--新增学生
    'POST /mock/addStudent': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'imgUrl': /[a-zA-Z0-9]{6}/,
            'name': '张某漠',
            'sex|0-1': 1,
            'ipNum': /[0-9]{18}/,
            'mobile': /[0-9]{11}/,
            'roleId': 1,
            'classId|1-10': 1,
            'studentId|1-100': 1,
            'remark': /[a-zA-Z0-9]{6}/,
            'graderList|1-2': [
                {
                    'name': /[a-zA-Z0-9]{6}/,
                    'relation': /[a-zA-Z0-9]{6}/,
                    'mobile': /[0-9]{11}/,
                    'WeChat': /[a-zA-Z0-9]{6}/
                }
            ]
        });
        res.end(JSON.stringify(data));
    },
    //班级管理--班级统计信息
    'POST /mock/getClassStatisticsInfo': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'totalClass|1-100': 43,
            'classIncreaseRate': '+4.5%',
            'list|6': [
                {
                    'className': /[a-zA-Z]{6}/,
                    'count|1-20': 8,
                    'personCount|100-500': 342,
                    'increaseRate': '+2.1%',
                    'classId|1-10': 1
                }
            ],
        });
        res.end(JSON.stringify(data));
    },
    //班级管理--级部列表
    'POST /mock/findDepartment': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list|2': [
                {
                    'name': /[a-zA-Z]{3}/,
                    'id|1-20': 12,
                }
            ],
            'page': {
                'pageNum': 1,
                'pageSize|5-10': 7,
                'total': 10,
                'pages': 1
            },
        });
        res.end(JSON.stringify({ data }));
    },
    //班级管理--全年级全班级列表信息
    'POST /mock/getAllClassList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list|3': [
                {
                    'name': /[a-zA-Z]{4}/,
                    'id|1-20': 12,
                }
            ],
            'page': {
                'pageNum': 1,
                'pageSize|5-10': 7,
                'total': 10,
                'pages': 1
            },
        });
        res.end(JSON.stringify({ data }));
    },
    //班级管理--获取初(高)中部的年级信息
    'POST /mock/getGradeList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list|1-5': [
                {
                    'levelId|1-20': 12,
                    'name': /[a-zA-Z]{6}/,
                    'id|1-100': 10,
                }
            ],
        });
        res.end(JSON.stringify({ data }));
    },
    //班级管理--添加信息
    'POST /mock/addClass': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({});
        res.end(JSON.stringify(data));
    },
    //班级管理--获取年级下的班级信息列表
    'POST /mock/getClassList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        const data = mockjs.mock({
            'list|4': [
                {
                    'name': /[a-zA-Z]{6}/,
                    'id|1-200': 12,
                    'gradeId|1-100': 10,
                }
            ],
        });
        res.end(JSON.stringify({ data }));
    },
    //班级管理--班级信息详情
    'POST /mock/getClassDetail': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        const data = mockjs.mock({
            'level': '初中部',
            'gradeId|1-10': 1,
            'gradeName': /[a-zA-Z]{6}/,
            'classId|1-20': 12,
            'className': /[a-zA-Z]{6}/,
            'location': /[a-zA-Z]{6}/,
            'teacher': /[a-zA-Z]{6}/,
            'mobile': /[0-9]{11}/,
            'remark': /[a-zA-Z]{6}/,
            'personCount|40-60': 45,
            'boyCount|20-30': 21,
            'girlCount|20-30': 28,
            'personResultDtos|30-50': [
                {
                    'imgUrl': /[a-zA-Z]{6}/,
                    'name': /[a-zA-Z]{6}/,
                    'studentId|1-50': 2,
                }
            ]
        });
        res.end(JSON.stringify({ data: { classInfo: data } }));
    },
    //班级管理--班级详情--学生信息列表
    'POST /mock/getClassStudentList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        const data = mockjs.mock({
            'studentList|30-50': [
                {
                    'imgUrl': /[a-zA-Z]{6}/,
                    'name': /[a-zA-Z]{6}/,
                    'studentId|1-50': 2,
                }
            ]
        });
        res.end(JSON.stringify(data));
    },
    //班级管理--查看学生详情
    'POST /mock/getStudentDetailInfo': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log('studentId', body);
        const data = mockjs.mock({
            'imgUrl': /[a-zA-Z0-9]{6}/,
            'name': '张某漠',
            'sex|0-1': 1,
            'ipNum': /[0-9]{18}/,
            'mobile': /[0-9]{11}/,
            'roleId': 1,
            'className': /[a-zA-Z0-9]{6}/,
            'classId|1-10': 1,
            'studentId|1-100': 1,
            'remark': /[a-zA-Z0-9]{6}/,
            'graderList1Name': /[a-zA-Z0-9]{6}/,
            'graderList1Relation': /[a-zA-Z0-9]{6}/,
            'graderList1Mobile': /[0-9]{11}/,
            'graderList1WeChat': /[a-zA-Z0-9]{6}/,
            'graderList2Name': /[a-zA-Z0-9]{6}/,
            'graderList2Relation': /[a-zA-Z0-9]{6}/,
            'graderList2Mobile': /[0-9]{11}/,
            'graderList2WeChat': /[a-zA-Z0-9]{6}/
        });
        res.end(JSON.stringify(data));
    },
    //班级管理--人员库中未绑定班级的学生列表
    'POST /mock/getNotBindStudentList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log('studentId', body);
        const data = mockjs.mock({
            'list|15': [
                {
                    'imgUrl': /[a-zA-Z0-9]{6}/,
                    'name': '张某漠',
                    'sex|0-1': 1,
                    'ipNum': /[0-9]{18}/,
                    'mobile': /[0-9]{11}/,
                    'roleId': 1,
                    'className': /[a-zA-Z0-9]{6}/,
                    'classId|1-10': 1,
                    'studentId|1-100': 1,
                    'remark': /[a-zA-Z0-9]{6}/,
                    'guardian1Name': /[a-zA-Z0-9]{6}/,
                    'guardian1Relation': /[a-zA-Z0-9]{6}/,
                    'guardian1Mobile': /[0-9]{11}/,
                    'guardian1WeChat': /[a-zA-Z0-9]{6}/,
                    'guardian2Name': /[a-zA-Z0-9]{6}/,
                    'guardian2Relation': /[a-zA-Z0-9]{6}/,
                    'guardian2Mobile': /[0-9]{11}/,
                    'guardian2WeChat': /[a-zA-Z0-9]{6}/
                }
            ],
            'page': {
                'pageNum': 1,
                'pageSize|5-10': 7,
                'total': 10,
                'pages': 1
            },
        });
        res.end(JSON.stringify({ data }));
    },
    //班级管理--修改学生信息
    'POST /mock/updateStudentInfo': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'imgUrl': /[a-zA-Z0-9]{6}/,
            'name': '张某漠',
            'sex|0-1': 1,
            'ipNum': /[0-9]{18}/,
            'mobile': /[0-9]{11}/,
            'roleId': 1,
            'classId|1-10': 1,
            'studentId|1-100': 1,
            'remark': /[a-zA-Z0-9]{6}/,
            'graderList|1-2': [
                {
                    'name': /[a-zA-Z0-9]{6}/,
                    'relation': /[a-zA-Z0-9]{6}/,
                    'mobile': /[0-9]{11}/,
                    'WeChat': /[a-zA-Z0-9]{6}/
                }
            ]
        });
        res.end(JSON.stringify(data));
    },
    //班级管理--删除学生信息
    'POST /mock/delStudent': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({});
        res.end(JSON.stringify(data));
    },
    //班级管理--删除班级信息
    'POST /mock/delClass': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({});
        res.end(JSON.stringify(data));
    },
    //设备管理-设备统计信息
    'POST /mock/getDeviceStatisticsInfo': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'total|100-200': 120,
            'running|100-150': 123,
            'notRun|10-50': 24,
            'problem|10-20': 11,
            'fixing|1-10': 3,
        });
        res.end(JSON.stringify(data));
    },
    //设备管理-设备列表信息
    'POST /mock/getDeviceList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list|10-20': [
                {
                    'account': /[a-zA-Z0-9]{6}/,
                    'IP': /[0-9]{6}/,
                    'name': /[a-zA-Z0-9]{6}/,
                    'location': /[a-zA-Z0-9]{6}/,
                    'connectTime': mockjs.mock('@datetime'),
                    'port': /[0-9]{6}/,
                    'status|0-3': 1,
                    'serviceId|1-20': 1,
                    'exitOrIn|0-1': 1,
                }
            ],
            'page': {
                'pageNum': 1,
                'pageSize|5-10': 7,
                'total': 10,
                'pages': 1
            },
        });
        res.end(JSON.stringify({ data }));
    },
    //设备管理-设备详情轮播图
    'POST /mock/getDeviceSlideList': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({
            'list': [
                {
                    'backgroundUrl': /[a-zA-Z0-9]{6}/,
                    'previewUrl': /[0-9]{6}/,
                    'title1': 'V-Touch',
                    'title2': '计算机视觉垂直领域系统整合商',
                    'title3': '广州市微智联科技有限公司',
                    'title4': '020-31145104',
                    'slideIndex': 1,
                    'slideId|1-100': 1
                }
            ]
        });
        res.end(JSON.stringify(data));
    },
    //设备管理-修改语音提示
    'POST /mock/updateVoice': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        const data = mockjs.mock({});
        res.end(JSON.stringify({ data }));
    },
    //设备管理-设置轮播图显示
    'POST /mock/terminal/slideshowSetShow': ({ body }, res) => {
        // 添加跨域请求头
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        console.log(body);
        res.end(JSON.stringify({ code: '200' }));
    },
};
//# sourceMappingURL=api.js.map