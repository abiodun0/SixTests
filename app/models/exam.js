import database from './db';

const baseRef = database.ref('exams');

var Exam = {
  all(cb) {
    baseRef.on('value', (snapshot) => {
      cb(snapshot.val());
    })
  },
  get(id, cb) {
    baseRef.child(id).on('value', (snapshot) => {
      cb(snapshot.val())
    })
  },
  create(exam, cb) {
    let key = baseRef.push().key();
    let createdExam = baseRef.child(key).set(exam);
    cb(createdExam);
  },
  delete(id, cb) {

  }
};

export default Exam;
