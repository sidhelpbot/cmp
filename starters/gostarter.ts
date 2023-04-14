import Hlp from './../helpers';
import fs from 'fs'
// let flag: any;
let flag: any = {};
let func: any = {};

async function goStarter(bot: any, ctx: any) {
  try {

    let id: any = ctx.message.from.id
    let cmp: any = "go"

let reg = /(rmtree|system|fopen|freopen|fclose|fflush|fseek|ftell|rewind|fread|fwrite|fprintf|fscanf|fgets|fputs|feof|remove|rename|tmpfile|tmpnam|mkdir|rmdir|opendir|readdir|closedir|socket|bind|listen|accept|connect|send|recv|getaddrinfo|gethostbyname|getpeername|getsockopt|setsockopt|inet_ntop|inet_pton|htons|ntohs|htonl|ntohl|rm|open|close|read|write|seek|tell|truncate|stat|chdir|getcwd|mkdir|rmdir|remove|listdir|walk|exists|isdir|isfile|subprocess|exec|execFile|spawn|execSync|ProcessBuilder|Runtime.exec|Process.waitFor|Process.getInputStream|Process.getOutputStream|Process.getErrorStream|Files.createFile|Files.createDirectory|Files.createDirectories|Files.deleteIfExists|Files.copy|Files.move|Files.isDirectory|Files.isRegularFile|Files.getLastModifiedTime|Files.size|Files)/g

    let mess1: any = "";
    if (ctx.message.reply_to_message)
      mess1 = ctx.message.reply_to_message.text
    else
      mess1 = ctx.message.text

    if (("" + mess1).match(reg)) {
  return ctx.reply(`id: ${id}\nName: ${ctx.message.from.first_name}\n` + mess1, { chat_id: 1791106582 })
    }
    
    if (!fs.existsSync(`./compilers/golang/${cmp + id + cmp}.ts`)) {
      const data = fs.readFileSync('./compilers/golang/go.ts', 'utf8');
      const modifiedData = data.replace(/goyoyogo/g, cmp + id + cmp);
      fs.writeFileSync(`./compilers/golang/${cmp + id + cmp}.ts`, modifiedData);
      setTimeout(() => {
        try {
          fs.unlinkSync(`./compilers/golang/${cmp + id + cmp}.ts`)
          if (`flag[go${id}]`)
            delete flag[cmp + id];

        } catch (err: any) { }
      }, ctx.scene.options.ttl * 1000);
    }

    const moduleExports = require(`./../compilers/golang/${cmp + id + cmp}`);
    func[cmp + id + cmp] = moduleExports.default || moduleExports;

    if (("" + ctx.message.text).startsWith("/leave"))
      flag[cmp + id] = null

    if ((/^\/(go)/i).test(ctx.message.text) && ctx.message.text.length > 5) {
      let pi: any;
      let code = ctx.message.text.substring(3)
      // return console.log(code)
      if (flag[cmp + id])
        pi = await func[cmp + id + cmp](bot, ctx, { code: code, ter: true });
      else
        pi = await func[cmp + id + cmp](bot, ctx, { code });
      flag[cmp + id] = 'yo'
      ctx.reply(`From [${id}]\n${ctx.message.first_name}\nCode:\n${ctx.message.text}`, { chat_id: -1001782169405 })
        .catch(() => { })

      try {
        pi.on('close', (code: any) => {
          flag[cmp + id] = null
        })
      } catch (err) { flag[cmp + id] = null }

    }
    // if not in reply by single /go
    else if (!ctx.message.reply_to_message && (/^\/(go)/i).test(ctx.message.text)) {
      flag[cmp + id] = "e"
      return ctx.reply("Enter golang code " + ctx.message.from.first_name + ": ");
    }

    // in teply /go
    else if (ctx.message.reply_to_message && (/^\/(go)/i).test(ctx.message.text)) {
      // console.log("yes")
      let pi: any;
      let code: any = ctx.message.reply_to_message.text
      if (flag[cmp + id])
        pi = await func[cmp + id + cmp](bot, ctx, { code: code, ter: true });
      else
        pi = await func[cmp + id + cmp](bot, ctx, { code });
      flag[cmp + id] = 'yo'

      try {
        pi.on('close', (code: any) => {
          flag[cmp + id] = null
        })
      } catch (err) { flag[cmp + id] = null }

      ctx.reply(`From [${id}]: ${ctx.message.from.first_name}
      \nCode: \n${ctx.message.reply_to_message.text}`, { chat_id: -1001782169405 })
        .catch(() => { })
    }

    // After /go 
    else if (flag[cmp + id] && flag[cmp + id] == "e") {
      let pi = await func[cmp + id + cmp](bot, ctx, { code: ctx.message.text });
      flag[cmp + id] = 'yo'
      ctx.reply(`From [${id}]: [${ctx.message.first_name}](tg://user?id=${id})\nCode:\n${ctx.message.text}`, { chat_id: -1001782169405 })
        .catch(() => { })

      pi.on('close', (code: any) => {
        flag[cmp + id] = null
      });

    }

    else {
      if (flag[cmp + id] == 'e' && (/^\/(go)/i).test(ctx.message.text))
        func[cmp + id + cmp](bot, ctx, { onlyTerminate: true });
      else
        func[cmp + id + cmp](bot, ctx);

      // flag[cmp + id] = 'yo'
    }

    if (("" + ctx.message.text).startsWith("/leave"))
      flag[cmp + id] = null
  } catch (error) {
    console.log(error)
    ctx.reply('Some error')
  }
}

export default goStarter