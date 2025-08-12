// --- Data Simulation ---
const students = [
    {
        id: 1,
        username: 'okorie_ifeanyi',
        matricNumber: '23cm109',
        name: 'Okorie Ifeanyi',
        courses: [
            { name: 'system performance evaluation', grade: 'A', attendance: '95%', units: 3 },
            { name: 'Calculus', grade: 'B+', attendance: '88%', units: 4 },
            { name: 'History of Art', grade: 'A-', attendance: '92%', units: 2 },
            { name: 'Computer Science Fundamentals', grade: 'A', attendance: '98%', units: 3 },
            { name: 'Digital Logic Design', grade: 'B', attendance: '85%', units: 3 },
            { name: 'Technical Drawing', grade: 'C+', attendance: '75%', units: 2 },
            { name: 'English Composition', grade: 'B-', attendance: '91%', units: 3 },
            { name: 'Introduction to Psychology', grade: 'A', attendance: '97%', units: 3 },
            { name: 'Introduction to Economics', grade: 'B', attendance: '89%', units: 3 },
            { name: 'Physical Education', grade: 'A', attendance: '100%', units: 1 },
            { name: 'Biology I', grade: 'A-', attendance: '94%', units: 3 },
            { name: 'Introduction to Philosophy', grade: 'B+', attendance: '87%', units: 2 },
            { name: 'Data Structures and Algorithms', grade: 'B-', attendance: '82%', units: 4 }
        ],
        announcements: [
            'Final exams start on December 15th. Check your schedule.',
            'New library hours: now open until 10 PM.',
            'Enrollment for the Spring semester is now open.'
        ]
    },
    {
        id: 2,
        username: 'aminu_favour',
        matricNumber: '23cm110',
        name: 'Aminu Favour',
        courses: [
            { name: 'System quality and assurance', grade: 'B', attendance: '85%', units: 3 },
            { name: 'Web Development', grade: 'A+', attendance: '99%', units: 4 },
            { name: 'Data Structures', grade: 'A', attendance: '95%', units: 3 },
            { name: 'Database Management Systems', grade: 'A', attendance: '96%', units: 3 },
            { name: 'Operating Systems', grade: 'B+', attendance: '90%', units: 3 },
            { name: 'Elementary mathematics 2', grade: 'A', attendance: '98%', units: 2 },
            { name: 'Statistics for Engineers', grade: 'C', attendance: '70%', units: 3 },
            { name: 'Thermodynamics', grade: 'B-', attendance: '83%', units: 4 },
            { name: 'Principles of Marketing', grade: 'A-', attendance: '94%', units: 3 },
            { name: 'Linear Algebra', grade: 'B', attendance: '88%', units: 3 },
            { name: 'Creative Writing', grade: 'A+', attendance: '100%', units: 2 },
            { name: 'Software Engineering', grade: 'A', attendance: '97%', units: 4 },
            { name: 'Artificial Intelligence', grade: 'B-', attendance: '86%', units: 3 }
        ],
        announcements: [
            'Guest lecture on AI ethics this Friday at 2 PM.',
            'Reminder: All tuition fees are due by November 30th.'
        ]
    }
];

// Admin data
const admins = [
    { username: 'admin1', password: 'adminpassword', name: 'Admin One' },
    { username: 'admin2', password: 'anotheradmin', name: 'Admin Two' }
];

// --- CGPA Calculation Function ---
function calculateCGPA(courses) {
    const gradePoints = {
        'A+': 5.0, 'A': 5.0, 'A-': 4.5,
        'B+': 4.0, 'B': 3.5, 'B-': 3.0,
        'C+': 2.5, 'C': 2.0, 'C-': 1.5,
        'D+': 1.0, 'D': 0.5,
        'F': 0.0
    };

    let totalGradePoints = 0;
    let totalUnits = 0;

    courses.forEach(course => {
        const gradeValue = gradePoints[course.grade.toUpperCase()];
        if (gradeValue !== undefined) {
            totalGradePoints += gradeValue * course.units;
            totalUnits += course.units;
        }
    });

    if (totalUnits === 0) {
        return 'N/A';
    }

    return (totalGradePoints / totalUnits).toFixed(2);
}

// --- Shared Functions ---
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function getLoggedInRole() {
    return localStorage.getItem('userRole');
}

function redirectToLogin() {
    if (!getLoggedInUser()) {
        window.location.href = 'index.html';
        return true;
    }
    return false;
}

function handleLogout() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userRole');
            window.location.href = 'index.html';
        });
    }
}

function setSidebarState() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const links = document.querySelectorAll('.sidebar-nav a');
    links.forEach(link => {
        if (link.getAttribute('data-page') === currentPage) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });
}

// --- Logic based on current page ---
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('loginForm')) {
        // Login page specific logic
        const passwordInput = document.getElementById('password');
        const togglePassword = document.querySelector('.toggle-password');
        const roleRadios = document.querySelectorAll('input[name="role"]');
        const passwordLabel = document.querySelector('label[for="password"]');

        // Update placeholder and label based on selected role
        roleRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (document.getElementById('roleStudent').checked) {
                    passwordInput.placeholder = 'e.g., 23cm109';
                    passwordLabel.textContent = 'Matric No.:';
                } else {
                    passwordInput.placeholder = 'Enter admin password';
                    passwordLabel.textContent = 'Password:';
                }
            });
        });

        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });

        document.getElementById('loginForm').addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const selectedRole = document.querySelector('input[name="role"]:checked').value;
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = '';

            let user = null;
            let redirectPage = '';

            if (selectedRole === 'student') {
                user = students.find(s => s.username === username && s.matricNumber === password);
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('userRole', 'student');
                    redirectPage = 'dashboard.html';
                }
            } else if (selectedRole === 'admin') {
                user = admins.find(a => a.username === username && a.password === password);
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('userRole', 'admin');
                    redirectPage = 'admin-dashboard.html';
                }
            }

            if (user && redirectPage) {
                window.location.href = redirectPage;
            } else {
                errorMessage.textContent = `Invalid ${selectedRole} username or password.`;
            }
        });
    } else {
        if (redirectToLogin()) return;

        const currentUser = getLoggedInUser();
        const userRole = getLoggedInRole();

        if (userRole === 'admin' && !window.location.pathname.includes('admin-dashboard.html')) {
            window.location.href = 'admin-dashboard.html';
            return;
        } else if (userRole === 'student' && window.location.pathname.includes('admin-dashboard.html')) {
            window.location.href = 'dashboard.html';
            return;
        }

        if (document.getElementById('profileName')) {
            document.getElementById('profileName').textContent = currentUser.name;
        }
        handleLogout();
        setSidebarState();

        if (userRole === 'student') {
            if (document.querySelector('main h1').textContent.includes('Dashboard')) {
                document.getElementById('welcomeMessage').textContent = `Welcome back, ${currentUser.name}!`;
                const cgpa = calculateCGPA(currentUser.courses);
                const cgpaWidget = document.createElement('div');
                cgpaWidget.classList.add('widget', 'cgpa-widget');
                cgpaWidget.innerHTML = `<h4>Your CGPA</h4><p class="cgpa-value">${cgpa}</p>`;
                document.querySelector('.dashboard-widgets').prepend(cgpaWidget);
            }

            if (document.querySelector('main h1').textContent.includes('My Courses')) {
                const coursesTableBody = document.querySelector('#coursesTable tbody');
                currentUser.courses.forEach(course => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${course.name}</td>
                        <td>${course.attendance}</td>
                    `;
                    coursesTableBody.appendChild(row);
                });
            }

            if (document.querySelector('main h1').textContent.includes('My Grades')) {
                const gradesTableBody = document.querySelector('#gradesTable tbody');
                currentUser.courses.forEach(course => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${course.name}</td>
                        <td>${course.grade}</td>
                        <td>${course.attendance}</td>
                        <td>${course.units}</td>
                    `;
                    gradesTableBody.appendChild(row);
                });
                const cgpa = calculateCGPA(currentUser.courses);
                const cgpaDisplayDiv = document.createElement('div');
                cgpaDisplayDiv.innerHTML = `<h4 style="text-align: right; margin-top: 20px;">Overall CGPA: <span style="color: #007bff;">${cgpa}</span></h4>`;
                document.querySelector('.grades-widget').appendChild(cgpaDisplayDiv);
            }

            if (document.querySelector('main h1').textContent.includes('Announcements')) {
                const announcementsList = document.getElementById('announcementsList');
                const currentAnnouncements = currentUser.announcements || [];
                currentAnnouncements.forEach(announcementText => {
                    const li = document.createElement('li');
                    li.textContent = announcementText;
                    announcementsList.appendChild(li);
                });
                if (currentAnnouncements.length === 0) {
                    const li = document.createElement('li');
                    li.textContent = 'No new announcements.';
                    announcementsList.appendChild(li);
                }
            }
        }
        else if (userRole === 'admin') {
            if (document.querySelector('main h1').textContent.includes('Admin Dashboard')) {
                document.getElementById('adminWelcomeMessage').textContent = `Welcome, ${currentUser.name}! (Admin)`;

                const studentListForAdmin = document.getElementById('studentListForAdmin');
                if (studentListForAdmin) {
                    students.forEach(student => {
                        const li = document.createElement('li');
                        li.innerHTML = `<strong>${student.name}</strong> (Username: ${student.username}, Matric No: ${student.matricNumber}) <button data-student-id="${student.id}" class="edit-student-btn">Edit Results</button>`;
                        studentListForAdmin.appendChild(li);
                    });
                }
            }
        }
    }
});