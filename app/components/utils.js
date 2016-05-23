let notify = (message) => {
  var snackbarContainer = document.querySelector('#exam-notifications');
  snackbarContainer.MaterialSnackbar.showSnackbar({
    message: message
  });
};

let loadUI = () => {
  setTimeout(function() {
    componentHandler.upgradeDom();
  });
}

export { notify, loadUI };
