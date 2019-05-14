function showUsers(acc_type) {
  const showIt = acc_type == 'designer' || acc_type =='admin' ? true : false;
  return showIt;
}
module.exports = showUsers;
