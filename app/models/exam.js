import database from './db';

const baseRef = database.ref('exams');

var Exam = {
  all(cb) {
    baseRef.once('value', (snapshot) => {
      cb(snapshot.val());
    })
  },
  get(id, cb) {
    baseRef.child(id).once('value', (snapshot) => {
      cb(snapshot.val())
    })
  },
  create(exam, cb) {
    let key = '6e__' + baseRef.push().key;
    baseRef.child(key).set(exam, (err) => {
      cb(err, key);
    });
  },
  delete(id, cb) {
    baseRef.child(id).remove(cb)
  }
};

export default Exam;
