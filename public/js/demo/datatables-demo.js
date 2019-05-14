// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTable').DataTable();
});

// design Table
$(document).ready(function() {
  $('#dt_locDesign').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// frames Table
$(document).ready(function() {
  $('#dt_locFrames').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// floor Table
$(document).ready(function() {
  $('#dt_locFloors').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// covering Table
$(document).ready(function() {
  $('#dt_locCoverings').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// covering Table
$(document).ready(function() {
  $('#dt_locGutters').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// Heating Table
$(document).ready(function() {
  $('#dt_locHeatSys').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// Heating Table
$(document).ready(function() {
  $('#dt_locVent').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// CO2 Table
$(document).ready(function() {
  $('#dt_locCO2').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// Energy Table
$(document).ready(function() {
  $('#dt_locEnergy').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// Energy Types Table
$(document).ready(function() {
  $('#dt_locScreens').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// Misc Table
$(document).ready(function() {
  $('#dt_locMisc').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// Power Table
$(document).ready(function() {
  $('#dt_locPower').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// ABATEMENTS

// fungals Table
$(document).ready(function() {
  $('#dt_abate_fungals').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// mildew Table
$(document).ready(function() {
  $('#dt_abate_mildew').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// molds Table
$(document).ready(function() {
  $('#dt_abate_molds').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// viroids Table
$(document).ready(function() {
  $('#abate_viroids_dt').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// viruses Table
$(document).ready(function() {
  $('#abate_viruses_dt').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// Restorations

// fire accelerant Table
$(document).ready(function() {
  $('#resto_fire_dt').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// flood causes Table
$(document).ready(function() {
  $('#resto_flood_dt').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// industry sectors
$(document).ready(function() {
  $('#industry_sectors_dt').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// pests
$(document).ready(function() {
  $('#dt_pests').DataTable({
    columnDefs: [
      {
        targets: -1,
        sorting: false
      }
    ],
    scrollY: '500px',
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});

// service_requests Table
$(document).ready(function() {
  $('#dt_srvice_requests').DataTable({
    columnDefs: [
      {
        targets: 1,
        sorting: false
      }
    ],
    scrollY: '500px',
    scrollX: false,
    pagingType: 'simple_numbers', // "simple" option for 'Previous' and 'Next' buttons only
    scrollCollapse: true,
    ordering: true,
    info: false,
    searching: false
  });
});
