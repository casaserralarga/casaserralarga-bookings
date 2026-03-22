// Guest Booking Script

document.getElementById('check-availability').addEventListener('click', function() {
    const checkin = document.getElementById('check-in').value;
    const checkout = document.getElementById('check-out').value;
    const roomType = document.getElementById('room-type').value;

    if (!checkin || !checkout) {
        alert('Vul alstublieft beide datums in');
        return;
    }

    // Bereken aantal nachten
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const nights = (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24);

    if (nights <= 0) {
        alert('Vertrekdatum moet na aankomstdatum liggen');
        return;
    }

    // Basisprijs per nacht
    const basePrices = {
        'single': 50,
        'double': 75,
        'suite': 120
    };

    const pricePerNight = basePrices[roomType];
    const totalPrice = pricePerNight * nights;

    document.getElementById('price').innerHTML = `
        <p>Kamertype: <strong>${roomType === 'single' ? 'Eenpersoon' : roomType === 'double' ? 'Tweepersoon' : 'Suite'}</strong></p>
        <p>Aantal nachten: <strong>${nights}</strong></p>
        <p>Prijs per nacht: <strong>€${pricePerNight.toFixed(2)}</strong></p>
        <p>Totaal: <strong>€${totalPrice.toFixed(2)}</strong></p>
        <button onclick="makeBooking()">Boeken</button>
    `;

    document.getElementById('result').classList.remove('hidden');
});

function makeBooking() {
    alert('Boeking succesvol! U ontvangt een bevestigingsmail op uw emailadres.');
    document.getElementById('booking-form').reset();
    document.getElementById('result').classList.add('hidden');
}
