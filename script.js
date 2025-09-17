// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    initNavigation();
    
    // Form handling
    initFormHandling();
    
    // Interactive buttons
    initInteractiveFeatures();
    
    // Welcome animation
    showWelcomeMessage();
});

// Navigation between sections
function initNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Get target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Add active class to target section
                targetSection.classList.add('active');
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Update active nav link
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

// Form handling with validation
function initFormHandling() {
    const form = document.getElementById('userForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Validate form
            if (validateForm(name, email, message)) {
                // Show loading state
                showLoadingState();
                
                // Simulate form submission (replace with actual PHP submission)
                setTimeout(() => {
                    showSuccessMessage(name);
                    form.reset();
                }, 1500);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

// Form validation
function validateForm(name, email, message) {
    let isValid = true;
    
    // Name validation
    if (!name || name.trim().length < 2) {
        showFieldError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Message validation
    if (!message || message.trim().length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

// Individual field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    switch(fieldName) {
        case 'name':
            if (value.length < 2) {
                showFieldError(fieldName, 'Name must be at least 2 characters long');
                return false;
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(fieldName, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'message':
            if (value.length < 10) {
                showFieldError(fieldName, 'Message must be at least 10 characters long');
                return false;
            }
            break;
    }
    
    clearFieldError(field);
    return true;
}

// Show field error
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.parentElement;
    
    // Remove existing error
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#e53e3e';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    formGroup.appendChild(errorDiv);
    field.style.borderColor = '#e53e3e';
}

// Clear field error
function clearFieldError(field) {
    const formGroup = field.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    
    if (errorMessage) {
        errorMessage.remove();
    }
    
    field.style.borderColor = '#e2e8f0';
}

// Interactive features
function initInteractiveFeatures() {
    // Color change button
    const colorBtn = document.getElementById('colorBtn');
    if (colorBtn) {
        colorBtn.addEventListener('click', changeBackgroundColor);
    }
    
    // Time display button
    const timeBtn = document.getElementById('timeBtn');
    if (timeBtn) {
        timeBtn.addEventListener('click', displayCurrentTime);
    }
}

// Change background color
function changeBackgroundColor() {
    const body = document.body;
    const variants = ['bg-variant-1', 'bg-variant-2', 'bg-variant-3', 'bg-variant-4'];
    
    // Remove all existing variant classes
    variants.forEach(variant => {
        body.classList.remove(variant);
    });
    
    // Add random variant
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    body.classList.add(randomVariant);
    
    // Show notification
    showNotification('Background color changed!', 'success');
}

// Display current time
function displayCurrentTime() {
    const timeDisplay = document.getElementById('timeDisplay');
    const now = new Date();
    
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    const formattedTime = now.toLocaleDateString('en-US', options);
    
    if (timeDisplay) {
        timeDisplay.innerHTML = `
            <div style="text-align: center;">
                <strong>Current Date & Time:</strong><br>
                ${formattedTime}
            </div>
        `;
        
        // Add animation
        timeDisplay.style.transform = 'scale(0.95)';
        setTimeout(() => {
            timeDisplay.style.transform = 'scale(1)';
        }, 100);
    }
}

// Show loading state
function showLoadingState() {
    const submitBtn = document.querySelector('.btn-primary');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        submitBtn.style.opacity = '0.7';
    }
}

// Show success message
function showSuccessMessage(name) {
    const submitBtn = document.querySelector('.btn-primary');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
        submitBtn.style.opacity = '1';
    }
    
    showNotification(`Thank you ${name}! Your form has been submitted successfully.`, 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Styling based on type
    const baseStyles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px',
        wordWrap: 'break-word'
    };
    
    const typeStyles = {
        success: { backgroundColor: '#48bb78' },
        error: { backgroundColor: '#e53e3e' },
        info: { backgroundColor: '#4299e1' }
    };
    
    // Apply styles
    Object.assign(notification.style, baseStyles, typeStyles[type]);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Welcome message
function showWelcomeMessage() {
    setTimeout(() => {
        showNotification('Welcome to our web application! Explore the features below.', 'info');
    }, 1000);
}

// Smooth scrolling for all internal links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add some interactive hover effects
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('form-group')) {
        e.target.style.transform = 'translateX(5px)';
        e.target.style.transition = 'transform 0.2s ease';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('form-group')) {
        e.target.style.transform = 'translateX(0)';
    }
});
