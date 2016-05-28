let notify = (message) => {
  var snackbarContainer = document.querySelector('#exam-notifications');
  snackbarContainer.MaterialSnackbar.showSnackbar({
    message: message
  });
};

let loadUI = () => {
  setTimeout(() => {
    componentHandler.upgradeDom();
  });
}

let idfyObj = (key, obj) => {
  obj['__id'] = key;
  return obj;
}

let objectToArray = (obj) => {
  if(!obj)
    return []

  let updated = Object.keys(obj).map((id) => {
    return idfyObj(id, obj[id]);
  })
  return updated;
}

export { notify, loadUI, idfyObj, objectToArray };
