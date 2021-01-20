# Readme

Lock your windows desktop by telegram bot.

Use command `/lock` to lock your desktop, if succeed, bot will reply time of the system.

*Bot use "long poll" request to get updates from Telegram bot server. According to the [document](https://core.telegram.org/bots/api#getupdates), running with multiple instances will cause undefined behavior.*

Don't forget: Proxy might be required if your network is censored.

Environment Variable:

- `botkey`: ask from [@BotFather](https://t.me/botfather). *Required*
- `admin_uid`: uid list who can lock your desktop, split by `,` , such as: `123456,456789`. *Required*
- `loop_delay`: delay between poll request in ms. default: `3000`
- `poll_timeout`: poll request timeout in seconds, default: `30` 

Tested on Windows 10 20H2 with `deno 1.6.3 (release, x86_64-pc-windows-msvc) v8 8.8.294 typescript 4.1.3`

## License

Following libraries were used in this project. 
- [js-joda](https://github.com/js-joda/js-joda) in BSD license.
- [voca](https://github.com/panzerdp/voca) in MIT license.
- `lib.deno.d.ts` in MIT license. 