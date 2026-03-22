// Admin Dashboard Script

// Laad boekingen
function loadBookings() {
    fetch('/api/bookings')
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('bookings-body');
            tbody.innerHTML = '';
            data.forEach(booking => {
                const row = `
                    <tr>
                        <td>${booking.guestName}</td>
                        <td>${booking.room}</td>
                        <td>${booking.checkin}</td>
                        <td>${booking.checkout}</td>
                        <td><span class="status ${booking.status}">${booking.status}</span></td>
                        <td>
                            <button onclick="editBooking(${booking.id})">Wijzigen</button>
                            <button onclick="deleteBooking(${booking.id})">Verwijderen</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        });
}

// Laad kamers
function loadRooms() {
    const rooms = ['Kamer 1', 'Kamer 2', 'Kamer 3', 'Kamer 4', 'Kamer 5', 'Kamer 6'];
    const grid = document.getElementById('rooms-grid');
    grid.innerHTML = '';
    
    rooms.forEach(room => {
        const card = `
            <div class="room-card">
                <h3>${room}</h3>
                <p>Beschikbaar</p>
                <button onclick="manageRoom('${room}')">Beheren</button>
            </div>
        `;
        grid.innerHTML += card;
    });
}

function editBooking(id) {
    alert('Boeking ' + id + ' wijzigen');
}

function deleteBooking(id) {
    if (confirm('Weet u zeker dat u deze boeking wilt verwijderen?')) {
        alert('Boeking verwijderd');
        loadBookings();
    }
}

function manageRoom(room) {
    alert('Beheren: ' + room);
}

document.getElementById('pricing-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const date = document.getElementById('price-date').value;
    const price = document.getElementById('price-amount').value;
    alert(`Prijs opgeslagen voor ${date}: €${price}`);
    this.reset();
});

// Initialiseren
loadBookings();
loadRooms();
