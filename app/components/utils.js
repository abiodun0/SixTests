let notify = (message) => {
  var snackbarContainer = document.querySelector('#exam-notifications');
  snackbarContainer.MaterialSnackbar.showSnackbar({
    message: message
  });
};

export { notify };
