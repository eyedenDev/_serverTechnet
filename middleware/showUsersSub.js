function showUsersSub(acc_type) {
  const showIt = acc_type == 'designer' || acc_type =='admin' || acc_type =='r&d_dev' ? true : false;
  return showIt;
}
module.exports = showUsersSub;
