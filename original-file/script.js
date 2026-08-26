import {
    tambahTugas,
    hapusTugas,
    toggleSelesai,
    editTugas,
    muatDariStorage,
    setFilter,
    getDaftarTugas,
    getFilterTugas,
    pindahkanTugas
} from "./tugas.js";

import {
    setupCatatan,
    muatCatatanDariStorage
} from "./catatan.js";

import {
    ambilKutipan,
    ambilCuaca
} from "./api.js";

function debounce(fn, delay = 300) {
    let timer;

    return (...args) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

const app = document.getElementById("app");

const judul = document.createElement("h2");
judul.textContent = "Selamat Datang di DailyBoard";
judul.style.color = "#2563eb";
app.appendChild(judul);

const tugas = document.createElement("section");
tugas.textContent = "Tugas";

const catatan = document.createElement("section");
catatan.textContent = "Catatan";

const cuaca = document.createElement("section");
cuaca.textContent = "Cuaca";

app.appendChild(tugas);
app.appendChild(catatan);
app.appendChild(cuaca);

setupCatatan(catatan);

const tombol = document.createElement("button");
tombol.textContent = "Tambah";
tugas.appendChild(tombol);

const input = document.createElement("input");
input.placeholder = "Masukkan tugas";
tugas.appendChild(input);

const inputCari = document.createElement("input");
inputCari.placeholder = "Cari tugas...";
tugas.appendChild(inputCari);

const tombolSemua = document.createElement("button");
tombolSemua.textContent = "Semua";

const tombolSelesai = document.createElement("button");
tombolSelesai.textContent = "Selesai";

const tombolBelum = document.createElement("button");
tombolBelum.textContent = "Belum Selesai";

tugas.appendChild(tombolSemua);
tugas.appendChild(tombolSelesai);
tugas.appendChild(tombolBelum);

const ul = document.createElement("ul");
ul.id = "daftar-tugas";
tugas.appendChild(ul);

function renderTugas(data = null) {
    ul.innerHTML = "";

    let hasil = data || getDaftarTugas();

    if (!data) {
        const filter = getFilterTugas();

        if (filter === "selesai") {
            hasil = getDaftarTugas().filter(tugas => tugas.selesai);
        }

        if (filter === "belum") {
            hasil = getDaftarTugas().filter(tugas => !tugas.selesai);
        }
    }

    hasil.forEach(tugasData => {
        const li = document.createElement("li");

        li.className = "tugas-item";
        li.dataset.id = tugasData.id;
        li.draggable = !0;
        li.textContent = tugasData.nama;

        if (tugasData.selesai) {
            li.style.textDecoration = "line-through";
        }

        li.addEventListener("click", () => {
            toggleSelesai(tugasData.id, renderTugas);
        });

        li.addEventListener("dblclick", () => {
            const namaBaru = prompt(
                "Edit tugas:",
                tugasData.nama
            );

            if (namaBaru !== null) {
                editTugas(
                    tugasData.id,
                    namaBaru,
                    renderTugas
                );
            }
        });

        const tombolHapus = document.createElement("button");
        tombolHapus.textContent = "Hapus";

        tombolHapus.addEventListener("click", event => {
            event.stopPropagation();

            hapusTugas(
                tugasData.id,
                renderTugas
            );
        });

        li.appendChild(tombolHapus);
        ul.appendChild(li);
    });
}

tombol.addEventListener("click", () => {
    tambahTugas(input.value, () => {
        input.value = "";
        renderTugas();
    });
});

tombolSemua.addEventListener("click", () => {
    setFilter("semua");
    renderTugas();
});

tombolSelesai.addEventListener("click", () => {
    setFilter("selesai");
    renderTugas();
});

tombolBelum.addEventListener("click", () => {
    setFilter("belum");
    renderTugas();
});

const cariTugas = debounce(() => {
    const kataKunci = inputCari.value
        .toLowerCase()
        .trim();

    const hasil = getDaftarTugas().filter(tugas =>
        tugas.nama.toLowerCase().includes(kataKunci)
    );

    renderTugas(hasil);
}, 300);

inputCari.addEventListener("input", cariTugas);

let tugasDipindahkan = null;

ul.addEventListener("dragstart", event => {
    const item = event.target.closest(".tugas-item");

    if (item) {
        tugasDipindahkan = Number(item.dataset.id);
    }
});

ul.addEventListener("dragover", event => {
    event.preventDefault();
});

ul.addEventListener("drop", event => {
    event.preventDefault();

    const target = event.target.closest(".tugas-item");

    if (!target || tugasDipindahkan === null) {
        return;
    }

    const idTarget = Number(target.dataset.id);

    if (tugasDipindahkan === idTarget) {
        return;
    }

    pindahkanTugas(
        tugasDipindahkan,
        idTarget,
        renderTugas
    );

    tugasDipindahkan = null;
});

const kutipan = document.createElement("section");

kutipan.innerHTML = `
    <div class="header-kutipan">
        <h2>Kutipan hari ini</h2>

        <button id="tombol-refresh" title="Refresh Kutipan">
            <span>↻</span>
            <span>Refresh</span>
        </button>
    </div>

    <p id="kutipan-harian">
        Memuat kutipan...
    </p>
`;

app.appendChild(kutipan);

const tombolRefresh =
    document.getElementById("tombol-refresh");

tombolRefresh.addEventListener("click", () => {
    ambilKutipan();
});

const inputKota = document.createElement("input");
inputKota.placeholder = "Masukkan nama kota";
cuaca.appendChild(inputKota);

const tombolCuaca = document.createElement("button");
tombolCuaca.textContent = "Cari Cuaca";
cuaca.appendChild(tombolCuaca);

const infoCuaca = document.createElement("div");
infoCuaca.id = "info-cuaca";
cuaca.appendChild(infoCuaca);

tombolCuaca.addEventListener("click", () => {
    const kota = inputKota.value;

    if (kota.trim() === "") {
        infoCuaca.textContent =
            "Masukkan nama kota terlebih dahulu.";

        return;
    }

    ambilCuaca(kota);
});

const status = document.createElement("p");
status.textContent = "Memuat semua data...";
app.appendChild(status);

async function muatSemuaWidget() {
    status.textContent = "Memuat semua data...";

    try {
        await Promise.all([
            ambilKutipan(),
            ambilCuaca("Jakarta")
        ]);

        status.textContent = "Data berhasil dimuat";
    } catch (error) {
        status.textContent = "Gagal memuat data";
        console.error(error);
    }
}

const tombolDarkMode = document.createElement("button");
tombolDarkMode.textContent = "Dark Mode";

document.body.insertBefore(
    tombolDarkMode,
    app
);

if (localStorage.getItem("tema") === "gelap") {
    document.body.classList.add("dark-mode");
    tombolDarkMode.textContent = "Light Mode";
}

tombolDarkMode.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const modeAktif =
        document.body.classList.contains("dark-mode");

    localStorage.setItem(
        "tema",
        modeAktif ? "gelap" : "terang"
    );

    tombolDarkMode.textContent =
        modeAktif ? "Light Mode" : "Dark Mode";
});

muatDariStorage();
muatCatatanDariStorage();
renderTugas();
muatSemuaWidget();
