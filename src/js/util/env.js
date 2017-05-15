
import $g from '../common/gome-brige.js';

$g.ready()
    .then(function() {

    	$('body').prepend('<button id="login">登陆</button>');
    	$g.getUserInfo()
    		.then(function(res) {
    			$('body').prepend('<h1>test</h1>');
    			$('body').prepend(res);
    		}, function(e) {
    			if (e) {
    				$('body').prepend(e);	
    			}
    		})

    	$('#login').on('click', function() {
    	    $g.login();
    	});

    }, function(err) {
        console.log(err);
    })