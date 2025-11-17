// Curriculum Loader - Dynamically loads and parses syllabus files

// Parse syllabus text into structured data
function parseSyllabus(text, title) {
    const modules = [];
    const lines = text.split('\n').map(line => line.trim());

    let currentModule = null;
    let currentSection = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip empty lines and header
        if (!line || line === 'Robotics Syllabus') {
            continue;
        }

        // Check if it's a module number (e.g., "1. Module Title")
        const moduleMatch = line.match(/^(\d+)\.\s+(.+)$/);
        if (moduleMatch) {
            // Save previous module if exists
            if (currentModule) {
                modules.push(currentModule);
            }

            // Start new module
            currentModule = {
                number: moduleMatch[1],
                title: moduleMatch[2],
                topics: [],
                project: ''
            };
            currentSection = null;
            continue;
        }

        // Check if it's a section header
        if (line === 'Topics Covered:') {
            currentSection = 'topics';
            continue;
        }

        if (line === 'Hands-On Project:') {
            currentSection = 'project';
            continue;
        }

        // Check if it's a separator
        if (line === '________________') {
            continue;
        }

        // Process content based on current section
        if (currentModule) {
            if (currentSection === 'topics' && line.startsWith('*')) {
                // Remove the bullet point and add topic
                const topic = line.substring(1).trim();
                if (topic) {
                    currentModule.topics.push(topic);
                }
            } else if (currentSection === 'project' && line.startsWith('*')) {
                // Remove the bullet point and set project (handle multi-line projects)
                const projectText = line.substring(1).trim();
                if (projectText) {
                    if (currentModule.project) {
                        currentModule.project += ' ' + projectText;
                    } else {
                        currentModule.project = projectText;
                    }
                }
            }
        }
    }

    // Don't forget the last module
    if (currentModule) {
        modules.push(currentModule);
    }

    return {
        title: title,
        modules: modules
    };
}

// Generate HTML for a curriculum module
function generateModuleHTML(module) {
    const topicsHTML = module.topics.map(topic => `<li>${topic}</li>`).join('\n                        ');

    return `
                <div class="curriculum-module">
                    <h3>${module.number}. ${module.title}</h3>
                    <h4>Topics Covered:</h4>
                    <ul>
                        ${topicsHTML}
                    </ul>
                    <div class="project-box">
                        <strong>Hands-On Project:</strong>
                        <p>${module.project}</p>
                    </div>
                </div>`;
}

// Load and display curriculum
async function loadCurriculum(filePath, modalId, title, closeFunctionName) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Modal ${modalId} not found`);
        return;
    }

    const contentDiv = modal.querySelector('.curriculum-content');
    if (!contentDiv) {
        console.error(`Curriculum content div not found in ${modalId}`);
        return;
    }

    try {
        // Try to fetch the curriculum file
        const response = await fetch(filePath, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain',
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const text = await response.text();

        if (!text || text.trim().length === 0) {
            throw new Error('Curriculum file is empty');
        }

        const curriculum = parseSyllabus(text, title);

        if (!curriculum.modules || curriculum.modules.length === 0) {
            throw new Error('No curriculum modules found in file');
        }

        // Generate and insert HTML
        const modulesHTML = curriculum.modules.map(module => generateModuleHTML(module)).join('\n');
        contentDiv.innerHTML = modulesHTML;

        // Update the title
        const titleElement = modal.querySelector('h2');
        if (titleElement) {
            titleElement.textContent = `📚 ${curriculum.title}`;
        }

    } catch (error) {
        console.error(`Error loading curriculum from ${filePath}:`, error);

        // Show detailed error message in modal
        let errorMessage = error.message || 'Unknown error';

        // Provide helpful message based on error type
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage = 'Unable to load curriculum file. Please ensure you are running the site from a web server (not file://). If testing locally, use: python -m http.server 8000';
        }

        // Get CSS variable values
        const rootStyles = getComputedStyle(document.documentElement);
        const errorColor = rootStyles.getPropertyValue('--error').trim();
        const textSecondary = rootStyles.getPropertyValue('--text-secondary').trim();

        contentDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: ${errorColor};">
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">⚠️ Error loading curriculum</p>
                <p style="font-size: 0.9rem; margin-bottom: 0.5rem;">${errorMessage}</p>
                <p style="font-size: 0.8rem; color: ${textSecondary}; margin-top: 1rem;">File: ${filePath}</p>
                <p style="font-size: 0.8rem; color: ${textSecondary};">Please check the browser console for more details.</p>
            </div>
        `;
    }
}

// Load all curricula when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Load Beginner Builders curriculum (Ages 6-8)
    loadCurriculum('resources/Syllabus_6-8.txt', 'beginnerCurriculumModal', 'Beginner Builders Curriculum', 'closeBeginnerCurriculum');

    // Load Robot Engineers curriculum (Ages 9-12)
    loadCurriculum('resources/Syllabus_9-12.txt', 'curriculumModal', 'Robot Engineers Curriculum', 'closeCurriculum');

    // Load Future Inventors curriculum (Ages 13-16)
    loadCurriculum('resources/Syllabus_13-16.txt', 'futureCurriculumModal', 'Future Inventors Curriculum', 'closeFutureCurriculum');
});

