<?php
require 'vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

// Add CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$client = new Client();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    try {
        $response = $client->post('http://localhost:5555/chat/completions', [
            'stream' => true,
            'headers' => [
                'Accept' => 'text/event-stream',
            ],
        ]);

        $body = $response->getBody();

        header('Content-Type: text/event-stream');
        header('Cache-Control: no-cache');

        while (!$body->eof()) {
            echo \GuzzleHttp\Psr7\Utils::readLine($body);
            ob_flush();
            flush();
        }
    } catch (RequestException $e) {
        echo 'Request failed: ' . $e->getMessage();
    }
} else {
    echo 'This endpoint only accepts POST requests.';
}
