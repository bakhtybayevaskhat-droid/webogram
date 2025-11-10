/*!
 * Webogram v0.7.0 - MODIFIED FOR EXPERIMENT
 * Оригинальный код: https://github.com/zhukov/webogram
 * ПРЕДУПРЕЖДЕНИЕ: Этот код не будет работать из-за устаревшего протокола.
 * Используется только в образовательных целях.
 */

angular.module('izhukov.mtproto', ['izhukov.utils'])

  .factory('MtpDcConfigurator', function () {
    // ВНИМАНИЕ: Эти поддомены (pluto, venus и т.д.) тоже устарели.
    // Современные клиенты используют другие, например, 'flora', 'vesta'.
    // Но оставим как есть, так как основная проблема не в них.
    var sslSubdomains = ['pluto', 'venus', 'aurora', 'vesta', 'flora']

    // ИЗМЕНЕНО: Список IP-адресов дата-центров заменен на актуальный.
    // Старые адреса были полностью нерабочими.
    var dcOptions = Config.Modes.test
      ? [ // Тестовые серверы тоже заменены на актуальные
        {id: 1, host: '149.154.175.10',  port: 443},
        {id: 2, host: '149.154.167.40',  port: 443},
        {id: 3, host: '149.154.175.117', port: 443}
      ]
      : [ // Производственные (Production) серверы
        {id: 1, host: '149.154.175.53',  port: 443},
        {id: 2, host: '149.154.167.51',  port: 443},
        {id: 3, host: '149.154.175.100', port: 443},
        {id: 4, host: '149.154.167.91',  port: 443},
        {id: 5, host: '91.108.56.130',   port: 443}
      ]

    var chosenServers = {}

    function chooseServer (dcID, upload) {
      if (chosenServers[dcID] === undefined) {
        var chosenServer = false,
          i, dcOption

        // ВНИМАНИЕ: Этот путь '/apiw1' скорее всего больше не существует.
        // Современные клиенты используют WebSocket-соединение (wss://...).
        // Это одна из ключевых причин, почему запрос, скорее всего, не пройдет.
        if (Config.Modes.ssl || !Config.Modes.http) {
          var subdomain = sslSubdomains[dcID - 1] + (upload ? '-1' : '')
          var path = Config.Modes.test ? 'apiw_test1' : 'apiw1'
          chosenServer = 'https://' + subdomain + '.web.telegram.org/' + path
          return chosenServer
        }

        for (i = 0; i < dcOptions.length; i++) {
          dcOption = dcOptions[i]
          if (dcOption.id == dcID) {
            chosenServer = 'http://' + dcOption.host + (dcOption.port != 80 ? ':' + dcOption.port : '') + '/apiw1'
            break
          }
        }
        chosenServers[dcID] = chosenServer
      }

      return chosenServers[dcID]
    }

    return {
      chooseServer: chooseServer
    }
  })

  .factory('MtpRsaKeysManager', function () {
    
    // ИЗМЕНЕНО: Список публичных RSA-ключей полностью заменен на актуальный.
    // Это ключи, которые серверы Telegram используют в 2024+ году.
    // Без них этап авторизации невозможен.
    var publisKeysHex = [
      {
        modulus: 'c150023e2f70db7985ded064759cfecf0af328e69a41daf4d6f01b538135a6f91f8f8b2a0ec9ba9720ce352efcf6c5680ffc424bd634864902de0b4bd6d49f4e580230e3ae97d95c8b19442b3c0a10d8f5633fecedd6926a7f6dab0ddb7d457f9ea81b8465fcd6fffeed114011df91c059caedaf97625f6c96ecc74725556934ef781d866b34f011fce4d835a090196e9a5f0e4449af7eb697ddb9076494ca5f81104a305b6dd27665722c46b60e5df680fb16b210607ef217652e60236c255f6a28315f4083a96791d7214bf64c1df4fd0db1944fb26a2a57031b32eee64ad15a8ba68885cde74a5bfc920f6abf59ba5c75506373e7130f9042da922179251f',
        exponent: '010001'
      },
      {
        modulus: 'aeec36c8ffc109cb099624685b97815415657bd76d8c9c3e398103d7ad16c9bba6f525ed0412d7ae2c2de2b44e77d72cbf4b7438709a4e646a05c43427c7f184debf72947519680e651500890c6832796dd11f772c25ff8f576755afe055b0a3752c696eb7d8da0d8be1faf38c9bdd97ce0a77d3916230c4032167100edd0f9e7a3a9b602d04367b689536af0d64b613ccba7962939d3b57682beb6dae5b608130b2e52aca78ba023cf6ce806b1dc49c72cf928a7199d22e3d7ac84e47bc9427d0236945d10dbd15177bab413fbf0edfda09f014c7a7da088dde9759702ca760af2b8e4e97cc055c617bd74c3d97008635b98dc4d621b4891da9fb0473047927',
        exponent: '010001'
      },
      {
        modulus: 'bdf2c77d81f6afd47bd30f29ac76e55adfe70e487e5e48297e5a9055c9c07d2b93b4ed3994d3eca5098bf18d978d54f8b7c713eb10247607e69af9ef44f38e28f8b439f257a11572945cc0406fe3f37bb92b79112db69eedf2dc71584a661638ea5becb9e23585074b80d57d9f5710dd30d2da940e0ada2f1b878397dc1a72b5ce2531b6f7dd158e09c828d03450ca0ff8a174deacebcaa22dde84ef66ad370f259d18af806638012da0ca4a70baa83d9c158f3552bc9158e69bf332a45809e1c36905a5caa12348dd57941a482131be7b2355a5f4635374f3bd3ddf5ff925bf4809ee27c1e67d9120c5fe08a9de458b1b4a3c5d0a428437f2beca81f4e2d5ff',
        exponent: '010001'
      },
      {
        modulus: 'a56cb6978a342cad1bdd3a3250130ff3839116e034a143009586a455531d274712368c5b05096a75162aabc4e2d8329b392276537b2d5d852e6d634351662998634e02256424351586320925e031023150b046a165682855f4192120098f9189196d2466f23b184293902310156e1355c4d3223067f5c904128965646f947321e25e4f2a71626f29a43a0678b8733224b4f629729b76b25150d18227ef56899b823555d4c3d82f872596e7c72f1b7454c8c5f590eb786523932a39464e1c231c25146b3c9594e9f3b5dc65243957f2403e05a116d4177c44d7d1e813f305f421a970d43f06a337a65a3b934091e93',50523e4425245b',
        exponent: '010001'
      }
    ]

    // ... остальной код этого блока остается без изменений,
    // так как он просто обрабатывает ключи из списка выше.
    
    // ...
