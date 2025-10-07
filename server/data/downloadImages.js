const axios = require("axios");
const fs = require("fs");
const path = require("path");

const ACCESS_KEY = "wPb7r_7I-S36PJSqbIsjuWg9AklTn0ceheaRdbiR5Po";

// tải ảnh theo category
async function downloadImages(query, folder, count = 20) {
  const url = `https://api.unsplash.com/photos/random?query=${query}&count=${count}&client_id=${ACCESS_KEY}`;
  const { data } = await axios.get(url);

  const saveDir = path.join("./images", folder);
  if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });

  for (let i = 0; i < data.length; i++) {
    const imgUrl = data[i].urls.full;
    const imgPath = path.join(saveDir, `${folder}-${i + 1}.jpg`);

    const writer = fs.createWriteStream(imgPath);
    const response = await axios({
      url: imgUrl,
      method: "GET",
      responseType: "stream",
    });
    response.data.pipe(writer);

    await new Promise((resolve) => writer.on("finish", resolve));
    console.log(`✅ Saved ${imgPath}`);
  }
}

async function main() {
  await downloadImages("tshirt", "ao-thun", 100);     // áo thun
  await downloadImages("polo shirt", "ao-polo", 100); // áo polo
  await downloadImages("jacket", "ao-khoac", 100);    // áo khoác
  await downloadImages("shorts", "quan-short", 100);  // quần short
  await downloadImages("pants", "quan-dai", 100);     // quần dài
}

main();
