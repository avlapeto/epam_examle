(function (angular, jcs) {
    'use strict';

    class RequestsService {
        constructor($q,  $http){
            this.$q = $q;
            this.$http = $http;

        };

        getRequests () {
            /*Получение списка заявок*/
            let defer = this.$q.defer();

            this.$http({
                method: 'POST',
                url: jcs.sessionAdd('/req/'),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                withCredentials: jcs.withCredential()
            }).then((response)=> {

                if (response.data){
                defer.resolve(response.data);

            }
        })
        .catch((error)=>{

            });

            return defer.promise;

        };

        acceptRequest(requestID) {
            /*Приняте чужой одиночной заявки*/
            let defer = this.$q.defer();

            this.$http({
                method: 'POST',
                url: jcs.sessionAdd('/req/accept/'),
                data:"request_id=" + requestID,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                withCredentials: jcs.withCredential()
            }).then((response)=> {

                if (response.data){
                defer.resolve(response.data);

            }
        })
        .catch((error)=>{

            });

            return defer.promise;

        };

        acceptMassRequest(requestID, side) {
            /*Приняте чужой массовой заявки*/
            let defer = this.$q.defer();

            let data = side ? `request_id=${requestID}&side=${side}` : `request_id=${requestID}`;

            this.$http({
                method: 'POST',
                url: jcs.sessionAdd('/req/accept-mass/'),
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                withCredentials: jcs.withCredential()
            }).then((response)=> {

                if (response.data){
                defer.resolve(response.data);

            }
        })
        .catch((error)=>{

            });

            return defer.promise;

        };

        rejectRequest(requestID) {
            /*Отказ на бой по моей одиночной заявке*/
            let defer = this.$q.defer();

            this.$http({
                method: 'POST',
                url: jcs.sessionAdd('/req/decline/'),
                data:"request_id=" + requestID,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                withCredentials: jcs.withCredential()
            }).then((response)=> {

                if (response.data){
                defer.resolve(response.data);

            }
        })
        .catch((error)=>{

            });

            return defer.promise;

        };

        createRequest() {
            /*Создание собственной одиночной заявки*/
            let defer = this.$q.defer();

            this.$http({
                method: 'POST',
                url: jcs.sessionAdd('/req/create/'),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                withCredentials: jcs.withCredential()
            }).then((response)=> {

                if (response.data){
                defer.resolve(response.data);

            }
        })
        .catch((error)=>{

            });

            return defer.promise;

        };


        /**
         * type - @string - тип заявки групповая/хаотическая/сам за себя (+ вариации с ротацией)
         * maxPlayers - @int - число человек в команде (для хаотов - число человек в заявке)
         * camp - @string - тип лагеря мой/ +/-1 / любой
         * maxPlayers - @int - число человек в команде (для хаотов - число человек в заявке)
         * startTime - @int - Время до начала боя в секундах
         *
         * **/

        createMassRequest(type, maxPlayers, camp, startTime) {
            /*Создание собственной групповой или хаотической заявки*/
            let defer = this.$q.defer();

            this.$http({
                method: 'POST',
                url: jcs.sessionAdd('/req/create-mass/'),
                data: `request_type=${type}&max_players=${maxPlayers}&camp=${camp}&start_time=${startTime}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                withCredentials: jcs.withCredential()
            }).then((response)=> {

                if (response.data){
                defer.resolve(response.data);

            }
        })
        .catch((error)=>{

            });

            return defer.promise;

        };

        cancelRequest(requestID) {
            /*Отзыв собственной одиночной заявки*/
            let defer = this.$q.defer();

            this.$http({
                method: 'POST',
                url: jcs.sessionAdd('/req/cancel/'),
                data:"request_id=" + requestID,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                withCredentials: jcs.withCredential()
            }).then((response)=> {

                if (response.data){
                defer.resolve(response.data);

            }
        })
        .catch((error)=>{

            });

            return defer.promise;

        };

        cancelMassRequest(requestID) {
            /*Отзыв собственной одиночной заявки*/
            let defer = this.$q.defer();

            this.$http({
                method: 'GET',
                url: jcs.sessionAdd('/req/cancel-mass/'),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                withCredentials: jcs.withCredential()
            }).then((response)=> {

                if (response.data){
                defer.resolve(response.data);

            }
        })
        .catch((error)=>{

            });

            return defer.promise;

        };

    };

    RequestsService.$inject = [
        '$q',
        '$http',
    ];

    angular.module(jcs.modules.inventory.name)
        .service(jcs.modules.inventory.services.requests, RequestsService)


}(angular, jcs));