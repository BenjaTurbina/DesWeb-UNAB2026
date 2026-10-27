/* Interfaz de acceso. Integración visual: conectar auth:submit a tu backend.
   No se almacenan contraseñas ni se simula un inicio de sesión. */
(() => {
    'use strict';
    const modal = document.getElementById('perfilModal');
    if (!modal) return;
    const card = modal.querySelector('#authCard');
    const status = modal.querySelector('#authStatus');
    const strength = modal.querySelector('.auth-strength');
    const password = modal.querySelector('#auth-register-password');
    const loginEmail = modal.querySelector('#auth-login-email');
    const remember = modal.querySelector('#authRemember');
    const registerForm = modal.querySelector('#authRegisterForm');
    const birthdate = modal.querySelector('#auth-register-birthdate');
    const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    birthdate.max = today;
    const panels = {
        login: modal.querySelector('.auth-login'),
        register: modal.querySelector('.auth-register'),
        reset: modal.querySelector('.auth-reset')
    };
    function setView(view, focus = true) {
        if (!panels[view]) return;
        card.dataset.authView = view;
        Object.entries(panels).forEach(([key, panel]) => {
            panel.inert = key !== view;
            panel.setAttribute('aria-hidden', String(key !== view));
        });
        panels.reset.hidden = view !== 'reset';
        ['left', 'right'].forEach(side => {
            const panel = modal.querySelector('.auth-overlay-' + side);
            const active = side === 'left' ? view === 'register' : view === 'login';
            panel.inert = !active;
            panel.setAttribute('aria-hidden', String(!active));
        });
        status.hidden = true;
        if (focus) panels[view].querySelector('input').focus({ preventScroll: true });
        // Recalcula la posición si cambia la altura del modal.
        window.bootstrap?.Modal.getInstance(modal)?.handleUpdate();
    }
    modal.querySelectorAll('button[data-auth-view]').forEach(button => {
        button.addEventListener('click', () => setView(button.dataset.authView));
    });
    modal.querySelectorAll('[data-auth-password]').forEach(button => {
        button.addEventListener('click', () => {
            const input = document.getElementById(button.dataset.authPassword);
            const visible = input.type === 'password';
            input.type = visible ? 'text' : 'password';
            button.textContent = visible ? 'Ocultar' : 'Ver';
            button.setAttribute('aria-label', visible ? 'Ocultar contraseña' : 'Mostrar contraseña');
            button.setAttribute('aria-pressed', String(visible));
        });
    });
    function updateStrength() {
        const value = password.value;
        const score = value ? [value.length > 0, value.length >= 8, /[A-Z]/.test(value), /[0-9]/.test(value), /[^A-Za-z0-9]/.test(value)].filter(Boolean).length : 0;
        strength.style.setProperty('--auth-strength-width', `${score * 20}%`);
        strength.style.setProperty('--auth-strength-color', score <= 2 ? 'red' : score === 3 ? 'var(--color-naranja-2-light)' : score === 4 ? 'var(--color-azul-1-light)' : 'green');
        strength.setAttribute('aria-valuenow', String(score));
        modal.querySelector('#auth-strength-text').textContent = score === 0 ? 'Fortaleza de la contraseña' : score <= 2 ? 'Fortaleza: baja' : score === 3 ? 'Fortaleza: media' : 'Fortaleza: alta';
    }
    password.addEventListener('input', updateStrength);
    registerForm.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => input.setCustomValidity(''));
        input.addEventListener('change', () => input.setCustomValidity(''));
    });

    function validateRegistration() {
        const run = modal.querySelector('#auth-register-run');
        const compactRun = run.value.replace(/[.\s-]/g, '').toUpperCase();
        const validRunFormat = /^[0-9]{1,8}[0-9K]$/.test(compactRun);
        run.setCustomValidity(validRunFormat ? '' : 'Escribe el RUN con su dígito verificador, por ejemplo 12.345.678-5.');
        if (validRunFormat) run.value = compactRun.slice(0, -1) + '-' + compactRun.slice(-1);
        ['name', 'address', 'commune', 'province', 'region'].forEach(field => {
            const input = modal.querySelector('#auth-register-' + field);
            input.value = input.value.trim();
            input.setCustomValidity(input.value ? '' : 'Completa este dato.');
        });
        const phone = modal.querySelector('#auth-register-phone');
        const digits = phone.value.replace(/\D/g, '');
        const validPhone = /^\+?[0-9 ()-]+$/.test(phone.value.trim()) && digits.length >= 8 && digits.length <= 15;
        phone.setCustomValidity(validPhone ? '' : 'Escribe un número telefónico válido.');
        birthdate.setCustomValidity(birthdate.value && birthdate.value <= today ? '' : 'Selecciona una fecha de nacimiento válida.');
        return registerForm.reportValidity();
    }
    try {
        const email = localStorage.getItem('sandwichdv.rememberedEmail');
        if (email) { loginEmail.value = email; remember.checked = true; }
    } catch (_) { /* La interfaz funciona también con almacenamiento bloqueado. */ }
    Object.entries(panels).forEach(([view, panel]) => {
        const form = panel.querySelector('form');
        form.addEventListener('submit', event => {
            event.preventDefault();
            if (view === 'register' && !validateRegistration()) return;
            if (!form.reportValidity()) return;
            const data = Object.fromEntries(new FormData(form));
            const emailKey = `auth-${view === 'register' ? 'register' : view === 'reset' ? 'reset' : 'login'}-email`;
            data[emailKey] = data[emailKey].trim();
            if (view === 'register') {
                data['auth-register-name'] = data['auth-register-name'].trim();
                if (!data['auth-register-name']) {
                    status.textContent = 'Ingresa tu nombre.';
                    status.hidden = false;
                    return;
                }
            }
            if (view === 'login') {
                data.rememberEmail = remember.checked;
                try {
                    if (remember.checked) localStorage.setItem('sandwichdv.rememberedEmail', data[emailKey]);
                    else localStorage.removeItem('sandwichdv.rememberedEmail');
                } catch (_) {}
            }
            // Un controlador externo puede escuchar este evento y llamar
            // preventDefault() para reemplazar el aviso por su conexión al servidor.
            const request = new CustomEvent('auth:submit', {
                bubbles: true, cancelable: true, detail: { action: view, data, form }
            });
            if (form.dispatchEvent(request)) {
                status.textContent = 'El formulario está listo. Falta conectar el servidor para completar esta solicitud.';
                status.hidden = false;
            }
        });
    });
    modal.addEventListener('shown.bs.modal', event => setView(event.relatedTarget?.dataset.authOpenView === 'register' ? 'register' : 'login'));
    modal.addEventListener('hidden.bs.modal', () => {
        modal.querySelectorAll('input[type="password"], .auth-password input').forEach(input => {
            input.value = '';
            input.type = 'password';
        });
        modal.querySelectorAll('[data-auth-password]').forEach(button => {
            button.textContent = 'Ver';
            button.setAttribute('aria-label', 'Mostrar contraseña');
            button.setAttribute('aria-pressed', 'false');
        });
        updateStrength();
        setView('login', false);
    });
})();
