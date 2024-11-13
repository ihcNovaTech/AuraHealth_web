const reminders = [
    { title: "Chequeo médico", date: "10 de septiembre, 2024", time: "08:00 AM" },
    { title: "Pastillas", date: "15 de septiembre, 2024", time: "11:00 AM" },
    { title: "Exámenes", date: "17 de septiembre, 2024", time: "6:30 PM" },
];

function loadReminders() {
    const reminderList = document.getElementById("reminderItems");
    reminderList.innerHTML = ""; // Limpiar lista antes de cargar
    reminders.forEach((reminder) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<span>${reminder.title} - ${reminder.date}, ${reminder.time}</span>
                              <input type="checkbox">`;
        reminderList.appendChild(listItem);
    });
}

function openModal() {
    document.getElementById("reminderModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("reminderModal").style.display = "none";
    document.getElementById("reminderForm").reset();
    removeSelectedDayHighlight();
}

function saveReminder() {
    const title = document.getElementById("reminderTitle").value;
    const date = document.getElementById("reminderDate").value;
    const time = document.getElementById("reminderTime").value;
    
    if (title && date && time) {
        const formattedDate = new Date(date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
        reminders.push({ title, date: formattedDate, time });
        
        const listItem = document.createElement("li");
        listItem.innerHTML = `<span>${title} - ${formattedDate}, ${time}</span>
                              <input type="checkbox">`;
        document.getElementById("reminderItems").appendChild(listItem);
        
        closeModal();
    } else {
        alert("Por favor, complete todos los campos.");
    }
}

document.addEventListener("DOMContentLoaded", loadReminders);

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDayElement = null; // Variable para almacenar el elemento seleccionado

function loadCalendar() {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const daysInWeek = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

    const calendarDays = document.getElementById("calendarDays");
    const monthYear = document.getElementById("monthYear");

    // Limpiar el calendario
    calendarDays.innerHTML = "";

    // Establecer el mes y año en el encabezado
    monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    // Agregar nombres de días
    daysInWeek.forEach(day => {
        const dayHeader = document.createElement("div");
        dayHeader.textContent = day;
        dayHeader.classList.add("dayName");
        calendarDays.appendChild(dayHeader);
    });

    // Obtener primer día del mes y número de días en el mes
    const firstDay = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Ajuste para comenzar el lunes
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Agregar celdas vacías al inicio
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        calendarDays.appendChild(emptyCell);
    }

    // Agregar días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.textContent = day;

        // Marcar el día actual
        const today = new Date();
        if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayCell.classList.add("today");
        }

        dayCell.onclick = () => selectDate(dayCell, day); // Selección de fecha
        calendarDays.appendChild(dayCell);
    }
}

function prevMonth() {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear -= 1;
    } else {
        currentMonth -= 1;
    }
    loadCalendar();
}

function nextMonth() {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear += 1;
    } else {
        currentMonth += 1;
    }
    loadCalendar();
}

function selectDate(dayCell, day) {
    const selectedDate = new Date(currentYear, currentMonth, day);
    if (!isNaN(selectedDate)) { // Validar fecha seleccionada
        document.getElementById("reminderDate").value = selectedDate.toISOString().split("T")[0];

        // Quitar el sombreado del día previamente seleccionado
        if (selectedDayElement) {
            selectedDayElement.classList.remove("selected-day");
        }

        // Sombrear el nuevo día seleccionado
        dayCell.classList.add("selected-day");
        selectedDayElement = dayCell;
    }
}

function removeSelectedDayHighlight() {
    if (selectedDayElement) {
        selectedDayElement.classList.remove("selected-day");
        selectedDayElement = null;
    }
}

// Cargar el calendario cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
    loadCalendar();
});
