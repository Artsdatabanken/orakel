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