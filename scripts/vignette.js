const { createCanvas, loadImage } = require('canvas')
const fs = require('fs')
const { join } = require('path')

// File paths
const inputImagePath = join(__dirname, '../images/main_menu_cleaned_full.jpg')
const finalOutputPath = join(__dirname, '../images/main_menu_cleaned_full_vignette.jpg')

// Overlay and Vignette settings
const overlayColor = '#C2B280' // Sandstorm color
const overlayOpacity = 0.5 // Opacity for the overlay
const vignetteColor = '#000000' // Vignette color (black)
const vignetteOpacity = 0.6 // Opacity for the vignette
const vignetteStart = 0.85 // Vignette starts closer to edges
const blurRadius = 100 // Blur for vignette smoothing

// Function to create overlay and vignette
const applyEffects = async () => {
    const img = await loadImage(inputImagePath)
    const { width, height } = img

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // Draw the original image
    ctx.drawImage(img, 0, 0)

    // Apply sandstorm overlay
    ctx.fillStyle = overlayColor
    ctx.globalAlpha = overlayOpacity
    ctx.fillRect(0, 0, width, height)

    // Create vignette gradient
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
    gradient.addColorStop(0, `rgba(0, 0, 0, 0)`)
    gradient.addColorStop(1, `${vignetteColor}${Math.floor(vignetteOpacity * 255).toString(16).padStart(2, '0')}`)

    // Apply vignette overlay
    ctx.fillStyle = gradient
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillRect(0, 0, width, height)

    // Blur the vignette for smooth transitions
    ctx.filter = `blur(${blurRadius}px)`
    ctx.drawImage(canvas, 0, 0)

    // Save the final result
    const outStream = fs.createWriteStream(finalOutputPath)
    const jpegStream = canvas.createJPEGStream({ quality: 0.95 })
    jpegStream.pipe(outStream)

    return new Promise((resolve) => {
        outStream.on('finish', () => resolve(finalOutputPath))
    })
}

// Run the effects
applyEffects().then(finalImagePath => {
    console.log(`Final image saved to ${finalImagePath}`)
}).catch(error => {
    console.error('Error processing image:', error)
})
