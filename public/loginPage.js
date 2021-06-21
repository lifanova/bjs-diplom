//const { response } = require("express");


// Создаем объект 
let userForm = new UserForm();

userForm.loginFormCallback = (loginData) => {
    //сначала вызывается loginFormAction с данными формы
    // затем вызов callback-а loginFormCallback(getData(loginForm));
    //getData -> {login, passwd}
    console.log("[loginFormCallback]: " + JSON.stringify(loginData));
    // У login 2 парам-ра: тело POST-запроса (строка) и функция (с параметром response - Ответ сервера)
    ApiConnector.login(loginData, processLoginResponse);
}

userForm.registerFormCallback = (registerData) => {
    ApiConnector.register(registerData, processRegisterResponse);
}

let processLoginResponse = (response) => {    
    if(!response.success) {        
        userForm.setLoginErrorMessage(response.error);
        return;
    }
    
    // перезагрузка страницы
    location.reload();
};

let processRegisterResponse = (response) => {
    if(!response.success) {
        userForm.setRegisterErrorMessage(response.error);
        return;
    }

    // перезагрузка страницы
    location.reload();
};

