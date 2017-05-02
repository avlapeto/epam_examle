(function (angular, jcs) {
    'use strict';

    class AuthController {
        constructor($scope, $title) {
            this.$scope = $scope;
            this.$title = $title;
            this.fixer = this.fixer();

        }

        fixer() {
            setTimeout(() => {
                jcs.auth.bindings();
            }, 100);
            return true;
        };


        $onInit() {
            document.body.classList.add('game');
            document.querySelector('title').innerHTML = this.$title;

        };

        $onDestroy() {
            document.body.classList.remove('game');

        }
    }


        class AuthorizationController extends AuthController{
        constructor($authorization, $PreviousState, $scope, $title){
            super($scope, $title);
            this.login = '';
            this.password = '';
            this.remember = '';
            this.incorrectData = false;
            this.$authorization = $authorization;
            this.$PreviousState = $PreviousState;
        }


        logIn(){
            let state = {
                name: 'portal.forum.section',
                params: {
                    sectionID: 1,
                    page: 1,
                }

            };

            if(this.$PreviousState.Name){
                state.name = this.$PreviousState.Name;
                state.params = this.$PreviousState.Params;
            }

            if(state.name == "portal.index" || state.name == "auth.authorization" || state.name == "auth.restore2"){
                state.name = "main.inventory";
            }

            this.$authorization.logIn(this.login, this.password, this.remember).then((user)=>{
                if(user.status == 'new'){
                    /*Неактивированных пользователей перекидываем на главную*/
                    state.name = "portal.index";
                    this.$authorization.setPermissions(user, state);

                }

                if(user.authorized){
                    /*Активированных - пускаем в игру*/
                    this.$authorization.setPermissions(user, state);

                }
                if(!user.authorized){
                    /*При неверно введенных данных - показываем ошибку*/
                    this.login = '';
                    this.password = '';
                    this.remember = '';
                    this.incorrectData = true;
                }

            });
        }


    };
    class RegistrationController extends AuthController{
        constructor($authorization, $scope, $title){
            super($scope, $title);
            this.$authorization = $authorization;
            this.activationEmail = false;
            this.login = '';
            this.email = '';
            this.sex = 'male';
            this.pass1 = '';
            this.pass2 = '';
            this.passToLogin = '';
            this.loginToLogin = '';
            this.reasons = {
                login: '',
                pass1: '',
                pass2: '',
                email: '',
            };
            this.errors = {
                login: false,
                email: false,
                pass1: false,
                pass2: false,
            }

        }

        range(n){
            return new Array(n);
        };


        register(){
            this.validateLogin();
            this.validateEmail();
            this.validatePass1();
            this.validatePass2();

            if( !this.errors.login
                && !this.errors.email
                && !this.errors.pass1
                && !this.errors.pass2
            ){
                this.$authorization.register(this.login, this.pass1, this.email, this.sex).then(()=>{
                    this.passToLogin = this.pass1;
                    this.loginToLogin = this.login;
                    this.pass1 = '';
                    this.pass2 = '';
                    this.login = '';
                    this.email = '';
                    this.sex = 'male';

                    this.activationEmail = true;

                })
            }else {
                return;
            }

        };

        logIn(){
            this.$authorization.logIn(this.loginToLogin, this.passToLogin).then((user)=>{

                let state = {
                    name: "portal.forum.section",
                    params: {
                        sectionID: 1,
                        page: 1
                    }
                };
                this.$authorization.setPermissions(user, state);
            })
        };

        checkLogin(){
            if(this.errors.login){
                return;
            }
            this.$authorization.checkLogin(this.login).then((ans)=>{
                if(ans.error){
                    this.errors.login = true;
                    switch(ans.error.message[0]){
                        case "Login is not valid!":{
                            this.reasons.login  = "Некорректное имя персонажа";
                            break;
                        }
                        case "Login is already taken!":{
                            this.reasons.login  = "Персонаж с таким именем уже зарегистрирован";
                            break;
                        }
                        default:{
                            this.reasons.login  = "Некорректное имя персонажа";
                        }
                    }


                }
            })
        };

        checkEmail(){
            if(this.errors.email){
                return;
            }
            this.$authorization.checkEmail(this.email).then((ans)=>{

                if(ans.error){
                    this.errors.email = true;
                    switch(ans.error.message[0]){
                        case "Email is not valid!":{
                            this.reasons.email  = "Некорректный адрес почты";
                            break;
                        }
                        case "Email is already taken!":{

                            this.reasons.email  = "Данный адрес уже зарегистрирован";
                            break;
                        }

                    }


                }

            })
        };




        validateLogin(){
            let regexLogin = /^(?:[a-z0-9 ~_\.\-\^\(\)]{3,25}|[а-яё0-9 ~_\.\-\^\(\)]{3,25})$/i;

            this.reasons.login = '';
            this.errors.login = false;


            if(this.login.length < 3){
                this.reasons.login = "Минимальная длинна логина - 3 символа";
                this.errors.login = true;
            }

            if(this.login.length > 25){
                this.reasons.login = "Максимальная длинна логина - 25 символов";
                this.errors.login = true;
            }


            if(!regexLogin.test(this.login)){
                this.reasons.login = "Некорректное имя";
                this.errors.login = true;

            }else{
                this.errors.login = false;

            }

        };

        validateEmail(){
            this.reasons.email = '';

            if(this.email.match(/.+@.+\..+/i)){
                this.errors.email = false;
            }else{
                this.reasons.email = "Некорректный email";
                this.errors.email = true;
            }

        }

        validatePass1(){
            this.reasons.pass1 = '';

            if(this.pass1.length > 6){
                this.errors.pass1 = false;
            }else{
                this.reasons.pass1 = "Минимальная длинна пароля - 7 символов";
                this.errors.pass1 = true;
            }

        }

        validatePass2(){
            this.reasons.pass2 = '';

            if(this.pass1 == this.pass2){
                this.errors.pass2 = false;
            }else{
                this.reasons.pass2 = "Пароли не совпадают";
                this.errors.pass2 = true;
            }

        }

    };
    class RestoreByAnswerController extends AuthController{
        constructor($scope, $title){
            super($scope, $title);
            this.email = '';
            this.question1 = '0';
            this.question2 = '0';
            this.ans1 = '';
            this.ans2 = '';
            this.incorrectData = false;
            this.correct = {
                ans1: true,
                ans2: true,
            };
            this.reasons = {
                email : '',
                ans1 : '',
                ans2 : '',
            }

        }


        validEmail(){
            this.reasons.email = '';

            if(this.email.match(/[a-z,0-9]@[a-z,0-9]/i)){
                return true;
            }else{
                this.reasons.email = "Некорректный email";
                return false;
            }

            /*TODO: Сделать проверку занятых почт*/

        };

        restore(){
            if (this.ans1 == ''){
                this.reasons.ans1 = "Необходим ответ";
                this.correct.ans1 = false;
            }

            if (this.ans2 == ''){
                this.reasons.ans2 = "Необходим ответ";
                this.correct.ans2 = false;

            }

            if(!this.correct.ans1 ||!this.correct.ans2 ){
                return;
            }

            /*Эмулируем отказ*/
            this.incorrectData = true;
            this.reasons.ans1 =  "Некорректный ответ на один или два контрольных вопроса";
            this.reasons.ans2 = this.reasons.ans1;

        };

        clearErrors(){
            this.correct.ans1 = this.correct.ans2 = true;
            this.incorrectData = false;

        }
    };
    class ConfirmEmailController extends AuthController{
        constructor($authorization, $scope, $title){
            super($scope, $title);
            this.showPopup = false;
            this.$authorization = $authorization;
            this.init = this.confirmEmail();


        }


        confirmEmail(){
            this.$authorization.confirmEmail().then(()=>{
                this.showPopup = true;

            })
        }
    };
    class RestoreByEmailController extends AuthController{
        constructor($authorization, $stateParams, $scope, $title){
            super($scope, $title);
            this.$authorization = $authorization;
            this.$stateParams = $stateParams;
            this.error = false;
            this.success = false;
            this.login = '';
            this.email = '';
            this.key = '';
            this.reasons = {
                pass1: '',
                pass2: '',
            };
            this.errors = {
                pass1: false,
                pass2: false,
            }
        }

        restore(){

            if(this.login == '' || this.email == ''){
                this.error = true;
                return;
            };
            if(this.error){
                return;
            };

            this.$authorization.restoreByEmail(this.login, this.email).then((ans)=>{
                if(ans.status == "success"){
                    this.success = true;

                }else{
                    this.error = true;
                }
            })

        }

        restore2(){

            if(this.errors.pass1 || this.errors.pass2){
                return;
            };

            if(this.error){
                return;
            };

            this.$authorization.changePassword(this.pass1, this.$stateParams.key).then((ans)=>{
                if(ans.status == "success"){
                    this.success = true;

                }else{
                    this.error = true;
                }
            })

        }

        validatePass1(){
            this.reasons.pass1 = '';

            if(this.pass1 && this.pass1.length > 6){
                this.errors.pass1 = false;
            }else{
                this.reasons.pass1 = "Минимальная длинна пароля - 7 символов";
                this.errors.pass1 = true;
            }

        }

        validatePass2(){
            this.reasons.pass2 = '';

            if(this.pass1 == this.pass2){
                this.errors.pass2 = false;
            }else{
                this.reasons.pass2 = "Пароли не совпадают";
                this.errors.pass2 = true;
            }

        }
    };

    class ReactivationController extends AuthController{
        constructor($authorization, $PreviousState, $scope, $title, $user){
            super($scope, $title);
            this.$user = $user;
            this.login = this.$user.getUser().login;
            this.email = this.$user.getUser().email;
            this.password = '';
            this.incorrectData = false;
            this.$authorization = $authorization;
            this.$PreviousState = $PreviousState;
            this.show = {
                success: false,
                error: false

            };
        }



        reactivate(){

            this.$authorization.reactivate(this.email, this.password).then((ans)=>{
                if(ans.success){
                    this.show.success = true;
                    this.show.error = false;

                    this.$user.setUser({email: this.email});

                }else{
                    this.show.success = false;
                    this.show.error = true;
                }
            });
        }


    };


    AuthController.$inject = [
        '$scope',

    ];
    AuthorizationController.$inject = [
        jcs.modules.auth.services.authorization,
        'PreviousState',
        '$scope',
        '$title',

    ];
    RegistrationController.$inject = [
        jcs.modules.auth.services.authorization,
        '$scope',
        '$title',



    ];
    ConfirmEmailController.$inject = [
        jcs.modules.auth.services.authorization,
        '$scope',
        '$title',



    ];

    RestoreByEmailController.$inject = [
        jcs.modules.auth.services.authorization,
        '$stateParams',
        '$scope',
        '$title',



    ];
    ReactivationController.$inject = [
        jcs.modules.auth.services.authorization,
        '$stateParams',
        '$scope',
        '$title',
        jcs.modules.auth.services.user,

    ];


    angular.module(jcs.modules.auth.name)
        .controller('AuthorizationController', AuthorizationController)
        .controller('RegistrationController', RegistrationController)
        .controller('RestoreByAnswerController', RestoreByAnswerController)
        .controller('ConfirmEmailController', ConfirmEmailController)
        .controller('RestoreByEmailController', RestoreByEmailController)
        .controller('ReactivationController', ReactivationController);





}(angular, jcs));