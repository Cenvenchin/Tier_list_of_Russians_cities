# Тир-лист городов России

Простой сайт для друзей: перетащите карточки городов на тир-лист, расставьте по своему вкусу и отправьте скриншот автору.

## Как открыть локально

Откройте файл `index.html` в браузере или запустите локальный сервер:

```bash
npx serve .
```

## Публикация на GitHub Pages

1. Создайте репозиторий на GitHub (например, `russia-cities-tierlist`).
2. Загрузите проект:

```bash
git init
git add .
git commit -m "Add Russia cities tier list site"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/russia-cities-tierlist.git
git push -u origin main
```

3. На GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root)**.
4. Через минуту сайт будет доступен по адресу:  
   `https://ВАШ_ЛОГИН.github.io/russia-cities-tierlist/`

## Как пользоваться

- Карточки городов лежат внизу на тёмно-сером фоне.
- Перетащите их на тир-лист (мышью или пальцем на телефоне).
- Чтобы вернуть город вниз — перетащите его обратно в блок «Города».
- Сделайте скриншот и отправьте другу.

## Структура

```
index.html          — страница
style.css           — стили
script.js           — перетаскивание карточек
assets/images/      — фон тир-листа и фото городов
```
