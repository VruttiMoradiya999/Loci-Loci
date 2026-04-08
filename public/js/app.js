const socket = io();

let userName = prompt("Please enter your name:");
if (!userName || userName.trim() === "") {
    userName = "Anonymous";
}

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((Position) => {
        const { latitude, longitude } = Position.coords;
        socket.emit("send-location", { latitude, longitude, name: userName })
    },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        })

}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Krishna Academy"
}).addTo(map)

const markers = {};

socket.on(
    "receive-location", (data) => {
        const { id, latitude, longitude, name } = data;

        // Only center the map if it's the current user's movement
        if (id === socket.id) {
            map.setView([latitude, longitude]);
        }
        if (markers[id]) {
            markers[id].setLatLng([latitude, longitude]);
            if (name) markers[id].getTooltip().setContent(name);
        }
        else {
            markers[id] = L.marker([latitude, longitude]).addTo(map);
            if (name) {
                markers[id].bindTooltip(name, {
                    permanent: true,
                    direction: 'top',
                    offset: [0, -10], // Adjusted for better alignment
                    className: 'custom-tooltip'
                }).openTooltip();
            }
        }
    }
);



