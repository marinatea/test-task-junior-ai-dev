**Aplikacja do generowania artykulow HTML za pomocą AI.**

Jest to prosta aplikacja Node.js, która pobiera artykuł w formacie tekstowym, generuje jego wersję HTML przy użyciu OpenAI i tworzy stronę podglądu z podstawowym szablonem.
Aplikacja automatycznie tworzy strony HTML, w tym miejsca na obrazy z tagami `img`, podpisami i nagłówkami w odpowiednich tagach HTML.

Pliki i foldery:
- /styles - style
- index.js - główny plik aplikacji
- config.js - konfiguracja klucza API OpenAI
- fetchArticle.js - plik odpowiedzialny za pobieranie treści artykułu
- szablon.html - szablon HTML używany do generowania podglądu artykułu
- artykul.html - wygenerowany OpenAI plik HTML z treścią artykułu
- podglad.html - strona podglądu z artykułem wstawionym do szablonu.

Funkcje
- Pobiera treść artykułu z podanego URL.
- Używa modelu GPT OpenAI do generowania struktury HTML z tekstu artykułu.
- Tworzy podgląd artykułu w spersonalizowanym szablonie HTML.

Instrukcja uruchomienia:

Przed uruchomieniem aplikacji trzeba zainstalować Node.js.

1. Klonujemy repo.

2. Instalujemy zależności:
npm i

3. Utwarzamy plik .env w głównym katalogu projektu i dodajemy lklucz API:
OPENAI_API_KEY=twój_klucz

4. Uruchamiamy aplikację za pomocą komendy:
node index.js
