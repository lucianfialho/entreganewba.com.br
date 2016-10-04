var Google = (function(){
    'use strict';
    // Private
    // Settings
    var CLIENT_ID     = '124018462620-gsjhcuqs8kkd3qefsj4bfv9le9ua3cri.apps.googleusercontent.com',
    SCOPES        = ['https://www.googleapis.com/auth/analytics.readonly'];

    // Globals
    var userAccountId           = null,
    webPropertieAccountId       = null,
    viewPropertieAccountId      = null,
    webViewPropertieAccountId   = null;

    var autorize = function(event, callback){
        var useImmdiate = event ? false : true;
        var authData = {
            client_id: CLIENT_ID,
            scope: SCOPES,
            immediate: useImmdiate
        };

        gapi.auth.authorize(authData, function(response) {

            if (response.error) {
                $authButton.hidden = false;
            } else {
                apiLoad().then(function(){
                    return queryAccounts().execute(callback);
                });
            }
        });
    }

    var apiLoad = function(){
        return gapi.client.load('analytics', 'v3');
    }

    var queryAccounts = function(callback){
        return gapi.client.analytics.management.accounts.list();
    }

    var queryProperties = function(accountId, callback) {
        return gapi.client.analytics.management.webproperties.list({'accountId': accountId}).execute(callback);
    }

    var queryFilters = function(accountId){
        // Get a list of all the properties for the account.
        gapi.client.analytics.management.filters.list({
            'accountId': accountId
        }).then(handleFilters).then(null, function(err) {
            // Log any errors.
            console.log(err);
        });
    }

    var handleFilters = function(response) {
        // Handles the response from the profiles list method.
        var notFound = null;
        if (response.result.items && response.result.items.length) {
            for (var i = 0; i < response.result.items.length; i++) {
                if(response.result.items[i].type && response.result.items[i].excludeDetails){
                    if(response.result.items[i].type !== 'EXCLUDE' && response.result.items[i].excludeDetails.field !== 'GEO_IP_ADDRESS'){
                        notFound = true;
                    }
                }
            }
            if(notFound){
                vals.push({ label: 'checkFilters', status: false, message: "Você não tem filtros para previnir visitas da sua equipe no Google Analytics" });
            }
        } else {
            vals.push({ label: 'checkFilters', status: false, message: "Filtro de visitas internas, você não tem filtros para previnir visitas da sua equipe no Google Analytics" });
        }
    }

    var queryProfiles = function(accountId, propertyId, callback) {
        gapi.client.analytics.management.profiles.list({'accountId': accountId,'webPropertyId': propertyId}).execute(callback);
    }

    var queryViewsProperties = function(accountId, propertyId, viewPropertieId, callback) {
        return gapi.client.analytics.management.profiles.get({'accountId': accountId,'webPropertyId': propertyId,'profileId': viewPropertieId}).execute(callback);
    }

    var checkRevenue = function(google, callback){
        return gapi.client.analytics.data.ga.get({
            'ids': 'ga:' + google.id,
            'start-date': '30daysAgo',
            'end-date': 'today',
            'metrics': 'ga:transactionRevenue'
        }).execute(callback);
    }

    var checkProductCategory = function(google, callback){
        return gapi.client.analytics.data.ga.get({
            'ids': 'ga:' + google.id,
            'start-date': '30daysAgo',
            'end-date': 'today',
            'metrics': 'ga:itemRevenue',
            'dimensions': 'ga:productCategory'
        }).execute(callback);
    }

    var checkBounceRate = function (google, callback){
        return gapi.client.analytics.data.ga.get({
            'ids': 'ga:' + google.id,
            'start-date': '30daysAgo',
            'end-date': 'today',
            'metrics': 'ga:bounceRate',
        }).execute(callback);
    }

    var checkGoalExists = function (google, callback){
        return gapi.client.analytics.data.ga.get({
            'ids': 'ga:' + google.id,
            'start-date': '30daysAgo',
            'end-date': 'today',
            'metrics': 'ga:goalValueAll',
        }).execute(callback);
    }

    var checkAdwordsExists = function (google, callback){
        return gapi.client.analytics.data.ga.get({
            'ids': 'ga:' + google.id,
            'start-date': '30daysAgo',
            'end-date': 'today',
            'metrics': 'ga:impressions',
        }).execute(callback);
    }

    var checkEventsExists = function (google, callback){
        return gapi.client.analytics.data.ga.get({
            'ids': 'ga:' + google.id,
            'start-date': '30daysAgo',
            'end-date': 'today',
            'metrics': 'ga:totalEvents',
        }).execute(callback);
    }

    var checkThirdCheckoutReferenceExists = function(google, callback){
        return gapi.client.analytics.data.ga.get({
            'ids': 'ga:' + google.id,
            'start-date': '30daysAgo',
            'end-date': 'today',
            'metrics': 'ga:sessions',
            'dimensions': 'ga:source'
        }).execute(callback);
    }

    var checkGoogleWebLightReferenceExists = function(google, callback){
        return gapi.client.analytics.data.ga.get({
            'ids': 'ga:' + google.id,
            'start-date': '30daysAgo',
            'end-date': 'today',
            'metrics': 'ga:sessions',
            'dimensions': 'ga:source'
        }).execute(callback);
    }

    return {
        autorize: autorize,
        queryAccounts: queryAccounts,
        queryProperties: queryProperties,
        queryFilters: queryFilters,
        queryProfiles: queryProfiles,
        queryViewsProperties: queryViewsProperties,
        checkRevenue: checkRevenue,
        checkProductCategory: checkProductCategory,
        checkBounceRate: checkBounceRate,
        checkGoalExists: checkGoalExists,
        checkAdwordsExists: checkAdwordsExists,
        checkEventsExists: checkEventsExists,
        checkThirdCheckoutReferenceExists: checkThirdCheckoutReferenceExists,
        checkGoogleWebLightReferenceExists: checkGoogleWebLightReferenceExists
    }
})();
