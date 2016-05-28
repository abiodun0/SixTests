import Vue from 'vue';
import VueMdl from 'vue-mdl'
import VueRouter from 'vue-router';
import HomeComponent from './components/home/home';
import BaseAppComponent from './components/base/base';
import RunExamComponent from './components/runner/runner';
import {
  ListExamComponent,
  SingleExamComponent,
  BaseExamComponent
} from './components/exam/exam';
import SettingsComponent from './components/settings/settings'

Vue.use(VueRouter);
Vue.use(VueMdl);

var App = Vue.extend({});

var router = new VueRouter({
  hashbang: false,
  history: true
});

router.map({
  '/': {
    name: 'home',
    component: HomeComponent
  },
  '/runner/:exam_id': {
    name: 'runner',
    component: RunExamComponent
  },
  '/app': {
    component: BaseAppComponent,
    subRoutes: {
      '/exams': {
        name: 'exams',
        component: BaseExamComponent,
        subRoutes: {
          '/': {
            name: 'allexams',
            component: ListExamComponent
          },
          '/:exam_id': {
            name: 'singleexam',
            component: SingleExamComponent
          }
        }
      },
      '/settings': {
        name: 'settings',
        component: SettingsComponent
      },
    }
  }
})

router.start(App, '#app')
