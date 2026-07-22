import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const images = [
  {
    src: 'C:\\Users\\Afreen\\.gemini\\antigravity-ide\\brain\\804c9e21-d981-435c-ad09-fcca6d24506e\\doctor_prathiba_1784552097023.png',
    destDir: 'c:\\Users\\Afreen\\OneDrive\\Desktop\\janya-landing\\appointment\\assets\\images\\doctors',
    name: 'doctor-prathiba',
    width: 400,
    height: 500
  },
  {
    src: 'C:\\Users\\Afreen\\.gemini\\antigravity-ide\\brain\\804c9e21-d981-435c-ad09-fcca6d24506e\\testimonial_1_1784552115771.png',
    destDir: 'c:\\Users\\Afreen\\OneDrive\\Desktop\\janya-landing\\appointment\\assets\\images\\testimonials',
    name: 'testimonial-1',
    width: 200,
    height: 200
  },
  {
    src: 'C:\\Users\\Afreen\\.gemini\\antigravity-ide\\brain\\804c9e21-d981-435c-ad09-fcca6d24506e\\testimonial_2_1784552137020.png',
    destDir: 'c:\\Users\\Afreen\\OneDrive\\Desktop\\janya-landing\\appointment\\assets\\images\\testimonials',
    name: 'testimonial-2',
    width: 200,
    height: 200
  },
  {
    src: 'C:\\Users\\Afreen\\.gemini\\antigravity-ide\\brain\\804c9e21-d981-435c-ad09-fcca6d24506e\\testimonial_3_1784552155062.png',
    destDir: 'c:\\Users\\Afreen\\OneDrive\\Desktop\\janya-landing\\appointment\\assets\\images\\testimonials',
    name: 'testimonial-3',
    width: 200,
    height: 200
  }
];

async function processImages() {
  for (const img of images) {
    if (!fs.existsSync(img.destDir)) {
      fs.mkdirSync(img.destDir, { recursive: true });
    }
    
    console.log(`Processing ${img.name}...`);
    
    const sharpInstance = sharp(img.src).resize(img.width, img.height, { fit: 'cover' });

    // Generate WebP
    await sharpInstance
      .webp({ quality: 80 })
      .toFile(path.join(img.destDir, `${img.name}.webp`));

    // Generate AVIF
    await sharpInstance
      .avif({ quality: 75 })
      .toFile(path.join(img.destDir, `${img.name}.avif`));
      
    console.log(`Completed ${img.name}`);
  }
}

processImages().catch(console.error);
