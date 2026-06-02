const API_URL =
"https://script.google.com/macros/s/AKfycbyMKZIhJgdu5vBIpVBA30lsXNaLBI7zmMqEn8wv55KkVA6ejpBpB-tpoHsujLZRGL_n/exec";

const resultBox =
document.getElementById("result");

function updateMode(){

    const hour =
    new Date().getHours();

    const mode =
    hour < 12
    ? "MODE : MASUK"
    : "MODE : PULANG";

    document.getElementById("mode")
    .innerText = mode;

}

updateMode();

function beep(){

    const ctx =
    new(window.AudioContext ||
    window.webkitAudioContext)();

    const osc =
    ctx.createOscillator();

    osc.connect(ctx.destination);

    osc.frequency.value = 1000;

    osc.start();

    setTimeout(()=>{
        osc.stop();
    },150);

}

async function kirimQR(qrId){

    try{

        const response =
        await fetch(API_URL,{
            method:"POST",
            body:JSON.stringify({
                qrId:qrId
            })
        });

        const data =
        await response.json();

        beep();

        if(data.success){

            resultBox.className =
            "result success";

            resultBox.innerHTML=`
            <h2>✅ PRESENSI BERHASIL</h2>
            <h3>${data.nama}</h3>
            <p>${data.kelas}</p>
            <p>${data.mode}</p>
            <p>${data.jam}</p>
            `;

        }else{

            resultBox.className =
            "result error";

            resultBox.innerHTML=`
            <h2>⚠ ${data.message}</h2>
            <h3>${data.nama || ""}</h3>
            `;

        }

        setTimeout(()=>{

            resultBox.className =
            "result";

            resultBox.innerHTML=
            "<h2>Arahkan Kartu ke Kamera</h2>";

        },3000);

    }
    catch(err){

        console.log(err);

    }

}

let sedangScan = false;

function onScanSuccess(decodedText){

    if(sedangScan) return;

    sedangScan = true;

    kirimQR(decodedText);

    setTimeout(()=>{
        sedangScan = false;
    },3000);

}

const html5QrCode =
new Html5Qrcode("reader");

html5QrCode.start(
    {
        facingMode:"user"
    },
    {
        fps:10,
        qrbox:250
    },
    onScanSuccess
);
