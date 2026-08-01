// coordinates show.ejs se aa rahe hain

const map = L.map("map").setView(
    [coordinates[1], coordinates[0]],
    13
);

// OpenStreetMap Tile Layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);


// Custom Marker Icon
const customIcon = L.icon({
    iconUrl: "/images/marker.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35]
});

console.log(customIcon);
// Marker + Popup
const marker = L.marker(
    [coordinates[1], coordinates[0]],
    {
        icon: customIcon
    }
).addTo(map);


marker.bindPopup(`
    <b>${locationText}</b><br>
    🏡 Wanderlust Stay Location
`);