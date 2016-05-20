import Vue from 'vue';
import listTemplate from './list.html';
import singleTemplate from './single.html';

import Exam from '../../models/exam';

const ListExamComponent = Vue.extend({
  template: listTemplate,
  data() {
    return {
      newExam: {},
      exams: []
    }
  },
  route: {
    activate() {
      console.log("In here :: " + componentHandler);
      componentHandler.upgradeAllRegistered();
    },
    data(transition) {
      Exam.all((exams) => {
        transition.next({
          exams: exams
        })
      })
    },
  },
  methods: {
    showCreateModal(event) {
      var dialog = document.querySelector('.create-exam-dialog');
      if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
      }
      dialog.showModal();
      dialog.querySelector('.close').addEventListener('click', function() {
        dialog.close();
      });
    },
    createExam(event) {
      console.log(this.newExam)
      Exam.create()
    }
  }
});

const SingleExamComponent = Vue.extend({
  template: singleTemplate,
});

export { ListExamComponent, SingleExamComponent };
