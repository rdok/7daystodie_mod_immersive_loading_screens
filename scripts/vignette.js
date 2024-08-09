const { createCanvas, loadImage } = require('canvas')
const fs = require('fs')
const { join } = require('path')

// File paths
const inputImagePath = join(__dirname, '../images/main_menu_cleaned_full_dev.jpg')
const sandstormOverlayPath = join(__dirname, '../images/main_menu_cleaned_full_overlay.jpg')
const finalOutputPath = join(__dirname, '../images/main_menu_cleaned_full_vignette.jpg')

// Overlay effect settings
const overlayColor = '#C2B280' // Sandstorm color
const overlayOpacity = 0.5 // Set the opacity for the overlay (0.0 to 1.0)

// Vignette effect settings
const vignetteColor = '#000000' // Vignette color (black)
const vignetteOpacity = 0.6 // Opacity for the vignette (0.0 to 1.0)
const vignetteStart = 0.85 // Start of the vignette closer to the edges (0.0 to 1.0)
const blurRadius = 100 // Blur effect to smooth the vignette edges

// Function to apply sandstorm overlay
const applySandstormOverlay = async () => {
    const img = await loadImage(inputImagePath)
    const width = img.width
    const height = img.height

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // Draw the original image
    ctx.drawImage(img, 0, 0)

    // Apply the sandstorm color overlay
    ctx.fillStyle = overlayColor
    ctx.globalAlpha = overlayOpacity
    ctx.fillRect(0, 0, width, height)

    // Save the sandstorm overlay image
    const outStream = fs.createWriteStream(sandstormOverlayPath)
    const jpegStream = canvas.createJPEGStream({ quality: 0.95 })
    jpegStream.pipe(outStream)

    // Return the path to the sandstorm overlay image
    return new Promise((resolve) => {
        outStream.on('finish', () => resolve(sandstormOverlayPath))
    })
}

// Function to create vignette gradient
const createVignetteGradient = (ctx, width, height) => {
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

    return gradient
}

// Function to apply vignette effect
const applyVignette = async (imagePath) => {
    const img = await loadImage(imagePath)
    const width = img.width
    const height = img.height

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // Draw the sandstorm overlay image
    ctx.drawImage(img, 0, 0)

    // Create and apply the vignette overlay, starting closer to the edges
    const vignetteGradient = createVignetteGradient(ctx, width, height)
    ctx.fillStyle = vignetteGradient
    ctx.globalCompositeOperation = 'multiply' // Use 'multiply' to apply the vignette effect
    ctx.fillRect(0, 0, width, height)

    // Blur the vignette for smoother transition
    ctx.filter = `blur(${blurRadius}px)`
    ctx.drawImage(canvas, 0, 0)

    // Save the final result
    const outStream = fs.createWriteStream(finalOutputPath)
    const jpegStream = canvas.createJPEGStream({ quality: 0.95 })
    jpegStream.pipe(outStream)

    // Return the path to the final image
    return new Promise((resolve) => {
        outStream.on('finish', () => resolve(finalOutputPath))
    })
}

// Main function to apply both effects sequentially
const processImage = async () => {
    try {
        const overlayImagePath = await applySandstormOverlay()
        const finalImagePath = await applyVignette(overlayImagePath)
        console.log(`Final image saved to ${finalImagePath}`)
    } catch (error) {
        console.error('Error processing image:', error)
    }
}

processImage()
