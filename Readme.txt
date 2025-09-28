Thanks for downloading this template!

Template Name: Medilab
Template URL: https://bootstrapmade.com/medilab-free-medical-bootstrap-theme/
Author: BootstrapMade.com
License: https://bootstrapmade.com/license/


<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title>Doctor Dashboard - MediCare</title>
  <meta name="description" content="Doctor dashboard for MediCare healthcare portal">

  <!-- Favicons -->
  <link href="../assets/img/favicon.png" rel="icon">
  <link href="../assets/img/apple-touch-icon.png" rel="apple-touch-icon">

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com" rel="preconnect">
  <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet">

  <!-- Vendor CSS Files -->
  <link href="../assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="../assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="../assets/vendor/aos/aos.css" rel="stylesheet">
  <link href="../assets/vendor/fontawesome-free/css/all.min.css" rel="stylesheet">
  <link href="../assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet">
  <link href="../assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet">

  <!-- Main CSS File -->
  <link href="../assets/css/main.css" rel="stylesheet">



  <!-- Dashboard CSS -->
  <style>
    .dashboard-card {
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s;
      height: 100%;
    }

    .dashboard-card:hover {
      transform: translateY(-5px);
    }

    .card-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .appointments-card {
      border-left: 4px solid #4154f1;
    }

    .patients-card {
      border-left: 4px solid #2ca58d;
    }

    .prescriptions-card {
      border-left: 4px solid #f72585;
    }

    .reviews-card {
      border-left: 4px solid #ff9e00;
    }

    .nav-pills .nav-link.active {
      background-color: #4154f1;
    }

    .profile-img {
      width: 120px;
      height: 120px;
      object-fit: cover;
    }

    .availability-badge {
      font-size: 0.8rem;
    }
  </style>
</head>

<body class="dashboard-page">

  <header id="header" class="header sticky-top">
    <div class="topbar d-flex align-items-center">
      <div class="container d-flex justify-content-center justify-content-md-between">
        <div class="contact-info d-flex align-items-center">
          <i class="bi bi-person d-flex align-items-center"><span id="doctor-name">Loading...</span></i>
        </div>
        <div class="social-links d-none d-md-flex align-items-center">
          <a href="../index.html" class="home-btn"><i class="bi bi-house-door"></i> Home</a>
          <a href="#" id="logout-btn" class="logout-btn ms-3"><i class="bi bi-box-arrow-right"></i> Logout</a>
        </div>
      </div>
    </div>

    <div class="branding d-flex align-items-center">
      <div class="container position-relative d-flex align-items-center justify-content-between">
        <a href="dashboard.html" class="logo d-flex align-items-center me-auto">
          <h1 class="sitename">MediCare</h1>
        </a>

        <nav id="navmenu" class="navmenu">
          <ul>
            <li><a href="#dashboard" class="active">Dashboard</a></li>
            <li><a href="#appointments">Appointments</a></li>
            <li><a href="#patients">Patients</a></li>
            <li><a href="#prescriptions">Prescriptions</a></li>
            <li><a href="#profile">Profile</a></li>
          </ul>
          <i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
        </nav>

        <a class="cta-btn d-none d-sm-block" href="#availability">Update Availability</a>
      </div>
    </div>
  </header>

  <main class="main">
    <!-- Dashboard Section -->
    <section id="dashboard" class="dashboard section">
      <div class="container">
        <div class="row mb-4">
          <div class="col-12">
            <h2>Doctor Dashboard</h2>
            <p class="mb-0">Welcome back to your healthcare portal</p>
          </div>
        </div>

        <div class="row gy-4">
          <!-- Today's Appointments Card -->
          <div class="col-lg-3 col-md-6">
            <div class="dashboard-card appointments-card p-4">
              <div class="card-icon text-primary">
                <i class="bi bi-calendar-check"></i>
              </div>
              <h5>Today's Appointments</h5>
              <h3 id="todays-appointments-count">0</h3>
              <a href="#appointments" class="btn btn-sm btn-outline-primary">View All</a>
            </div>
          </div>

          <!-- Total Patients Card -->
          <div class="col-lg-3 col-md-6">
            <div class="dashboard-card patients-card p-4">
              <div class="card-icon text-success">
                <i class="bi bi-people"></i>
              </div>
              <h5>Total Patients</h5>
              <h3 id="patients-count">0</h3>
              <a href="#patients" class="btn btn-sm btn-outline-success">View All</a>
            </div>
          </div>

          <!-- Prescriptions Card -->
          <div class="col-lg-3 col-md-6">
            <div class="dashboard-card prescriptions-card p-4">
              <div class="card-icon text-danger">
                <i class="bi bi-prescription"></i>
              </div>
              <h5>Prescriptions</h5>
              <h3 id="prescriptions-count">0</h3>
              <a href="#prescriptions" class="btn btn-sm btn-outline-danger">View All</a>
            </div>
          </div>

          <!-- Reviews Card -->
          <div class="col-lg-3 col-md-6">
            <div class="dashboard-card reviews-card p-4">
              <div class="card-icon text-warning">
                <i class="bi bi-star"></i>
              </div>
              <h5>Average Rating</h5>
              <h3 id="average-rating">0.0</h3>
              <a href="#reviews" class="btn btn-sm btn-outline-warning">View All</a>
            </div>
          </div>
        </div>

        <!-- Upcoming Appointments Section -->
        <div class="row mt-5">
          <div class="col-lg-8">
            <div class="card">
              <div class="card-header">
                <h5>Upcoming Appointments</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Patient</th>
                        <th>Reason</th>
                        <th>Type</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody id="upcoming-appointments">
                      <!-- Filled by JavaScript -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions Section -->
          <div class="col-lg-4">
            <div class="card">
              <div class="card-header">
                <h5>Quick Actions</h5>
              </div>
              <div class="card-body">
                <div class="d-grid gap-2">
                  <button class="btn btn-primary" onclick="location.href='#new-prescription'">
                    <i class="bi bi-prescription me-2"></i> New Prescription
                  </button>
                  <button class="btn btn-success" onclick="location.href='#availability'">
                    <i class="bi bi-calendar-event me-2"></i> Update Availability
                  </button>
                  <button class="btn btn-info" onclick="location.href='#patients'">
                    <i class="bi bi-people me-2"></i> View Patients
                  </button>
                  <button class="btn btn-warning" onclick="location.href='#profile'">
                    <i class="bi bi-pencil-square me-2"></i> Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section><!-- /Dashboard Section -->

    <!-- Appointments Section -->
    <section id="appointments" class="appointments section">
      <div class="container">
        <div class="row mb-4">
          <div class="col-12">
            <h2>Appointments</h2>
            <p>Manage your upcoming and past appointments</p>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <ul class="nav nav-pills mb-4" id="appointments-tab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="upcoming-tab" data-bs-toggle="pill" data-bs-target="#upcoming"
                  type="button" role="tab">Upcoming</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="past-tab" data-bs-toggle="pill" data-bs-target="#past" type="button"
                  role="tab">Past</button>
              </li>
            </ul>

            <div class="tab-content" id="appointments-tabContent">
              <div class="tab-pane fade show active" id="upcoming" role="tabpanel">
                <div class="card">
                  <div class="card-body">
                    <div class="table-responsive">
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <th>Date & Time</th>
                            <th>Patient</th>
                            <th>Reason</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody id="upcoming-appointments-list">
                          <!-- Filled by JavaScript -->
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tab-pane fade" id="past" role="tabpanel">
                <div class="card">
                  <div class="card-body">
                    <div class="table-responsive">
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <th>Date & Time</th>
                            <th>Patient</th>
                            <th>Reason</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody id="past-appointments-list">
                          <!-- Filled by JavaScript -->
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section><!-- /Appointments Section -->

    <!-- Patients Section -->
    <section id="patients" class="patients section">
      <div class="container">
        <div class="row mb-4">
          <div class="col-12">
            <h2>My Patients</h2>
            <p>View and manage your patients</p>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Last Visit</th>
                        <th>Next Appointment</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody id="patients-list">
                      <!-- Filled by JavaScript -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section><!-- /Patients Section -->

    <!-- Prescriptions Section -->
    <section id="prescriptions" class="prescriptions section">
      <div class="container">
        <div class="row mb-4">
          <div class="col-12">
            <h2>Prescriptions</h2>
            <p>Manage patient prescriptions</p>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <ul class="nav nav-tabs card-header-tabs" id="prescriptions-tabs" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="active-tab" data-bs-toggle="pill" data-bs-target="#active"
                      type="button" role="tab">Active</button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link" id="new-tab" data-bs-toggle="pill" data-bs-target="#new" type="button"
                      role="tab">New Prescription</button>
                  </li>
                </ul>
              </div>
              <div class="card-body">
                <div class="tab-content" id="prescriptions-tabContent">
                  <div class="tab-pane fade show active" id="active" role="tabpanel">
                    <div class="table-responsive">
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Patient</th>
                            <th>Medication</th>
                            <th>Dosage</th>
                            <th>Refills</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody id="active-prescriptions">
                          <!-- Filled by JavaScript -->
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="tab-pane fade" id="new" role="tabpanel">
                    <form id="new-prescription-form">
                      <div class="row">
                        <div class="col-md-6 form-group mb-3">
                          <label for="prescription-patient" class="form-label">Patient</label>
                          <select name="patient" id="prescription-patient" class="form-select" required>
                            <option value="">Select Patient</option>
                            <!-- Filled by JavaScript -->
                          </select>
                        </div>
                        <div class="col-md-6 form-group mb-3">
                          <label for="prescription-appointment" class="form-label">Appointment (Optional)</label>
                          <select name="appointment" id="prescription-appointment" class="form-select">
                            <option value="">Select Appointment</option>
                            <!-- Filled by JavaScript -->
                          </select>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6 form-group mb-3">
                          <label for="prescription-medication" class="form-label">Medication</label>
                          <input type="text" class="form-control" id="prescription-medication" required>
                        </div>
                        <div class="col-md-6 form-group mb-3">
                          <label for="prescription-dosage" class="form-label">Dosage</label>
                          <input type="text" class="form-control" id="prescription-dosage" required>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6 form-group mb-3">
                          <label for="prescription-frequency" class="form-label">Frequency</label>
                          <input type="text" class="form-control" id="prescription-frequency" required>
                        </div>
                        <div class="col-md-6 form-group mb-3">
                          <label for="prescription-duration" class="form-label">Duration</label>
                          <input type="text" class="form-control" id="prescription-duration" required>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6 form-group mb-3">
                          <label for="prescription-refills" class="form-label">Refills</label>
                          <input type="number" class="form-control" id="prescription-refills" value="0" min="0">
                        </div>
                        <div class="col-md-6 form-group mb-3">
                          <label for="prescription-notes" class="form-label">Notes</label>
                          <input type="text" class="form-control" id="prescription-notes">
                        </div>
                      </div>
                      <div class="form-group mb-3">
                        <label for="prescription-instructions" class="form-label">Instructions</label>
                        <textarea class="form-control" id="prescription-instructions" rows="3" required></textarea>
                      </div>
                      <div class="text-end">
                        <button type="submit" class="btn btn-primary">Create Prescription</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section><!-- /Prescriptions Section -->

    <!-- Availability Section -->
    <section id="availability" class="availability section">
      <div class="container">
        <div class="row mb-4">
          <div class="col-12">
            <h2>Availability</h2>
            <p>Set your working hours and availability</p>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <form id="availability-form">
                  <div class="row mb-4">
                    <div class="col-12">
                      <h5>Weekly Schedule</h5>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-2">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="monday-check" checked>
                        <label class="form-check-label" for="monday-check">Monday</label>
                      </div>
                    </div>
                    <div class="col-md-5">
                      <label for="monday-start" class="form-label">Start Time</label>
                      <input type="time" class="form-control" id="monday-start" value="09:00">
                    </div>
                    <div class="col-md-5">
                      <label for="monday-end" class="form-label">End Time</label>
                      <input type="time" class="form-control" id="monday-end" value="17:00">
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-2">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="tuesday-check" checked>
                        <label class="form-check-label" for="tuesday-check">Tuesday</label>
                      </div>
                    </div>
                    <div class="col-md-5">
                      <label for="tuesday-start" class="form-label">Start Time</label>
                      <input type="time" class="form-control" id="tuesday-start" value="09:00">
                    </div>
                    <div class="col-md-5">
                      <label for="tuesday-end" class="form-label">End Time</label>
                      <input type="time" class="form-control" id="tuesday-end" value="17:00">
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-2">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="wednesday-check" checked>
                        <label class="form-check-label" for="wednesday-check">Wednesday</label>
                      </div>
                    </div>
                    <div class="col-md-5">
                      <label for="wednesday-start" class="form-label">Start Time</label>
                      <input type="time" class="form-control" id="wednesday-start" value="09:00">
                    </div>
                    <div class="col-md-5">
                      <label for="wednesday-end" class="form-label">End Time</label>
                      <input type="time" class="form-control" id="wednesday-end" value="17:00">
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-2">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="thursday-check" checked>
                        <label class="form-check-label" for="thursday-check">Thursday</label>
                      </div>
                    </div>
                    <div class="col-md-5">
                      <label for="thursday-start" class="form-label">Start Time</label>
                      <input type="time" class="form-control" id="thursday-start" value="09:00">
                    </div>
                    <div class="col-md-5">
                      <label for="thursday-end" class="form-label">End Time</label>
                      <input type="time" class="form-control" id="thursday-end" value="17:00">
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-2">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="friday-check" checked>
                        <label class="form-check-label" for="friday-check">Friday</label>
                      </div>
                    </div>
                    <div class="col-md-5">
                      <label for="friday-start" class="form-label">Start Time</label>
                      <input type="time" class="form-control" id="friday-start" value="09:00">
                    </div>
                    <div class="col-md-5">
                      <label for="friday-end" class="form-label">End Time</label>
                      <input type="time" class="form-control" id="friday-end" value="17:00">
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-2">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="saturday-check">
                        <label class="form-check-label" for="saturday-check">Saturday</label>
                      </div>
                    </div>
                    <div class="col-md-5">
                      <label for="saturday-start" class="form-label">Start Time</label>
                      <input type="time" class="form-control" id="saturday-start" value="09:00" disabled>
                    </div>
                    <div class="col-md-5">
                      <label for="saturday-end" class="form-label">End Time</label>
                      <input type="time" class="form-control" id="saturday-end" value="17:00" disabled>
                    </div>
                  </div>

                  <div class="row mb-4">
                    <div class="col-md-2">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="sunday-check">
                        <label class="form-check-label" for="sunday-check">Sunday</label>
                      </div>
                    </div>
                    <div class="col-md-5">
                      <label for="sunday-start" class="form-label">Start Time</label>
                      <input type="time" class="form-control" id="sunday-start" value="09:00" disabled>
                    </div>
                    <div class="col-md-5">
                      <label for="sunday-end" class="form-label">End Time</label>
                      <input type="time" class="form-control" id="sunday-end" value="17:00" disabled>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-12">
                      <h5>Time Slots</h5>
                      <p>Appointment duration (minutes):</p>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="appointmentDuration" id="duration-15"
                          value="15">
                        <label class="form-check-label" for="duration-15">15</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="appointmentDuration" id="duration-30"
                          value="30" checked>
                        <label class="form-check-label" for="duration-30">30</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="appointmentDuration" id="duration-45"
                          value="45">
                        <label class="form-check-label" for="duration-45">45</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="appointmentDuration" id="duration-60"
                          value="60">
                        <label class="form-check-label" for="duration-60">60</label>
                      </div>
                    </div>
                  </div>

                  <div class="row mt-4">
                    <div class="col-12 text-end">
                      <button type="submit" class="btn btn-primary">Update Availability</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section><!-- /Availability Section -->

    <!-- Profile Section -->
    <section id="profile" class="profile section">
      <div class="container">
        <div class="row mb-4">
          <div class="col-12">
            <h2>My Profile</h2>
            <p>Manage your professional information</p>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-4">
            <div class="card">
              <div class="card-body text-center">
                <img src="../assets/img/doctors/doctor-default.jpg" alt="Profile"
                  class="rounded-circle profile-img mb-3">
                <h4 id="profile-name">Loading...</h4>
                <p class="text-muted" id="profile-specialty">Loading...</p>
                <div class="d-grid gap-2">
                  <button class="btn btn-outline-primary" id="change-photo-btn">Change Photo</button>
                </div>
              </div>
            </div>

            <div class="card mt-4">
              <div class="card-header">
                <h5>Account Security</h5>
              </div>
              <div class="card-body">
                <div class="d-grid gap-2">
                  <button class="btn btn-outline-warning" id="change-password-btn">Change Password</button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-8">
            <div class="card">
              <div class="card-header">
                <h5>Professional Information</h5>
              </div>
              <div class="card-body">
                <form id="profile-form">
                  <div class="row">
                    <div class="col-md-6 form-group mb-3">
                      <label for="profile-first-name" class="form-label">First Name</label>
                      <input type="text" class="form-control" id="profile-first-name" required>
                    </div>
                    <div class="col-md-6 form-group mb-3">
                      <label for="profile-last-name" class="form-label">Last Name</label>
                      <input type="text" class="form-control" id="profile-last-name" required>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 form-group mb-3">
                      <label for="profile-email" class="form-label">Email</label>
                      <input type="email" class="form-control" id="profile-email" required>
                    </div>
                    <div class="col-md-6 form-group mb-3">
                      <label for="profile-phone" class="form-label">Phone</label>
                      <input type="tel" class="form-control" id="profile-phone">
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 form-group mb-3">
                      <label for="profile-specialty" class="form-label">Specialty</label>
                      <select class="form-select" id="profile-specialty" required>
                        <option value="">Select Specialty</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="General Practice">General Practice</option>
                      </select>
                    </div>
                    <div class="col-md-6 form-group mb-3">
                      <label for="profile-years" class="form-label">Years of Experience</label>
                      <input type="number" class="form-control" id="profile-years" min="0">
                    </div>
                  </div>
                  <div class="form-group mb-3">
                    <label for="profile-bio" class="form-label">Biography</label>
                    <textarea class="form-control" id="profile-bio" rows="3"></textarea>
                  </div>
                  <div class="form-group mb-3">
                    <label for="profile-education" class="form-label">Education</label>
                    <textarea class="form-control" id="profile-education" rows="3"></textarea>
                  </div>
                  <div class="text-end">
                    <button type="submit" class="btn btn-primary">Update Profile</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section><!-- /Profile Section -->

    <!-- Change Password Modal -->
    <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="changePasswordModalLabel"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="changePasswordModalLabel">Change Password</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="change-password-form">
              <div class="form-group mb-3">
                <label for="current-password" class="form-label">Current Password</label>
                <input type="password" class="form-control" id="current-password" required>
              </div>
              <div class="form-group mb-3">
                <label for="new-password" class="form-label">New Password</label>
                <input type="password" class="form-control" id="new-password" required>
              </div>
              <div class="form-group mb-3">
                <label for="confirm-password" class="form-label">Confirm New Password</label>
                <input type="password" class="form-control" id="confirm-password" required>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Change Password</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Call Modal -->
    <div class="modal fade" id="videoCallModal" tabindex="-1" aria-labelledby="videoCallModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="videoCallModalLabel">Video Consultation</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-8">
                <div id="video-container"
                  style="width: 100%; height: 400px; background-color: #000; position: relative;">
                  <div id="local-video"
                    style="position: absolute; bottom: 20px; right: 20px; width: 120px; height: 90px; z-index: 100;">
                  </div>
                  <div id="remote-video" style="width: 100%; height: 100%;"></div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="chat-container"
                  style="height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;"
                  id="chat-messages">
                  <!-- Chat messages will appear here -->
                </div>
                <div class="input-group">
                  <input type="text" class="form-control" id="chat-input" placeholder="Type your message...">
                  <button class="btn btn-primary" id="send-message">Send</button>
                </div>
                <div class="mt-3">
                  <button id="end-call" class="btn btn-danger w-100">End Call</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Prescription Modal -->
    <div class="modal fade" id="prescriptionModal" tabindex="-1" aria-labelledby="prescriptionModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="prescriptionModalLabel">Create Prescription</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="prescription-form">
              <input type="hidden" id="prescription-appointment-id">
              <div class="row">
                <div class="col-md-6 form-group mb-3">
                  <label for="prescription-patient-name" class="form-label">Patient</label>
                  <input type="text" class="form-control" id="prescription-patient-name" readonly>
                </div>
                <div class="col-md-6 form-group mb-3">
                  <label for="prescription-date" class="form-label">Date</label>
                  <input type="date" class="form-control" id="prescription-date" readonly>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 form-group mb-3">
                  <label for="prescription-medication" class="form-label">Medication</label>
                  <input type="text" class="form-control" id="prescription-medication" required>
                </div>
                <div class="col-md-6 form-group mb-3">
                  <label for="prescription-dosage" class="form-label">Dosage</label>
                  <input type="text" class="form-control" id="prescription-dosage" required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 form-group mb-3">
                  <label for="prescription-frequency" class="form-label">Frequency</label>
                  <input type="text" class="form-control" id="prescription-frequency" required>
                </div>
                <div class="col-md-6 form-group mb-3">
                  <label for="prescription-duration" class="form-label">Duration</label>
                  <input type="text" class="form-control" id="prescription-duration" required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 form-group mb-3">
                  <label for="prescription-refills" class="form-label">Refills</label>
                  <input type="number" class="form-control" id="prescription-refills" value="0" min="0">
                </div>
                <div class="col-md-6 form-group mb-3">
                  <label for="prescription-notes" class="form-label">Notes</label>
                  <input type="text" class="form-control" id="prescription-notes">
                </div>
              </div>
              <div class="form-group mb-3">
                <label for="prescription-instructions" class="form-label">Instructions</label>
                <textarea class="form-control" id="prescription-instructions" rows="3" required></textarea>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Prescription</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer id="footer" class="footer light-background">
    <div class="container">
      <div class="copyright text-center">
        <p>© <span>Copyright</span> <strong class="px-1 sitename">MediCare</strong> <span>All Rights Reserved</span></p>
      </div>
    </div>
  </footer>

  <!-- Scroll Top -->
  <a href="#" id="scroll-top" class="scroll-top d-flex align-items-center justify-content-center"><i
      class="bi bi-arrow-up-short"></i></a>

  <!-- Vendor JS Files -->
  <script src="../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="../assets/vendor/aos/aos.js"></script>
  <script src="../assets/vendor/glightbox/js/glightbox.min.js"></script>
  <script src="../assets/vendor/swiper/swiper-bundle.min.js"></script>

  <!-- Main JS File -->
  <script src="../assets/js/main.js"></script>

  
  <script src="https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js"></script>

  <!-- Dashboard JS -->
  <script>
    // Global variables
    let currentUser = null;
    let zegoCloudEngine = null;
    let currentAppointmentId = null;

    const appID = 1216224771; // Replace with your ZegoCloud App ID (number)
    const server = '20acf9663280801a5df6698b048aef76'; // Replace with your ZegoCloud server URL

    // DOM Ready
    document.addEventListener('DOMContentLoaded', function () {
      // Check authentication
      checkAuthStatus();

      // Load dashboard data
      loadDashboardData();

      // Event listeners
      document.getElementById('logout-btn').addEventListener('click', function (e) {
        e.preventDefault();
        logout();
      });

      document.getElementById('change-password-btn').addEventListener('click', function () {
        const changePasswordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
        changePasswordModal.show();
      });

      // Form submissions
      document.getElementById('profile-form').addEventListener('submit', function (e) {
        e.preventDefault();
        updateProfile();
      });

      document.getElementById('new-prescription-form').addEventListener('submit', function (e) {
        e.preventDefault();
        createPrescription();
      });

      document.getElementById('availability-form').addEventListener('submit', function (e) {
        e.preventDefault();
        updateAvailability();
      });

      document.getElementById('change-password-form').addEventListener('submit', function (e) {
        e.preventDefault();
        changePassword();
      });

      // Toggle weekend availability inputs
      document.getElementById('saturday-check').addEventListener('change', function () {
        document.getElementById('saturday-start').disabled = !this.checked;
        document.getElementById('saturday-end').disabled = !this.checked;
      });

      document.getElementById('sunday-check').addEventListener('change', function () {
        document.getElementById('sunday-start').disabled = !this.checked;
        document.getElementById('sunday-end').disabled = !this.checked;
      });
    });

    // API Functions
    //  async function checkAuthStatus() {
    //      const token = localStorage.getItem('token');
    //     if (token) {
    //       try {
    //         const response = await fetch('/auth/me', {
    //           headers: {
    //             'Authorization': `Bearer ${token}`
    //           }
    //         });

    //         if (response.ok) {
    //           const user = await response.json();
    //           if (user.role !== 'DOCTOR') {
    //             window.location.href = `/${user.role.toLowerCase()}/dashboard.html`;
    //             return;
    //           }
    //           currentUser = user;
    //           updateUIForLoggedInUser(user);
    //         } else {
    //           localStorage.removeItem('token');
    //           window.location.href = '../index.html';
    //         }
    //       } catch (error) {
    //         console.error('Error checking auth status:', error);
    //         window.location.href = '../index.html';
    //       }
    //     } else {
    //       window.location.href = '../index.html';
    //     }
    //   }

    async function checkAuthStatus() {
      const token = localStorage.getItem('token');
      console.log('Token on dashboard load:', token);
      if (!token) {
        console.log('No token found, redirecting to /index.html');
        window.location.href = '/index.html';
        return;
      }
      try {
        console.log('Sending request to /auth/me');
        const response = await fetch('http://localhost:8080/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Response status:', response.status);
        if (response.ok) {
          const user = await response.json();
          console.log('User data:', user);
          if (user.role.toUpperCase() !== 'DOCTOR') {
            console.log('Redirecting to:', `/${user.role.toLowerCase()}/dashboard.html`);
            window.location.href = `/${user.role.toLowerCase()}/dashboard.html`;
            return;
          }
          currentUser = user;
          updateUIForLoggedInUser(user);
        } else {
          const error = await response.json();
          console.error('Auth error:', error);
          alert(`Authentication failed: ${error.message || 'Please log in again'}`);
          localStorage.removeItem('token');
          window.location.href = '/index.html';
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        alert('An error occurred while verifying authentication. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/index.html';
      }
    }

    async function loadDashboardData() {
      try {
        const [appointmentsRes, patientsRes, prescriptionsRes, profileRes] = await Promise.all([
          fetch('http://localhost:8080/appointments/doctor', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch('http://localhost:8080/patients', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch('http://localhost:8080/prescriptions/doctor', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch('http://localhost:8080/doctors/me', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);

        if (appointmentsRes.ok) {
          const appointments = await appointmentsRes.json();
          displayAppointments(appointments);
        }

        if (patientsRes.ok) {
          const patients = await patientsRes.json();
          displayPatients(patients);
        }

        if (prescriptionsRes.ok) {
          const prescriptions = await prescriptionsRes.json();
          displayPrescriptions(prescriptions);
        }

        if (profileRes.ok) {
          const profile = await profileRes.json();
          displayProfile(profile);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    }

    async function updateProfile() {
      const form = document.getElementById('profile-form');

      const profileData = {
        name: `${formData.get('first-name')} ${formData.get('last-name')}`,
        email: formData.get('email'),
        phone: formData.get('phone'),
        specialty: formData.get('specialty'),
        yearsOfExperience: formData.get('years'),
        bio: formData.get('bio'),
        education: formData.get('education')
      };

      try {
        const response = await fetch('http://localhost:8080/doctors/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(profileData)
        });

        if (response.ok) {
          const updatedProfile = await response.json();
          alert('Profile updated successfully!');
          displayProfile(updatedProfile);
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating profile');
      }
    }

    async function createPrescription() {
      const form = document.getElementById('new-prescription-form');

      const prescriptionData = {
        patientId: formData.get('patient'),
        appointmentId: formData.get('appointment') || null,
        medication: formData.get('medication'),
        dosage: formData.get('dosage'),
        frequency: formData.get('frequency'),
        duration: formData.get('duration'),
        refills: formData.get('refills'),
        instructions: formData.get('instructions'),
        notes: formData.get('notes')
      };

      try {
        const response = await fetch('http://localhost:8080/prescriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(prescriptionData)
        });

        if (response.ok) {
          const prescription = await response.json();
          alert('Prescription created successfully!');
          form.reset();
          loadDashboardData();
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to create prescription');
        }
      } catch (error) {
        console.error('Error creating prescription:', error);
        alert('An error occurred while creating prescription');
      }
    }

    async function updateAvailability() {
      const form = document.getElementById('availability-form');

      const availabilityData = {
        schedule: {
          monday: {
            available: formData.get('monday-check') === 'on',
            startTime: formData.get('monday-start'),
            endTime: formData.get('monday-end')
          },
          tuesday: {
            available: formData.get('tuesday-check') === 'on',
            startTime: formData.get('tuesday-start'),
            endTime: formData.get('tuesday-end')
          },
          wednesday: {
            available: formData.get('wednesday-check') === 'on',
            startTime: formData.get('wednesday-start'),
            endTime: formData.get('wednesday-end')
          },
          thursday: {
            available: formData.get('thursday-check') === 'on',
            startTime: formData.get('thursday-start'),
            endTime: formData.get('thursday-end')
          },
          friday: {
            available: formData.get('friday-check') === 'on',
            startTime: formData.get('friday-start'),
            endTime: formData.get('friday-end')
          },
          saturday: {
            available: formData.get('saturday-check') === 'on',
            startTime: formData.get('saturday-start'),
            endTime: formData.get('saturday-end')
          },
          sunday: {
            available: formData.get('sunday-check') === 'on',
            startTime: formData.get('sunday-start'),
            endTime: formData.get('sunday-end')
          }
        },
        appointmentDuration: formData.get('appointmentDuration')
      };

      try {
        const response = await fetch('http://localhost:8080/doctors/availability', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(availabilityData)
        });

        if (response.ok) {
          alert('Availability updated successfully!');
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to update availability');
        }
      } catch (error) {
        console.error('Error updating availability:', error);
        alert('An error occurred while updating availability');
      }
    }

    async function changePassword() {
      const form = document.getElementById('change-password-form');

      if (formData.get('new-password') !== formData.get('confirm-password')) {
        alert('New passwords do not match');
        return;
      }

      const passwordData = {
        currentPassword: formData.get('current-password'),
        newPassword: formData.get('new-password')
      };

      try {
        const response = await fetch('http://localhost:8080/auth/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(passwordData)
        });

        if (response.ok) {
          alert('Password changed successfully!');
          const changePasswordModal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
          changePasswordModal.hide();
          form.reset();
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to change password');
        }
      } catch (error) {
        console.error('Error changing password:', error);
        alert('An error occurred while changing password');
      }
    }

    function logout() {
      localStorage.removeItem('token');
      window.location.href = '../index.html';
    }

    // UI Update Functions
    function updateUIForLoggedInUser(user) {
      document.getElementById('doctor-name').textContent = user.name;
    }

    function displayAppointments(appointments) {
      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      const todayEnd = new Date(now.setHours(23, 59, 59, 999));

      const todaysAppointments = appointments.filter(a => {
        const appointmentDate = new Date(a.date);
        return appointmentDate >= todayStart && appointmentDate <= todayEnd;
      });

      const upcomingAppointments = appointments.filter(a => new Date(a.date) > now);
      const pastAppointments = appointments.filter(a => new Date(a.date) <= now);

      // Update counts
      document.getElementById('todays-appointments-count').textContent = todaysAppointments.length;

      // Display today's appointments in dashboard
      const dashboardTable = document.getElementById('upcoming-appointments');
      dashboardTable.innerHTML = '';

      todaysAppointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${new Date(appointment.date).toLocaleTimeString()}</td>
          <td>${appointment.patient.name}</td>
          <td>${appointment.symptoms || 'Not specified'}</td>
          <td>${appointment.type || 'Regular'}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="startVideoCall('${appointment.id}')">Start</button>
            <button class="btn btn-sm btn-info" onclick="showPrescriptionModal('${appointment.id}', '${appointment.patient.name}')">Prescribe</button>
          </td>
        `;
        dashboardTable.appendChild(row);
      });

      // Display upcoming appointments in appointments section
      const upcomingTable = document.getElementById('upcoming-appointments-list');
      upcomingTable.innerHTML = '';

      upcomingAppointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${new Date(appointment.date).toLocaleString()}</td>
          <td>${appointment.patient.name}</td>
          <td>${appointment.symptoms || 'Not specified'}</td>
          <td>${appointment.type || 'Regular'}</td>
          <td><span class="badge bg-success">Confirmed</span></td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="startVideoCall('${appointment.id}')">Start</button>
            <button class="btn btn-sm btn-info" onclick="showPrescriptionModal('${appointment.id}', '${appointment.patient.name}')">Prescribe</button>
          </td>
        `;
        upcomingTable.appendChild(row);
      });

      // Display past appointments in appointments section
      const pastTable = document.getElementById('past-appointments-list');
      pastTable.innerHTML = '';

      pastAppointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${new Date(appointment.date).toLocaleString()}</td>
          <td>${appointment.patient.name}</td>
          <td>${appointment.symptoms || 'Not specified'}</td>
          <td>${appointment.type || 'Regular'}</td>
          <td><span class="badge bg-secondary">Completed</span></td>
          <td>
            <button class="btn btn-sm btn-info" onclick="showPrescriptionModal('${appointment.id}', '${appointment.patient.name}')">Prescribe</button>
          </td>
        `;
        pastTable.appendChild(row);
      });
    }

    function displayPatients(patients) {
      // Update count
      document.getElementById('patients-count').textContent = patients.length;

      // Display patients
      const patientsTable = document.getElementById('patients-list');
      patientsTable.innerHTML = '';

      patients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${patient.name}</td>
          <td>${patient.age || 'N/A'}</td>
          <td>${patient.gender || 'N/A'}</td>
          <td>${patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</td>
          <td>${patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString() : 'N/A'}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="viewPatientDetails('${patient.id}')">View</button>
            <button class="btn btn-sm btn-success" onclick="messagePatient('${patient.id}')">Message</button>
          </td>
        `;
        patientsTable.appendChild(row);
      });
    }

    function displayPrescriptions(prescriptions) {
      // Update count
      document.getElementById('prescriptions-count').textContent = prescriptions.length;

      // Display prescriptions
      const prescriptionsTable = document.getElementById('active-prescriptions');
      prescriptionsTable.innerHTML = '';

      prescriptions.forEach(prescription => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${new Date(prescription.createdAt).toLocaleDateString()}</td>
          <td>${prescription.patient.name}</td>
          <td>${prescription.medication}</td>
          <td>${prescription.dosage}</td>
          <td>${prescription.refills}</td>
          <td>
            <button class="btn btn-sm btn-info" onclick="viewPrescription('${prescription.id}')">View</button>
          </td>
        `;
        prescriptionsTable.appendChild(row);
      });
    }

    function displayProfile(profile) {
      document.getElementById('profile-name').textContent = profile.name;
      document.getElementById('profile-specialty').textContent = profile.specialty || 'Not specified';

      // Split name into first and last
      const nameParts = profile.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      // Fill profile form
      document.getElementById('profile-first-name').value = firstName;
      document.getElementById('profile-last-name').value = lastName;
      document.getElementById('profile-email').value = profile.email;
      document.getElementById('profile-phone').value = profile.phone || '';
      document.getElementById('profile-specialty').value = profile.specialty || '';
      document.getElementById('profile-years').value = profile.yearsOfExperience || '';
      document.getElementById('profile-bio').value = profile.bio || '';
      document.getElementById('profile-education').value = profile.education || '';

      // Fill availability form if available
      if (profile.availability) {
        document.getElementById('monday-check').checked = profile.availability.schedule.monday.available;
        document.getElementById('monday-start').value = profile.availability.schedule.monday.startTime;
        document.getElementById('monday-end').value = profile.availability.schedule.monday.endTime;

        document.getElementById('tuesday-check').checked = profile.availability.schedule.tuesday.available;
        document.getElementById('tuesday-start').value = profile.availability.schedule.tuesday.startTime;
        document.getElementById('tuesday-end').value = profile.availability.schedule.tuesday.endTime;

        document.getElementById('wednesday-check').checked = profile.availability.schedule.wednesday.available;
        document.getElementById('wednesday-start').value = profile.availability.schedule.wednesday.startTime;
        document.getElementById('wednesday-end').value = profile.availability.schedule.wednesday.endTime;

        document.getElementById('thursday-check').checked = profile.availability.schedule.thursday.available;
        document.getElementById('thursday-start').value = profile.availability.schedule.thursday.startTime;
        document.getElementById('thursday-end').value = profile.availability.schedule.thursday.endTime;

        document.getElementById('friday-check').checked = profile.availability.schedule.friday.available;
        document.getElementById('friday-start').value = profile.availability.schedule.friday.startTime;
        document.getElementById('friday-end').value = profile.availability.schedule.friday.endTime;

        document.getElementById('saturday-check').checked = profile.availability.schedule.saturday.available;
        document.getElementById('saturday-start').value = profile.availability.schedule.saturday.startTime;
        document.getElementById('saturday-start').disabled = !profile.availability.schedule.saturday.available;
        document.getElementById('saturday-end').value = profile.availability.schedule.saturday.endTime;
        document.getElementById('saturday-end').disabled = !profile.availability.schedule.saturday.available;

        document.getElementById('sunday-check').checked = profile.availability.schedule.sunday.available;
        document.getElementById('sunday-start').value = profile.availability.schedule.sunday.startTime;
        document.getElementById('sunday-start').disabled = !profile.availability.schedule.sunday.available;
        document.getElementById('sunday-end').value = profile.availability.schedule.sunday.endTime;
        document.getElementById('sunday-end').disabled = !profile.availability.schedule.sunday.available;

        // Set appointment duration
        document.querySelector(`input[name="appointmentDuration"][value="${profile.availability.appointmentDuration}"]`).checked = true;
      }
    }

    // Video Call Functions

    async function startVideoCall(appointmentId) {
      currentAppointmentId = appointmentId;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        // Fetch video call token and room ID from backend
        const response = await fetch('http://localhost:8080/api/videocalls/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ appointmentId })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}: Failed to create video call`);
        }

        const videoCallData = await response.json();

        // Initialize ZegoCloud
        zegoCloudEngine = await initZegoCloud(videoCallData.token, videoCallData.roomId);

        // Show video call modal
        const videoCallModal = new bootstrap.Modal(document.getElementById('videoCallModal'));
        videoCallModal.show();
      } catch (error) {
        console.error('Error starting video call:', error);
        alert(`Failed to start video call: ${error.message}`);
      }
    }



    async function initZegoCloud(token, roomId) {
      try {
        // Check if ZegoExpressEngine is defined
        if (!window.ZegoExpressEngine) {
          throw new Error('ZegoExpressEngine SDK is not loaded. Please ensure the SDK script is included.');
        }

        // Initialize ZegoExpressEngine
        const engine = new ZegoExpressEngine(appID, server);

        // Login to the room
        await engine.loginRoom(roomId, token, {
          userID: currentUser.id,
          userName: currentUser.name
        });

        // Create and publish local stream
        const localStream = await engine.createStream({
          camera: { video: true, audio: true }
        });
        const localVideoElement = document.getElementById('local-video');
        localVideoElement.srcObject = localStream;
        await engine.startPublishingStream(`stream-${currentUser.id}`, localStream);

        // Handle remote stream updates
        engine.on('roomStreamUpdate', async (roomID, updateType, streamList) => {
          if (updateType === 'ADD') {
            const remoteVideoElement = document.getElementById('remote-video');
            const remoteStream = await engine.startPlayingStream(streamList[0].streamID);
            remoteVideoElement.srcObject = remoteStream;
          }
        });

        return engine;
      } catch (error) {
        console.error('Error initializing ZegoCloud:', error);
        throw error; // Rethrow to handle in the calling function
      }
    }
    async function endVideoCall() {
      try {
        if (zegoCloudEngine) {
          // Stop publishing stream
          await zegoCloudEngine.stopPublishingStream(`stream-${currentUser.id}`);
          // Logout from room
          await zegoCloudEngine.logoutRoom();
          // Destroy engine
          zegoCloudEngine.destroy();
          zegoCloudEngine = null;
        }

        // Update call status in backend
        const response = await fetch(`http://localhost:8080/api/videocalls/${currentAppointmentId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ status: 'COMPLETED' })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to update call status');
        }
      } catch (error) {
        console.error('Error ending video call:', error);
        alert(`Failed to end video call: ${error.message}`);
      } finally {
        currentAppointmentId = null;

        // Hide modal
        const videoCallModal = bootstrap.Modal.getInstance(document.getElementById('videoCallModal'));
        videoCallModal.hide();
      }
    }

    // Prescription Functions
    function showPrescriptionModal(appointmentId, patientName) {
      const prescriptionModal = new bootstrap.Modal(document.getElementById('prescriptionModal'));

      // Set patient name and current date
      document.getElementById('prescription-patient-name').value = patientName;
      document.getElementById('prescription-date').valueAsDate = new Date();
      document.getElementById('prescription-appointment-id').value = appointmentId;

      prescriptionModal.show();
    }

    // Helper functions
    function viewPatientDetails(patientId) {
      // Implement patient details view
      alert(`Viewing details for patient ${patientId}`);
    }

    function messagePatient(patientId) {
      // Implement patient messaging
      alert(`Messaging patient ${patientId}`);
    }

    function viewPrescription(prescriptionId) {
      // Implement prescription view
      alert(`Viewing prescription ${prescriptionId}`);
    }
  </script>
</body>

</html> 
