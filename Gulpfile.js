var gulp = require('gulp');

gulp.task('deploy', function() {
  var spawn = require('child_process').spawn;
  var jekyll = spawn('jekyll', ['build', '--config=_config.yml,_config_prod.yml'], {stdio: 'inherit'});

  jekyll.on('exit', function(code) {
    if(code === 0) {
      require('child_process').spawn('s3_website',  ['push'], {stdio: 'inherit'});
    } else {
       process.stdout.write("Build failed. Exit code: " + code);
    }

  });
});
