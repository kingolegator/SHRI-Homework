# Домашнее задание «Архитектура»

## Описание

* **Запуск**
    ```sh
    npm i
    npm start
    localhost:3000
    ```
    * Для проверки 3-го задания (Мультимедия) требуется запустить сервер стримов видео
    ```sh
    git clone https://github.com/mad-gooze/shri-2018-2-multimedia-homework.git
    cd shri-2018-2-multimedia-homework
    npm i
    npm start
    ```

## Итоги

Реализованная интерактивность: переключение вкладок "События"-"Видеонаблюдение" происходит через store фреймворка. Хранение данных стора дублируется во внешнем хранилище браузера local storage.

* Класс ``Events`` реализует методы добавления событий
* Класс ``Store`` наследует класс ``Events``, все события и callback-и событий биндятся через этот класс
* Класс ``Dispatcher`` реализует методы регистраций событий и их вызова

Разработанные классы фреймворка находятся: ``./public/lib``, приложение реализовано в ``./public/js/index.js``