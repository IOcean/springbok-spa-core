(function () {
    'use strict';
    
    angular.module('springbok.core').service('session', session);
    
    session.$inject = ['encryptionUtils'];
    
    function session(encryptionUtils) {
        var session = this;
        
        session.defaultExpirationDurationInMilliseconds = 1 * 3600 * 1000; // 1 hour
        init();
        getCurrent();
        
        session.persist = function() {
            localStorage.account = JSON.stringify(session.account);
        };
        
        session.update = function(account) {
            session.account.infos = account;
            session.account.authenticated = true;
            session.persist();
        };
        
        session.isExpired = function() {
            var isExpired = true;
            var currentDateTime = new Date().getTime();
            var sessionDateTime = session.account.expiration;
            
            if (!_.isNull(sessionDateTime) && !_.isUndefined(sessionDateTime)) {
                var dateTimeDifference = currentDateTime - sessionDateTime;
                isExpired = dateTimeDifference >= session.defaultExpirationDurationInMilliseconds;
            }
            
            return isExpired;
        };
        
        session.updateExpiration = updateExpiration;
        
        session.clear = function() {
            init();
            localStorage.removeItem('account');
        };
        
        session.getCurrent = getCurrent;
        
        session.setTokenAndExpiration = function() {
            var authorizationheader = 'Basic ';
            authorizationheader += encryptionUtils.encodeToBase64(session.account.username + ':' + session.account.password);
            
            session.account.token = authorizationheader;
            updateExpiration();
            session.persist();
        };

        session.updatePassword = function (password) {
            session.account.password = password;
            session.setTokenAndExpiration();
        };
        
        session.setDefaultExpirationDurationInMilliseconds = function(defaultExpirationDurationInMilliseconds) {
            session.defaultExpirationDurationInMilliseconds = defaultExpirationDurationInMilliseconds;
        };
        
        session.setLanguage = function(languageKey) {
            session.language = languageKey;
            localStorage.language = session.language;
        };
        
        session.updateLanguage = updateLanguage();
        
        function getCurrent() {
            if (localStorage.account) {
                var account = JSON.parse(localStorage.account);
                session.account = account;
            } else {
                init();
            }
            
            updateLanguage();
            
            return session.account;
        }
        
        function updateLanguage() {
            var language = CONFIG.app.preferredLanguage;
            
            if (localStorage.language) {
                language = localStorage.language;
            }
            
            session.language = language;
        }
        
        function updateExpiration() {
            session.account.expiration = new Date().getTime();
            session.persist();
        }
        
        /**
         * Clear all account data except for the language if one has been selected
         * @returns {void}
         */
        function init() {
            if (!session.account) {
                session.account = {};
            }
            
            session.account.infos = {};
            session.account.expiration = null;
            session.account.authenticated = false;
        }
    }
})();

