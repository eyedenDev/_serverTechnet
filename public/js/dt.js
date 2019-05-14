// $(document).ready(function () {
// $('#dtBasicExample').DataTable();
// $('.dataTables_length').addClass('bs-select');
// });

$(document).ready(function() {
  $('#dtTest').DataTable({
    pagingType: 'full_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    // "paging":   false,
    ordering: false,
    info: false,
    search: false
  });
  $('.dataTables_length').addClass('bs-select');
});
