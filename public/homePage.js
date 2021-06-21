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
// current - отправить get-запрос, response - ответ сервера, его парсим и показываем страницу пользователя
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
    console.log("[processStocks]: ");
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
// переопределяем callback
moneyManager.addMoneyCallback = (moneyData) => {
    // moneyData -> { currency, amount }
    // запрос на пополнение баланса
    ApiConnector.addMoney((response) => {
        let msg = (response.success) ? "Баланс пополнен" : "Выполнить операцию не удалось";
        moneyManager.setMessage(response.success, msg);

        ProfileWidget.showProfile(response.data);        
    })
};

moneyManager.conversionMoneyCallback = (moneyData) => {
    // moneyData -> { fromCurrency, targetCurrency, fromAmount }
    ApiConnector.convertMoney((moneyData, response) => {
        let msg = (response.success) ? "Операция конвертации выполнена" : "Выполнить операцию не удалось";
        moneyManager.setMessage(response.success, msg);

        ProfileWidget.showProfile(response.data);        
    });
}

moneyManager.sendMoneyCallback = (moneyData) => {
    // moneyData -> { to, amount, currency }
    ApiConnector.transferMoney((moneyData, response) => {
        let msg = (response.success) ? "Операция перевода выполнена" : "Выполнить операцию не удалось";
        moneyManager.setMessage(response.success, msg);

        ProfileWidget.showProfile(response.data);        
    });
}


//Работа с избранным:
// 1. Получить список
// 2. Добавить нового пользователя в избранное
// 3. Удалить нового пользователя из избранного

let favoritesWidget = new FavoritesWidget();
//начальный список избранного
let getInitialFavorites = () => {
    ApiConnector.getFavorites((response) => {
        if (response.success) {
            newFavoritesWidget.clearTable();
            newFavoritesWidget.fillTable(response.data);
            newMoneyManager.updateUsersList(response.data);
        }
    });
};

//вызываем
getInitialFavorites();

favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites((data, response) => {
        let msg = (response.success) ? "Операция добавления нового пользователя выполнена" : "Выполнить операцию не удалось";
        favoritesWidget.setMessage(response.success, msg);

        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);        
    });
}

favoritesWidget.removeUserCallback = (id) => {
    ApiConnector.removeUserFromFavorites(id, response => {
        let msg = (response.success) ? "Операция удаления пользователя выполнена" : "Выполнить операцию не удалось";
        favoritesWidget.setMessage(response.success, msg);          
            
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);        
    });
}
