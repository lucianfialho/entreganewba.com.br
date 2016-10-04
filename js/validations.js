var Validations = (function(){

    var validations = {
        "e_commerce": [checkTimeZone, checkCurrency, checkSiteSearchCategoryParameters, checkECommerceTracking]
    }
    var vals = [];
    var asyncCalls = [
        "checkRevenue",
        "checkProductCategory",
        "checkBounceRate",
        "checkGoalExists",
        "checkAdwordsExists",
        "checkEventsExists",
        "checkThirdCheckoutReferenceExists",
        "checkGoogleWebLightReferenceExists"
    ];

    function checkTimeZone(user){
        //formInfos googleInfos
        if((user.googleInfos.timezone !== undefined || user.googleInfos.timezone !== null)){
            if(user.googleInfos.timezone !== user.formInfos.fuso){
                return {
                    label: 'checkTimeZone',
                    status: false,
                    message: "Seu fuso horário está configurado errado",
                    post: 'http://metricasboss.com.br/como-criar-um-conta-no-google-analytics/',
                    title: ', veja como configurar seu timezone nesse post da métricas boss.'
                }
            }
        }else{
            return {
                label: 'checkTimeZone',
                status: false,
                message: "Seu fuso horário não está configurado",
                post: 'http://metricasboss.com.br/como-criar-um-conta-no-google-analytics/',
                title: ', veja como configurar seu timezone nesse post da métricas boss.'
            }
        }

        return {label: 'checkTimeZone', status: true, message: "Seu fuso horário está configurado!"};
    }

    function checkCurrency(user){
        if((user.googleInfos.timezone !== undefined || google.googleInfos.timezone !== null)){
            if(user.googleInfos.currency !== user.formInfos.pais){
                return {
                        label: 'checkCurrency',
                        status: false,
                        message: "Sua unidade monetária está está configurada errada",
                        post: 'http://metricasboss.com.br/como-criar-um-conta-no-google-analytics/',
                        title: ', aprenda como configurar sua unidade monetária no google analytics.'
                    }
            }
        }

        return { label: 'checkCurrency', status: true, message: "Sua unidade monetária está configurada!" };
    }

    function checkSiteSearchCategoryParameters(user){
        if((user.googleInfos.siteSearchQueryParameters === undefined || user.googleInfos.siteSearchQueryParameters === null)){
            return {
                    label: 'siteSearchCategoryParameters',
                    status: false,
                    message: "Seu parâmetro de pesquisa não está configurado",
                    post: 'http://metricasboss.com.br/como-configurar-a-pesquisa-interna-no-google-analytics/',
                    title: ', aprenda como configurar seu parâmetro de pesquisa.'
                }
        }

        return {label: 'siteSearchCategoryParameters', status: true, message: "Seu parâmetro de pesquisa está configurado!"};
    }

    function checkECommerceTracking(user){
        if(!user.googleInfos.eCommerceTracking){
            return {
                    label: 'eCommerceTracking',
                    status: false,
                    message: "Sua tag de comércio eletrônico não está ativa",
                    post: 'http://metricasboss.com.br/google-tag-manager-tag-de-comercio-eletronico/',
                    title: ', você é um e-commerce mesmo? Aprenda a configurar sua tag de comércio eletrônico!'
                }
        }
        return {label: 'eCommerceTracking', status: true, message: "Sua tag de comércio eletrônico está ativa"};
    }

    var validateUser = function(user, callback){
        if(user.formInfos.category === "e_commerce"){
            for (var i = 0; i < validations[user.formInfos.category].length; i++) {
                var validation = validations[user.formInfos.category][i](user);
                vals.push(validation);
            }

            Google.checkRevenue(user.googleInfos, function(response){
                if(!user.googleInfos.eCommerceTracking){
                    //vals.push({label: 'checkRevenue', status: false, message: "Sua tag de comércio eletrônico não está ativa"});
                }else if(parseInt(response.result.totalsForAllResults["ga:transactionRevenue"]) <= 0){
                  vals.push(
                      {
                          label: 'checkRevenue',
                          status: false,
                          message: "Seu e-commerce não teve transações nos últimos 30 dias",
                          post: 'http://metricasboss.com.br/google-tag-manager-tag-de-comercio-eletronico/',
                          title: ', aprenda como configurar corretamente a tag de comércio eletrônico.'
                      }
                  );
                }else {
                  vals.push({ label: 'checkRevenue', status: true, message: "Foram computadas vendas nos ultimos 30 dias !"});
                }
                asyncCalls.shift();
            });

            Google.checkProductCategory(user.googleInfos, function(response){
                var found = null;
                if(!user.googleInfos.eCommerceTracking){
                    //vals.push({label: 'checkProductCategory', status: false, message: "Sua tag de comércio eletrônico não está ativa"});
                }else if(parseInt(response.result.totalsForAllResults["ga:itemRevenue"]) <= 0){
                    vals.push({ label: 'checkProductCategory', status: false, message: "Seu e-commerce não teve transações nos últimos 30 dias", post: 'http://metricasboss.com.br/como-criar-um-alerta-personalizado-no-google-analytics/', title: ', seu e-commerce não teve transações e você não foi avisado? Aprenda como configurar um alerta personalizado.' });
                }else {
                    for (var i = 0; i < response.result.rows.length; i++) {
                        if(response.result.rows[i][0] !== "(not set)"){
                            found = true
                        }
                    }
                }

                if(found){
                    vals.push({ label: 'checkProductCategory', status: true, message: 'Suas categorias de produtos estão configuradas corretamente!'});
                }else{
                    vals.push(
                        {
                            label: 'checkProductCategory',
                            status: false,
                            message: "Existem produtos sem categorias no seu comércio eletrônico",
                            post: 'http://metricasboss.com.br/google-tag-manager-tag-de-comercio-eletronico/',
                            title: ', aprenda como configurar corretamente a tag de comércio eletrônico para ter a categoria de produto nos seus relatórios.'
                        }
                    );
                }

                asyncCalls.shift();
            });

            Google.checkThirdCheckoutReferenceExists(user.googleInfos, function(response){
                var thirdCheckout = ["bpag.uol.com.br","cieloecommerce.com.br", "pagseguro.com.br","pagador.com.br"];
                var found = null;
                for (var i = 0; i < response.result.rows.length; i++) {
                    if(thirdCheckout.indexOf(response.result.rows[i][0]) > -1){
                        found = true;
                    }
                }

                if(found){
                    vals.push(
                        {
                            label: 'checkThirdCheckoutReferenceExists',
                            status: false,
                            message: "Foi encontrado checkouts de terceiros como referência dentro da sua origem mídia",
                            post: 'http://metricasboss.com.br/como-configurar-checkout-do-pagseguro-mercado-pago-e-bcash-no-ga/',
                            title: ', aprenda como remover checkout de terceiros da sua lista de referências.'
                        }
                    );
                }else{
                    vals.push({label: 'checkThirdCheckoutReferenceExists', status: true, message: "Não foi encontrado checkouts de terceiros na sua lista de referências!"});
                }

                asyncCalls.shift();
            });

        }else{
            asyncCalls.shift();
            asyncCalls.shift();
            asyncCalls.shift();
        }

        Google.checkBounceRate(user.googleInfos, function(response){
            if(parseFloat(response.result.totalsForAllResults["ga:bounceRate"]) <= 20 ){
                vals.push(
                    {
                        label: 'checkBounceRate',
                        status: false,
                        message: 'Sua taxa de rejeição está abaixo de 20%',
                        post: 'http://metricasboss.com.br/os-5-maiores-erros-do-google-analytics/',
                        title: ', aprenda como analisar nesse post.'
                    }
                );
            }else{
                vals.push({label: 'checkBounceRate', status: true, message: "Sua taxa de rejeição esta estável - Sua taxa de rejeição não apresenta problemas"});
            }
            asyncCalls.shift();
        });

        Google.checkGoalExists(user.googleInfos, function(response){
            if(parseFloat(response.result.totalsForAllResults["ga:goalValueAll"]) <= 0 ){
                vals.push(
                    {
                        label: 'checkGoalExists',
                        status: false,
                        message: "Você não tem metas cadastradas, ou não foi registrado conclusões de meta nos ultimos 30 dias.",
                        post: 'http://metricasboss.com.br/funil-de-metas-no-google-analytics-o-que-e/',
                        title: ', aprenda o que é um funil de metas.'
                    }
                );
            }else{
                vals.push({label: 'checkGoalExists', status: true, message: "Suas metas estão estáveis - Suas metas foram cadastradas corretamente"});
            }
            asyncCalls.shift();
        });

        Google.checkAdwordsExists(user.googleInfos, function(response){
            if(parseFloat(response.result.totalsForAllResults["ga:impressions"]) <= 0 ){
                vals.push(
                    {
                        label: 'checkAdwordsExists',
                        status: false,
                        message: "Seu adwords não está vinculado no seu google analytics ou não existe.",
                        post: ' http://metricasboss.com.br/integracao-google-adwords-com-google-analytics/',
                        title: ', veja como vincular a sua conta do adwords no seu google analytics.'
                    }
                );
            }else{
                vals.push({label: 'checkAdwordsExists', status: true, message: "Seu adwords está vinculado corretamente!"});
            }
            asyncCalls.shift();
        });

        Google.checkEventsExists(user.googleInfos, function(response){
            if(parseFloat(response.result.totalsForAllResults["ga:totalEvents"]) <= 0 ){
                vals.push({label: 'checkEventsExists', status: false, message: "Não foi encontrado o monitoramento de eventos ou nenhum disparo do mesmo"});
            }else{
                vals.push({label: 'checkEventsExists', status: true, message: "Você está mensurando eventos corretamente!"});
            }
            asyncCalls.shift();
        });

        Google.checkGoogleWebLightReferenceExists(user.googleInfos, function(response){

            var found = null;
            for (var i = 0; i < response.result.rows.length; i++) {
                if(response.result.rows[i][0] === 'googleweblight.com'){
                    found = true;
                }
            }

            if(found){
                vals.push({label: 'checkGoogleWebLightReferenceExists', status: false, message: "Foi encontrado google web light como referência dentro da sua origem mídia", post: 'http://metricasboss.com.br/o-que-e-google-web-light/', title: ', aprenda como remover o google web light da sua lista de referência.'});
            }
            asyncCalls.shift();
        });

        var watch = setInterval(function () {
            if(asyncCalls.length <=0){
                clearInterval(watch);
                callback(vals);
            }else{
                if(asyncCalls.length <=0){
                    clearInterval(watch);
                    callback(vals);
                }
            }
        }, 200);
    }

    var filterResult = function(arr, callback){
        var total = arr.length,
            unityValue = 100 / total,
            negatives = [],
            positives = [];

        for (var i = 0; i < arr.length; i++) {
            if(arr[i].status === false){
                negatives.push(arr[i]);
            }else{
                positives.push(arr[i]);
            }
        }

        calc = {
            correct:{
                items: positives,
                count: positives.length * unityValue
            },
            incorrect:{
                items: negatives,
                count: negatives.length * unityValue
            }
        };

        callback(calc);
    }


    return {
        validateUser: validateUser,
        filterResult: filterResult
    }
})();
