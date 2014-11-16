<?php
/**
 * Created by PhpStorm.
 * User: ader
 * Date: 11/14/14
 * Time: 9:40 PM
 */


require dirname(__DIR__) . '\vendor\autoload.php';
require dirname(__DIR__) . '\Exchanger.php';

$server = \Ratchet\Server\IoServer::factory(
    new \Ratchet\Http\HttpServer(
        new \Ratchet\WebSocket\WsServer(
        new Exchanger()
        )
    ),
    8080
);

$server->run();