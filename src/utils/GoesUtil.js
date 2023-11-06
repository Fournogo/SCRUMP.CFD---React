import { MultiLoader } from '../utils/MultiLoader';
import { DecodeUtil } from '../utils/DecodeUtil';

async function GoesUtil(source, onProgress) {
    /*
    Expected source object example:
        {
            "numImages": 96,
            "goesCode": "sp",
            "goesJson": "...json",
            "goesLink": ".../",
            "goesResolution": "1200x1200"
        }
    */

    const cleanPercent = (percentComplete) => {
        return ((Math.round(percentComplete * 1000) / 1000) * 100).toFixed(1);
    }

    const loadAndDecodeImage = (completeLink) => {
        return new Promise(async (resolve, reject) => {
            const image = new Image();
            image.src = completeLink;
            try {
                await image.decode();
                resolve(image);
            } catch (error) {
                reject(error);
            }
        });
    };

    const { numImages, goesJson, goesLink, goesResolution } = source;

    const numImagesToRequest = numImages;
    const percentIncrement = (1 / numImages);

    let percentComplete = (0); // See how far along the operation we already are
    onProgress(cleanPercent(percentComplete));

    const imageLinks = await MultiLoader(goesJson)
    .then((response) => response.json())
    .then((responseJSON) => responseJSON.images[goesResolution]) // Ensure the correct resolution is picked

    const imagePromises = []
    for (let i = 0; i < (numImagesToRequest); i++) {
        
        let partialLink = imageLinks[imageLinks.length - numImages + i - 1];
        let completeLink = goesLink + partialLink;
        const imagePromise = loadAndDecodeImage(completeLink).then((image) => {
            percentComplete += percentIncrement;
            onProgress(cleanPercent(percentComplete));
            return image; // This image will be part of the resolved values of Promise.all
        });
        
        imagePromises.push(imagePromise);
    }

    try {
        const imageArray = await Promise.all(imagePromises);
        return imageArray;
    } catch (error) {
        // Handle any errors from the image loading here
        console.error("Error loading images:", error);
    }
    
};

export default GoesUtil;