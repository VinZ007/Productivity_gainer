const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const stopBtn = document.getElementById('stop');

// Элементы для Sea Stones
const seaTimer = document.getElementById('seaTimer');
const startSeaBtn = document.getElementById('startSea');
const resetSeaBtn = document.getElementById('resetSea');
const stopSeaBtn = document.getElementById('stopSea');
const tideFill = document.getElementById('tideFill');
const seaStatus = document.getElementById('seaStatus');

// Элементы для Running Guy
const runningTimer = document.getElementById('runningTimer');
const startRunBtn = document.getElementById('startRun');
const resetRunBtn = document.getElementById('resetRun');
const stopRunBtn = document.getElementById('stopRun');
const runner = document.getElementById('runner');
const finishLine = document.getElementById('finishLine');
const speedFill = document.getElementById('speedFill');
const paceText = document.getElementById('paceText');
const distanceDisplay = document.getElementById('distance');

// Общие элементы
const timeButtons = document.querySelectorAll('.timechoose button, .sea-time-buttons button, .distance-buttons button');
const openPlantModalBtn = document.getElementById('openPlantModal');
const plantModal = document.getElementById('plantModal');
const closeModalBtn = document.querySelector('.close-modal');
const plantOptions = document.querySelectorAll('.plant-option');
const selectedPlantSpan = document.getElementById('selectedPlant');
const plantStages = document.querySelectorAll('.plant_stage');

// Состояние приложения
let totalSeconds = 1800; 
let initialTime = 1800; 
let timerInterval = null;
let isRunning = false;
let selectedPlant = 'narcissus';
let currentMusic = null;
let sessionCount = 0;
let totalTimeSeconds = 0;

// Статистика для каждого макета
let seaSessionCount = 0;
let seaTotalTimeSeconds = 0;
let runSessionCount = 0;
let runTotalTimeSeconds = 0;

const PlantMusicDictionary = {
    narcissus: document.getElementById('narcissusmusic'),
    seastones: document.getElementById('yellowmusic'),
    running: document.getElementById('runningman')
};

// Инициализация
init();

function init() {
    updateTimerDisplay();
    updatePlantStage();
    timeButtons[2].classList.add('active');
    
    // Установка начального макета
    switchLayout('narcissus');
    
    // Загрузка сохраненных данных
    loadSavedData();
}

function switchLayout(plantType) {
    // Скрыть все макеты
    document.querySelectorAll('.layout-narcissus, .layout-seastones, .layout-running').forEach(layout => {
        layout.classList.remove('active-layout');
    });
    
    // Показать выбранный макет
    document.querySelector(`.layout-${plantType}`).classList.add('active-layout');
    
    // Обновить тему
    changeTheme(plantType);
    
    // Обновить кнопки выбора времени для активного макета
    updateTimeButtons(plantType);
}

function changeTheme(plantType) {
    // Удаляем все классы тем
    document.body.classList.remove('theme-narcissus', 'theme-seastones', 'theme-running');
    
    // Добавляем текущую тему
    document.body.classList.add(`theme-${plantType}`);
    selectedPlant = plantType;
    
    // Устанавливаем RGB значения для акцентных цветов
    setAccentColorRGB(plantType);
    
    // Сохраняем тему
    localStorage.setItem('selectedTheme', plantType);
}

function setAccentColorRGB(plantType) {
    let rgb = '';
    switch(plantType) {
        case 'narcissus':
            rgb = '255, 204, 0';
            break;
        case 'seastones':
            rgb = '56, 182, 255';
            break;
        case 'running':
            rgb = '74, 222, 128';
            break;
    }
    document.documentElement.style.setProperty('--accent-color-rgb', rgb);
}

function updateTimeButtons(plantType) {
    // Сбросить активные кнопки
    timeButtons.forEach(btn => btn.classList.remove('active'));
    
    // Установить активную кнопку в зависимости от макета
    let activeBtn;
    if (plantType === 'narcissus') {
        activeBtn = document.querySelector('.timechoose button[data-time="1800"]');
    } else if (plantType === 'seastones') {
        activeBtn = document.querySelector('.sea-time-buttons button[data-time="1800"]');
    } else if (plantType === 'running') {
        activeBtn = document.querySelector('.distance-buttons button[data-time="1800"]');
    }
    
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Обновить все таймеры
    timerDisplay.textContent = timeString;
    if (seaTimer) seaTimer.textContent = timeString;
    if (runningTimer) runningTimer.textContent = timeString;
    
    // Обновить цвет и анимации
    updateTimerColor();
    updatePlantStage();
    updateSeaVisualization();
    updateRunningVisualization();
}

function updateTimerColor() {
    if (totalSeconds < 300) {
        timerDisplay.style.color = '#ffccbc';
        if (seaTimer) seaTimer.style.color = '#ffccbc';
        if (runningTimer) runningTimer.style.color = '#ffccbc';
    } else {
        switch(selectedPlant) {
            case 'narcissus':
                timerDisplay.style.color = '#fff9c4';
                break;
            case 'seastones':
                if (seaTimer) seaTimer.style.color = '#a5d8ff';
                break;
            case 'running':
                if (runningTimer) runningTimer.style.color = '#bbf7d0';
                break;
        }
    }
}

function updatePlantStage() {
    if (selectedPlant !== 'narcissus') return;
    
    const progress = totalSeconds / initialTime;
    
    plantStages.forEach(stage => stage.classList.remove('active'));

    let activeStage;
    if (progress >= 0.75) {
        activeStage = plantStages[0];
    } else if (progress >= 0.5) {
        activeStage = plantStages[1];
    } else if (progress >= 0.25) {
        activeStage = plantStages[2];
    } else {
        activeStage = plantStages[3];
    }

    activeStage.classList.add('active');
    
    // Обновить прогресс бар
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = `${(1 - progress) * 100}%`;
    }
    
    // Обновить текст статуса
    const statusText = document.getElementById('statusText');
    if (statusText) {
        if (progress >= 0.75) statusText.textContent = "Your flower is blooming beautifully!";
        else if (progress >= 0.5) statusText.textContent = "Your flower is growing well!";
        else if (progress >= 0.25) statusText.textContent = "Your flower needs some attention!";
        else statusText.textContent = "Your flower is wilting! Water it with productivity!";
    }
}

function updateSeaVisualization() {
    if (selectedPlant !== 'seastones') return;
    
    const progress = totalSeconds / initialTime;
    const tideLevel = (1 - progress) * 100;
    
    if (tideFill) {
        tideFill.style.width = `${tideLevel}%`;
    }
    
    if (seaStatus) {
        if (progress >= 0.75) seaStatus.textContent = "🌊 Tide is calm and peaceful";
        else if (progress >= 0.5) seaStatus.textContent = "🌊 Waves are getting stronger";
        else if (progress >= 0.25) seaStatus.textContent = "🌊 Storm is brewing!";
        else seaStatus.textContent = "🌊⚡ High tide! Focus now!";
    }
    
    // Анимировать камни
    const stones = document.querySelectorAll('.stone');
    stones.forEach((stone, index) => {
        const delay = index * 0.2;
        stone.style.animationDelay = `${delay}s`;
    });
}

function updateRunningVisualization() {
    if (selectedPlant !== 'running') return;
    
    const progress = totalSeconds / initialTime;
    const distanceCovered = (1 - progress) * 3000; // 3000m total distance
    
    // Обновить бегуна
    if (runner) {
        const trackWidth = document.querySelector('.track').offsetWidth;
        const runnerWidth = runner.offsetWidth;
        const finishLinePos = 100; // позиция финишной линии справа
        const newPosition = (1 - progress) * (trackWidth - runnerWidth - finishLinePos);
        runner.style.left = `${newPosition}px`;
    }
    
    // Обновить дистанцию
    if (distanceDisplay) {
        distanceDisplay.textContent = Math.round(distanceCovered);
    }
    
    // Обновить спидометр
    if (speedFill) {
        const speedPercent = (1 - progress) * 100;
        document.documentElement.style.setProperty('--speed-percent', `${speedPercent}%`);
        speedFill.textContent = `${Math.round(speedPercent)}%`;
    }
    
    // Обновить темп
    if (paceText) {
        if (progress >= 0.75) paceText.textContent = "🏃‍♂️ Warm up pace - steady!";
        else if (progress >= 0.5) paceText.textContent = "🏃‍♂️ Good rhythm - keep going!";
        else if (progress >= 0.25) paceText.textContent = "🏃‍♂️ Pushing hard - almost there!";
        else paceText.textContent = "🏃‍♂️💨 Sprint finish - give it all!";
    }
}

function PlayMusic(plantType) {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
    
    const song = PlantMusicDictionary[plantType];
    if (song) {
        song.volume = 0.5;
        song.loop = true;
        currentMusic = song;
        
        if (isRunning) {
            const playPromise = song.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("Music playing");
                }).catch(error => {
                    console.log("Playback error:", error);
                });
            }
        }
    }
}

function startTimer() {
    if (isRunning) return;

    isRunning = true;
    
    // Отключить кнопки старта на всех макетах
    startBtn.disabled = true;
    if (startSeaBtn) startSeaBtn.disabled = true;
    if (startRunBtn) startRunBtn.disabled = true;
    
    // Воспроизвести музыку
    PlayMusic(selectedPlant);
    
    // Обновить анимации для бега
    if (selectedPlant === 'running') {
        runner.style.animationPlayState = 'running';
    }
    
    timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateTimerDisplay();
            
            // Увеличить общее время
            totalTimeSeconds++;
            if (selectedPlant === 'seastones') seaTotalTimeSeconds++;
            if (selectedPlant === 'running') runTotalTimeSeconds++;
            updateStats();
        } else {
            finishTimer();
        }
    }, 1000);
}

function finishTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    
    // Включить кнопки старта
    startBtn.disabled = false;
    if (startSeaBtn) startSeaBtn.disabled = false;
    if (startRunBtn) startRunBtn.disabled = false;
    
    // Остановить музыку
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
    
    // Увеличить счетчик сессий
    sessionCount++;
    if (selectedPlant === 'seastones') seaSessionCount++;
    if (selectedPlant === 'running') runSessionCount++;
    updateStats();
    
    // Показать уведомление о завершении
    showCompletionNotification();
    
    // Остановить анимацию бегуна
    if (selectedPlant === 'running') {
        runner.style.animationPlayState = 'paused';
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    
    // Включить кнопки старта
    startBtn.disabled = false;
    if (startSeaBtn) startSeaBtn.disabled = false;
    if (startRunBtn) startRunBtn.disabled = false;
    
    // Остановить музыку
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
    
    // Сбросить таймер
    const activeTimeBtn = getActiveTimeButton();
    if (activeTimeBtn) {
        initialTime = parseInt(activeTimeBtn.dataset.time);
        totalSeconds = initialTime;
    } else {
        initialTime = 1800;
        totalSeconds = 1800;
    }
    
    updateTimerDisplay();
    
    // Сбросить анимацию бегуна
    if (selectedPlant === 'running') {
        runner.style.left = '50px';
        runner.style.animationPlayState = 'paused';
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    
    // Включить кнопки старта
    startBtn.disabled = false;
    if (startSeaBtn) startSeaBtn.disabled = false;
    if (startRunBtn) startRunBtn.disabled = false;
    
    // Остановить музыку
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
    
    // Остановить анимацию бегуна
    if (selectedPlant === 'running') {
        runner.style.animationPlayState = 'paused';
    }
}

function getActiveTimeButton() {
    if (selectedPlant === 'narcissus') {
        return document.querySelector('.timechoose button.active');
    } else if (selectedPlant === 'seastones') {
        return document.querySelector('.sea-time-buttons button.active');
    } else if (selectedPlant === 'running') {
        return document.querySelector('.distance-buttons button.active');
    }
    return null;
}

function updateStats() {
    // Обновить статистику для Narcissus
    const sessionCountEl = document.getElementById('sessionCount');
    const totalTimeEl = document.getElementById('totalTime');
    
    if (sessionCountEl) sessionCountEl.textContent = sessionCount;
    if (totalTimeEl) {
        const totalMinutes = Math.floor(totalTimeSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
        totalTimeEl.textContent = `${totalHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
    }
    
    // Обновить статистику для Sea Stones
    const seaSessionCountEl = document.getElementById('seaSessionCount');
    const seaTotalTimeEl = document.getElementById('seaTotalTime');
    
    if (seaSessionCountEl) seaSessionCountEl.textContent = seaSessionCount;
    if (seaTotalTimeEl) {
        const seaTotalMinutes = Math.floor(seaTotalTimeSeconds / 60);
        const seaTotalHours = Math.floor(seaTotalMinutes / 60);
        const seaRemainingMinutes = seaTotalMinutes % 60;
        seaTotalTimeEl.textContent = `${seaTotalHours.toString().padStart(2, '0')}:${seaRemainingMinutes.toString().padStart(2, '0')}`;
    }
    
    // Обновить статистику для Running Guy
    const runSessionCountEl = document.getElementById('runSessionCount');
    const runTotalTimeEl = document.getElementById('runTotalTime');
    const avgPaceEl = document.getElementById('avgPace');
    
    if (runSessionCountEl) runSessionCountEl.textContent = runSessionCount;
    if (runTotalTimeEl) {
        const runTotalMinutes = Math.floor(runTotalTimeSeconds / 60);
        const runTotalHours = Math.floor(runTotalMinutes / 60);
        const runRemainingMinutes = runTotalMinutes % 60;
        runTotalTimeEl.textContent = `${runTotalHours.toString().padStart(2, '0')}:${runRemainingMinutes.toString().padStart(2, '0')}`;
    }
    
    if (avgPaceEl && runSessionCount > 0) {
        const avgPace = Math.floor(runTotalTimeSeconds / runSessionCount / 60);
        avgPaceEl.textContent = `${avgPace}:00`;
    }
}

function showCompletionNotification() {
    let message = '';
    let icon = '';
    
    switch(selectedPlant) {
        case 'narcissus':
            message = '🌸 Your flower has fully bloomed! Great work!';
            icon = '🌸';
            break;
        case 'seastones':
            message = '🌊 The tide has settled! Session complete!';
            icon = '🌊';
            break;
        case 'running':
            message = '🏃‍♂️ You finished the run! Amazing pace!';
            icon = '🏃‍♂️';
            break;
    }
    
    // Создать временное уведомление
    const notification = document.createElement('div');
    notification.className = 'completion-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Удалить уведомление через 3 секунды
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function loadSavedData() {
    // Загрузить сохраненную тему
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        const plantOption = document.querySelector(`.plant-option[data-plant="${savedTheme}"]`);
        if (plantOption) {
            plantOption.click();
        }
    }
    
    // Загрузить статистику
    const savedStats = localStorage.getItem('productivityStats');
    if (savedStats) {
        const stats = JSON.parse(savedStats);
        sessionCount = stats.sessionCount || 0;
        totalTimeSeconds = stats.totalTimeSeconds || 0;
        seaSessionCount = stats.seaSessionCount || 0;
        seaTotalTimeSeconds = stats.seaTotalTimeSeconds || 0;
        runSessionCount = stats.runSessionCount || 0;
        runTotalTimeSeconds = stats.runTotalTimeSeconds || 0;
        updateStats();
    }
}

function saveData() {
    const stats = {
        sessionCount,
        totalTimeSeconds,
        seaSessionCount,
        seaTotalTimeSeconds,
        runSessionCount,
        runTotalTimeSeconds
    };
    localStorage.setItem('productivityStats', JSON.stringify(stats));
}

// События для всех макетов
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
stopBtn.addEventListener('click', stopTimer);

if (startSeaBtn) startSeaBtn.addEventListener('click', startTimer);
if (resetSeaBtn) resetSeaBtn.addEventListener('click', resetTimer);
if (stopSeaBtn) stopSeaBtn.addEventListener('click', stopTimer);

if (startRunBtn) startRunBtn.addEventListener('click', startTimer);
if (resetRunBtn) resetRunBtn.addEventListener('click', resetTimer);
if (stopRunBtn) stopRunBtn.addEventListener('click', stopTimer);

timeButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Убрать active со всех кнопок времени в текущем макете
        let parentSelector = '';
        if (this.closest('.timechoose')) parentSelector = '.timechoose button';
        else if (this.closest('.sea-time-buttons')) parentSelector = '.sea-time-buttons button';
        else if (this.closest('.distance-buttons')) parentSelector = '.distance-buttons button';
        
        if (parentSelector) {
            document.querySelectorAll(parentSelector).forEach(btn => btn.classList.remove('active'));
        }
        
        this.classList.add('active');

        if (!isRunning) {
            initialTime = parseInt(this.dataset.time);
            totalSeconds = initialTime;
            updateTimerDisplay();
        }
    });
});

// Модальное окно
openPlantModalBtn.addEventListener('click', function() {
    plantModal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', function() {
    plantModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === plantModal) {
        plantModal.style.display = 'none';
    }
});

plantOptions.forEach(option => {
    option.addEventListener('click', function() {
        plantOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');

        const plantType = this.dataset.plant;
        const plantName = this.querySelector('h3').textContent;
        selectedPlantSpan.textContent = plantName;

        // Обновить все кнопки открытия модального окна
        document.querySelectorAll('#openPlantModal').forEach(btn => {
            btn.innerHTML = `<i class="fas fa-palette"></i> ${plantName} ✓`;
        });

        // Переключить макет
        switchLayout(plantType);
        
        // Обновить изображения растения (только для Narcissus)
        if (plantType === 'narcissus') {
            updatePlantImages(plantType);
        }
        
        // Воспроизвести музыку
        PlayMusic(plantType);
        
        // Анимация подтверждения
        document.querySelectorAll('#openPlantModal').forEach(btn => {
            btn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);
        });
        
        // Закрыть модальное окно через секунду
        setTimeout(() => {
            plantModal.style.display = 'none';
        }, 1000);
        
        // Сохранить данные
        saveData();
    });
});

function updatePlantImages(plantType) {
    const plantImages = {
        narcissus: [
            'img/plant1.png',
            'img/plant1_2.png',
            'img/plant1_3.png',
            'img/plant1_4.png'
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

// Горячие клавиши
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

// Автосохранение каждые 30 секунд
setInterval(saveData, 30000);

// Сохранить при закрытии страницы
window.addEventListener('beforeunload', saveData);
