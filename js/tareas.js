class Tarea {
    constructor(id, titulo, categoria, estado, fecha) {
        this.id = id;
        this.titulo = titulo;
        this.categoria = categoria;
        this.estado = estado;
        this.fecha = fecha;
    }
}

class GestorDeTareas {
    constructor() {
        const data = JSON.parse(localStorage.getItem('audi_tareas')) || [];
        this.tickets = data.map(t => new Tarea(t.id, t.titulo, t.categoria, t.estado, t.fecha));

        this.listaUl = document.getElementById('task-grid');
        this.inputTitulo = document.getElementById('tituloTarea');
        this.selectCat = document.getElementById('categoriaTarea');
        this.selectEst = document.getElementById('estadoOperativo');
        this.inputFecha = document.getElementById('fechaLimite');
        this.editId = document.getElementById('edit-id');
        this.formTitle = document.getElementById('form-title');
        this.btnAgregar = document.getElementById('btn-audi');
        this.btnCancelar = document.getElementById('btn-cancel');
        this.btnBorrarTodo = document.getElementById('btn-borrar-todo');
        this.formCard = document.getElementById('form-card');
        this.errorMsg = document.getElementById('error-msg');

        this.btnAgregar.onclick = () => this.procesarTicket();
        this.btnCancelar.onclick = () => this.cancelarEdicion();
        if (this.btnBorrarTodo) {
            this.btnBorrarTodo.onclick = () => this.borrarTodas();
        }

        this.render();
    }

    procesarTicket() {
        const id = this.editId.value;
        const titulo = this.inputTitulo.value.trim();
        const fecha = this.inputFecha.value;

        if (!titulo || !fecha) {
            this.errorMsg.style.display = "block";
            setTimeout(() => this.errorMsg.style.display = "none", 3000);
            return;
        }

        if (id) {
            const index = this.tickets.findIndex(t => t.id == id);
            this.tickets[index] = new Tarea(
                Number(id),
                titulo,
                this.selectCat.value,
                this.selectEst.value,
                fecha
            );
        } else {
            const nueva = new Tarea(
                Date.now(),
                titulo,
                this.selectCat.value,
                this.selectEst.value,
                fecha
            );
            this.tickets.push(nueva);
        }

        this.sincronizar();
        this.cancelarEdicion();
    }

    editarTicket(id) {
        const ticket = this.tickets.find(t => t.id == id);
        if (!ticket) return;

        this.editId.value = ticket.id;
        this.inputTitulo.value = ticket.titulo;
        this.selectCat.value = ticket.categoria;
        this.selectEst.value = ticket.estado;
        this.inputFecha.value = ticket.fecha;

        this.formTitle.innerText = "Editando Ticket";
        this.formCard.classList.add('editing');
        this.btnCancelar.style.display = "block";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    cancelarEdicion() {
        this.editId.value = "";
        this.inputTitulo.value = "";
        this.inputFecha.value = "";
        this.selectEst.value = "Sin Iniciar";
        this.formTitle.innerText = "Gestor de Tareas";
        this.formCard.classList.remove('editing');
        this.btnCancelar.style.display = "none";
    }

    eliminarTicket(id) {
        if (confirm("¿Eliminar este ticket?")) {
            this.tickets = this.tickets.filter(t => t.id != id);
            this.sincronizar();
        }
    }

    toggleEstado(id) {
        const ticket = this.tickets.find(t => t.id == id);
        if (!ticket) return;
        ticket.estado = ticket.estado === "Finalizado" ? "En Progreso" : "Finalizado";
        this.sincronizar();
    }

    borrarTodas() {
        if (confirm("¿Desea borrar todas las tareas?")) {
            this.tickets = [];
            this.sincronizar();
        }
    }

    sincronizar() {
        localStorage.setItem('audi_tareas', JSON.stringify(this.tickets));
        this.render();
    }

    render() {
        if (!this.listaUl) return;
        this.listaUl.innerHTML = '';

        this.tickets.forEach(t => {
            const li = document.createElement('li');
            li.className = 'task-card';
            if (t.estado === "Finalizado") li.classList.add('completada');

            const dotClass = `dot-${t.categoria}`;

            li.innerHTML = `
                <div class="task-header">
                    <span class="category-label">${t.categoria}</span>
                    <span class="status-label">
                        <i class="fa-solid fa-circle ${dotClass}"></i> ${t.estado}
                    </span>
                </div>
                <h3>${t.titulo}</h3>
                <div class="task-footer">
                    <span class="date-text">
                        <i class="fa-regular fa-calendar"></i> ${t.fecha}
                    </span>
                    <div class="task-actions">
                        <button class="btn-sm toggle-btn" data-id="${t.id}" data-action="toggle">
                            <i class="fa-solid fa-check"></i>
                        </button>
                        <button class="btn-sm edit-btn" data-id="${t.id}" data-action="edit">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn-sm delete-btn" data-id="${t.id}" data-action="delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;

            li.querySelectorAll('button').forEach(btn => {
                btn.onclick = (e) => {
                    const id = e.currentTarget.dataset.id;
                    const action = e.currentTarget.dataset.action;
                    if (action === 'toggle') this.toggleEstado(id);
                    if (action === 'edit') this.editarTicket(id);
                    if (action === 'delete') this.eliminarTicket(id);
                };
            });

            this.listaUl.appendChild(li);
        });
    }
}

class AudiMenu {
    constructor() {
        this.menuIcon = document.getElementById('menu-icon');
        this.navMenu = document.getElementById('nav-menu');
        this.closeIcon = document.getElementById('close-icon');
        this.links = document.querySelectorAll('#nav-menu-list a');

        if (this.menuIcon && this.navMenu) this.init();
    }

    openMenu() { this.navMenu.classList.add('active'); }
    closeMenu() { this.navMenu.classList.remove('active'); }

    init() {
        this.menuIcon.onclick = () => this.openMenu();
        if (this.closeIcon) this.closeIcon.onclick = () => this.closeMenu();
        this.links.forEach(link => link.onclick = () => this.closeMenu());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new GestorDeTareas();
    new AudiMenu();
});