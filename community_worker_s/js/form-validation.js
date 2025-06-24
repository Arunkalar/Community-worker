// Form validation functionality for contact forms
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.errors = {};
        this.isSubmitting = false;
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.setupEventListeners();
        this.setupRealTimeValidation();
    }
    
    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add input event listeners for real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    setupRealTimeValidation() {
        const emailInput = this.form.querySelector('input[type="email"]');
        const phoneInput = this.form.querySelector('input[type="tel"]');
        
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                this.debounce(() => this.validateEmail(emailInput), 500)();
            });
        }
        
        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                this.formatPhoneNumber(phoneInput);
            });
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        this.clearAllErrors();
        
        if (this.validateForm()) {
            await this.submitForm();
        }
    }
    
    validateForm() {
        const nameField = this.form.querySelector('#name');
        const emailField = this.form.querySelector('#email');
        const phoneField = this.form.querySelector('#phone');
        const subjectField = this.form.querySelector('#subject');
        const messageField = this.form.querySelector('#message');
        
        let isValid = true;
        
        // Validate name
        if (!this.validateName(nameField)) isValid = false;
        
        // Validate email
        if (!this.validateEmail(emailField)) isValid = false;
        
        // Validate phone (optional but must be valid if provided)
        if (phoneField && phoneField.value.trim() && !this.validatePhone(phoneField)) {
            isValid = false;
        }
        
        // Validate subject
        if (!this.validateSubject(subjectField)) isValid = false;
        
        // Validate message
        if (!this.validateMessage(messageField)) isValid = false;
        
        return isValid;
    }
    
    validateField(field) {
        switch (field.type) {
            case 'text':
                if (field.id === 'name') return this.validateName(field);
                break;
            case 'email':
                return this.validateEmail(field);
            case 'tel':
                return this.validatePhone(field);
            case 'select-one':
                return this.validateSubject(field);
            case 'textarea':
                return this.validateMessage(field);
        }
        return true;
    }
    
    validateName(field) {
        const value = field.value.trim();
        const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
        
        if (!value) {
            this.setFieldError(field, 'Name is required');
            return false;
        }
        
        if (value.length < 2) {
            this.setFieldError(field, 'Name must be at least 2 characters long');
            return false;
        }
        
        if (value.length > 50) {
            this.setFieldError(field, 'Name must be less than 50 characters');
            return false;
        }
        
        if (!nameRegex.test(value)) {
            this.setFieldError(field, 'Name can only contain letters, spaces, hyphens, and apostrophes');
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    validateEmail(field) {
        const value = field.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
        
        if (!value) {
            this.setFieldError(field, 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(value)) {
            this.setFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        if (value.length > 254) {
            this.setFieldError(field, 'Email address is too long');
            return false;
        }
        
        // Check for common typos in popular domains
        const domain = value.split('@')[1].toLowerCase();
        const suggestions = this.suggestEmailCorrection(domain);
        
        if (suggestions.length > 0) {
            this.setFieldWarning(field, `Did you mean: ${value.split('@')[0]}@${suggestions[0]}?`);
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    validatePhone(field) {
        const value = field.value.trim();
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = value.replace(/[\s\-\(\)\.]/g, '');
        
        if (!value) {
            // Phone is optional
            this.clearFieldError(field);
            return true;
        }
        
        if (cleanPhone.length < 10) {
            this.setFieldError(field, 'Phone number must be at least 10 digits');
            return false;
        }
        
        if (cleanPhone.length > 15) {
            this.setFieldError(field, 'Phone number is too long');
            return false;
        }
        
        if (!phoneRegex.test(cleanPhone)) {
            this.setFieldError(field, 'Please enter a valid phone number');
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    validateSubject(field) {
        const value = field.value.trim();
        
        if (!value) {
            this.setFieldError(field, 'Please select a subject');
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    validateMessage(field) {
        const value = field.value.trim();
        
        if (!value) {
            this.setFieldError(field, 'Message is required');
            return false;
        }
        
        if (value.length < 10) {
            this.setFieldError(field, 'Message must be at least 10 characters long');
            return false;
        }
        
        if (value.length > 1000) {
            this.setFieldError(field, 'Message must be less than 1000 characters');
            return false;
        }
        
        // Check for spam patterns
        if (this.containsSpamPatterns(value)) {
            this.setFieldError(field, 'Message contains invalid content');
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    containsSpamPatterns(text) {
        const spamPatterns = [
            /viagra/i,
            /casino/i,
            /lottery/i,
            /winner/i,
            /congratulations.*won/i,
            /click.*here.*now/i,
            /urgent.*action.*required/i
        ];
        
        return spamPatterns.some(pattern => pattern.test(text));
    }
    
    suggestEmailCorrection(domain) {
        const commonDomains = [
            'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
            'aol.com', 'icloud.com', 'live.com', 'msn.com'
        ];
        
        const suggestions = [];
        
        commonDomains.forEach(commonDomain => {
            if (this.levenshteinDistance(domain, commonDomain) <= 2 && domain !== commonDomain) {
                suggestions.push(commonDomain);
            }
        });
        
        return suggestions.slice(0, 1); // Return only the best suggestion
    }
    
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }
    
    formatPhoneNumber(field) {
        let value = field.value.replace(/\D/g, '');
        
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
        }
        
        field.value = value;
    }
    
    setFieldError(field, message) {
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', field.id + 'Error');
        
        this.errors[field.id] = message;
    }
    
    setFieldWarning(field, message) {
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            errorElement.style.color = '#ff9800'; // Orange for warnings
        }
        
        field.classList.add('warning');
    }
    
    clearFieldError(field) {
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            errorElement.style.color = ''; // Reset color
        }
        
        field.classList.remove('error', 'warning');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        
        delete this.errors[field.id];
    }
    
    clearAllErrors() {
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
        
        const fields = this.form.querySelectorAll('.error, .warning');
        fields.forEach(field => {
            field.classList.remove('error', 'warning');
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
        });
        
        this.errors = {};
    }
    
    async submitForm() {
        this.isSubmitting = true;
        const submitBtn = this.form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual API call)
            await this.simulateFormSubmission();
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            this.form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('Failed to send message. Please try again.');
        } finally {
            // Reset button state
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
            this.isSubmitting = false;
        }
    }
    
    async simulateFormSubmission() {
        // Simulate API call delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo purposes
                if (Math.random() > 0.1) { // 90% success rate
                    resolve();
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 2000);
        });
    }
    
    showSuccessMessage() {
        const formElement = this.form;
        const successElement = document.getElementById('formSuccess');
        
        if (successElement) {
            formElement.style.display = 'none';
            successElement.style.display = 'block';
            
            // Scroll to success message
            successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Hide success message after 10 seconds and show form again
            setTimeout(() => {
                successElement.style.display = 'none';
                formElement.style.display = 'block';
            }, 10000);
        }
    }
    
    showErrorMessage(message) {
        // Create or update error message element
        let errorElement = this.form.querySelector('.form-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            errorElement.style.cssText = `
                background: #fee;
                color: #c33;
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 20px;
                border: 1px solid #fcc;
            `;
            this.form.insertBefore(errorElement, this.form.firstChild);
        }
        
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Error:</strong> ${message}
        `;
        
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide error message after 5 seconds
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }, 5000);
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Global function for form submission (used in HTML)
function submitForm(event) {
    event.preventDefault();
    
    // Get the form validator instance
    const formValidator = window.contactFormValidator;
    if (formValidator) {
        formValidator.handleSubmit(event);
    }
}

// Character counter for textarea
function initializeCharacterCounter() {
    const messageField = document.getElementById('message');
    if (messageField) {
        const maxLength = 1000;
        const counterElement = document.createElement('div');
        counterElement.className = 'character-counter';
        counterElement.style.cssText = `
            text-align: right;
            font-size: 0.9rem;
            color: #666;
            margin-top: 5px;
        `;
        
        messageField.parentNode.appendChild(counterElement);
        
        function updateCounter() {
            const currentLength = messageField.value.length;
            const remaining = maxLength - currentLength;
            
            counterElement.textContent = `${currentLength}/${maxLength} characters`;
            
            if (remaining < 100) {
                counterElement.style.color = '#ff6b6b';
            } else if (remaining < 200) {
                counterElement.style.color = '#ff9800';
            } else {
                counterElement.style.color = '#666';
            }
        }
        
        messageField.addEventListener('input', updateCounter);
        updateCounter(); // Initial count
    }
}

// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form validator
    if (document.getElementById('contactForm')) {
        window.contactFormValidator = new FormValidator('contactForm');
        initializeCharacterCounter();
    }
    
    // Add CSS for error states
    addValidationStyles();
});

// Add validation CSS styles
function addValidationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #ff6b6b !important;
            box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1) !important;
        }
        
        .form-group input.warning,
        .form-group select.warning,
        .form-group textarea.warning {
            border-color: #ff9800 !important;
            box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.1) !important;
        }
        
        .error-message {
            display: none;
            color: #ff6b6b;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #667eea !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
        }
    `;
    
    document.head.appendChild(style);
}

// Export for global access
window.submitForm = submitForm;
