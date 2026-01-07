// Curriculum Page Loader - Loads syllabus files based on URL parameter

// Program mapping
const programMap = {
    'beginner': {
        file: 'resources/Syllabus_6-8.txt',
        title: 'BotBees Explorers Curriculum',
        subtitle: 'Ages 7-10 years - Learning through play & simple bots'
    },
    'creator': {
        file: 'resources/Syllabus_8-10.txt',
        title: 'BotBees Designers Curriculum',
        subtitle: 'Ages 10-12 years - Basic robotics + coding concepts'
    },
    'innovator': {
        file: 'resources/Syllabus_10-13.txt',
        title: 'BotBees Inventors Curriculum',
        subtitle: 'Ages 12-14 years - Robot building, sensors, automation'
    },
    'engineer': {
        file: 'resources/Syllabus_13-16.txt',
        title: 'BotBees Engineers Curriculum',
        subtitle: 'Ages 14-16 years - Advanced robotics & real-world projects'
    }
};

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

        // Add content to current section
        if (currentModule) {
            if (currentSection === 'topics' && line.startsWith('*')) {
                currentModule.topics.push(line.substring(1).trim());
            } else if (currentSection === 'project' && line.startsWith('*')) {
                currentModule.project = line.substring(1).trim();
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

// Generate HTML for a module
function generateModuleHTML(module) {
    const topicsHTML = module.topics.map(topic => `<li>${topic}</li>`).join('\n');

    return `
        <div class="curriculum-module">
            <div class="curriculum-module-header">
                <span class="module-number">${module.number}</span>
                <h3>${module.title}</h3>
            </div>
            <div class="curriculum-module-content">
                <div class="curriculum-topics">
                    <h4>Topics Covered:</h4>
                    <ul>
                        ${topicsHTML}
                    </ul>
                </div>
                <div class="curriculum-project">
                    <h4>Hands-On Project:</h4>
                    <p>${module.project}</p>
                </div>
            </div>
        </div>
    `;
}

// Load and display curriculum
async function loadCurriculumPage() {
    // Get program parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const program = urlParams.get('program') || 'beginner';

    // Get program info
    const programInfo = programMap[program];
    if (!programInfo) {
        showError('Invalid program specified');
        return;
    }

    // Update page title and subtitle
    const titleElement = document.getElementById('curriculum-title');
    const subtitleElement = document.getElementById('curriculum-subtitle');
    const contentDiv = document.getElementById('curriculum-content');

    if (titleElement) {
        titleElement.textContent = `📚 ${programInfo.title}`;
    }
    if (subtitleElement) {
        subtitleElement.textContent = programInfo.subtitle;
    }

    // Update document title
    document.title = `${programInfo.title} - BotBees Academy`;

    try {
        // Fetch the curriculum file
        const response = await fetch(programInfo.file, {
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

        const curriculum = parseSyllabus(text, programInfo.title);

        if (!curriculum.modules || curriculum.modules.length === 0) {
            throw new Error('No curriculum modules found in file');
        }

        // Generate and insert HTML
        const modulesHTML = curriculum.modules.map(module => generateModuleHTML(module)).join('\n');
        contentDiv.innerHTML = modulesHTML;

    } catch (error) {
        console.error(`Error loading curriculum:`, error);
        showError(`Failed to load curriculum: ${error.message}`);
    }
}

// Show error message
function showError(message) {
    const contentDiv = document.getElementById('curriculum-content');
    contentDiv.innerHTML = `
        <div class="curriculum-error">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
            <a href="index.html#classes" class="cta-button" style="margin-top: 2rem; display: inline-block;">Back to Programs</a>
        </div>
    `;
}

// Load curriculum when page loads
document.addEventListener('DOMContentLoaded', function () {
    loadCurriculumPage();
});
