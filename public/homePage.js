// Выход из личного кабинета
let logoutButton = new LogoutButton();
logoutButton.action = () => {
    //logout (callback)
    ApiConnector.logout((response) => {
        if (response.success) {
            location.reload();
        }
    });
};


// Получение информации о пользователе
// current - отправить get-запрос, response - ответ сервера:
//{"success":true,"data":{"created_at":"2019-10-15T05:28:25.593Z","login":"oleg@demo.ru","password":"demo","id":1,"balance":{"RUB":1000,"USD":20,"EUR":20,"NTC":3000}}}
// его парсим и показываем страницу пользователя
// ApiConnector.current(callback)
ApiConnector.current((response) => {
    if (response.success) {
        // передавать не response, а сами данные - data
        ProfileWidget.showProfile(response.data);
    }
});

//Получение текущих курсов валюты
let ratesBoard = new RatesBoard();
let processStocks = () => {
    // получение курсов валют (последние 100 записей)    
    ApiConnector.getStocks(stocksCallBack);   
};

let stocksCallBack = (response) => {
    if (response.success) {        
        ratesBoard.clearTable();
        ratesBoard.fillTable(response.data);
    }
}

processStocks();
// запускаем с интервалом 1 мин
let timerId = setInterval(processStocks, 60000);

//Операции с деньгами:
// 1. Пополнить баланс
// 2. Конвертировать валюту
// 3. Перевод денег пользователю

let moneyManager = new MoneyManager();
// Пополнить баланс
moneyManager.addMoneyCallback = (moneyData) => {
    // moneyData -> { currency, amount }
    // запрос на пополнение баланса    
    ApiConnector.addMoney(moneyData, moneyCallback);
};

let moneyCallback = (response) => {
    //{"success":false,"error":"Ошибка при переводе значения в число"}    
    let msg = (response.success) ? "Баланс пополнен" : response.error;
    moneyManager.setMessage(response.success, msg);

    ProfileWidget.showProfile(response.data);        
};

// Конвертация валюты
moneyManager.conversionMoneyCallback = (moneyData) => {
    // moneyData -> { fromCurrency, targetCurrency, fromAmount }
    console.log("[conversionMoneyCallback]");
    ApiConnector.convertMoney(moneyData, processConversion);
};

let processConversion = (response) => {
    let msg = (response.success) ? "Операция конвертации выполнена" : response.error;
    moneyManager.setMessage(response.success, msg);
    console.log("[conversionMoneyCallback]" + msg);

    ProfileWidget.showProfile(response.data);        
};

// Перевод денег пользователю
moneyManager.sendMoneyCallback = (moneyData) => {
    // moneyData -> { to, amount, currency }
    ApiConnector.transferMoney(moneyData, processSendingMoney);
};

let processSendingMoney = (response) => {
    let msg = (response.success) ? "Операция перевода выполнена" : response.error;
    moneyManager.setMessage(response.success, msg);
    
    ProfileWidget.showProfile(response.data);        
};


//Работа с избранным:
// 1. Получить список
// 2. Добавить нового пользователя в избранное
// 3. Удалить нового пользователя из избранного

let favoritesWidget = new FavoritesWidget();
// Список избранного
let getInitialFavorites = () => {
    ApiConnector.getFavorites((response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);

            moneyManager.updateUsersList(response.data);
        }
    });
};

//вызываем
getInitialFavorites();

// Добавить нового пользователя в избранное
favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, processUserAddition);
};

let processUserAddition = (response) => {
    let msg = (response.success) ? "Операция добавления нового пользователя выполнена" : response.error;
    favoritesWidget.setMessage(response.success, msg);

    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);

    moneyManager.updateUsersList(response.data);        
};


// Удалить нового пользователя из избранного
favoritesWidget.removeUserCallback = (id) => {
    ApiConnector.removeUserFromFavorites(id, processUserRemoving);
};

let processUserRemoving = response => {
    let msg = (response.success) ? "Операция удаления пользователя выполнена" : response.error;
    favoritesWidget.setMessage(response.success, msg);          
        
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);

    moneyManager.updateUsersList(response.data);        
};
