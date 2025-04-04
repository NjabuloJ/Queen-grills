const axios = require("axios");
const { keith } = require(__dirname + "/../keizzah/keith");
const { format } = require(__dirname + "/../keizzah/mesfonctions");
const os = require('os');
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

const readMore = String.fromCharCode(8206).repeat(4001);

const formatUptime = (seconds) => {
    seconds = Number(seconds);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return [
        days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : '',
        hours > 0 ? `${hours} ${hours === 1 ? "hour" : "hours"}` : '',
        minutes > 0 ? `${minutes} ${minutes === 1 ? "minute" : "minutes"}` : '',
        remainingSeconds > 0 ? `${remainingSeconds} ${remainingSeconds === 1 ? "second" : "seconds"}` : ''
    ].filter(Boolean).join(', ');
};

// Fetch GitHub stats and multiply by 10
const fetchGitHubStats = async () => {
    try {
        const response = await axios.get("https://api.github.com/repos/NjabuloJ/Njabulo-Jb");
        const forksCount = response.data.forks_count * 11; 
        const starsCount = response.data.stargazers_count * 11; 
        const totalUsers = forksCount + starsCount; 
        return { forks: forksCount, stars: starsCount, totalUsers };
    } catch (error) {
        console.error("Error fetching GitHub stats:", error);
        return { forks: 0, stars: 0, totalUsers: 0 };
    }
};

keith({
    nomCom: "repo",
    aliases: ["script", "sc"],
    reaction: '🦋',
    nomFichier: __filename
}, async (command, reply, context) => {
    const { repondre, auteurMessage, nomAuteurMessage } = context;

    try {
        const response = await axios.get("https://api.github.com/repos/NjabuloJ/Njabulo-Jb");
        const repoData = response.data;

        if (repoData) {
            
            const repoInfo = {
                stars: repoData.stargazers_count * 11,
                forks: repoData.forks_count * 11,
                updated: repoData.updated_at,
                owner: repoData.owner.login
            };

            const releaseDate = new Date(repoData.created_at).toLocaleDateString('en-GB');
            const message = `
            *Hello 👋 ${nomAuteurMessage}*

            *🦋ǫᴜᴇᴇɴ ɢʀɪʟʟs🦋*
            the best bot in the universe developed by ${conf.OWNER_NAME}. Fork and give a star 🌟 to my repo!
    *╭┈─────────────•*
    *┋╭┈───────────•*
    *┋┋*  *Stars:* - ${repoInfo.stars}
    *┋┋*  *Forks:* - ${repoInfo.forks}
    *┋┋*  *Release date:* - ${releaseDate}
    *┋┋*  *Repo:* - ${repoData.html_url}
    *┋┋*  *Owner:*   *${conf.OWNER_NAME}*
    *┋╰┈───────────•*
    *╰┈─────────────•*`;

         await reply.sendMessage(command, {
         text: message,
         contextInfo: {
         isForwarded: true,
         forwardedNewsletterMessageInfo: {
         newsletterJid: '120363345407274799@newsletter',
         newsletterName: "🦋ǫᴜᴇᴇɴ ɢʀɪʟʟs🦋",
         serverMessageId: 143,
         },
         forwardingScore: 999, // Score to indicate it has been forwarded
         externalAdReply: {
           title: "🦋ǫᴜᴇᴇɴ ɢʀɪʟʟs🦋",
           body: "message on",
           thumbnailUrl: 'https://files.catbox.moe/cs7xfr.jpg', // Add thumbnail URL if required 
           sourceUrl: 'https://whatsapp.com/channel/0029VarYP5iAInPtfQ8fRb2T', // Add source URL if necessary
           mediaType: 1,
           renderLargerThumbnail: true
                    }
                }
            });
        } else {
            console.log("Could not fetch data");
            repondre("An error occurred while fetching the repository data.");
        }
    } catch (error) {
        console.error("Error fetching repository data:", error);
        repondre("An error occurred while fetching the repository data.");
    }
});
