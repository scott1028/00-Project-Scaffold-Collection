'use strict';

module.exports = function(grunt) {

    var clientTomcatPort = (function(){
        if(typeof grunt.option('x-rewrite') === 'number')
            return grunt.option('x-rewrite');
        return false;
    })();


    //
    var rewriteRuleMiddleware = function(req, res, next) {
        var originRule = require('./.htaccess.js').rewrite;


        //
        if(clientTomcatPort){
            var toClientTomcat = '^/api/(.*)$ http://' + req.client._peername.address + ':' + clientTomcatPort + '/api/$1 [P,L]';
            originRule.shift();
            originRule.unshift(toClientTomcat);
            console.log(originRule);
        }

        //
        return require('connect-modrewrite')(originRule)(req, res, next);
    };


    //
    var staticFileMiddleware = function(req, res, next) {
        var finalhandler = require('finalhandler');  // if you no use this plugin, when client get nonexisted file, connect server will shutdown.
        var serveStatic = require('serve-static');
        var serve = serveStatic(staticPath);
        serve(req, res, next);
    };


    //
    var bowerComponentsMiddleware = function(req, res, next) {
        var finalhandler = require('finalhandler');  // if you no use this plugin, when client get nonexisted file, connect server will shutdown.
        var serveStatic = require('serve-static');
        var serve = serveStatic('./');
        var done = finalhandler(req, res);
        serve(req, res, done);
    };


    //
    var allMiddlewares = function(connect, options) {
        var optBase = (typeof options.base === 'string') ? [options.base] : options.base;
        console.log(23);
        return [
            rewriteRuleMiddleware,   // rewriteRule support
            staticFileMiddleware,    // staticFile serve
            bowerComponentsMiddleware
        ]
    }


    //
    var staticPath = './app';


    //
    grunt.loadNpmTasks('grunt-wiredep');


    //
    grunt.initConfig({
        wiredep: {
            task: {
                src: [
                    './app/*.html', // .html support...
                ],
            }
        },
        connect: {
            options: {
                port: 3333,
                hostname: '*',
                keepalive: true,    // 維持伺服器開啟
                debug: true
            },
            development: {
                options: {
                    middleware: allMiddlewares
                }
            }
        }
    });


    //
    grunt.loadNpmTasks('grunt-contrib-connect');


    //
    grunt.registerTask('lift', function (target) {
        grunt.task.run([
            'connect:development'
        ]);
    });


    //
    grunt.registerTask('default', function (target) {
        console.log('No select Task.');
    });
};
