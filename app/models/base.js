import { database } from './db';
import _ from 'lodash'

class FirebaseModel {
  constructor(node, prefix, protect) {
    this.base = database.ref(node)
    this.prefix = prefix
    this.protect = protect || 'owner'
  }

  create(uid, obj) {
    let key = prefix + base.push().key;
    obj = _.assign({}, { [this.protect]: uid }, obj)
    
    return this.base.child(key).set(obj, err => err)
  }

  get(id) {
    return this.base.child(id).once(data => data.val())
  }

  find(uid) {
    this.base.orderByChild(this.protect).equalTo(uid).once(data => data.val())
  }

  update(obj) {
    let key = obj.__id;
    
    return this.base.child(key).set(obj, err => { 
      return { err, key }
    })
  }

  delete(key, cb) {
    return this.base.child(key).remove(err => err)
  }
}