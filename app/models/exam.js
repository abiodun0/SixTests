import database from './db';

const baseRef = database.ref('exams');

var Exam = {
  all(cb) {
    baseRef.once('value', (snapshot) => {
      cb(snapshot.val());
    })
  },
  get(id, cb) {
    baseRef.child(id).on('value', (snapshot) => {
      cb(snapshot.val())
    })
  },
  create(exam, cb) {
    let key = baseRef.push().key;
    baseRef.child(key).set(exam, (err) => {
      cb(err, key);
    });
  },
  delete(id, cb) {

  }
};

export default Exam;
