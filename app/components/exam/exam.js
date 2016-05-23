import _ from 'lodash';
import Vue from 'vue';
import listTemplate from './list.html';
import singleTemplate from './single.html';

import { notify, loadUI } from '../utils'

import Exam from '../../models/exam';

let idfyObj = function(key, obj) {
  obj['__id'] = key;
  return obj;
}

let objectToArray = function(obj) {
  if(!obj)
    return []

  let updated = Object.keys(obj).map(function(id) {
    return idfyObj(id, obj[id]);
  })
  return updated;
}

const ListExamComponent = Vue.extend({
  template: listTemplate,
  data() {
    return {
      newExam: {},
      exams: {}
    }
  },
  route: {
    activate() {
      loadUI()
    },
    data(transition) {
      Exam.all((exams) => {
        transition.next({
          exams: objectToArray(exams)
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
      dialog.querySelector('.close').addEventListener('click', () => {
        dialog.close();
      })
    },
    createExam(event) {
      let _this = this
      Exam.create(this.newExam, (err, key) => {
        if(err) {
          console.log("Error occured while trying to create exam.")
        } else {
          var dialog = document.querySelector('.create-exam-dialog');
          let _fb_form = idfyObj(key, this.newExam);
          this.exams.push(_fb_form);
          this.newExam = {};
          dialog.close();
          notify("Successfully added the test");
        }
      })
    }
  }
})

const SingleExamComponent = Vue.extend({
  template: singleTemplate,
  route: {
    activate() {
      loadUI()
    }
  }
})

export { ListExamComponent, SingleExamComponent };
