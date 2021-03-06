<template>
  <div>
    <header class="horizontal">
      <div class="shunted-container flex align-middle-left">
        <nav class="fill">
          <div class="logo">
            <div class="responsive-wrapper">
              <img src="/build/img/logo_new_icon.png" />
            </div>
          </div>
        </nav>
        <div class="header-controls inverted">
          <span class="user-information mdl-color-text--white">
            Logged in as {{user.displayName}}
          </span>
          <img v-bind:src="user.photoURL" />
          <mdl-button id="main-dropdown" class="mdl-button--icon mdl-color-text--white">
            <i class="material-icons">more_vert</i>
          </mdl-button>
          <mdl-menu for="main-dropdown" class="mdl-menu--bottom-right">
            <mdl-menu-item v-link="{ path: '/app/profile'}">Profile</mdl-menu-item>
            <mdl-menu-item @click.prevent="logout">Logout</mdl-menu-item>
          </mdl-menu>
        </div>
      </div>
    </header>
    <div v-if="$loadingRouteData || markingExam" class="data-loading" v-bind:class="{ 'dimmed': markingExam }">
      <mdl-spinner></mdl-spinner>
    </div>
    <main class="padded-top">
      <div v-if="!$loadingRouteData" class="shunted-container">
        <div class="report-container mdl-color--white mdl-shadow--2dp" v-if="finishedExam">
          <div class="report-header">
            <div class="rounded-container">
              <img src="/build/img/tick.png" />
            </div>
            <h1>Here are your results</h1>
          </div>
          <h1 class="test-title">{{ exam.name }}</h1>
          <div class="test-score">
            <span>Your score: {{ examReport.score }}/{{ questions.length }}</span>
          </div>
          <mdl-button raised colored @click="resetExam" class="mdl-js-ripple-effect mdl-color--deep-orange">Try Exam Again</mdl-button>
          <mdl-button raised colored @click="closeWindow" class="mdl-js-ripple-effect mdl-color--deep-orange">Close this window</mdl-button>
        </div>
        <div class="test-container mdl-color--white mdl-shadow--2dp" v-if="!finishedExam">
          <h1 class="test-title fill">{{ exam.name }}</h1>
          <div class="question-container column-layout flex align-top-left" v-for="(qIdx, question) in questions" v-if="$index == currentQuestion">
            <div class="count">Question {{$index + 1}}/{{ questions.length }}</div>
            <div class="question-text fill" v-html="question.text || '' | marked"></div>
            <div class="question-options">
              <div class="question-option flex align-middle-left" v-for="option in question.options">
                <label for="question-correct-{{qIdx}}-{{$index}}" class="mdl-radio mdl-js-radio mdl-js-ripple-effect">
                  <input type="radio" id="question-correct-{{qIdx}}-{{$index}}" name="question-correct-{{qIdx}}" class="mdl-radio__button" v-model="answers[question.__id]" value="{{$index}}">
                </label>
                <div>
                  {{option.text}}
                </div>
              </div>
            </div>
          </div>
          <div class="test-controls">
            <div class="progress-meter">

            </div>
            <div class="buttons">
              <mdl-button raised colored @click="prevQuestion" class="mdl-js-ripple-effect mdl-color--cyan">Previous Question</mdl-button>
              <mdl-button raised colored @click="nextQuestion" class="mdl-js-ripple-effect mdl-color--cyan">Next Question</mdl-button>
              <mdl-button raised colored @click="submitExam" class="mdl-js-ripple-effect mdl-color--deep-orange">Submit Exam</mdl-button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import request from 'superagent';
import marked from 'marked';

import { notify, loadUI, idfyObj, objectToArray } from './utils';

import Exam from '../models/exam';
import User from '../models/user';
import Question from '../models/question';

export default {
  data() {
    return {
      exam: {},
      answers: {},
      questions: [],
      examReport: {},
      markingExam: false,
      finishedExam: false,
      currentQuestion: 0
    }
  },
  route: {
    data(transition) {
      User.checkLoggedIn(user => {
        if (!user) {
          // Do something when user is not logged in
          // this.$route.router.go({ name: 'runner_home' });
        }
        let examId = this.$route.params.examId;
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
    submitExam($event) {
      this.markingExam = true
      let examId = this.$route.params.examId;
      request.post('/scorer/' + examId + '/').send({
        data: this.answers,
        uid: this.user.uid
      }).end((err, res) => {
        this.examReport = res.body
        this.markingExam = false
        this.finishedExam = true
      });
    },
    nextQuestion($event) {
      if(this.currentQuestion < this.questions.length - 1) {
        this.currentQuestion += 1
        loadUI();
      }
    },
    prevQuestion($event) {
      if(this.currentQuestion > 0) {
        this.currentQuestion -= 1
        loadUI();
      }
    },
    resetExam($event) {
      this.currentQuestion = 0;
      this.answers = {}
      this.examReport = {}
      this.markingExam = false
      this.finishedExam = false
      this.currentQuestion = 0
    },
    closeWindow($event) {
      window.close()
    }
  },
  filters: {
    marked: marked
  }
}
</script>