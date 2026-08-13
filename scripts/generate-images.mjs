import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read API key from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const apiKeyMatch = envContent.match(/NANO_BANANA_API_KEY=(.+)/);
const API_KEY = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!API_KEY) {
  console.error('NANO_BANANA_API_KEY not found in .env.local');
  process.exit(1);
}

const MODEL = 'gemini-3.1-flash-image';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const imagesToGenerate = [
  {
    filename: 'hero-bg.jpg',
    prompt: 'A vibrant flat lay photograph of colorful Algerian school supplies arranged on a clean white marble surface. Items include: notebooks with Arabic calligraphy covers, sharpened pencils, geometric rulers, a small backpack, colored markers, and an apple. Bright natural lighting from the top-left, soft shadows, professional product photography style. Warm and inviting atmosphere. No text in the image.',
    aspectRatio: '16:9',
  },
  {
    filename: 'primaire.jpg',
    prompt: 'A cheerful blue-themed school kit for young elementary children. A cute cartoon-style blue backpack surrounded by colorful pencils, erasers shaped like animals, small notebooks with fun covers, and crayons. Bright studio lighting, white background, playful and friendly atmosphere. Product photography style. No text.',
    aspectRatio: '4:3',
  },
  {
    filename: 'cem.jpg',
    prompt: 'A green-themed middle school supplies collection on a clean desk. Items include: a green geometry set with compass and protractor, scientific calculator, grid notebooks, fine-tip pens, and a pencil case. Organized neatly, professional product photography, soft natural lighting, white background. No text.',
    aspectRatio: '4:3',
  },
  {
    filename: 'lycee.jpg',
    prompt: 'A purple-themed high school supplies arrangement. Advanced scientific calculator, literature books with elegant covers, fountain pens, highlighters, and a sophisticated pencil case. Premium product photography style, soft diffused lighting, minimal white background. Academic and refined atmosphere. No text.',
    aspectRatio: '4:3',
  },
  {
    filename: 'step1.jpg',
    prompt: 'A warm illustration of a parent and child sitting together at a table, looking at a tablet screen showing school level options. The scene is cozy with soft warm colors, modern flat illustration style, clean background. Friendly and supportive mood. Algerian home setting subtly suggested. No text.',
    aspectRatio: '1:1',
  },
  {
    filename: 'step2.jpg',
    prompt: 'A modern flat illustration of hands customizing items on a mobile app screen. The phone displays a clean shopping interface with school supply items. Surrounding the phone are floating pencils, notebooks, and a backpack. Blue and green color palette, clean minimal style, white background. No text.',
    aspectRatio: '1:1',
  },
  {
    filename: 'step3.jpg',
    prompt: 'A realistic photograph of a white delivery truck parked in front of a traditional Algerian house with a blue door and white walls. Sunny day with clear blue sky, palm tree visible. A delivery person is handing a cardboard box to a smiling woman at the door. Warm Mediterranean lighting, cheerful atmosphere. No text.',
    aspectRatio: '1:1',
  },
  {
    filename: 'pack-default.jpg',
    prompt: 'A high-resolution studio product photograph of a complete school supply kit in a sturdy cardboard box. The box is open showing neatly arranged items: notebooks, pencils, pens, ruler, eraser, and sharpener. Clean white background, professional three-point lighting, sharp focus, ecommerce product photography style. No text.',
    aspectRatio: '4:3',
  },
];

function callGemini(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseModalities: ['Text', 'Image'],
        temperature: 0.4,
      },
    });

    const req = https.request(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json);
        } catch (e) {
          reject(new Error(`Invalid JSON response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function generateImage({ filename, prompt }) {
  const outputPath = path.join(imagesDir, filename);

  if (fs.existsSync(outputPath)) {
    console.log(`  ⏭️  Skipping ${filename} (already exists)`);
    return;
  }

  console.log(`  🎨 Generating ${filename}...`);

  try {
    const response = await callGemini(prompt);

    if (response.error) {
      console.error(`  ❌ API error for ${filename}:`, response.error.message);
      return;
    }

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      console.error(`  ❌ No candidates for ${filename}`);
      return;
    }

    const parts = candidates[0].content?.parts || [];
    const imagePart = parts.find(p => p.inlineData);

    if (!imagePart) {
      console.error(`  ❌ No image data in response for ${filename}`);
      console.error('  Response parts:', JSON.stringify(parts, null, 2));
      return;
    }

    const imageData = Buffer.from(imagePart.inlineData.data, 'base64');
    fs.writeFileSync(outputPath, imageData);
    console.log(`  ✅ Saved ${filename} (${(imageData.length / 1024).toFixed(1)} KB)`);

    // Small delay to respect rate limits
    await new Promise(r => setTimeout(r, 2000));
  } catch (err) {
    console.error(`  ❌ Failed ${filename}:`, err.message);
  }
}

async function main() {
  console.log('🚀 Generating images for Hakibati website...\n');

  for (const img of imagesToGenerate) {
    await generateImage(img);
  }

  console.log('\n🎉 Done! Images saved to public/images/');
}

main().catch(console.error);
