// Testimonial Form Script

// ============================================
// EMAILJS CONFIGURATION REQUIRED
// ============================================
// To enable email functionality, you need to:
// 1. Sign up at https://www.emailjs.com/
// 2. Create an email service (Gmail recommended)
// 3. Create an email template
// 4. Get your Public Key, Service ID, and Template ID
// 5. Replace the placeholders below with your actual values
// 6. See EMAILJS_SETUP.md for detailed instructions
// ============================================

// Initialize EmailJS
// Replace "YOUR_PUBLIC_KEY" with your EmailJS Public Key from your account dashboard
(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init("i6FvkeDDJ-zKrgfym"); // Replace with your EmailJS Public Key
    }
})();

// Store form data for retry
let lastFormData = null;

// Toggle student fields based on relationship
function toggleStudentFields() {
    const relationship = document.getElementById('relationship').value;
    const studentInfoGroup = document.getElementById('studentInfoGroup');
    const studentName = document.getElementById('studentName');
    const studentAge = document.getElementById('studentAge');

    if (relationship === 'parent') {
        studentInfoGroup.style.display = 'block';
        studentName.setAttribute('required', 'required');
        studentAge.setAttribute('required', 'required');
    } else {
        studentInfoGroup.style.display = 'none';
        studentName.removeAttribute('required');
        studentAge.removeAttribute('required');
        studentName.value = '';
        studentAge.value = '';
    }
}

// Initialize star rating system
function initStarRating() {
    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    const ratingLabels = document.querySelectorAll('.rating-label');

    ratingInputs.forEach((input, index) => {
        input.addEventListener('change', function () {
            const selectedValue = parseInt(this.value);
            updateStarDisplay(selectedValue, ratingLabels);
        });

        // Also handle click on labels
        const label = ratingLabels[index];
        if (label) {
            label.addEventListener('click', function () {
                const value = parseInt(input.value);
                updateStarDisplay(value, ratingLabels);
            });
        }
    });

    // Handle hover effects
    ratingLabels.forEach((label, index) => {
        label.addEventListener('mouseenter', function () {
            const hoverValue = index + 1;
            updateStarDisplay(hoverValue, ratingLabels, true);
        });
    });

    // Reset on mouse leave if nothing is selected
    const ratingGroup = document.querySelector('.rating-group');
    if (ratingGroup) {
        ratingGroup.addEventListener('mouseleave', function () {
            const checkedInput = document.querySelector('input[name="rating"]:checked');
            if (checkedInput) {
                const selectedValue = parseInt(checkedInput.value);
                updateStarDisplay(selectedValue, ratingLabels);
            } else {
                // Reset all stars
                ratingLabels.forEach(label => {
                    label.style.filter = 'grayscale(100%)';
                    label.style.opacity = '0.4';
                    label.style.transform = 'scale(1)';
                });
            }
        });
    }
}

// Update star display based on selected rating
function updateStarDisplay(value, labels, isHover = false) {
    labels.forEach((label, index) => {
        const starValue = index + 1;
        if (starValue <= value) {
            label.style.filter = 'grayscale(0%)';
            label.style.opacity = '1';
            if (starValue === value && !isHover) {
                label.style.transform = 'scale(1.2)';
                label.style.filter = 'drop-shadow(0 2px 6px rgba(255, 193, 7, 0.5)) grayscale(0%)';
            } else {
                label.style.transform = 'scale(1)';
            }
        } else {
            label.style.filter = 'grayscale(100%)';
            label.style.opacity = '0.4';
            label.style.transform = 'scale(1)';
        }
    });
}

// Form submission handler
document.addEventListener('DOMContentLoaded', function () {
    const testimonialForm = document.getElementById('testimonialForm');
    const successMessage = document.getElementById('successMessage');

    // Initialize star rating
    initStarRating();

    if (testimonialForm) {
        testimonialForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate form
            if (validateForm()) {
                // Get form data
                const formData = getFormData();

                // Store form data for potential retry
                lastFormData = formData;

                // Send email
                sendTestimonialEmail(formData);
            }
        });
    }
});

// Form validation
function validateForm() {
    const testimonialForm = document.getElementById('testimonialForm');
    const requiredFields = testimonialForm.querySelectorAll('[required]');
    let isValid = true;

    // Get CSS variable values for consistent theming
    const rootStyles = getComputedStyle(document.documentElement);
    const errorColor = rootStyles.getPropertyValue('--error').trim();
    const successColor = rootStyles.getPropertyValue('--success').trim();

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = errorColor;

            // Reset border color after 2 seconds
            setTimeout(() => {
                field.style.borderColor = '';
            }, 2000);
        } else {
            field.style.borderColor = '';
        }
    });

    // Validate email format
    const emailField = document.getElementById('email');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            isValid = false;
            emailField.style.borderColor = errorColor;
            alert('Please enter a valid email address');
            setTimeout(() => {
                emailField.style.borderColor = '';
            }, 2000);
        }
    }

    // Validate testimonial text length (minimum 50 characters)
    const testimonialText = document.getElementById('testimonialText');
    if (testimonialText && testimonialText.value) {
        if (testimonialText.value.trim().length < 50) {
            isValid = false;
            testimonialText.style.borderColor = errorColor;
            alert('Please write at least 50 characters for your testimonial');
            setTimeout(() => {
                testimonialText.style.borderColor = '';
            }, 2000);
        }
    }

    // Validate rating is selected
    const rating = document.querySelector('input[name="rating"]:checked');
    if (!rating) {
        isValid = false;
        alert('Please select a rating');
    }

    // Validate student fields if relationship is parent
    const relationship = document.getElementById('relationship').value;
    if (relationship === 'parent') {
        const studentName = document.getElementById('studentName');
        const studentAge = document.getElementById('studentAge');

        if (!studentName.value.trim()) {
            isValid = false;
            studentName.style.borderColor = errorColor;
            setTimeout(() => {
                studentName.style.borderColor = '';
            }, 2000);
        }

        if (!studentAge.value || parseInt(studentAge.value) < 6 || parseInt(studentAge.value) > 16) {
            isValid = false;
            studentAge.style.borderColor = errorColor;
            alert('Please enter a valid student age (6-16 years)');
            setTimeout(() => {
                studentAge.style.borderColor = '';
            }, 2000);
        }
    }

    return isValid;
}

// Get form data as object
function getFormData() {
    const form = document.getElementById('testimonialForm');
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            // Handle multiple checkboxes with same name
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }

    // Get rating value
    const rating = document.querySelector('input[name="rating"]:checked');
    if (rating) {
        data.rating = rating.value;
    }

    return data;
}

// Send testimonial email using EmailJS
function sendTestimonialEmail(formData) {
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS is not loaded. Make sure the EmailJS script is included in the HTML.');

        // Show error message on page
        const testimonialForm = document.getElementById('testimonialForm');
        const errorMessage = document.getElementById('errorMessage');

        if (testimonialForm && errorMessage) {
            testimonialForm.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }

    // EmailJS Configuration
    // These are configured with actual values from EmailJS dashboard
    const serviceId = 'service_rdnw9gw';
    const templateId = 'template_dmqrhlj';

    // Validate that EmailJS is properly configured
    if (!serviceId || !templateId || serviceId === 'YOUR_SERVICE_ID' || templateId === 'YOUR_TEMPLATE_ID') {
        console.warn('EmailJS is not configured. Please set up EmailJS following EMAILJS_SETUP.md');
        console.log('Form data (email not sent - EmailJS not configured):', formData);

        // Show error message to user
        const testimonialForm = document.getElementById('testimonialForm');
        const errorMessage = document.getElementById('errorMessage');

        if (testimonialForm && errorMessage) {
            testimonialForm.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }

    // Format the email message
    const emailBody = formatEmailBody(formData);

    // Get relationship info for from_name
    const relationship = formData.relationship === 'parent' ? 'Parent' : 'Student';
    const fromName = `${formData.yourFirstName} ${formData.yourLastName}`;

    // EmailJS template parameters
    const templateParams = {
        to_email: 'robokids209@gmail.com',
        from_name: `${fromName} (${relationship})`,
        subject: `New Testimonial Submission - ${fromName}`,
        message: emailBody,
        reply_to: formData.email
    };

    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');

    // Send email using EmailJS
    emailjs.send(serviceId, templateId, templateParams)
        .then(function (response) {
            console.log('Email sent successfully!', response.status, response.text);

            // Show success message
            const testimonialForm = document.getElementById('testimonialForm');
            const successMessage = document.getElementById('successMessage');

            testimonialForm.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth' });
        })
        .catch(function (error) {
            console.error('Failed to send email:', error);

            // Show error message on page
            const testimonialForm = document.getElementById('testimonialForm');
            const errorMessage = document.getElementById('errorMessage');

            testimonialForm.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.scrollIntoView({ behavior: 'smooth' });

            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        });
}

// Format form data into readable email body
function formatEmailBody(data) {
    let body = `NEW TESTIMONIAL SUBMISSION\n\n`;
    body += `========================================\n\n`;

    // Submitter Information
    body += `SUBMITTER INFORMATION\n`;
    body += `-------------------\n`;
    body += `Relationship: ${data.relationship === 'parent' ? 'Parent/Guardian' : 'Student'}\n`;
    body += `Name: ${data.yourFirstName} ${data.yourLastName}\n`;
    body += `Email: ${data.email}\n\n`;

    // Student Information (if parent)
    if (data.relationship === 'parent' && data.studentName) {
        body += `STUDENT INFORMATION\n`;
        body += `-------------------\n`;
        body += `Student Name: ${data.studentName}\n`;
        if (data.studentAge) body += `Student Age: ${data.studentAge}\n`;
        body += `\n`;
    }

    // Program Information
    body += `PROGRAM INFORMATION\n`;
    body += `-------------------\n`;
    const programNames = {
        'beginner': '🧩 X-Bots Beginners (Ages 6-8)',
        'engineer': '⚙️ X-Creators (Ages 8-10)',
        'inventor': '🚀 X-Innovators (Ages 10-13)',
        'engineers': '🔧 X-Engineers (Ages 13-16)',
        'multiple': 'Multiple Programs'
    };
    body += `Program Attended: ${programNames[data.programAttended] || data.programAttended}\n`;
    body += `Rating: ${'⭐'.repeat(parseInt(data.rating))} (${data.rating}/5)\n\n`;

    // Testimonial Content
    body += `TESTIMONIAL\n`;
    body += `-----------\n`;
    body += `${data.testimonialText}\n\n`;

    // Additional Options
    body += `ADDITIONAL OPTIONS\n`;
    body += `------------------\n`;
    body += `Photo Permission: ${data.photoPermission ? 'Yes' : 'No'}\n`;
    body += `Display Full Name: ${data.displayName ? 'Yes' : 'No'}\n\n`;

    body += `========================================\n`;
    body += `Submitted: ${new Date().toLocaleString()}\n`;

    return body;
}

// Reset form
function resetForm() {
    const form = document.getElementById('testimonialForm');
    if (form) {
        form.reset();
        // Reset student fields visibility
        const studentInfoGroup = document.getElementById('studentInfoGroup');
        if (studentInfoGroup) {
            studentInfoGroup.style.display = 'none';
        }
        // Clear any validation styles
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
    }
}

// Retry submission
function retrySubmission() {
    const errorMessage = document.getElementById('errorMessage');
    const testimonialForm = document.getElementById('testimonialForm');

    if (errorMessage) {
        errorMessage.style.display = 'none';
    }

    if (testimonialForm) {
        testimonialForm.style.display = 'block';
        testimonialForm.scrollIntoView({ behavior: 'smooth' });

        // If we have stored form data, repopulate the form
        if (lastFormData) {
            // Repopulate form fields
            Object.keys(lastFormData).forEach(key => {
                const field = document.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox' || field.type === 'radio') {
                        if (field.value === lastFormData[key] || (Array.isArray(lastFormData[key]) && lastFormData[key].includes(field.value))) {
                            field.checked = true;
                        }
                    } else {
                        field.value = lastFormData[key];
                    }
                }
            });

            // Re-trigger student fields toggle if needed
            if (lastFormData.relationship === 'parent') {
                toggleStudentFields();
            }
        }
    }
}

