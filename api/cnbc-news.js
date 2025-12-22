const axios = require('axios');
const xml2js = require('xml2js');

const cleantext = (text) => text ? text.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim() : "";

async function cnbcnews() {
    try {
        const resp = await axios.get('https://www.cnbcindonesia.com/news/rss', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const hasil = await xml2js.parseStringPromise(resp.data, { explicitArray: false });
        const itemsRaw = hasil.rss.channel.item;
        const items = Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw];

        return items.map(item => ({
            sumber: 'CNBC Indonesia',
            title: item.title,
            link: item.link,
            image: item.enclosure.$.url || 'https://placehold.co/600x400.png',
            contentSnippet: item['content:encoded'] ? cleantext(item['content:encoded']).substring(0, 150) : "",
            isoDate: item.pubDate
        }));
    } catch (e) { return []; }
}
module.exports = cnbcnews;