import { database } from './db';

let baseRef = database.ref('exams');
let baseQuestionRef = database.ref('questions')

let Exam =  {
  all(cb) {
    baseRef.once('value', snapshot => {
      cb(snapshot.val());
    })
  },
  get(id, cb) {
    baseRef.child(id).once('value', snapshot => {
      cb(snapshot.val())
    })
  },
  create(uid, exam, cb) {
    let key = '6e__' + baseRef.push().key;
    exam.uid = uid;
    baseRef.child(key).set(exam, err => {
      let struct = { owner: uid }
      if(err) {
        cb(err);
        return;
      }
      baseQuestionRef.child(key).set(struct, err => {
        cb(err, key);
      })

    });
  },
  update(exam, cb) {
    let key = exam.__id;
    baseRef.child(key).set(exam, err => {
      cb(err, key);
    })
  },
  delete(id, cb) {
    baseRef.child(id).remove(err => {
      if(err) {
        cb(err)
        return;
      }
      baseQuestionRef.child(id).remove(cb)
    })

  }
};

export default Exam;
