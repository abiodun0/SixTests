import _ from 'lodash';
import marked from 'marked';
import Vue from 'vue';
import listTemplate from './list.html';
import singleTemplate from './single.html';

import { notify, loadUI } from '../utils'

import Exam from '../../models/exam';
import Question from '../../models/question';

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
  data() {
    return {
      questions: [],
      question: {
        text: '',
        is_correct: 0,
        options: []
      },
      addingQuestion: false,
      numberOfOptions: 2
    }
  },
  route: {
    activate() {
      loadUI()
    },
    data(transition) {
      let examId = this.$route.params.exam_id;
      this.examId = examId;
      Exam.get(examId, (exam) => {
        Question.all(examId, (questions) => {
          transition.next({
            exam: exam,
            questions: objectToArray(questions)
          })
        })
      })
    },
  },
  methods: {
    displayForm() {
      this.addingQuestion = true;
    },
    resetQuestion() {
      this.question = {
        text: '',
        is_correct: 0,
        options: []
      };
    },
    addOption() {
      if(this.numberOfOptions < 5) {
        this.numberOfOptions += 1
        loadUI()
      }
    },
    closeForm() {
      this.addingQuestion = false;
      this.resetQuestion();
    },
    createQuestion(event) {
      let _this = this
      Question.create(this.examId, this.question, (err, key) => {
        if(err) {
          console.log("Error occured while trying to create question.")
        } else {
          let _fb_q = idfyObj(key, this.question);
          this.questions.push(_fb_q);
          this.closeForm();
          notify("Successfully added the question");
        }
      })
    },
    deleteQuestion(id, idx, event) {
      Question.delete(this.examId, id, (err) => {
        if(err) {
          console.log("Error occured while trying to delete question.")
        } else {
          this.questions.splice(idx, 1);
          notify("Successfully deleted the question");
        }
      })
    }
  },
  filters: {
    marked: marked
  }
})

export { ListExamComponent, SingleExamComponent };
