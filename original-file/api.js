const API_KEY = "498abaeb985c5ce9463a7f8efcfa85a7";

export async function ambilKutipan() {
    const kutipanElement =
        document.getElementById("kutipan-harian");

    kutipanElement.textContent =
        "Memuat kutipan...";

    try {
        const res = await fetch(
            "https://dummyjson.com/quotes/random"
        );

        if (!res.ok) {
            throw new Error(
                "Gagal mengambil kutipan"
            );
        }

        const data = await res.json();

        kutipanElement.textContent = data.quote;
    } catch (error) {
        kutipanElement.textContent =
            "Gagal memuat kutipan.";

        console.error(error);
    }
}

export async function ambilCuaca(kota) {
    const infoCuaca =
        document.getElementById("info-cuaca");

    infoCuaca.textContent =
        "Memuat cuaca...";

    try {
        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${kota}&appid=${API_KEY}&units=metric&lang=id`;

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message);
        }

        infoCuaca.innerHTML = `
            <p><strong>${data.name}</strong></p>
            <p>Suhu:${data.main.temp}°C </p>
            <p>Cuaca:${data.weather[0].description}</p>
        `;
    } catch (error) {
        infoCuaca.textContent =
            "Error: " + error.message;

        console.error(error);
    }
}
