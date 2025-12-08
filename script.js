// ============================
// GESTION DE LA MUSIQUE
// ============================
const audio = document.getElementById('background-music');
const playBtn = document.getElementById('play-music-btn');
const muteBtn = document.getElementById('mute-music-btn');
const unmuteBtn = document.getElementById('unmute-music-btn');
const volumeSlider = document.getElementById('volume-slider');
const activateAudioBtn = document.getElementById('activate-audio-btn');
const audioPopup = document.getElementById('audio-popup');

// Variables globales pour le livre
const book = document.querySelector("#book");
const allPapers = document.querySelectorAll(".paper");
const nextButtons = document.querySelectorAll(".next-btn");
const prevButtons = document.querySelectorAll(".prev-btn");
const numOfPapers = allPapers.length;
const maxLocation = numOfPapers + 1;
let currentLocation = 1;

// Initialiser les pages
function initializePages() {
    allPapers.forEach((paper, index) => {
        paper.style.zIndex = (numOfPapers - index) + numOfPapers;
    });
}

// Gestion des boutons de navigation
nextButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        goNextPage();
    });
});

prevButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        goPrevPage();
    });
});

// Fonctions de navigation
function openBook() {
    book.style.transform = "translateX(50%)";
}

function closeBook() {
    book.style.transform = "translateX(0%)";
}

function goNextPage() {
    if (currentLocation < maxLocation) {
        if (currentLocation === 1) {
            openBook();
        }
        const paperToFlip = document.querySelector(`#p${currentLocation}`);
        paperToFlip.classList.add("flipped");
        setTimeout(() => {
            paperToFlip.style.zIndex = currentLocation;
        }, 600);
        currentLocation++;
        updateResponsive();
    }
}

function goPrevPage() {
    if (currentLocation > 1) {
        currentLocation--;
        const paperToUnflip = document.querySelector(`#p${currentLocation}`);
        paperToUnflip.classList.remove("flipped");
        paperToUnflip.style.zIndex = (numOfPapers - (currentLocation - 1)) + numOfPapers;
        if (currentLocation === 1) {
            closeBook();
        }
        updateResponsive();
    }
}

// ============================
// FONCTIONS AUDIO
// ============================

// Afficher le popup au chargement
window.addEventListener('load', function() {
    const audioAllowed = localStorage.getItem('audioAllowed');
    if (!audioAllowed) {
        setTimeout(() => {
            audioPopup.style.display = 'flex';
        }, 1000);
    } else {
        startAudio();
    }
    initializePages();
    handleResponsive();
});

// Activer l'audio via le popup
activateAudioBtn.addEventListener('click', function() {
    localStorage.setItem('audioAllowed', 'true');
    audioPopup.style.display = 'none';
    startAudio();
    
    // Son de confirmation
    const clickSound = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQ=');
    clickSound.volume = 0.3;
    clickSound.play();
});

// Démarrer l'audio
function startAudio() {
    audio.volume = 0.7;
    audio.play().then(() => {
        console.log("Musique démarrée avec succès");
        playBtn.style.display = 'none';
        muteBtn.style.display = 'flex';
        unmuteBtn.style.display = 'none';
    }).catch(error => {
        console.log("Erreur de lecture audio:", error);
        
        // Activer l'audio au prochain clic
        const enableAudioOnClick = function() {
            audio.play();
            document.removeEventListener('click', enableAudioOnClick);
        };
        document.addEventListener('click', enableAudioOnClick);
    });
}

// Contrôles audio
playBtn.addEventListener('click', function() {
    startAudio();
});

muteBtn.addEventListener('click', function() {
    audio.muted = true;
    muteBtn.style.display = 'none';
    unmuteBtn.style.display = 'flex';
});

unmuteBtn.addEventListener('click', function() {
    audio.muted = false;
    unmuteBtn.style.display = 'none';
    muteBtn.style.display = 'flex';
});

volumeSlider.addEventListener('input', function() {
    audio.volume = this.value;
});

// ============================
// RESPONSIVE FUNCTIONALITY
// ============================

function handleResponsive() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        book.style.transform = "translateX(0)";
        book.style.perspective = "1500px";
        
        // Ajuster les boutons sur mobile
        document.querySelectorAll('.next-btn, .prev-btn').forEach(btn => {
            btn.style.padding = '8px 15px';
            btn.style.fontSize = '0.85rem';
        });
        
        // Ajuster les z-index pour mobile
        adjustZIndexForMobile();
    } else {
        book.style.perspective = "2000px";
    }
    
    // Ajuster la taille des images
    adjustImagesSize();
}

function adjustZIndexForMobile() {
    if (window.innerWidth <= 768) {
        allPapers.forEach((paper, index) => {
            paper.style.zIndex = (numOfPapers - index) * 10;
        });
    }
}

function adjustImagesSize() {
    const images = document.querySelectorAll('.cover-image, .page-image');
    const isMobile = window.innerWidth <= 768;
    
    images.forEach(img => {
        if (isMobile) {
            img.style.maxWidth = '95%';
            img.style.maxHeight = '80%';
        } else {
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
        }
    });
}

function updateResponsive() {
    handleResponsive();
    adjustImagesSize();
}

// Gestion du redimensionnement
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        handleResponsive();
    }, 250);
});

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    handleResponsive();
    
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            alert("Menu mobile - Fonctionnalité à personnaliser");
        });
    }
    
    // Gestion de l'orientation
    window.addEventListener("orientationchange", function() {
        setTimeout(handleResponsive, 100);
    });
    
    // Démarrer l'audio si déjà autorisé
    const audioAllowed = localStorage.getItem('audioAllowed');
    if (audioAllowed && audio.paused) {
        document.addEventListener('click', function initAudio() {
            audio.play().catch(e => console.log("Auto-play bloqué:", e));
            document.removeEventListener('click', initAudio);
        });
    }
});