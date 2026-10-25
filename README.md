# Medilab Web Application

Medilab is a responsive web application designed for medical and healthcare-related services. It features a modern dashboard, appointment forms, and informational pages for clinics, doctors, and patients.

## Features
- Patient and doctor dashboards
- Responsive design using Bootstrap
- Gallery, testimonials, and department sections
- Easy navigation and user-friendly interface

## Folder Structure
```
.
├── index.html
├── assets/
│   ├── css/       # Shared site styles
│   ├── img/       # Shared images
│   ├── js/
│   │   ├── ui/    # Navigation, scrolling, preloader, animation, and widget behavior
│   │   ├── auth.js
│   │   ├── appointments.js
│   │   ├── chatbot.js
│   │   ├── contact.js
│   │   ├── doctors.js
│   │   ├── payments.js
│   │   ├── stats.js
│   │   └── video-call.js
│   ├── scss/      # Stylesheet sources
│   └── vendor/    # Third-party libraries
├── doctor/
│   ├── assets/
│   │   ├── css/   # Doctor dashboard styles
│   │   └── js/    # Dashboard, auth, security, profile, availability, appointments, patients, prescriptions, calls
│   └── dashboard.html
├── patient/
│   ├── assets/
│   │   ├── css/   # Patient dashboard styles
│   │   └── js/    # Dashboard, auth, appointments, payments, profile, security, prescriptions, calls
│   └── dashboard.html
└── README.md
```

Application scripts are split by feature so authentication, data loading, forms,
payments, and calls can be maintained independently. Third-party libraries stay
under `assets/vendor/`.

## Getting Started
1. Clone or download the repository.
2. Serve the project root with a local web server and open `index.html`.
3. Dashboard API requests expect the application backend at `http://localhost:8080`.

## Dependencies
- Bootstrap
- FontAwesome
- Bootstrap Icons
- AOS (Animate On Scroll)
- GLightbox
- Swiper

## Customization
- Update images in `assets/img/` as needed.
- Modify styles in `assets/css/main.css`.
- Modify dashboard-specific styles and scripts in each role's `assets/` folder.
- Edit content in HTML files for your clinic or organization.

## Contact
For support or inquiries, please contact the project maintainer.
