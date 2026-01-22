
class AudiMenu {
    constructor() {
        this.menuIcon = document.getElementById('menu-icon');
        this.navMenu = document.getElementById('nav-menu');
        this.closeIcon = document.getElementById('close-icon');
        this.links = document.querySelectorAll('.nav-menu a');
        this.form = document.querySelector('.formulario');

        if (this.menuIcon && this.navMenu) {
            this.initMenu();
        }
        if (this.form) {
            this.initForm();
        }
    }

    openMenu() {
        this.navMenu.classList.add('active');
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
    }

    initMenu() {
        this.menuIcon.addEventListener('click', () => this.openMenu());

        if (this.closeIcon) {
            this.closeIcon.addEventListener('click', () => this.closeMenu());
        }

        this.links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    initForm() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
           
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const mensaje = document.getElementById('mensaje').value;

            if (nombre && email && mensaje) {
                alert(`Gracias ${nombre}, hemos recibido tu mensaje.`);
                this.form.reset();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AudiMenu();
});
