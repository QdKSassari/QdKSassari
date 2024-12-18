// Smooth scrolling per i link di navigazione
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Gestione form di contatto
document.querySelector('.hero-content .cta-button')?.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#contatti').scrollIntoView({
        behavior: 'smooth'
    });
});

// Aggiungi questa funzione per caricare gli eventi
function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    
    const eventsData = {
        "events": [
            {
                "day": "SAB",
                "number": "07",
                "month": "DIC",
                "title": "Karaoke & Cozze - Special Event",
                "location": "Black&White",
                "time": "13:00",
                "description": "Pranzo con karaoke e cozze fresche"
            }
        ]
    };

    try {
        eventsContainer.innerHTML = '';
        
        if (eventsData.events.length === 0) {
            eventsContainer.innerHTML = '<p class="no-events">Nessun evento programmato</p>';
            return;
        }
        
        eventsData.events.forEach(event => {
            const eventCard = `
                <div class="event-card">
                    <div class="event-date">
                        <span class="day">${event.day}</span>
                        <span class="number">${event.number}</span>
                        <span class="month">${event.month}</span>
                    </div>
                    <div class="event-info">
                        <h3>${event.title}</h3>
                        <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                        <p><i class="far fa-clock"></i> Dalle ${event.time}</p>
                        ${event.description ? `<p><i class="fas fa-info-circle"></i> ${event.description}</p>` : ''}
                    </div>
                </div>
            `;
            eventsContainer.innerHTML += eventCard;
        });
    } catch (error) {
        console.error('Errore nel caricamento degli eventi:', error);
        eventsContainer.innerHTML = '<p class="no-events">Nessun evento programmato</p>';
    }
}

// Aggiungi questa riga alla fine del file
document.addEventListener('DOMContentLoaded', loadEvents);

// Aggiungi queste funzioni per la gestione del lightbox
let currentImageIndex = 0;
const galleryImages = document.querySelectorAll('.gallery-item img');

function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const clickedImg = element.querySelector('img');
    
    lightboxImg.src = clickedImg.src;
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Trova l'indice dell'immagine corrente
    currentImageIndex = Array.from(galleryImages).indexOf(clickedImg);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    // Gestione loop circolare
    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }
    
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = galleryImages[currentImageIndex].src;
}

// Chiudi lightbox con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Funzione per caricare le foto da Instagram
async function loadInstagramFeed() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const accessToken = 'IL_TUO_ACCESS_TOKEN';
    const userId = 'IL_TUO_USER_ID';
    
    try {
        const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${accessToken}`);
        const data = await response.json();
        
        galleryGrid.innerHTML = ''; // Pulisce la galleria esistente
        
        data.data.forEach(post => {
            if (post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM') {
                const galleryItem = `
                    <div class="gallery-item" onclick="openLightbox(this)">
                        <img src="${post.media_url}" alt="${post.caption || 'Foto Instagram'}" loading="lazy">
                        <div class="gallery-overlay">
                            <i class="fas fa-expand"></i>
                        </div>
                    </div>
                `;
                galleryGrid.innerHTML += galleryItem;
            }
        });
    } catch (error) {
        console.error('Errore nel caricamento delle foto da Instagram:', error);
    }
}

// Aggiungi questo codice per gestire il menu mobile
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
});

// Chiudi il menu quando si clicca su un link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Animate sections on scroll
const observerOptions = {
    root: null,
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.section > *').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
});