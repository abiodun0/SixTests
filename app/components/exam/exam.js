import _ from 'lodash';
import marked from 'marked';
import Vue from 'vue';
import listTemplate from './list.html';
import singleTemplate from './single.html';
import baseTemplate from './base.html';

import { notify, loadUI, idfyObj, objectToArray } from '../utils'

import User from '../../models/user';
import Exam from '../../models/exam';
import Question from '../../models/question';

const BaseExamComponent = Vue.extend({
  template: baseTemplate,
  data() {
    return {
      user: {},
      ExamFactory: {}
    }
  },
  route: {
    data(transition) {
      User.checkLoggedIn(user => {
        if (!user) {
          this.$route.router.go({ name: 'home' });
        }
        transition.next({
          user: user,
          ExamFactory: Exam(user.uid)
        })
      });
    },
    waitForData: true
  },
  methods: {
    logout() {
      User.logoutUser((err) => {
        if(!err)
          console.log("Logging out user");
      })
    }
  }
})

const ListExamComponent = Vue.extend({
  template: listTemplate,
  data() {
    return {
      newExam: {},
      exams: {}
    }
  },
  route: {
    data(transition) {
      this.$parent.ExamFactory.all((exams) => {
        transition.next({
          exams: objectToArray(exams)
        })
      })
    }
  },
  methods: {
    showCreateModal(event) {
      this.$refs.createExamDialog.open();
    },
    createExam(event) {
      this.$parent.ExamFactory.create(this.newExam, (err, key) => {
        if(err) {
          console.log("Error occured while trying to create exam.")
        } else {
          var dialog = document.querySelector('.create-exam-dialog');
          let _fb_form = idfyObj(key, this.newExam);
          this.exams.push(_fb_form);
          this.newExam = {};
          this.$refs.createExamDialog.close();
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
      numberOfOptions: 2,
      displayPreview: true
    }
  },
  route: {
    activate() {
      loadUI()
    },
    data(transition) {
      let examId = this.$route.params.exam_id;
      this.$parent.ExamFactory.get(examId, (exam) => {
        Question.all(examId, (questions) => {
          console.log(questions);
          transition.next({
            exam: idfyObj(examId, exam),
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
      this.numberOfOptions = 2;
    },
    addOption() {
      if(this.numberOfOptions < 5) {
        this.numberOfOptions += 1;
        loadUI();
      }
    },
    closeForm() {
      this.addingQuestion = false;
      this.resetQuestion();
    },
    createQuestion(event) {
      Question.create(this.exam.__id, this.question, (err, key) => {
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
      Question.delete(this.exam.__id, id, (err) => {
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

export { ListExamComponent, SingleExamComponent, BaseExamComponent };
