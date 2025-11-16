// Enrollment Form Script

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const enrollmentForm = document.getElementById('enrollmentForm');
    const successMessage = document.getElementById('successMessage');

    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm()) {
                // Show success message
                enrollmentForm.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth' });
                
                // In a real application, you would send the form data to a server here
                console.log('Form submitted with data:', getFormData());
            }
        });
    }
});

// Form validation
function validateForm() {
    const requiredFields = enrollmentForm.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#ff4444';
            
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
            emailField.style.borderColor = '#ff4444';
            alert('Please enter a valid email address');
            setTimeout(() => {
                emailField.style.borderColor = '';
            }, 2000);
        }
    }

    // Validate phone format
    const phoneField = document.getElementById('parentPhone');
    if (phoneField && phoneField.value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(phoneField.value) || phoneField.value.replace(/\D/g, '').length < 10) {
            isValid = false;
            phoneField.style.borderColor = '#ff4444';
            alert('Please enter a valid phone number');
            setTimeout(() => {
                phoneField.style.borderColor = '';
            }, 2000);
        }
    }

    // Validate age range
    const ageField = document.getElementById('studentAge');
    if (ageField && ageField.value) {
        const age = parseInt(ageField.value);
        if (age < 6 || age > 16) {
            isValid = false;
            ageField.style.borderColor = '#ff4444';
            alert('Student age must be between 6 and 16 years');
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
    const form = document.getElementById('enrollmentForm');
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

// Reset form
function resetForm() {
    const form = document.getElementById('enrollmentForm');
    if (form) {
        if (confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
            form.reset();
            // Reset any custom styling
            const fields = form.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                field.style.borderColor = '';
            });
        }
    }
}

// Show terms and conditions (placeholder)
function showTerms() {
    alert('Terms and Conditions:\n\n' +
          '1. Enrollment is subject to availability\n' +
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

// Add form field animations
document.addEventListener('DOMContentLoaded', function() {
    const formFields = document.querySelectorAll('input, select, textarea');
    
    formFields.forEach(field => {
        // Add focus effect
        field.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s';
        });
        
        field.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
        
        // Add validation feedback
        field.addEventListener('input', function() {
            if (this.hasAttribute('required') && this.value.trim()) {
                this.style.borderColor = '#4CAF50';
            } else if (this.hasAttribute('required')) {
                this.style.borderColor = '';
            }
        });
    });
});

