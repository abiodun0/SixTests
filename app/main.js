import Vue from 'vue';
import VueRouter from 'vue-router';
import BaseComponent from './components/base/base'
import { ListExamComponent, SingleExamComponent } from './components/exam/exam';
import SettingsComponent from './components/settings/settings'

Vue.use(VueRouter);

var App = Vue.extend({});

var router = new VueRouter();

router.map({
  '/': {
    component: BaseComponent,
    subRoutes: {
      '/exams': {
        name: 'exams',
        component: ListExamComponent
      },
      '/exams/:exam_id': {
        name: 'singleexam',
        component: SingleExamComponent
      },
      '/settings': {
        name: 'settings',
        component: SettingsComponent
      },
    }
  }
})

router.start(App, '#app')
