import fetchArticle from "./fetchArticle.js";
import { OPENAI_API_KEY } from "./config.js";
import fetch from "node-fetch";
import fs from "fs";

const articleUrl =
  "https://cdn.oxido.pl/hr/Zadanie%20dla%20JJunior%20AI%20Developera%20-%20tresc%20artykulu.txt";

async function generateHTMLWithOpenAI(articleContent) {
  const prompt = `Przygotuj kod HTML na podstawie poniższego artykułu. Zastosuj odpowiednie tagi HTML, dodaj miejsca na obrazy z tagami <img> z atrybutem src="image_placeholder.jpg" oraz alt="opis obrazka". Dodaj podpisy pod grafikami. Nie dodawaj CSS ani JavaScript, tylko kod HTML do wstawienia pomiędzy tagami <body> i </body>.\n\nArtykuł: \n\n${articleContent}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("Odpowiedź z OpenAI:", data);

    if (data.choices && data.choices.length > 0) {
      let htmlContent = data.choices[0].message?.content?.trim();

      htmlContent = htmlContent.replace(/```html/g, "").replace(/```/g, "");

      if (htmlContent) {
        const fullHTMLContent = `<!DOCTYPE html>\n<html lang="pl">\n<head>\n<meta charset="UTF-8">\n<title>Artykuł</title>\n</head>\n<body>\n${htmlContent}\n</body>\n</html>`;

        fs.writeFileSync("artykul.html", fullHTMLContent, "utf8");
        console.log("Plik HTML został zapisany jako artykul.html");
      } else {
        throw new Error("Brak treści HTML w odpowiedzi OpenAI");
      }
    } else {
      throw new Error("Brak odpowiednich danych w odpowiedzi z OpenAI");
    }
  } catch (error) {
    console.error("Błąd podczas komunikacji z OpenAI:", error);
    throw error;
  }
}

async function main() {
  try {
    const articleContent = await fetchArticle(articleUrl);
    await generateHTMLWithOpenAI(articleContent);
  } catch (error) {
    console.error("Wystąpił błąd:", error);
  }
}

main();