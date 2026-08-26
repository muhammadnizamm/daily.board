import{simpanTugas,muatTugas}from "./storage.js";let daftarTugas=[{id:1,nama:"Belajar JavaScript",selesai:!1},{id:2,nama:"Olahraga",selesai:!1}];let nextId=3;let filterTugas="semua";export function validasiInput(nilai){if(nilai.trim()===""){alert("Input tidak boleh kosong!");return!1}
if(nilai.length>100){alert("Input maksimal 100 karakter!");return!1}
return!0}
export function muatDariStorage(){daftarTugas=muatTugas();if(daftarTugas.length>0){nextId=Math.max(...daftarTugas.map((tugas)=>tugas.id))+1}}
export function tambahTugas(nama,render){if(!validasiInput(nama)){return}
daftarTugas.push({id:nextId++,nama:nama.trim(),selesai:!1});simpanTugas(daftarTugas);render()}
export function hapusTugas(id,render){daftarTugas=daftarTugas.filter((tugas)=>tugas.id!==id);simpanTugas(daftarTugas);render()}
export function toggleSelesai(id,render){daftarTugas=daftarTugas.map((tugas)=>tugas.id===id?{...tugas,selesai:!tugas.selesai}:tugas);simpanTugas(daftarTugas);render()}
export function editTugas(id,namaBaru,render){if(!validasiInput(namaBaru)){return}
daftarTugas=daftarTugas.map((tugas)=>tugas.id===id?{...tugas,nama:namaBaru.trim()}:tugas);simpanTugas(daftarTugas);render()}
export function setFilter(filter){filterTugas=filter}
export function getDaftarTugas(){return daftarTugas}
export function getFilterTugas(){return filterTugas}
export function pindahkanTugas(idDipindahkan,idTarget,render){const indexDipindahkan=daftarTugas.findIndex((tugas)=>tugas.id===idDipindahkan);const indexTarget=daftarTugas.findIndex((tugas)=>tugas.id===idTarget);if(indexDipindahkan===-1||indexTarget===-1){return}
const tugasPindah=daftarTugas.splice(indexDipindahkan,1)[0];daftarTugas.splice(indexTarget,0,tugasPindah);simpanTugas(daftarTugas);render()}