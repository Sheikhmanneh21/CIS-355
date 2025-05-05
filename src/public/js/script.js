class SetupForm {
    constructor() {
        this.form = document.getElementById('setup-form');
        this.membersContainer = document.getElementById('members-container');
        this.choresContainer = document.getElementById('chores-container');
        this.loadingSpinner = document.getElementById('loading-spinner');
        
        this.initEventListeners();
        this.addMemberField();
        this.addChoreField();
    }

    initEventListeners() {
        // Add member button
        document.getElementById('add-member')?.addEventListener('click', () => {
            this.addMemberField();
        });

        // Add chore button
        document.getElementById('add-chore')?.addEventListener('click', () => {
            this.addChoreField();
        });

        // Form submission
        this.form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });

        // Delegated event listeners for remove buttons
        this.membersContainer?.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-member')) {
                this.removeField(e.target.closest('.member-field'));
            }
        });

        this.choresContainer?.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-chore')) {
                this.removeField(e.target.closest('.chore-field'));
            }
        });
    }

    addMemberField(value = '') {
        const id = `member-${Date.now()}`;
        const field = document.createElement('div');
        field.className = 'member-field mb-3 input-group';
        field.innerHTML = `
            <input type="text" class="form-control" id="${id}" 
                   placeholder="Family member name" value="${value}" required>
            <button type="button" class="btn btn-outline-danger remove-member">
                <i class="bi bi-trash"></i>
            </button>
        `;
        this.membersContainer?.appendChild(field);
        document.getElementById(id)?.focus();
    }

    addChoreField(name = '', frequency = '1') {
        const id = `chore-${Date.now()}`;
        const field = document.createElement('div');
        field.className = 'chore-field mb-3';
        field.innerHTML = `
            <div class="input-group">
                <span class="input-group-text">Chore</span>
                <input type="text" class="form-control chore-name" 
                       placeholder="e.g., Wash dishes" value="${name}" required>
                <span class="input-group-text">Frequency</span>
                <input type="number" class="form-control chore-frequency" 
                       min="1" value="${frequency}" required>
                <button type="button" class="btn btn-outline-danger remove-chore">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        this.choresContainer?.appendChild(field);
    }

    removeField(field) {
        field?.remove();
    }

    async handleSubmit() {
        if (!this.validateForm()) {
            return;
        }

        const data = {
            members: this.getMembers(),
            chores: this.getChores(),
            weeks: parseInt(document.getElementById('weeks')?.value || '4')
        };

        this.form?.classList.add('d-none');
        this.loadingSpinner?.classList.remove('d-none');

        try {
            const response = await fetch('/generate-schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to generate schedule');
            }

            const result = await response.json();
            this.renderCalendarPage(result);
        } catch (error) {
            alert(`Error: ${error.message}`);
            console.error('Submission error:', error);
        } finally {
            this.form?.classList.remove('d-none');
            this.loadingSpinner?.classList.add('d-none');
        }
    }

    validateForm() {
        if (!this.membersContainer || this.membersContainer.children.length === 0) {
            alert('Please add at least one family member');
            return false;
        }

        if (!this.choresContainer || this.choresContainer.children.length === 0) {
            alert('Please add at least one chore');
            return false;
        }

        const memberInputs = this.membersContainer.querySelectorAll('input');
        for (const input of memberInputs) {
            if (!input.value.trim()) {
                alert('Please enter a name for all family members');
                input.focus();
                return false;
            }
        }

        const choreNames = this.choresContainer.querySelectorAll('.chore-name');
        const choreFreqs = this.choresContainer.querySelectorAll('.chore-frequency');
        
        for (let i = 0; i < choreNames.length; i++) {
            if (!choreNames[i].value.trim()) {
                alert('Please enter a name for all chores');
                choreNames[i].focus();
                return false;
            }
            
            if (!choreFreqs[i].value || parseInt(choreFreqs[i].value) < 1) {
                alert('Please enter a valid frequency (at least 1) for all chores');
                choreFreqs[i].focus();
                return false;
            }
        }

        return true;
    }

    getMembers() {
        return Array.from(this.membersContainer?.querySelectorAll('input') || [])
            .map(input => input.value.trim())
            .filter(name => name);
    }

    getChores() {
        const names = Array.from(this.choresContainer?.querySelectorAll('.chore-name') || [])
            .map(input => input.value.trim());
        
        const freqs = Array.from(this.choresContainer?.querySelectorAll('.chore-frequency') || [])
            .map(input => parseInt(input.value));
        
        return names.map((name, i) => ({
            name,
            frequency: freqs[i]
        })).filter(chore => chore.name);
    }

    renderCalendarPage(data) {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Chore Rotation Calendar</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="/css/style.css">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
            </head>
            <body>
                ${Handlebars.templates['calendar'](data)}
                <script src="/js/calendar.js"></script>
            </body>
            </html>
        `;
        
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(html);
            newWindow.document.close();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SetupForm();
});/*class SetupForm {
    constructor() {
        this.form = document.getElementById('setup-form');
        this.membersContainer = document.getElementById('members-container');
        this.choresContainer = document.getElementById('chores-container');
        this.loadingSpinner = document.getElementById('loading-spinner');
        
        this.initEventListeners();
        this.addMemberField();
        this.addChoreField();
    }

    initEventListeners() {
        // Add member button
        document.getElementById('add-member').addEventListener('click', () => {
            this.addMemberField();
        });

        // Add chore button
        document.getElementById('add-chore').addEventListener('click', () => {
            this.addChoreField();
        });

        // Form submission
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });

        // Delegated event listeners for remove buttons
        this.membersContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-member')) {
                this.removeField(e.target.closest('.member-field'));
            }
        });

        this.choresContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-chore')) {
                this.removeField(e.target.closest('.chore-field'));
            }
        });
    }

    addMemberField(value = '') {
        const id = `member-${Date.now()}`;
        const field = document.createElement('div');
        field.className = 'member-field mb-3 input-group';
        field.innerHTML = `
            <input type="text" class="form-control" id="${id}" 
                   placeholder="Family member name" required>
            <button type="button" class="btn btn-outline-danger remove-member">
                <i class="bi bi-trash"></i>
            </button>
        `;
        this.membersContainer.appendChild(field);
        document.getElementById(id).focus();
    }

    addChoreField(name = '', frequency = '1') {
        const id = `chore-${Date.now()}`;
        const field = document.createElement('div');
        field.className = 'chore-field mb-3';
        field.innerHTML = `
            <div class="input-group">
                <span class="input-group-text">Chore</span>
                <input type="text" class="form-control chore-name" 
                       placeholder="e.g., Wash dishes" required>
                <span class="input-group-text">Frequency</span>
                <input type="number" class="form-control chore-frequency" 
                       min="1" value="${frequency}" required>
                <button type="button" class="btn btn-outline-danger remove-chore">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        this.choresContainer.appendChild(field);
    }

    removeField(field) {
        field.remove();
    }

    async handleSubmit() {
        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Prepare data
        const data = {
            members: this.getMembers(),
            chores: this.getChores(),
            weeks: parseInt(document.getElementById('weeks').value)
        };

        // Show loading state
        this.form.classList.add('d-none');
        this.loadingSpinner.classList.remove('d-none');

        try {
            // Submit to server
            const response = await fetch('/api/generate-schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // Render the calendar page with the received data
                this.renderCalendarPage(result);
            } else {
                throw new Error(result.error || 'Failed to generate schedule');
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
            console.error('Submission error:', error);
        } finally {
            this.form.classList.remove('d-none');
            this.loadingSpinner.classList.add('d-none');
        }
    }

    validateForm() {
        // Check for at least one member
        if (this.membersContainer.children.length === 0) {
            alert('Please add at least one family member');
            return false;
        }

        // Check for at least one chore
        if (this.choresContainer.children.length === 0) {
            alert('Please add at least one chore');
            return false;
        }

        // Validate all member fields
        const memberInputs = this.membersContainer.querySelectorAll('input');
        for (const input of memberInputs) {
            if (!input.value.trim()) {
                alert('Please enter a name for all family members');
                input.focus();
                return false;
            }
        }

        // Validate all chore fields
        const choreNames = this.choresContainer.querySelectorAll('.chore-name');
        const choreFreqs = this.choresContainer.querySelectorAll('.chore-frequency');
        
        for (let i = 0; i < choreNames.length; i++) {
            if (!choreNames[i].value.trim()) {
                alert('Please enter a name for all chores');
                choreNames[i].focus();
                return false;
            }
            
            if (!choreFreqs[i].value || parseInt(choreFreqs[i].value) < 1) {
                alert('Please enter a valid frequency (at least 1) for all chores');
                choreFreqs[i].focus();
                return false;
            }
        }

        return true;
    }

    getMembers() {
        return Array.from(this.membersContainer.querySelectorAll('input'))
            .map(input => input.value.trim())
            .filter(name => name);
    }

    getChores() {
        const names = Array.from(this.choresContainer.querySelectorAll('.chore-name'))
            .map(input => input.value.trim());
        
        const freqs = Array.from(this.choresContainer.querySelectorAll('.chore-frequency'))
            .map(input => parseInt(input.value));
        
        return names.map((name, i) => ({
            name,
            frequency: freqs[i]
        })).filter(chore => chore.name);
    }

    renderCalendarPage(data) {
        // Create a new page with the calendar template
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Chore Rotation Calendar</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="/css/style.css">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
            </head>
            <body>
                ${Handlebars.templates['calendar'](data)}
                <script src="/js/calendar.js"></script>
            </body>
            </html>
        `;
        
        // Open the new page
        const newWindow = window.open('', '_blank');
        newWindow.document.write(html);
        newWindow.document.close();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SetupForm();
}); */