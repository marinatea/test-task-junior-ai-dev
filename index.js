import fetchArticle from "./fetchArticle.js";
import { OPENAI_API_KEY } from "./config.js";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

async function createPreview() {
  try {
    const articleHtml = fs.readFileSync("artykul.html", "utf8");

    const templateHtml = fs.readFileSync("szablon.html", "utf8");

    const previewHtml = templateHtml.replace(
      "<!-- CONTENT_PLACEHOLDER -->",
      articleHtml
    );

    fs.writeFileSync("podglad.html", previewHtml, "utf8");
    console.log("Plik podglad.html został pomyślnie wygenerowany.");
  } catch (error) {
    console.error("Błąd podczas tworzenia podglądu artykułu:", error);
  }
}

async function generateHTMLWithOpenAI(articleContent) {
  const prompt = `Przygotuj kod HTML na podstawie poniższego artykułu.
  Zastosuj odpowiednie tagi HTML do strukturyzacji treści, dodaj miejsca na obrazy z tagami <img> z atrybutem src="image_placeholder.jpg" oraz dodaj atrybut alt do każdego obrazka z dokładnym promptem, który możemy użyć do wygenerowania grafiki na podstawie odpowiednich paragraów.
  Umieść podpisy pod grafikami używając odpowiedniego tagu HTML.
  Wszystkie nagłowki powinne byc też w odpowiednich tagach: <h1> albo <h2> albo <h3> albo <h4> albo <h5>.
  Nie dodawaj CSS ani JavaScript, tylko kod HTML do wstawienia pomiędzy tagami <body> i </body>.\n\nArtykuł: \n\n${articleContent}`;

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

    if (data.choices && data.choices.length > 0) {
      let htmlContent = data.choices[0].message?.content?.trim();

      htmlContent = htmlContent.replace(/```html/g, "").replace(/```/g, "");

      if (htmlContent) {
        fs.writeFileSync("artykul.html", htmlContent, "utf8");
        console.log("Artykuł HTML został wygenerowany.");
      } else {
        throw new Error("Brak treści HTML w odpowiedzi OpenAI");
      }
    }
  } catch (error) {
    console.error("Błąd podczas komunikacji z OpenAI:", error);
    throw error;
  }
}

async function main() {
  try {
    const articleContent = await fetchArticle(
      "https://cdn.oxido.pl/hr/Zadanie%20dla%20JJunior%20AI%20Developera%20-%20tresc%20artykulu.txt"
    );

    await generateHTMLWithOpenAI(articleContent);

    await createPreview();
  } catch (error) {
    console.error("Wystąpił błąd:", error);
  }
}

main();
