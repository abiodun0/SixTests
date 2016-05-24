import database from './db';

const baseRef = database.ref('questions');

var Question = {
  all(examId, cb) {
    baseRef.child(examId).once('value', (snapshot) => {
      cb(snapshot.val());
    })
  },
  create(examId, question, cb) {
    let questionRef = baseRef.child(examId);
    let key = '6eq__' + questionRef.push().key;
    questionRef.child(key).set(question, (err) => {
      cb(err, key);
    });
  },
  delete(examId, id, cb) {
    let questionRef = baseRef.child(examId);
    questionRef.child(id).remove(cb);
  }
};

export default Question;
