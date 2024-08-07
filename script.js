const display = document.getElementById("time");

let date;
// Show HH:MM:SS in html and title
function ShowTime() {
    date = new Date();
    let s = date.toLocaleTimeString();

    document.title = s;
    display.innerHTML = s;
}

// Align setInterval to the start of the second for more exact time. Check if the second has changed every 10 milliseconds.
function Callibrate() {
    if (date.getSeconds() != new Date().getSeconds()) {
        window.setTimeout(Callibrate, 10);
    } else {
        ShowTime();
        setInterval(ShowTime, 1000)
    }
}

ShowTime();
Callibrate();