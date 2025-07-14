const display = document.getElementById("time");

//So can easily stop timers
let controller = new AbortController();
let interval;
let timeout;

// Show HH:MM:SS in html and title
function ShowTime(date) {
    let s = date.toLocaleTimeString();
    console.log(date.getMilliseconds());

    document.title = s;
    display.innerHTML = s;
}

// Based on https://gist.github.com/jakearchibald/cb03f15670817001b1157e62a076fe95
// Tries to update the displayed time at the start of every second
// Has <100ms accuracy which is quite good
function animationIntervalEverySecond(signal, callback) {
    function run() {
        if (signal.aborted) {
            clearTimeout(timeout);
            return;
        }

        const date = new Date();
        const now = date.getTime();
        callback(date);

        // Schedule the next call at the next full second
        const next = 1000 - (now % 1000);
        timeout = setTimeout(() => requestAnimationFrame(run), next);
    }

    // Align the first run to the next whole second
    const now = Date.now();
    const delay = 1000 - (now % 1000);
    timeout = setTimeout(() => requestAnimationFrame(run), delay);
}


//Two update modes:
// Accurate when on page
// Just set interval it when page is inactive
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState) {
        //Page hidden, use simple timeout
        controller.abort();
        clearInterval(interval);
        interval = setInterval(() => ShowTime(new Date()), 1000);
    } else {
        //Page active, use more accurate interval
        clearInterval(interval);

        controller = new AbortController();
        animationIntervalEverySecond(controller.signal, date => {
            ShowTime(date);
        });
    }
}
);

//When start page
document.addEventListener("DOMContentLoaded", () => {
    ShowTime(new Date());

    controller = new AbortController();
    animationIntervalEverySecond(controller.signal, date => {
        ShowTime(date);
    });
});