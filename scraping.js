// scraping.js
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://elpais.com/ultimas-noticias/";

async function realizarScraping() {
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);

      let noticias = [];

      // Seleccionar elementos de noticias
      $("article.c.c-d.c--m").each((_, element) => {
        const titulo = $(element).find("header.c_h").text().trim();
        const descripcion = $(element).find("p.c_d").text().trim();
        const enlace = $(element).find("a").attr("href");
        const imagen = $(element).find("img").attr("src");

        const noticia = {
          titulo,
          descripcion,
          enlace: enlace ? `https://elpais.com${enlace}` : null,
          imagen: imagen ? `https://elpais.com${imagen}` : null,
        };

        noticias.push(noticia);
      });

      // Guardar noticias en un archivo JSON
      fs.writeFileSync("noticias.json", JSON.stringify(noticias, null, 2));
      console.log(
        "Scraping realizado con éxito y datos guardados en noticias.json"
      );
    }
  } catch (error) {
    console.error("Error al realizar el scraping:", error.message);
  }
}

module.exports = realizarScraping;
