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
    ApiConnector.getStocks(stocksCallBack);
};

let stocksCallBack = (response) => {
    if (response.success) {
        ratesBoard.clearTable();
        ratesBoard.fillTable(response.data);
    }
}

processStocks();
let timerId = setInterval(processStocks, 60000);

//Операции с деньгами
let moneyManager = new MoneyManager();

//Работа с избранным
let favoritesWidget = new FavoritesWidget();
