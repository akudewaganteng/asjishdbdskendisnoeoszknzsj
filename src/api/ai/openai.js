module.exports = function (app) {
    const Groq = require('groq-sdk');

    let api = [
        "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",
        "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",
        "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",
        "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"
    ];

    let apikey = api[Math.floor(Math.random() * api.length)];

    const client = new Groq({
        apiKey: apikey,
    });

    async function groq(teks, prompt = `sekarang kamu adalah ai yang mengetahui tentang semua bahasa pemrograman dan selalu gunakan bahasa Indonesia saat menjawab semua pertanyaan!`) {
        try {
            const chatCompletion = await client.chat.completions.create({
                messages: [
                    { role: 'system', content: prompt },
                    { role: 'user', content: teks }
                ],
                model: 'llama3-8b-8192',
            });

            return {
                status: true,
                respon: chatCompletion.choices[0].message.content
            };

        } catch (e) {
            console.error("Error in Groq API:", e);
            return {
                status: false,
                respon: "Error: " + e.message
            };
        }
    }

    app.get("/ai/openai", async (req, res) => {
        const { msg } = req.query;
        if (!msg) {
            return res.status(400).json({ status: false, message: "Isi Parameternya!" });
        }

        try {
            let anu = await groq(msg);
            res.json({
                status: anu.status,
                result: anu.respon
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "An error occurred while fetching data." });
        }
    });
};
