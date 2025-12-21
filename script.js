const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const stopBtn = document.getElementById('stop');
const timeButtons = document.querySelectorAll('.timechoose button');
const openPlantModalBtn = document.getElementById('openPlantModal');
const plantModal = document.getElementById('plantModal');
const closeModalBtn = document.querySelector('.close-modal');
const plantOptions = document.querySelectorAll('.plant-option');
const selectedPlantSpan = document.getElementById('selectedPlant');
const plantStages = document.querySelectorAll('.plant_stage');
let currentMusic = null;
let totalSeconds = 1800; 
let initialTime = 1800; 
let timerInterval = null;
let isRunning = false;
let selectedPlant = null;

updateTimerDisplay();
updatePlantStage();
timeButtons[2].classList.add('active'); 

const PlantMusicDictionary = {
    narcissus: document.getElementById('narcissusmusic'),
    seastones: document.getElementById('yellowmusic'),
    running: document.getElementById('runningman')
};

function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (totalSeconds < 300) { 
        timerDisplay.style.color = '#ffccbc';
        timerDisplay.style.textShadow = '0 0 10px rgba(255, 204, 188, 0.5)';
    } else {
        timerDisplay.style.color = '#c8e6c9';
        timerDisplay.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
    }
    
    updatePlantStage();
}

function updatePlantStage() {
    const progress = totalSeconds / initialTime;
    
    plantStages.forEach(stage => stage.classList.remove('active'));

    let activeStage;
    if (progress >= 0.75) {
        activeStage = plantStages[0]; // Первая стадия (75-100%)
    } else if (progress >= 0.5) {
        activeStage = plantStages[1]; // Вторая стадия (50-75%)
    } else if (progress >= 0.25) {
        activeStage = plantStages[2]; // Третья стадия (25-50%)
    } else {
        activeStage = plantStages[3]; // Четвертая стадия (0-25%)
    }

    activeStage.classList.add('active');
}

function PlayMusic(plantType) {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
    
    const song = PlantMusicDictionary[plantType];
    if (song) {
        song.volume = 0.5;
        currentMusic = song;
        
        if (isRunning) {
            const playPromise = song.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("Музыка успешно воспроизводится");
                }).catch(error => {
                    console.log("Ошибка воспроизведения:", error);
                });
            }
        }
    }
}

function startTimer() {
    if (isRunning) return;

    isRunning = true;
    startBtn.disabled = true;
    
    if (selectedPlant) {
        PlayMusic(selectedPlant);
    }

    timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateTimerDisplay();  
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            startBtn.disabled = false;
            
            if (currentMusic) {
                currentMusic.pause();
                currentMusic.currentTime = 0;
            }
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.disabled = false;

    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }

    const activeTimeBtn = document.querySelector('.timechoose button.active');
    if (activeTimeBtn) {
        initialTime = parseInt(activeTimeBtn.dataset.time);
        totalSeconds = initialTime;
    } else {
        initialTime = 1800; 
        totalSeconds = 1800;
    }

    updateTimerDisplay();
}

function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.disabled = false;
    
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
stopBtn.addEventListener('click', stopTimer);

timeButtons.forEach(button => {
    button.addEventListener('click', function() {
        timeButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        if (!isRunning) {
            initialTime = parseInt(this.dataset.time);
            totalSeconds = initialTime;
            updateTimerDisplay();
        }
    });
});

openPlantModalBtn.addEventListener('click', function() {
    plantModal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', function() {
    plantModal.style.display = 'none';
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', function(event) {
    if (event.target === plantModal) {
        plantModal.style.display = 'none';
    }
});

plantOptions.forEach(option => {
    option.addEventListener('click', function() {
        plantOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');

        selectedPlant = this.dataset.plant;
        const plantName = this.querySelector('h3').textContent;
        selectedPlantSpan.textContent = plantName;

        openPlantModalBtn.textContent = `${plantName} ✓`;

        updatePlantImages(selectedPlant);
        PlayMusic(selectedPlant);
        
        setTimeout(() => {
            plantModal.style.display = 'none';
        }, 1000);
    });
});

function updatePlantImages(plantType) {
    const plantImages = {
        narcissus: [
            'img/plant1.png',
            'img/plant1_2.png',
            'img/plant1_3.png',
            'img/plant1_4.png'
        ],
        seastones: [
            'img/plant2_1.png',
            'img/plant2_2.png',
            'img/plant2_3.png',
            'img/plant2_4.png'
        ],
        running: [
            'img/plant3_1.png',
            'img/plant3_2.png',
            'img/plant3_3.png',
            'img/plant3_4.png'
        ]

    };

    if (plantImages[plantType]) {
        plantStages.forEach((stage, index) => {
            if (plantImages[plantType][index]) {
                stage.src = plantImages[plantType][index];
            }
        });
    }
}

// ГОРЯЧИЕ КЛАВИШИ
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        if (isRunning) {
            stopTimer();
        } else {
            startTimer();
        }
    }
});
