import Vue from 'vue';
import VueMdl from 'vue-mdl'
import VueRouter from 'vue-router';
import VueValidator from 'vue-validator';

import Home from './components/Home.vue'
import AppBase from './components/Base.vue';
import ExamBase from './components/ExamBase.vue'
import ExamSingle from './components/ExamSingle.vue'
import ExamList from './components/ExamList.vue'
import Runner from './components/Runner.vue';
import Profile from './components/Profile.vue'

Vue.use(VueRouter);
Vue.use(VueMdl);
Vue.use(VueValidator);

var App = Vue.extend({});

var router = new VueRouter({
    hashbang: false,
    history: true
});

router.map({
    '/': {
        name: 'home',
        component: Home
    },
    '/runner/:examId': {
        name: 'runner',
        component: Runner
    },
    '/app': {
        component: AppBase,
        subRoutes: {
            '/exams': {
                name: 'exams',
                component: ExamBase,
                subRoutes: {
                    '/': {
                        name: 'allexams',
                        component: ExamList
                    },
                    '/:examId': {
                        name: 'singleexam',
                        component: ExamSingle
                    }
                }
            },
            '/profile': {
                name: 'profile',
                component: Profile
            },
        }
    }
})

router.start(App, '#app')