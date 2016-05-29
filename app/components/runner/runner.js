import Vue from 'vue';
import request from 'superagent';
import marked from 'marked';
import runnerTemplate from './main.html';
import runnerHomeTemplate from './home.html';

import { notify, loadUI, idfyObj, objectToArray } from '../utils';

import Exam from '../../models/exam';
import User from '../../models/user';
import Question from '../../models/question';

const RunHomeComponent = Vue.extend({
  template: runnerHomeTemplate,
})

const RunExamComponent = Vue.extend({
  template: runnerTemplate,
  data() {
    return {
      exam: {},
      answers: {},
      questions: []
    }
  },
  route: {
    data(transition) {
      User.checkLoggedIn(user => {
        if (!user) {
          this.$route.router.go({ name: 'runner_home' });
        }
        let examId = this.$route.params.exam_id;
        Exam.get(examId, (exam) => {
          Question.all(examId, (questions) => {
            transition.next({
              user: user,
              exam: idfyObj(examId, exam),
              questions: objectToArray(questions)
            });
            loadUI();
          })
        });
      });

    },
  },
  methods: {
    submitExam() {
      let examId = this.$route.params.exam_id;
      request.post('/scorer/' + examId + '/').send({
        data: this.answers,
        uid: this.user.uid
      }).end((err, res) => {
        // this.$route.router.go('/results')
      });
    }
  },
  filters: {
    marked: marked
  }
})

export { RunHomeComponent, RunExamComponent };
