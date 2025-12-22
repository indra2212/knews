const antaraNews = require('./antara-news');
const cnbcNews = require('./cnbc-news');

module.exports = async (req, res) => {
    // Header agar bisa diakses dari browser
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    try {
        console.log("Mencari berita baru via Serverless...");
        
        // Mengambil data secara real-time saat API dipanggil
        const [antara, cnbc] = await Promise.all([
            antaraNews(), 
            cnbcNews()
        ]);

        // Gabungkan dan urutkan
        const newsStorage = [...antara, ...cnbc].sort((a, b) => 
            new Date(b.pubDate) - new Date(a.pubDate)
        );

        // Kirim data ke browser
        res.status(200).json(newsStorage);
    } catch (error) {
        console.error("Error Sniping:", error);
        res.status(500).json({ error: "Gagal mengambil berita" });
    }
};