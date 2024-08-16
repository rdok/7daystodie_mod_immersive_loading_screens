const { createCanvas, loadImage } = require('canvas')
const fs = require('fs')
const { join } = require('path')

// File paths
const inputImagePath = join(__dirname, '../images/wp_2082870.jpg')
const overlayBasePath = join(__dirname, '../images/rdr2_overlay_') // Base path for overlay images
const finalOutputBasePath = join(__dirname, '../images/wp_2082870_rdr2_filter_') // Base path for output images

// Vignette settings
const vignetteEnabled = true // Set this to false to disable the vignette effect
const vignetteOpacity = 0.85 // Higher opacity for the vignette
const vignetteStart = 0.65 // Vignette starts closer to edges
const blurRadius = 150 // Blur for vignette smoothing

// Vignette color settings to simulate the silver halide or wet collodion effect
const vignetteStartColor = 'rgba(192, 192, 192, 0.1)' // Light silver color in the center
const vignetteEndColor = `rgba(50, 50, 50, ${vignetteOpacity})` // Dark, nearly black edge

// Number of overlay images to apply
const overlayCount = 4 // Assuming you have 4 overlays (rdr2_overlay_01.jpg to rdr2_overlay_04.jpg)

// Function to create the effects
const applyEffects = async () => {
    const img = await loadImage(inputImagePath)
    const { width, height } = img

    for (let i = 1; i <= overlayCount; i++) {
        const overlayImagePath = `${overlayBasePath}${String(i).padStart(2, '0')}.jpg`
        const finalOutputPath = `${finalOutputBasePath}${String(i).padStart(2, '0')}.jpg`

        const overlayImg = await loadImage(overlayImagePath)

        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d')

        // Draw the original image
        ctx.drawImage(img, 0, 0)

        // Apply a desaturation filter (convert to grayscale)
        const imageData = ctx.getImageData(0, 0, width, height)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
            const grayscale = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11
            data[i] = grayscale // Red
            data[i + 1] = grayscale // Green
            data[i + 2] = grayscale // Blue
        }
        ctx.putImageData(imageData, 0, 0)

        // Vignette effect (if enabled)
        if (vignetteEnabled) {
            const radiusStart = Math.min(width, height) * vignetteStart
            const radiusEnd = Math.max(width, height) * 1.2
            const gradient = ctx.createRadialGradient(
                width / 2,
                height / 2,
                radiusStart,
                width / 2,
                height / 2,
                radiusEnd
            )
            gradient.addColorStop(0, vignetteStartColor)
            gradient.addColorStop(1, vignetteEndColor)

            // Apply vignette overlay
            ctx.fillStyle = gradient
            ctx.globalCompositeOperation = 'multiply'
            ctx.fillRect(0, 0, width, height)

            // Blur the vignette for smooth transitions
            ctx.filter = `blur(${blurRadius}px)`
            ctx.drawImage(canvas, 0, 0)
        }

        // Reset filter and apply the overlay image
        ctx.filter = 'none'
        ctx.globalAlpha = 1.0
        ctx.globalCompositeOperation = 'overlay' // Use overlay blending mode for more realistic effect
        ctx.drawImage(overlayImg, 0, 0, width, height)

        // Save the final result
        const outStream = fs.createWriteStream(finalOutputPath)
        const jpegStream = canvas.createJPEGStream({ quality: 0.95 })
        jpegStream.pipe(outStream)

        await new Promise((resolve) => {
            outStream.on('finish', () => resolve())
        })

        console.log(`Final image saved to ${finalOutputPath}`)
    }
}

// Run the effects
applyEffects().catch(error => {
    console.error('Error processing images:', error)
})
