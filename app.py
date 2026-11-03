"""
AI-дайджест — простой сайт на Flask.

Как это работает:
1. Читаем карточки из файла content.json
2. Передаём их в шаблон templates/index.html
3. Запуск: python app.py  →  сайт откроется на http://127.0.0.1:5000
"""

import json
import os
from flask import Flask, render_template

# Создаём приложение Flask.
# flask ищет шаблоны в папке templates/, а стили и скрипты — в static/
app = Flask(__name__)


def load_cards():
    """Читает карточки из content.json и возвращает их списком."""
    # Путь считаем от папки с app.py — так файл найдётся на любом хостинге
    base_dir = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(base_dir, "content.json"), "r", encoding="utf-8") as file:
        data = json.load(file)
    return data["cards"]


@app.route("/")
def index():
    """Главная страница: показываем все карточки."""
    cards = load_cards()
    return render_template("index.html", cards=cards)


if __name__ == "__main__":
    # Хостинг Render передаёт порт в переменной окружения PORT.
    # Локально приложим порт 5000, как раньше.
    port = int(os.environ.get("PORT", 5000))

    # debug=True — сайт сам перезагружается при изменении кода.
    # Включаем отладку только локально (на Render она и так отключена).
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("RENDER") is None)
