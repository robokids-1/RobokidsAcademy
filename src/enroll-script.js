// Enquiry Form Script

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

// Form submission handler
document.addEventListener('DOMContentLoaded', function () {
    const enquiryForm = document.getElementById('enquiryForm');
    const successMessage = document.getElementById('successMessage');

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate form
            if (validateForm()) {
                // Get form data
                const formData = getFormData();

                // Store form data for potential retry
                lastFormData = formData;

                // Send email
                sendEnquiryEmail(formData);
            }
        });
    }
});

// Form validation
function validateForm() {
    const enquiryForm = document.getElementById('enquiryForm');
    const requiredFields = enquiryForm.querySelectorAll('[required]');
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
    const emailField = document.getElementById('parentEmail');
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

    // Validate phone format (numbers only, at least 10 digits)
    const phoneField = document.getElementById('parentPhone');
    if (phoneField && phoneField.value) {
        const phoneDigits = phoneField.value.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            isValid = false;
            phoneField.style.borderColor = errorColor;
            alert('Please enter a valid phone number (numbers only, at least 10 digits)');
            setTimeout(() => {
                phoneField.style.borderColor = '';
            }, 2000);
        }
    }

    // Validate age range
    const ageField = document.getElementById('studentAge');
    if (ageField && ageField.value) {
        const age = parseInt(ageField.value);
        if (age < 7 || age > 16) {
            isValid = false;
            ageField.style.borderColor = errorColor;
            alert('Student age must be between 7 and 16 years');
            setTimeout(() => {
                ageField.style.borderColor = '';
            }, 2000);
        }
    }

    // Check terms acceptance
    const termsCheckbox = document.getElementById('termsAccepted');
    if (termsCheckbox && !termsCheckbox.checked) {
        isValid = false;
        alert('Please accept the Terms and Conditions to continue');
        termsCheckbox.focus();
    }

    return isValid;
}

// Get form data as object
function getFormData() {
    const form = document.getElementById('enquiryForm');
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

    return data;
}

// Send enquiry email using EmailJS
function sendEnquiryEmail(formData) {
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS is not loaded. Make sure the EmailJS script is included in the HTML.');

        // Show error message on page
        const enquiryForm = document.getElementById('enquiryForm');
        const errorMessage = document.getElementById('errorMessage');

        if (enquiryForm && errorMessage) {
            enquiryForm.style.display = 'none';
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
        const enquiryForm = document.getElementById('enquiryForm');
        const errorMessage = document.getElementById('errorMessage');

        if (enquiryForm && errorMessage) {
            enquiryForm.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }

    // Format the email message
    const emailBody = formatEmailBody(formData);

    // EmailJS template parameters
    const templateParams = {
        to_email: 'robokids209@gmail.com',
        from_name: `${formData.parentFirstName} ${formData.parentLastName}`,
        subject: `New Enquiry: ${formData.studentFirstName} ${formData.studentLastName}`,
        message: emailBody,
        reply_to: formData.parentEmail
    };

    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Send email using EmailJS
    // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual values from EmailJS dashboard
    emailjs.send(serviceId, templateId, templateParams)
        .then(function (response) {
            console.log('Email sent successfully!', response.status, response.text);

            // Show success message
            const enquiryForm = document.getElementById('enquiryForm');
            const successMessage = document.getElementById('successMessage');

            enquiryForm.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth' });
        })
        .catch(function (error) {
            console.error('Failed to send email:', error);

            // Show error message on page
            const enquiryForm = document.getElementById('enquiryForm');
            const errorMessage = document.getElementById('errorMessage');

            enquiryForm.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.scrollIntoView({ behavior: 'smooth' });

            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
}

// Format form data into readable email body
function formatEmailBody(data) {
    let body = `NEW ENQUIRY REQUEST\n\n`;
    body += `========================================\n\n`;

    // Student Information
    body += `STUDENT INFORMATION\n`;
    body += `-------------------\n`;
    body += `Name: ${data.studentFirstName} ${data.studentLastName}\n`;
    body += `Age: ${data.studentAge}\n`;
    if (data.studentGrade) body += `Grade: ${data.studentGrade}\n`;
    body += `Selected Class: ${data.classSelection}\n\n`;

    // Parent/Guardian Information
    body += `PARENT/GUARDIAN INFORMATION\n`;
    body += `--------------------------\n`;
    body += `Name: ${data.parentFirstName} ${data.parentLastName}\n`;
    body += `Email: ${data.parentEmail}\n`;
    body += `Phone: ${data.parentPhone}\n`;
    if (data.parentAddress) body += `Address: ${data.parentAddress}\n`;
    body += `\n`;

    // Medical Information
    if (data.allergies || data.medications) {
        body += `MEDICAL INFORMATION\n`;
        body += `-------------------\n`;
        if (data.allergies) body += `Allergies/Medical Conditions: ${data.allergies}\n`;
        if (data.medications) body += `Medications: ${data.medications}\n`;
        body += `\n`;
    }

    // Additional Information
    body += `ADDITIONAL INFORMATION\n`;
    body += `----------------------\n`;
    if (data.experience) body += `Previous Experience: ${data.experience}\n`;
    if (data.interests) {
        const interests = Array.isArray(data.interests) ? data.interests.join(', ') : data.interests;
        body += `Interests: ${interests}\n`;
    }
    if (data.goals) body += `Goals: ${data.goals}\n`;
    body += `\n`;

    // Permissions
    body += `PERMISSIONS\n`;
    body += `-----------\n`;
    body += `Photo Permission: ${data.photoPermission ? 'Yes' : 'No'}\n`;
    body += `Newsletter Subscription: ${data.newsletter ? 'Yes' : 'No'}\n`;
    body += `Terms Accepted: Yes\n`;
    body += `\n`;

    body += `========================================\n`;
    body += `Submitted: ${new Date().toLocaleString()}\n`;

    return body;
}

// Reset form
function resetForm() {
    const form = document.getElementById('enquiryForm');
    if (form) {
        if (confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
            form.reset();
            // Reset any custom styling
            const fields = form.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                field.style.borderColor = '';
            });
            // Clear stored form data
            lastFormData = null;
        }
    }
}

// Retry submission after error
function retrySubmission() {
    const errorMessage = document.getElementById('errorMessage');
    const enquiryForm = document.getElementById('enquiryForm');

    // Hide error message
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }

    // Show form again
    if (enquiryForm) {
        enquiryForm.style.display = 'block';
        enquiryForm.scrollIntoView({ behavior: 'smooth' });

        // If we have stored form data, user can resubmit
        // The form fields should still contain the data since we didn't reset them
        if (lastFormData) {
            // Focus on submit button to make it easy to retry
            const submitButton = enquiryForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.focus();
            }
        }
    }
}

// Show terms and conditions (placeholder)
function showTerms() {
    alert('Terms and Conditions:\n\n' +
        '1. Enquiry is subject to availability\n' +
        '2. Payment is due before the start of classes\n' +
        '3. Refund policy: 100% refund if cancelled 7 days before class starts\n' +
        '4. Students must follow safety guidelines\n' +
        '5. Parents/guardians are responsible for student behavior\n\n' +
        'For full terms, please contact us at hello@robokids.com');
    return false;
}

// Show privacy policy (placeholder)
function showPrivacy() {
    alert('Privacy Policy:\n\n' +
        '1. We collect information necessary for enrollment and communication\n' +
        '2. Student information is kept confidential\n' +
        '3. We do not share personal information with third parties\n' +
        '4. Photos may be used for promotional purposes with permission\n' +
        '5. You can request data deletion at any time\n\n' +
        'For full privacy policy, please contact us at hello@robokids.com');
    return false;
}

// Add form field animations and phone number restrictions
document.addEventListener('DOMContentLoaded', function () {
    const formFields = document.querySelectorAll('input, select, textarea');

    // Restrict phone number fields to numbers only
    const phoneFields = document.querySelectorAll('#parentPhone');
    phoneFields.forEach(field => {
        // Prevent non-numeric input
        field.addEventListener('input', function (e) {
            // Remove any non-numeric characters
            this.value = this.value.replace(/\D/g, '');
        });

        // Prevent paste of non-numeric content
        field.addEventListener('paste', function (e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const numbersOnly = paste.replace(/\D/g, '');
            this.value = numbersOnly;
        });

        // Prevent non-numeric keypress
        field.addEventListener('keypress', function (e) {
            const char = String.fromCharCode(e.which);
            if (!/[0-9]/.test(char)) {
                e.preventDefault();
            }
        });
    });

    formFields.forEach(field => {
        // Add focus effect
        field.addEventListener('focus', function () {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s';
        });

        field.addEventListener('blur', function () {
            this.parentElement.style.transform = 'scale(1)';
        });

        // Add validation feedback
        const rootStyles = getComputedStyle(document.documentElement);
        const successColor = rootStyles.getPropertyValue('--success').trim();

        field.addEventListener('input', function () {
            if (this.hasAttribute('required') && this.value.trim()) {
                this.style.borderColor = successColor;
            } else if (this.hasAttribute('required')) {
                this.style.borderColor = '';
            }
        });
    });
});

