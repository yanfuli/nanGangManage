import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                // {
                //     path: '/dashboard',
                //     component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                //     meta: { title: '系统首页' }
                // },
                {
                    path: '/user',
                    component: resolve => require(['../components/page/User.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/newsList',
                    component: resolve => require(['../components/page/news/NewsList.vue'], resolve),
                    meta: { title: '资讯管理' }
                },
                {
                    path: '/addNews',
                    component: resolve => require(['../components/page/news/AddNews.vue'], resolve),
                    meta: { title: '资讯管理' }
                },
                {
                    path: '/banner',
                    component: resolve => require(['../components/page/banner.vue'], resolve),
                    meta: { title: 'banner管理' }
                },
                {
                    path: '/employee',
                    component: resolve => require(['../components/page/employee/Employee.vue'], resolve),
                    meta: { title: '员工管理' }
                },
                {
                    path: '/employeeAtt',
                    component: resolve => require(['../components/page/employee/EmployeeAtt.vue'], resolve),
                    meta: { title: '员工考勤' }
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
