# Métricas Boss

> A [Métricas Boss](http://metricasboss.com.br) é uma agência de Web Analytics e usabilidade. Conte com uma empresa certificada Google Analytics para sua gestão de web analytics.

## Configuração do projeto

Para a construção do nosso site, utilizamos o [Jekyll](http://jekyllrb.com/) como plataforma e gerador.

Para rodar o site localmente siga os passos a seguir:

### Clone esse projeto

    git clone git@bitbucket.org:metricasboss/new.metricasboss.com.br.git

### Instale o Ruby

A melhor maneira de se fazer isso é utilizando o [RVM](https://rvm.io/) ou o [rbenv](https://github.com/rbenv/rbenv).

Também é possível fazer isso seguindo as instruções do [site oficial](https://www.ruby-lang.org/pt/).

### Instale o Bundler (gerenciador de dependências):

    $ gem install bundler

### Instale as gems necessárias

    $ bundle install

### Inicie o servidor do Jekyll

    $ bundle exec jekyll serve

### Pronto!

Agora basta acessar [localhost:4000](http://localhost:4000/).

## Para fazer o deploy

### Instale as dependencias

    $ npm install

PS. Caso não tenha o node instalado é só procurar sua versão em [Nodejs](https://nodejs.org)

Nossa infraestrutura se encontra na nuvem hospedando todo o nosso site em um bucket no s3 da amazon, o deploy deverá ser feito via `gulp deploy`.
