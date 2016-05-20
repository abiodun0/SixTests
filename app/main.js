import Vue from 'vue';
import VueRouter from 'vue-router';
import BaseComponent from './components/base/base'
import { ListExamComponent, SingleExamComponent } from './components/exam/exam';

Vue.use(VueRouter);

var App = Vue.extend({});

var router = new VueRouter();

router.map({
  '/exams': {
    component: BaseComponent,
    subRoutes: {
      '/': {
        name: 'exams',
        component: ListExamComponent
      },
      '/:exam-id': {
        name: 'singleexam',
        component: SingleExamComponent
      }
    }
  }
})

router.start(App, '#app')
