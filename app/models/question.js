import { database } from './db';

const baseRef = database.ref('questions');

var Question = {
  all(examId, cb) {
    baseRef.child(examId + '/data').once('value', (snapshot) => {
      cb(snapshot.val());
    })
  },
  create(uid, examId, question, cb) {
    let questionRef = baseRef.child(examId + '/data');
    let answerRef = baseRef.child(examId + '/answers');
    let answer = question.is_correct;
    let key = '6eq__' + questionRef.push().key;
    delete question.is_correct;
    questionRef.child(key).set(question, (err) => {
      answerRef.child(key).set(answer, err => {
        cb(err, key);
      });
    });
  },
  delete(examId, id, cb) {
    let questionRef = baseRef.child(examId + "/data");
    questionRef.child(id).remove(cb);
  }
};

export default Question;
