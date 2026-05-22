# My 3D Calc

Калькулятор себестоимости 3д-печати с бэк-офисом, клиентским экраном и публичным тестированием.

## Структура

```
3dprint-calc/
├── public/
│   └── index.html       ← весь фронтенд (админка + заказ + тестирование)
├── server/
│   └── index.js         ← Express API (результаты тестировщиков)
├── package.json
├── railway.toml
└── README.md
```

## Деплой — шаг за шагом

### 1. GitHub

```bash
# В папке проекта
git init
git add .
git commit -m "init"

# Создай репо на github.com и подключи
git remote add origin https://github.com/ТОЙ_НИК/3dprint-calc.git
git push -u origin main
```

### 2. Railway

1. Зайди на **railway.app**
2. New Project → **Deploy from GitHub repo**
3. Выбери репо `3dprint-calc`
4. Railway сам обнаружит `package.json` и задеплоит
5. В настройках сервиса: **Settings → Networking → Generate Domain**
6. Получишь URL вида `3dprint-calc-production.up.railway.app`

### 3. Обновить URL в коде (если нужно)

Если фронт и бэк на одном Railway-сервисе (рекомендуется) — ничего менять не надо.
API-переменная в `index.html` уже настроена на пустую строку (тот же хост).

### 4. Поделиться с тестировщиками

Просто отправь им URL Railway-сервиса. Они открывают сайт, идут во вкладку **Тестирование**, вводят никнейм — и поехали.

## Технологии

- **Фронтенд**: чистый HTML/CSS/JS, без сборщиков
- **Бэкенд**: Node.js + Express + better-sqlite3
- **БД настроек**: localStorage (в браузере каждого пользователя)
- **БД тестировщиков**: SQLite на Railway (общая для всех)

## Переменные окружения (Railway)

| Переменная | Описание | По умолчанию |
|-----------|----------|--------------|
| `PORT` | Порт сервера | 3000 |
| `DB_PATH` | Путь к SQLite файлу | `./data.db` |
