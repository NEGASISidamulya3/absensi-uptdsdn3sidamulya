alert("APP.JS TERBARU LOADED");

const API_URL =
"https://script.google.com/macros/s/AKfycbyMKZIhJgdu5vBIpVBA30lsXNaLBI7zmMqEn8wv55KkVA6ejpBpB-tpoHsujLZRGL_n/exec";

const resultBox = document.getElementById("result");

function updateMode() {

    const hour = new Date().getHours();

    document.getElementById("mode").innerText =
        hour < 12
        ? "MODE : MASUK"
        : "MODE : PULANG";
}

updateMode();

function beep() {

    try {

        const ctx = new (window.AudioContext || window.webkitAudioContext)();

        const osc = ctx.createOscillator();

        osc.frequency.value = 1000;

        osc.connect(ctx.destination);

        osc.start();

        setTimeout(() => {
            osc.stop();
        }, 150);

    } catch (e) {
        console.log(e);
    }
}

let sedangScan = false;

async function kirimQR(qrId) {

    try {

        console.log("QR TERBACA:", qrId);

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                qrId: qrId
            })
        });

        const text = await response.text();

        console.log("RESPON API:");
        console.log(text);

        let data;

        try {

            data = JSON.parse(text);

        } catch (err) {

            resultBox.className = "result error";

            resultBox.innerHTML = `
                <h2>❌ RESPON API TIDAK VALID</h2>
                <p>Lihat Console Browser</p>
            `;

            sedangScan = false;

            return;
        }

        beep();

        if (data.success === true) {

            resultBox.className = "result success";

            resultBox.innerHTML = `
                <h2>✅ PRESENSI BERHASIL</h2>
                <h3>${data.nama || "-"}</h3>
                <p>${data.kelas || "-"}</p>
                <p>${data.mode || "-"}</p>
                <p>${data.jam || "-"}</p>
            `;

        } else {

            resultBox.className = "result error";

            resultBox.innerHTML = `
                <h2>⚠ ${data.message || "Terjadi Kesalahan"}</h2>
                <h3>${data.nama || ""}</h3>
                <p>${data.kelas || ""}</p>
            `;
        }

        setTimeout(() => {

            resultBox.className = "result";

            resultBox.innerHTML = `
                <h2>Arahkan Kartu ke Kamera</h2>
            `;

            sedangScan = false;

        }, 3000);

    } catch (err) {

        alert(err);

        console.error(err);

        resultBox.className = "result error";

        resultBox.innerHTML = `
        <h2>❌ GAGAL TERHUBUNG KE SERVER</h2>
        <p>${err}</p>
    `    ;
    }    
}

function onScanSuccess(decodedText) {

    if (sedangScan) return;

    sedangScan = true;

    kirimQR(decodedText);
}

const html5QrCode = new Html5Qrcode("reader");

html5QrCode.start(
    {
        facingMode: "user"
    },
    {
        fps: 10,
        qrbox: 250
    },
    onScanSuccess
);
