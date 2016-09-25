<template>
  <div class="padded-content">
    <mdl-dialog v-ref:create-exam-dialog v-bind:title="index !== -1 ? 'Editing Test' : 'Create a test'">
      <validator name="validation">
        <form novalidate action="#">
          <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" id="name" v-model="newExam.name" v-validate="required">
            <label class="mdl-textfield__label" for="name">Enter Test Name</label>
            <span class="mdl-textfield__error" v-show="validation.newExam.name.required">The name field is required</span>
          </div>
          <mdl-textfield label="Test Description" :value.sync="newExam.description" textarea rows="3" error="This field is required" required></mdl-textfield>
          <h4 class="dialog-sub-header">Exam Settings</h2>
          <div class="alert">Set this test as timed to set a duration</div>
          <div class="exam-form-field">
            <mdl-checkbox :checked.sync="newExam.timed" class="mdl-js-ripple-effect">Timed</mdl-checkbox>
            <mdl-textfield label="Enter exam duration in seconds" :value.sync="newExam.duration"></mdl-textfield>
            <mdl-checkbox :checked.sync="newExam.privacy" class="mdl-js-ripple-effect">Private</mdl-checkbox>
          </div>
        </form>
      </validator>
      <template slot="actions">
        <mdl-button @click="$refs.createExamDialog.close">Cancel</mdl-button>
        <mdl-button @click="createExam">OK</mdl-button>
      </template>
    </mdl-dialog>
    <div v-if="$loadingRouteData" class="data-loading">
      <mdl-spinner></mdl-spinner>
    </div>
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--6-col">
        <h2 class="subheader-text">Listing out your exams</h2>
      </div>
      <div class="mdl-cell mdl-cell--6-col flex align-middle-right">
        <mdl-button raised colored @click="showCreateModal()" class="mdl-js-ripple-effect mdl-color--cyan">Create Exam</mdl-button>
      </div>
    </div>
    <div class="mdl-grid" v-if="!$loadingRouteData">
      <div class="mdl-cell mdl-cell--4-col" v-for="exam in exams">
        <div class="exam-card-wide mdl-card mdl-shadow--2dp">
          <div class="mdl-card__title">
            <h2 class="mdl-card__title-text">{{ exam.name }}</h2>
          </div>
          <div class="mdl-card__supporting-text">
            {{ exam.description }}
          </div>
          <div class="mdl-card__actions mdl-card--border">
            <mdl-anchor-button colored class="mdl-js-ripple-effect mdl-color-text--cyan" v-link="{ path: '/app/exams/' + exam.__id }">View Exam Details</mdl-anchor-button>
          </div>
          <div class="mdl-card__menu">
            <mdl-button icon @click="showCreateModal('editing', $index, exam)" class="mdl-js-ripple-effect mdl-color-text--white mdl-button--icon">
              <i class="material-icons">edit</i>
            </mdl-button>
            <mdl-button icon @click="deleteExam($index, exam)" class="mdl-js-ripple-effect mdl-color-text--white mdl-button--icon">
              <i class="material-icons">delete</i>
            </mdl-button>
          </div>
        </div>
      </div>
    </div>
    <div class="empty-message flex column-layout align-middle-center" v-if="!$loadingRouteData && !exams.length">
      <div class="empty-icon">
        <img src="/build/img/folder.png" />
      </div>
      <div class="empty-text">
        <h2>There are currently no items here</h2>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

import { notify, loadUI, idfyObj, objectToArray } from './utils'

import User from '../models/user';
import Exam from '../models/exam';
import Question from '../models/question';

export default {
  data() {
    return {
      newExam: { name: '', description: '' },
      exams: {},
      index: -1
    }
  },
  route: {
    activate() {
      loadUI()
    },
    data(transition) {
      let uid = this.$parent.user.uid;
      Exam.all(uid, (exams) => {
        transition.next({
          exams: objectToArray(exams)
        })
      })
    }
  },
  methods: {
    showCreateModal(editingFlag, index, item) {
      this.index = -1;
      this.newExam = { name: '', description: '' };
      this.$refs.createExamDialog.open();
      if(editingFlag === 'editing') {
        this.newExam = _.assign({}, item);
        this.index = index;
      }
    },
    deleteExam(index, exam) {
      swal({
        title: "Are you sure?",
        text: "You are about to delete this exam!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: true
      }, () => {
        Exam.delete(exam.__id, error => {
          if(!error) {
            this.exams.splice(index, 1); // you could do this.exams.$remove(this.index)
            notify("Successfully deleted the test");
          }
        })
      });
    },
    createExam(event) {
      let uid = this.$parent.user.uid;
      if(this.newExam) {

      }
      if(this.newExam.hasOwnProperty('__id')) {
        Exam.update(this.newExam, (err, key) => {
          if(!err) {
            this.exams.$set(this.index, this.newExam);
            this.newExam = { name: '', description: '' };
            this.index = -1;
            this.$refs.createExamDialog.close();
            notify("Successfully updated the test");
          } else {
            console.log("Error occured while trying to update exam");
          }
        });
      } else {
        Exam.create(uid, this.newExam, (err, key) => {
          if(!err) {
            let _fb_form = idfyObj(key, this.newExam);
            this.exams.push(_fb_form);
            this.newExam = { name: '', description: '' };
            this.$refs.createExamDialog.close();
            notify("Successfully added the test");
          } else {
            console.log("Error occured while trying to create exam.")
          }
        })
      }
    }
  }
}
</script>