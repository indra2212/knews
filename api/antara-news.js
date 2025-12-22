const axios = require('axios');
const xml2js = require('xml2js');

const cleantext = (text) => text ? text.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim() : "";

async function antaranews() {
    try {
        const resp = await axios.get('https://www.antaranews.com/rss/terkini.xml', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const hasil = await xml2js.parseStringPromise(resp.data, { explicitArray: false });
        const itemsRaw = hasil.rss.channel.item;
        const items = Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw];

        return items.map(item => ({
            sumber: 'Antara News',
            title: item.title,
            link: item.link,
            image: item.enclosure.$.url || 'https://placehold.co/600x400.png',
            contentSnippet: item['content:encoded'],
            isoDate: item.pubDate
        }));
    } catch (e) { return []; }
}
module.exports = antaranews;