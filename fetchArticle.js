import fetch from "node-fetch";

async function fetchArticle(url) {
  const response = await fetch(url);
  const text = await response.text();
  return text;
}

export default fetchArticle;
