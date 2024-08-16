const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const { join } = require('path');

const baseImageDir = join(__dirname, '../images');
const originalDir = join(baseImageDir, 'original');
const overlayDir = join(baseImageDir, 'overlays');
const outputDir = join(baseImageDir, 'rdr2_filtered_images');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const vignetteEnabled = true;
const vignetteOpacity = 0.85;
const vignetteStart = 0.65;
const blurRadius = 150;
const vignetteStartColor = 'rgba(192, 192, 192, 0.1)';
const vignetteEndColor = `rgba(50, 50, 50, ${vignetteOpacity})`;

const applyEffectsToFile = async (inputImagePath, fileName, overlayFiles) => {
    const img = await loadImage(inputImagePath);
    const { width, height } = img;

    for (let i = 0; i < overlayFiles.length; i++) {
        const overlayImagePath = join(overlayDir, overlayFiles[i]);
        const finalOutputPath = join(outputDir, `${fileName}_rdr2_filter_${i + 1}.jpg`);

        const overlayImg = await loadImage(overlayImagePath);

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const grayscale = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
            data[i] = grayscale;
            data[i + 1] = grayscale;
            data[i + 2] = grayscale;
        }
        ctx.putImageData(imageData, 0, 0);

        if (vignetteEnabled) {
            const radiusStart = Math.min(width, height) * vignetteStart;
            const radiusEnd = Math.max(width, height) * 1.2;
            const gradient = ctx.createRadialGradient(
                width / 2,
                height / 2,
                radiusStart,
                width / 2,
                height / 2,
                radiusEnd
            );
            gradient.addColorStop(0, vignetteStartColor);
            gradient.addColorStop(1, vignetteEndColor);

            ctx.fillStyle = gradient;
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillRect(0, 0, width, height);

            ctx.filter = `blur(${blurRadius}px)`;
            ctx.drawImage(canvas, 0, 0);
        }

        ctx.filter = 'none';
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'overlay';
        ctx.drawImage(overlayImg, 0, 0, width, height);

        const outStream = fs.createWriteStream(finalOutputPath);
        const jpegStream = canvas.createJPEGStream({ quality: 0.95 });
        jpegStream.pipe(outStream);

        await new Promise((resolve) => {
            outStream.on('finish', () => resolve());
        });

        console.log(`Final image saved to ${finalOutputPath}`);
    }
};

const processImagesInDirectory = async () => {
    const overlayFiles = fs.readdirSync(overlayDir).filter(file => file.endsWith('.jpg'));
    const files = fs.readdirSync(originalDir);

    for (const file of files) {
        const filePath = join(originalDir, file);
        const fileName = file.replace(/\.[^/.]+$/, "");
        await applyEffectsToFile(filePath, fileName, overlayFiles);
    }
};

processImagesInDirectory().catch(error => {
    console.error('Error processing images:', error);
});
