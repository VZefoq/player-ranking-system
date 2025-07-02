const rankToClassMap = {
    'S+': 'S-plus',
    'S': 'S',
    'S-': 'S-minus',
    'A+': 'A-plus',
    'A': 'A',
    'A-': 'A-minus',
    'B+': 'B-plus',
    'B': 'B',
    'B-': 'B-minus',
    'C+': 'C-plus',
    'C': 'C',
    'C-': 'C-minus',
    'F': 'F'
};

// Load players from localStorage on page load
let playersData = JSON.parse(localStorage.getItem('playersData')) || [];

const sliders = [
    { slider: 'techSlider', value: 'techValue' },
    { slider: 'combatSlider', value: 'combatValue' },
    { slider: 'gameSlider', value: 'gameValue' },
    { slider: 'adaptSlider', value: 'adaptValue' },
    { slider: 'clutchSlider', value: 'clutchValue' }
];

// Function to save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('playersData', JSON.stringify(playersData));
}

sliders.forEach(({ slider, value }) => {
    const sliderEl = document.getElementById(slider);
    const valueEl = document.getElementById(value);
    
    sliderEl.addEventListener('input', function() {
        valueEl.textContent = this.value;
        updateTotalScore();
    });
});

function updateTotalScore() {
    const tech = parseInt(document.getElementById('techSlider').value);
    const combat = parseInt(document.getElementById('combatSlider').value);
    const game = parseInt(document.getElementById('gameSlider').value);
    const adapt = parseInt(document.getElementById('adaptSlider').value);
    const clutch = parseInt(document.getElementById('clutchSlider').value);
    
    const total = tech + combat + game + adapt + clutch;
    const rank = calculateRank(total);
    
    document.getElementById('totalScore').textContent = `${total}/50`;
    const rankEl = document.getElementById('currentRank');
    rankEl.textContent = rank;
    rankEl.className = `rank-display rank-${rankToClassMap[rank]}`;
}

function calculateRank(score) {
    if (score >= 46) return 'S+';
    if (score >= 42) return 'S';
    if (score >= 39) return 'S-';
    if (score >= 36) return 'A+';
    if (score >= 33) return 'A';
    if (score >= 30) return 'A-';
    if (score >= 27) return 'B+';
    if (score >= 24) return 'B';
    if (score >= 21) return 'B-';
    if (score >= 18) return 'C+';
    if (score >= 15) return 'C';
    if (score >= 12) return 'C-';
    return 'F';
}

function addPlayer(username, rank, score = null) {
    const existingIndex = playersData.findIndex(p => p.username.toLowerCase() === username.toLowerCase());
    
    if (existingIndex !== -1) {
        playersData[existingIndex] = { username, rank, score };
    } else {
        playersData.push({ username, rank, score });
    }
    
    saveToLocalStorage();
    updateLeaderboard();
}

function updateLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    
    if (playersData.length === 0) {
        leaderboard.innerHTML = '<div class="empty-state">No players ranked yet. Start by rating a player!</div>';
        return;
    }

    const rankOrder = ['S+', 'S', 'S-', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'F'];
    playersData.sort((a, b) => rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank));

    leaderboard.innerHTML = playersData.map((player, index) => `
        <div class="player-item" id="player-${index}">
            <span class="player-name">${player.username}</span>
            <span class="player-rank rank-${rankToClassMap[player.rank]}">${player.rank}</span>
            <div class="player-actions">
                <button class="action-btn edit" onclick="editPlayer(${index})">Edit</button>
                <button class="action-btn delete" onclick="deletePlayer(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function editPlayer(index) {
    const player = playersData[index];
    const playerElement = document.getElementById(`player-${index}`);
    
    const rankOptions = ['S+', 'S', 'S-', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'F'];
    const optionsHtml = rankOptions.map(rank => 
        `<option value="${rank}" ${rank === player.rank ? 'selected' : ''}>${rank}</option>`
    ).join('');
    
    playerElement.innerHTML = `
        <span class="player-name">${player.username}</span>
        <div class="edit-form">
            <select class="edit-select" id="edit-rank-${index}">
                ${optionsHtml}
            </select>
            <div style="display: flex; gap: 5px;">
                <button class="action-btn" onclick="saveEdit(${index})" style="background: rgba(78, 205, 196, 0.3);">Save</button>
                <button class="action-btn" onclick="cancelEdit(${index})" style="background: rgba(255, 255, 255, 0.1);">Cancel</button>
            </div>
        </div>
        <div></div>
    `;
}

function saveEdit(index) {
    const newRank = document.getElementById(`edit-rank-${index}`).value;
    playersData[index].rank = newRank;
    saveToLocalStorage();
    updateLeaderboard();
}

function cancelEdit(index) {
    updateLeaderboard();
}

function deletePlayer(index) {
    const player = playersData[index];
    if (confirm(`Are you sure you want to delete ${player.username} from the rankings?`)) {
        playersData.splice(index, 1);
        saveToLocalStorage();
        updateLeaderboard();
    }
}

function addManualPlayer() {
    const username = document.getElementById('manualUsername').value.trim();
    const rank = document.getElementById('manualRank').value;
    
    if (!username) {
        alert('Please enter a username');
        return;
    }
    
    addPlayer(username, rank);
    document.getElementById('manualUsername').value = '';
    document.getElementById('manualRank').value = 'B';
}

function clearAllPlayers() {
    if (confirm('Are you sure you want to clear all rankings? This action cannot be undone.')) {
        playersData = [];
        saveToLocalStorage();
        updateLeaderboard();
    }
}

document.getElementById('playerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    if (!username) {
        alert('Please enter a username');
        return;
    }
    
    const tech = parseInt(document.getElementById('techSlider').value);
    const combat = parseInt(document.getElementById('combatSlider').value);
    const game = parseInt(document.getElementById('gameSlider').value);
    const adapt = parseInt(document.getElementById('adaptSlider').value);
    const clutch = parseInt(document.getElementById('clutchSlider').value);
    
    const total = tech + combat + game + adapt + clutch;
    const rank = calculateRank(total);
    
    addPlayer(username, rank, total);
    
    // reset form
    document.getElementById('username').value = '';
    sliders.forEach(({ slider, value }) => {
        document.getElementById(slider).value = 1;
        document.getElementById(value).textContent = '1';
    });
    updateTotalScore();
});

updateTotalScore();
updateLeaderboard();