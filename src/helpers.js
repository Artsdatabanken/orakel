import convert from 'heic-convert';

export const getJpegName = (name) => {
    const jpeg = 'jpeg';
    return name
        .replace('heic', jpeg)
        .replace('HEIC', jpeg)
        .replace('heif', jpeg)
        .replace('HEIF', jpeg);
}

export const shouldConvertFromHeic = (name) => {
    return name.endsWith('.heic') || name.endsWith('.HEIC') || name.endsWith('.heif') || name.endsWith('.HEIF');
}

export const convertImage = async (image) => {
    if (shouldConvertFromHeic(image.name)) {
        const arrayBuffer = await image.arrayBuffer();
        const inputBuffer = Buffer.from(arrayBuffer);
        const outputBuffer = await convert({
            buffer: inputBuffer,      // the HEIC file buffer
            format: 'JPEG',           // output format
            quality: 1                // the jpeg compression quality, between 0 and 1
        });
        const file = new File([outputBuffer], getJpegName(image.name), { type: "image/jpeg", lastModified: image.lastModified });
        return file;
    }
    return image;
}