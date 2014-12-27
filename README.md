## Что это
Модуль синтаксической подсветки языка 1С:Предприятия 8 для использования совместно с [SyntaxHighlighter 3](https://github.com/syntaxhighlighter),
разработанным [Alex Gorbatchev](http://alexgorbatchev.com). Поддерживается как русскоязычный так и англоязычный варианты кода.

## Как этим пользоваться

### На своих сайтах
Точно также, как в случае с модулями других языков - подключить сам SyntaxHighlighter, подключить модуль 
[scripts/shBrush1Cv8.js](scripts/shBrush1Cv8.js) и вызывать SyntaxHighlighter.all(). 
Расцветка синтаксичских блоков, соответствующая расцветке в конфигураторе 1С по умолчанию, задана в стилях 
[styles/shTheme1Cv8.css](styles/shTheme1Cv8.css).

Пример можно увидеть в [index.html](index.html). 

Модуль поддерживает единственный алиас "lang1c". Язык подсветки указывается традиционно через class="brush: lang1c".
Можно добавлять свои синонимы, но это может повлечь неработоспособность в Confluence - в ветке 5.x присуствует странная 
плавающая ошибка с обработкой регистра символов имени синонима и количеством синонимов

### В Atlassian Confluence 5.x
В Atlassian Confluence для подсветки пользовательского синатксиса используется макрос Code Macro, основанный на
том же SyntaxHighlighter, но обладающий некоторыми особенностями. Эти особенности учтены в модуле.
Для подключения модуля к Confluence необходимо:

1. В общих настройках конфигурации панели администрирования выбрать пункт "Configure Code Macro", нажать на ссылку 
"Add a new language", выбрать файл shBrush1Cv8.js и задать пользовательское название языка.
Под этим названием язык подсветки будет доступен при оформлении текста.

2. Добавить в глобальный стиль содержимое файла shTheme1Cv8.css - пункт "Stylesheet" группы "Look and Feel"
панели администирования.

3. Удаление подсветки производится из той же панели администрирования, через общее управление плагинами Confluence.
После этого можно удалить и соответствующий фрагмент глобального CSS
