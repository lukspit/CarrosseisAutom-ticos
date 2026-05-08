const fs = require('fs');
const path = require('path');

const API_KEY = "tgp_v1_5oE_ae7gu7EKnytbH35U2UNHsJA9wcV1ue2Pw9v_RwQ";

async function testarTogether() {
    console.log("Iniciando teste com Together AI (FLUX.1 Schnell)...");
    
    try {
        const response = await fetch('https://api.together.xyz/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "black-forest-labs/FLUX.1-schnell",
                prompt: "A close-up cinematic photo of a stressed freelance developer working late at night, messy desk with coffee cups, dark room with glowing monitor light, highly detailed, photorealistic",
                width: 1024,
                height: 1024,
                steps: 4,
                n: 1,
                response_format: "b64_json"
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ Erro na API. Pode ser bloqueio por conta nova ou saldo.");
            console.error("Detalhes do erro:", JSON.stringify(data, null, 2));
            return;
        }

        const b64 = data.data[0].b64_json;
        const buffer = Buffer.from(b64, 'base64');
        
        // Garante que a pasta output existe
        const outDir = path.resolve(__dirname, '../output');
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        const outputPath = path.resolve(outDir, 'teste-together-flux.png');
        fs.writeFileSync(outputPath, buffer);
        console.log(`✅ Imagem gerada com sucesso e salva em: ${outputPath}`);

    } catch (error) {
        console.error("Erro ao executar:", error);
    }
}

testarTogether();
