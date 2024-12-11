// Definisci sendToWhatsApp come funzione globale
window.sendToWhatsApp = function() {
    const basePrice = document.getElementById('base-price').textContent;
    const extrasPrice = document.getElementById('extras-price').textContent;
    const dayMarkup = document.getElementById('day-markup').textContent;
    const discount = document.getElementById('discount').textContent;
    const travelCost = document.getElementById('travel-cost').textContent;
    const finalPrice = document.getElementById('final-price').textContent;
    const pricePerNight = document.getElementById('price-per-night')?.textContent;
    
    // Ottieni i dettagli del pacchetto selezionato
    const basePackageSelect = document.getElementById('base-package');
    const packageTypeSelect = document.getElementById('package-type');
    const dayTypeSelect = document.getElementById('day-type');
    const distance = document.getElementById('distance').value;
    
    const basePackageName = basePackageSelect.options[basePackageSelect.selectedIndex].text;
    const packageType = packageTypeSelect.options[packageTypeSelect.selectedIndex].text;
    const dayType = packageType === 'Singola Serata' ? 
        dayTypeSelect.options[dayTypeSelect.selectedIndex].text : 'N/A';
    
    // Raccogli gli extra selezionati
    const extras = Array.from(document.querySelectorAll('.extra:checked'))
        .map(extra => extra.parentElement.textContent.trim())
        .join('\n- ');

    // Componi il messaggio
    let message = `🎤 *Preventivo Karaoke QDK*\n\n`;
    message += `📦 *Pacchetto:* ${basePackageName}\n`;
    message += `📅 *Tipo:* ${packageType}\n`;
    if (packageType === 'Singola Serata') {
        message += `📆 *Giorno:* ${dayType}\n`;
    }
    if (extras) {
        message += `\n✨ *Extra inclusi:*\n- ${extras}\n`;
    }
    if (distance > 20) {
        message += `\n🚗 *Distanza:* ${distance}km\n`;
    }
    
    message += `\n💰 *Riepilogo Costi:*\n`;
    message += `Base: ${basePrice}€\n`;
    if (parseInt(extrasPrice) > 0) message += `Extra: ${extrasPrice}€\n`;
    if (parseInt(dayMarkup) > 0) message += `Maggiorazione: ${dayMarkup}€\n`;
    if (parseInt(discount) > 0) message += `Sconto: -${discount}€\n`;
    if (parseInt(travelCost) > 0) message += `Rimborso km: ${travelCost}€\n`;
    
    message += `\n*Totale: ${finalPrice}€*`;
    if (pricePerNight) {
        message += `\n*Prezzo per serata: ${pricePerNight}€*`;
    }
    
    message += `\n\n📝 Desidero prenotare questo pacchetto!`;

    // Codifica il messaggio per l'URL
    const encodedMessage = encodeURIComponent(message);
    
    // Numero di telefono QDK
    const phoneNumber = '393426631365';
    
    // Crea e apri il link WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
};

document.addEventListener('DOMContentLoaded', function() {
    // Funzione principale di calcolo
    function calculatePrice() {
        try {
            const basePrice = parseInt(document.getElementById('base-package').value) || 0;
            const packageType = document.getElementById('package-type').value;
            const dayType = packageType === 'single' ? 
                (parseFloat(document.getElementById('day-type').value) || 1) : 1;
            const distance = parseInt(document.getElementById('distance').value) || 0;
            
            // Determina il numero di serate del pacchetto
            const numSerate = packageType.includes('month') ? 4 : 
                             packageType.includes('quarter') ? 12 : 1;
            
            let finalPrice = basePrice;
            let dayMarkup = 0;
            let discount = 0;
            let extrasTotal = 0;
            let travelCost = 0;
            
            // Calcola maggiorazione giorno
            if (dayType > 1) {
                dayMarkup = Math.round((basePrice * (dayType - 1)));
                finalPrice += dayMarkup;
            }
            
            // Calcola extra
            document.querySelectorAll('.extra:checked').forEach(extra => {
                if (!extra.disabled) {
                    const extraValue = parseInt(extra.value) || 0;
                    extrasTotal += extraValue;
                }
            });
            finalPrice += extrasTotal;
            
            // Calcola sconto pacchetto
            if (packageType !== 'single') {
                const discounts = {
                    'infra-month': 0.15,
                    'infra-quarter': 0.25,
                    'weekend-month': 0.10,
                    'weekend-quarter': 0.15,
                    'mixed-month': 0.12,
                    'mixed-quarter': 0.20
                };
                const discountPercentage = discounts[packageType] || 0;
                discount = Math.round(finalPrice * discountPercentage);
                finalPrice -= discount;
            }
            
            // Calcola rimborso km
            if (distance > 20) {
                const extraKm = distance - 20;
                travelCost = Math.round(extraKm * 0.3 * 2);
                finalPrice += travelCost;
            }
            
            // Calcola prezzi per pacchetti multipli
            if (packageType !== 'single') {
                // Prezzo totale del pacchetto (arrotondato alla decina)
                const totalPackagePrice = Math.round((finalPrice * numSerate) / 10) * 10;
                // Prezzo per singola serata (arrotondato all'unità)
                const pricePerNight = Math.round(totalPackagePrice / numSerate);
                
                // Aggiorna i display
                document.getElementById('final-price').textContent = totalPackagePrice;
                document.getElementById('price-per-night').textContent = pricePerNight;
                
                // Aggiorna il breakdown con i valori totali del pacchetto
                document.getElementById('base-price').textContent = basePrice * numSerate;
                document.getElementById('extras-price').textContent = extrasTotal * numSerate;
                document.getElementById('day-markup').textContent = dayMarkup * numSerate;
                document.getElementById('discount').textContent = discount * numSerate;
                document.getElementById('travel-cost').textContent = travelCost * numSerate;
            } else {
                // Per serata singola, arrotonda alla decina
                finalPrice = Math.round(finalPrice / 10) * 10;
                
                // Aggiorna i display per serata singola
                document.getElementById('final-price').textContent = finalPrice;
                document.getElementById('base-price').textContent = basePrice;
                document.getElementById('extras-price').textContent = extrasTotal;
                document.getElementById('day-markup').textContent = dayMarkup;
                document.getElementById('discount').textContent = discount;
                document.getElementById('travel-cost').textContent = travelCost;
            }
        } catch (error) {
            console.error('Errore nel calcolo:', error);
        }
    }

    // Gestione servizi inclusi
    function handleIncludedServices() {
        const basePackage = document.getElementById('base-package').value;
        const extraHour = document.querySelector('.extra[value="30"]'); // Ora aggiuntiva
        
        document.querySelectorAll('.extra').forEach(extra => {
            const includedIn = extra.dataset.includedIn?.split(',') || [];
            
            // Gestione ora aggiuntiva
            if (extra === extraHour) {
                if (basePackage === '120' || basePackage === '180') {
                    extra.checked = true;
                    extra.disabled = true;
                } else {
                    extra.disabled = false;
                    extra.checked = false;
                }
                return;
            }
            
            // Gestione altri extra
            if (basePackage === '120' && includedIn.includes('standard')) {
                extra.checked = true;
                extra.disabled = true;
            } else if (basePackage === '180' && includedIn.includes('premium')) {
                extra.checked = true;
                extra.disabled = true;
            } else {
                extra.disabled = false;
                extra.checked = false;
            }
        });
    }

    // Aggiorna info pacchetto e gestisce visibilità del selettore giorni
    function updatePackageInfo() {
        const packageType = document.getElementById('package-type').value;
        const infoElement = document.getElementById('package-info');
        const dayTypeGroup = document.querySelector('.form-group:has(#day-type)');
        
        // Gestisci visibilità del selettore giorni
        if (packageType === 'single') {
            dayTypeGroup.style.display = 'block';
        } else {
            dayTypeGroup.style.display = 'none';
            document.getElementById('day-type').value = '1';
        }
        
        // Aggiorna info pacchetto con limiti più flessibili
        let info = '';
        if (packageType.includes('weekend')) {
            info = packageType.includes('month') ? 
                'Massimo 3 sabati al mese' : // Aumentato da 2 a 3
                'Massimo 4 sabati nel trimestre'; // Aumentato da 3 a 4
        } else if (packageType.includes('mixed')) {
            info = packageType.includes('month') ? 
                'Massimo 1 sabato e 2 venerdì al mese' : 
                'Massimo 4 sabati e 6 venerdì nel trimestre'; // Aumentato da 3/5 a 4/6
        } else if (packageType.includes('infra')) {
            info = 'Valido solo da lunedì a giovedì';
        }
        
        infoElement.textContent = info;

        // Mostra/nascondi il prezzo per serata
        const perNightContainer = document.getElementById('per-night-container');
        if (packageType !== 'single') {
            perNightContainer.style.display = 'block';
        } else {
            perNightContainer.style.display = 'none';
        }
    }

    // Inizializzazione
    handleIncludedServices();
    updatePackageInfo();

    // Event Listeners
    document.getElementById('calculate-btn').addEventListener('click', function() {
        calculatePrice();
        // Aggiungi animazione al box del risultato
        const priceDisplay = document.querySelector('.price-display');
        priceDisplay.classList.add('updated');
        setTimeout(() => {
            priceDisplay.classList.remove('updated');
        }, 1000);
    });
    document.getElementById('base-package').addEventListener('change', handleIncludedServices);
    document.getElementById('package-type').addEventListener('change', updatePackageInfo);

    // Aggiungi CSS per l'animazione di fade
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .form-group {
                transition: all 0.3s ease;
            }
            .form-group:has(#day-type) {
                overflow: hidden;
                max-height: 200px;
                opacity: 1;
            }
            .form-group:has(#day-type)[style*="display: none"] {
                max-height: 0;
                opacity: 0;
                margin: 0;
            }
        </style>
    `);
}); 