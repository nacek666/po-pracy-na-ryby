/* 
====================================================
SCRIPT.JS
Logika:
- Sticky nawigacja + hamburger na mobile
- Płynne przewijanie do sekcji
- Countdown do daty wydarzenia
- Walidacja formularza i komunikaty
- Ustawienie bieżącego roku w stopce
==================================================== 
*/

/* 
--------------------------------------------
Ustawienie bieżącego roku w stopce
--------------------------------------------
*/
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

/* 
--------------------------------------------
Nawigacja mobilna (hamburger)
--------------------------------------------
*/
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
    });

    // Zamknięcie menu po kliknięciu w link
    mainNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            mainNav.classList.remove('open');
        }
    });
}

/* 
--------------------------------------------
Płynne przewijanie do sekcji
--------------------------------------------
*/
document.addEventListener('click', function (e) {
    const target = e.target;
    if (target.tagName === 'A' && target.getAttribute('href') && target.getAttribute('href').startsWith('#')) {
        const id = target.getAttribute('href').slice(1);
        const section = document.getElementById(id);
        if (section) {
            e.preventDefault();
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});

/* 
--------------------------------------------
COUNTDOWN DO WYDARZENIA
--------------------------------------------

Zmień niżej datę wydarzenia na aktualną:
Przykład: now Date('2027-06-30T18:00:00');

Uwaga: Upewnij się, że format daty jest poprawny
dla wszystkich przeglądarek (najbezpieczniej: YYYY-MM-DDTHH:MM:SS).
*/
const countdownElement = document.getElementById('countdown');
const countdownMessage = document.getElementById('countdown-message');

if (countdownElement) {
    // USTAW TUTAJ DATĘ WYDARZENIA
    const eventDate = new Date('2027-06-30T18:00:00');

    function updateCountdown() {
        const now = new Date();
        const diff = eventDate.getTime() - now.getTime();

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        if (diff <= 0) {
            // Jeśli czas minął
            daysEl.textContent = '0';
            hoursEl.textContent = '0';
            minutesEl.textContent = '0';
            secondsEl.textContent = '0';

            if (countdownMessage) {
                countdownMessage.textContent = 'Zawody właśnie trwają lub już się zakończyły.';
            }

            // Zatrzymujemy interwał
            clearInterval(countdownInterval);
            return;
        }

        const seconds = Math.floor(diff / 1000) % 60;
        const minutes = Math.floor(diff / 1000 / 60) % 60;
        const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
        const days = Math.floor(diff / 1000 / 60 / 60 / 24);

        daysEl.textContent = String(days);
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');

        if (countdownMessage) {
            countdownMessage.textContent = '';
        }
    }

    // Aktualizacja co sekundę
    const countdownInterval = setInterval(updateCountdown, 1000);
    // Początkowe wywołanie
    updateCountdown();
}

/* 
--------------------------------------------
WALIDACJA FORMULARZA KONTAKTOWEGO
--------------------------------------------
*/

const contactForm = document.getElementById('contact-form');
const formSuccessMessage = document.getElementById('form-success-message');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Czyścimy poprzednie błędy
        const errorMessages = contactForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => {
            msg.textContent = '';
        });
        if (formSuccessMessage) {
            formSuccessMessage.textContent = '';
        }

        // Pobieramy pola
        const nameInput = contactForm.querySelector('#name');
        const emailInput = contactForm.querySelector('#email');
        const phoneInput = contactForm.querySelector('#phone');
        const messageInput = contactForm.querySelector('#message');

        let hasError = false;

        // Pomocnicza funkcja do ustawiania błędów
        function setError(input, message) {
            const fieldName = input.getAttribute('id');
            const errorEl = contactForm.querySelector(`.error-message[data-for="${fieldName}"]`);
            if (errorEl) {
                errorEl.textContent = message;
            }
            hasError = true;
        }

        // Walidacja imienia (wymagane)
        if (!nameInput.value.trim()) {
            setError(nameInput, 'Podaj swoje imię.');
        }

        // Walidacja e-maila (wymagany + prosty regex)
        const emailValue = emailInput.value.trim();
        if (!emailValue) {
            setError(emailInput, 'Podaj swój adres e-mail.');
        } else {
            // Prosty wzorzec sprawdzający format e-mail
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailValue)) {
                setError(emailInput, 'Podaj poprawny adres e-mail.');
            }
        }

        // Walidacja telefonu (w tym projekcie wymagany)
        const phoneValue = phoneInput.value.trim();
        if (!phoneValue) {
            setError(phoneInput, 'Podaj swój numer telefonu.');
        } else {
            // Możesz doprecyzować wzorzec dla PL – poniżej prosty check cyfr
            const phoneDigits = phoneValue.replace(/\D/g, '');
            if (phoneDigits.length < 6) {
                setError(phoneInput, 'Podaj poprawny numer telefonu (co najmniej 6 cyfr).');
            }
        }

        // Wiadomość – opcjonalna, bez dodatkowej walidacji w tym projekcie

        if (!hasError) {
            // Tu normalnie wysłałbyś dane do serwera (fetch/AJAX).
            // W tym projekcie tylko symulujemy wysłanie.
            if (formSuccessMessage) {
                formSuccessMessage.textContent = 'Dziękujemy za zgłoszenie! Skontaktujemy się z Tobą w sprawie szczegółów.';
            }
            contactForm.reset();
        }
    });
}