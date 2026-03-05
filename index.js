const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/parcel', async (req, res) => {
  const apn = req.query.apn;
  if (!apn) return res.status(400).json({ error: 'No APN provided' });
  const url = `https://maps.utahcounty.gov/arcgis/rest/services/Parcels/TaxParcels_acreage/MapServer/30/query?where=SERIAL_NUM+LIKE+%27${encodeURIComponent(apn)}%25%27&outFields=SERIAL_NUM,OWNERNAME,ADDRESS,ACRES,CITY&f=json`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Fetch failed', detail: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy running'));
