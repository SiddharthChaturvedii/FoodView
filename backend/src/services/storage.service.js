const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(file, fileName) {
    if (!file || !fileName) {
        throw new Error("File and fileName are required for upload");
    }

    try {
        const result = await imagekit.upload({
            file: file,
            fileName: fileName,
        });

        if (!result || !result.url) {
            throw new Error("Upload succeeded but no URL returned");
        }

        return result;
    } catch (error) {
        console.error("Storage Upload Error:", error.message);
        throw new Error("File upload failed: " + error.message);
    }
}

module.exports = {
    uploadFile
}