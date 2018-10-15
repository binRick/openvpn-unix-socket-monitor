#!/usr/bin/env node

var fs = require('fs'),
    l = console.log,
    socketPath = '/root/management.sock',
    Ipc = require('easy-ipc'),
    ipc = new Ipc({
        socketPath: socketPath,
        dataType: 'text',
        reconnect: true,
        delayReconnect: 3000,
    }),
    qI = null,
    qIi = 3000;


ipc.on('connect', function(conn) {
    var pullStatus = function() {
        conn.write('status\n');
        conn.write('pid\n');
    };

    qI = setInterval(pullStatus, qIi);
    pullStatus();
    ipc.on('data', function(data) {
        l(data);
    });
    ipc.on('close', function() {
        l('socket closed');
        clearInterval(qI);
    });
    ipc.on('reconnect', function(conn) {
        l('socket reconnected');
        qI = setInterval(pullStatus, qIi);
    });
}).start();
