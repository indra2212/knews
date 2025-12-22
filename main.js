document.addEventListener('DOMContentLoaded', (event) => {
  // 1. Ambil elemen tombol menu dan tautan menu menggunakan ID
  const menuButton = document.getElementById('menuButton');
  const mastheadLinks = document.getElementById('mastheadLinks');

  // 2. Tambahkan event listener saat tombol diklik
  menuButton.addEventListener('click', function () {
    // Toggle (menambahkan/menghapus) kelas 'active'
    mastheadLinks.classList.toggle('active');

    // Mengganti ikon burger (☰) menjadi tanda silang (✕) dan sebaliknya
    if (mastheadLinks.classList.contains('active')) {
      menuButton.innerHTML = '✕';
      menuButton.style.fontSize = '1.8em';
    } else {
      menuButton.innerHTML = '☰';
      menuButton.style.fontSize = '1.5em';
    }
  });

  // 3. Opsional: Tutup menu jika ukuran layar kembali ke desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 800 && mastheadLinks.classList.contains('active')) {
      mastheadLinks.classList.remove('active');
      menuButton.innerHTML = '☰';
      menuButton.style.fontSize = '1.2em'; /* Kembali ke ukuran desktop default */
    }
  });
});


const container = document.getElementById('card-wrapper'); // Sesuaikan ID di HTML Anda

async function loadNews() {
    try {
        // Panggil endpoint rewrite dari vercel.json
        const response = await fetch('/api/api');
        if (!response.ok) throw new Error("Respons server tidak OK");
        
        const listberita = await response.json();
        
        container.innerHTML = ''; // Bersihkan sebelum render
        if (listberita.length > 0) {
            viewcard(listberita);
        }
    } catch (error) {
        console.error("Gagal mengambil berita:", error);
    }
}

function viewcard(listberita) {
    listberita.forEach(berita => {
        const card = document.createElement('div');
        card.className = 'card';

        card.style.cursor = 'pointer';
        card.onclick = () => window.open(berita.link, '_blank');

        const dateObj = new Date(berita.isoDate);
        const tanggal = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        const jam = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const gambarberita = berita.image

        card.innerHTML = `
        <div class="card-header">
           <span class="badge">${berita.sumber}</span>
           <img src="${gambarberita}" alt="berita" onerror="this.src='https://placehold.co/600x400.png'">
        </div>
        <div class="card-body">
          <p class="date">${tanggal} || ${jam}</p>
          <h3>${berita.title}</h3>
          <p class="description">${berita.contentSnippet}...</p>
          <a href="${berita.link}" target="_blank" class="btn-read">Baca Selengkapnya</a>
        </div>
        `;
        container.appendChild(card);
    });
}

loadNews();