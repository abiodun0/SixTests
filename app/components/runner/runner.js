import Vue from 'vue';
import marked from 'marked';
import runnerTemplate from './main.html';

import { notify, loadUI, idfyObj, objectToArray } from '../utils'

import Exam from '../../models/exam'
import Question from '../../models/question'

const RunExamComponent = Vue.extend({
  template: runnerTemplate,
  data() {
    return {
      exam: {},
      questions: []
    }
  },
  route: {
    data(transition) {
      let examId = this.$route.params.exam_id;
      Exam.get(examId, (exam) => {
        Question.all(examId, (questions) => {
          transition.next({
            exam: idfyObj(examId, exam),
            questions: objectToArray(questions)
          });
          loadUI();
        })
      })

    }
  },
  filters: {
    marked: marked
  }
})

export default RunExamComponent;
