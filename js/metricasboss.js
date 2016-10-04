var MetricasBoss = (function(){
    // Elements
    var $selectAccount      = $('#select-account'),
        $authArea		        = $('#auth-area');

        var user = {};

        var getUser = function(){
            return user;
        }
        var setGoogleInfos = function(googleUserObj){
            user.googleInfos = googleUserObj;
            return user;
        }
        var setFormInfos = function(formUserObj, callback){
            user.formInfos = formUserObj;
            callback(user.formInfos);
        }
        var getGoogleInfos = function(){
            return this.googleInfos;
        }
        var setTestInfos = function(testObj){
            user.testInfos = testObj;
            return user;
        }
        var generateAccountsSelect = function(accounts){
            var options = ['<option value="">Selecione a conta</option>'];
            $.each(accounts, function(i,v){
                options += '<option value="'+ v.id +'">'+ v.name +'</option>';
            });

            $('#accountsG').html(options);
        }

        var generatePropertiesSelect = function(properties){
            var options = ['<option value="">Selecione a propriedade</option>'];
            $.each(properties, function(i,v){
                options += '<option value="'+ v.id +'">'+ v.name +'</option>';
            });

            $('#propertiesG').html(options);
        }

        var generateViewSelect = function(views){
            var options = ['<option value="">Selecione a vista</option>'];
            $.each(views, function(i,v){
                options += '<option value="'+ v.id +'">'+ v.name +'</option>';
            });
            $('#viewG').html(options);
        }


        // Re-fatorar unir as funcoes getFormData e getContactData em uma unica funcao que recebera a instancia do form
        var getFormData = function (){
            var values = {};
            $.each($('#form').serializeArray(), function(i, field) {
                values[field.name] = field.value;
            });

            return values;
        }

        var getContactData = function (){
            var values = {};
            $.each($('#contact-form').serializeArray(), function(i, field){
                values[field.name] = field.value;
            });
            return values;
        }

        var generateErrosList =  function (list){
            var items = [];
            $.each(list, function(i,v){
                if(v.post){
                    items += '<li><a href="#" class="check-link"><i class="fa fa-square-o"></i> </a><span class="m-l-xs">'+ v.message +'</span><a href="'+ v.post +'" class="label label-primary">Veja como resolver esse problema</a></li>';
                }else{
                    items += '<li><a href="#" class="check-link"><i class="fa fa-square-o"></i> </a><span class="m-l-xs">'+ v.message +'</span></li>';
                }
            });
            $('#notifications').append(items);
        }

        var generateCorrectList =  function(list){
            var items = [];
            $.each(list, function(i,v){
                items += '<li><a href="#" class="check-link"><i class="fa fa-check-square"></i> </a><span class="m-l-xs todo-completed">'+ v.message +'</span></li>';
            });
            $('#notifications').append(items);
        }

        var subscribeUser = function(user){
            $.ajax({
                url: 'http://admin.metricasboss.com.br/auditings.json',
                type: 'POST',
                data: user
            });

        }

        var getCookie = function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length,c.length);
                }
            }
            return "";
        }

        var CheckNewsletterCookie = function(){
            var cookieNews = getCookie('newsletter');
            if(cookieNews != ""){
                $('.newsletter-signup-post').hide();
            }
        }

        var SetNewsletterCookie = function(){
            var cookie = document.cookie = 'newsletter=true';
            cosole.log(document.cookie);
        }

        var SignupUserNewsletter = function(){
            $('.newsletter-signup-post').submit(function(evt){
                $('.loading-news').show();
                $.ajax({
                    url: 'http://admin.metricasboss.com.br/subscribe',
                    type: 'POST',
                    data: $(this).serializeArray()
                }).done(function(data){
                    if(!data.id){
                        var timeoutLoading = setTimeout(function () {
                            $('.loading-news').hide();
                            $('#error-news-alert').fadeIn();

                            // Escondendo mensagem de erro;
                            var errorNews = setTimeout(function(){
                                $('#error-news-alert').fadeOut();
                                clearTimeout(errorNews);
                            }, 2000)

                            clearTimeout(timeoutLoading);
                        }, 2000);
                    }else{
                        var timeoutLoading = setTimeout(function () {
                            $('.newsletter-signup-post .input-group').hide();
                            $('.if-success').html("Obrigado por se cadastrar na nossa newsleter");
                            $('.loading-news').hide();
                            SetNewsletterCookie();
                            clearTimeout(timeoutLoading);
                        }, 2000);
                    }

                });
                evt.preventDefault();
            })
        }
        var ContactSubmit = function(){
            $('#contact-form').submit(function(evt){
                $.ajax({
                    url: 'http://admin.metricasboss.com.br/contact',
                    type: 'POST',
                    data: $(this).serializeArray()
                });
                evt.preventDefault();
            });
        }
        // Public
            return {
                init: function(){
                    this.clickAuth();
                    this.changeAccountSelect();
                    this.changePropertieSelect();
                    this.changeViewPropertieSelect();
                    this.clickCheckAccount();
                    this.clickFinish();
                    this.disableElements();
                    this.loadingTyped();
                    this.ContactSubmit();
                    this.clientsFix();
                },

                // Desativando hover clientes

                // Bug fix amp ontouch start
                // clientsFix: function(){
                //     $(document).on('touchstart click', '.flip-container', function(event){
                //         event.stopPropagation();
                //         event.preventDefault();
                //         if(event.handled !== true) {
                //             this.classList.toggle('hover');
                //             event.handled = true;
                //         } else {
                //             return false;
                //         }
                //     });
                // },

                clickAuth: function (){
                    $('#auth-button').click(function(event){
                        var accounts = Google.autorize(event, function(response){
                            if(response.result.items){
                                generateAccountsSelect(response.result.items);
                                $("#form").steps("next");
                            }
                        });
                        return false;
                    });
                },
                changeAccountSelect: function(){

                    $('#accountsG').change(function(){
                        userAccountId = $(this).val();
                        if(userAccountId !== null && userAccountId !== ''){
                            Google.queryProperties(userAccountId, function(response){
                                if(response.result.items){
                                    generatePropertiesSelect(response.result.items);
                                    $('#propertiesG').prop("disabled", false);
                                }
                            });
                        }
                    });
                },
                changePropertieSelect: function(){

                    $('#propertiesG').change(function(){
                        webPropertieAccountId = $(this).val();
                        if(webPropertieAccountId !== null && webPropertieAccountId !== ''){
                            Google.queryProfiles(userAccountId, webPropertieAccountId, function(response){
                                if(response.result.items){
                                    generateViewSelect(response.result.items);
                                    $('#viewG').prop("disabled", false);
                                }
                            });
                        }
                    });
                },
                changeViewPropertieSelect: function(){

                    $('#viewG').change(function(){
                        webViewPropertieAccountId = $(this).val();
                        if(webViewPropertieAccountId !== null && webViewPropertieAccountId !== ''){
                            Google.queryViewsProperties(userAccountId, webPropertieAccountId, webViewPropertieAccountId, function(response){
                                setGoogleInfos(response.result);
                                $('#go-button').removeAttr('disabled');
                            });
                        }
                    });
                },
                clickCheckAccount: function(){
                    $('#go-button').click(function(event){
                        $('#form').steps('next');
                        event.preventDefault();
                    });
                },
                clickFinish: function(){
                    $('#finish-button').click(function(event){
                        $('.loading').show();
                        setFormInfos(getFormData(), function(){
                            Validations.validateUser(user, function(vals){
                                Validations.filterResult(vals, function(result){
                                    var testInfos = {
                                        fail_test: result.incorrect.items.length,
                                        success_test: result.correct.items.length,
                                        score_test: Math.round(result.correct.count)
                                    };
                                    setTestInfos(testInfos);
                                    subscribeUser(user);
                                    $('#success-test').text(result.correct.items.length);
                                    generateCorrectList(result.correct.items);

                                    $('#fail-test').text(result.incorrect.items.length);
                                    generateErrosList(result.incorrect.items);

                                    $('#score-test').text(Math.round(result.correct.count) + '%');
                                    $('.ibox-content .content').css('height', '910px');
                                    $('#form').steps('next');
                                    $('.loading').hide();
                                });
                            });
                        });
                        event.preventDefault();
                    });
                },
                subscribeUser: subscribeUser,
                getUser: getUser,
                disableElements: function(){
                    $('#propertiesG').prop("disabled", true);
                    $('#viewG').prop("disabled", true);
                    $('#go-button').attr('disabled', 'disabled');
                },
                loadingTyped: function(){
                    $("#typed").typed({
                        strings: ["jogando um fifa.", "salvando o mundo." ,"analisando sua conta."],
                        typeSpeed: 50,
                        loop: true
                    });
                },
                SignupUserNewsletter: SignupUserNewsletter,
                ContactSubmit: ContactSubmit,
                CheckNewsletterCookie: CheckNewsletterCookie
            }
})();
