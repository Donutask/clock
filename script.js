const display = document.getElementById("time");

//So can easily stop timers
let controller = new AbortController();
let interval;
let timeout;

let logAccuracy = false;

//Used on page
const longFormatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
});

//Used in title of tab
const shortFormatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
});

// Shows on page and title
function ShowTime(date) {
    if (logAccuracy)
        console.log(date.getMilliseconds());

    document.title = shortFormatter.format(date);
    display.innerHTML = longFormatter.format(date);

    SetFaviconToTime(date);
}

//Update favicon every 15 minutes
let lastTicks = 0;
function SetFaviconToTime(date) {
    let nowTicks = date.getTime();
    if (nowTicks > lastTicks + 1000 * 60 * 15) {
        lastTicks = date.getTime();
        ChangeFavicon(ClockURL(date));
    }
}

//Clock favicon in the form /clocks/HHMM.svg, where minute is either 00 or 30
function ClockURL(date) {
    let hour = date.getHours();
    let minutes = date.getMinutes();

    let minuteString;
    if (minutes > 45) {
        minuteString = "00";
        hour++;
    }
    else if (minutes < 15) {
        minuteString = "00";
    } else {
        minuteString = "30";
    }

    let moduloHours = hour % 12;
    let hourString = (hour > 9) ? moduloHours.toString() : "0" + moduloHours.toString();

    let url = "./clocks/" + hourString.toString() + minuteString.toString() + ".svg"
    return url;
}

function ChangeFavicon(src) {
    var link = document.createElement('link'),
        oldLink = document.getElementById('favicon');

    link.id = 'favicon';
    link.rel = 'shortcut icon';
    link.href = src;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
}

// Based on https://gist.github.com/jakearchibald/cb03f15670817001b1157e62a076fe95
// Tries to update the displayed time at the start of every second
// Has <100ms accuracy which is good enough
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