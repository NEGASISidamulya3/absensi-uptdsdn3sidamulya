const API =
"https://script.google.com/macros/s/AKfycbyMKZIhJgdu5vBIpVBA30lsXNaLBI7zmMqEn8wv55KkVA6ejpBpB-tpoHsujLZRGL_n/exec";

const result =
document.getElementById("result");

const modeEl =
document.getElementById("mode");

let lockScan = false;

function getMode() {

    const hour =
    new Date().getHours();

    return hour < 12
    ? "MASUK"
    : "PULANG";
}

function updateMode() {

    modeEl.innerHTML =
    "MODE : " + getMode();
}

updateMode();

function beep() {

    try {

        const ctx =
        new(window.AudioContext ||
        window.webkitAudioContext)();

        const osc =
        ctx.createOscillator();

        osc.frequency.value = 1200;

        osc.connect(
            ctx.destination
        );

        osc.start();

        setTimeout(()=>{
            osc.stop();
        },150);

    } catch(e) {}
}

function showSuccess(data) {

    result.className =
    "result success";

    result.innerHTML = `
        <h2>✅ PRESENSI BERHASIL</h2>
        <h3>${data.nama}</h3>
        <p>${data.kelas}</p>
        <p>${data.mode}</p>
        <p>${data.jam}</p>
    `;
}

function showError(msg) {

    result.className =
    "result error";

    result.innerHTML = `
        <h2>⚠ ${msg}</h2>
    `;
}

async function kirimQR(qrId) {

    try {

        const url =
        API +
        "?qrId=" +
        encodeURIComponent(qrId);

        const response =
        await fetch(url);

        const data =
        await response.json();

        beep();

        if(data.success){

            showSuccess(data);

        } else {

            showError(
                data.message
            );
        }

    } catch(err) {

        showError(
            "SERVER TIDAK TERHUBUNG"
        );

        console.error(err);

    }

    setTimeout(()=>{

        result.className =
        "result";

        result.innerHTML =
        "<h2>Silakan Scan QR</h2>";

        lockScan = false;

    },3000);
}

function onScanSuccess(text) {

    if(lockScan) return;

    lockScan = true;

    kirimQR(text);
}

const qr =
new Html5Qrcode("reader");

qr.start(
    {
        facingMode:"user"
    },
    {
        fps:10,
        qrbox:250
    },
    onScanSuccess
);
