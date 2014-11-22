<?php
/**
 * Created by PhpStorm.
 * User: ader
 * Date: 11/14/14
 * Time: 9:07 PM
 */

use \Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Exchanger implements MessageComponentInterface {

    protected $clients;

    const MOVE_COMMAND = "move";
    const CLICK_COMMAND = "click";

    public function __construct() {
        $this->clients = new \SplObjectStorage();
    }

    public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $data = json_decode($msg, true);

        $res = $res = array('id'=>$from->resourceId);

        $move = $this::MOVE_COMMAND;
        if (isset($data[$move])) {
            $move_pos = $data[$move];
            $res[$move] = array("x"=>$move_pos["x"], "y"=>$move_pos["y"]);
        }


        $click = $this::CLICK_COMMAND;
        if (!empty($data[$click])) {
            $click_pos = $data[$click];
            $res[$click] = array("x"=>$click_pos["x"], "y"=>$click_pos["y"]);
        }

        $response = json_encode($res, JSON_FORCE_OBJECT);

        foreach ($this->clients as $client) {
            if ($from !== $client) {
                // The sender is not the receiver, send to each client connected
                $client->send($response);
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }

} 