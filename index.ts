import {LocalDateTime, ZonedDateTime} from "https://jspm.dev/@js-joda/core"
import v from './voca.ts'

const getConfig = () => {
    const key = v.trim(getEnv('botkey').trim(), '"');
    const adminUids = v.trim(getEnv('admin_uid').trim(), '"')
    const delayTime = parseInt(v.trim(getEnv('loop_delay', '3000').trim(), '"'))
    const pollTimeout = parseInt(v.trim(getEnv('poll_timeout', '30').trim(), '"'))
    const uids = v.trim(adminUids, '"').split(',').map(it => parseInt(it.trim()))
    console.log(`admin_uid.size: ${uids.length}`)
    console.log(`loop_delay: ${delayTime}`)
    console.log(`poll_timeout: ${pollTimeout}`)
    return {adminUid: uids, botKey: key, delayTime, pollTimeout}
}

const getEnv = (key: string, defaultValue?: string): string =>
    Deno.env.get(key) !== undefined ? Deno.env.get(key)!!
        : (defaultValue !== undefined ? defaultValue : error(`env: ${key} has no default value`))


const main = async (): Promise<void> => {
    while (true) {
        try {
            const updates = await getUpdates()
            const msg = updates.find(it => it.message.text.startsWith('/lock') && adminUid.find(i => i === it.message.from.id) !== undefined)
            if (msg !== undefined) {
                console.log(JSON.stringify(msg))
                lock()
                doReq('sendMessage', {
                    chat_id: msg.message.chat.id,
                    reply_to_message_id: msg.message.message_id,
                    parse_mode: 'HTML',
                    text: `Processed: <pre>${ZonedDateTime.now()}</pre>`,
                    allow_sending_without_reply: true
                })
            }
        } catch (e) {
        }
        await timeout(delayTime)
    }
}

let lastUpdateId = 0


const getUpdates = async (): Promise<any[]> => {
    const updates = await doReq('getUpdates', {
        timeout: pollTimeout,
        offset: lastUpdateId,
        allowed_updates: ['message']
    }) as any[]
    updates.forEach((it) => {
        lastUpdateId = Math.max(it.update_id, lastUpdateId) + 1
    })
    return updates
}

async function doReq(method: string, obj: any | undefined = undefined) {
    const action = obj === undefined ? 'GET' : 'POST'
    const payload = action !== undefined ? JSON.stringify(obj) : undefined
    const url = `https://api.telegram.org/bot${botKey}/${method}`
    const res = await (await fetch(url, {
        method: action,
        body: payload,
        headers: {'content-type': 'application/json'}
    })).json()
    if (res.ok) {
        return res.result
    } else {
        throw new Error(`[${res.error_code}]: ${res.description}`)
    }
}

const lock = () => {
    Deno.run({
        cmd: ['rundll32.exe', 'user32.dll,LockWorkStation']
    })
}

const timeout = (ms: number) => new Promise((resolve, _: any) => setTimeout(resolve, ms))
const error = (msg: string): never => {
    throw new Error(msg)
}
const {adminUid, botKey, delayTime, pollTimeout} = getConfig()
console.log(`started: ${ZonedDateTime.now()}`)
await main()