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

    const { numImages, goesJson, goesLink, goesResolution } = source;
    
    const numImagesToRequest = numImages;
    const percentIncrement = (1 / (numImages));

    const cleanPercent = (percentComplete) => {
        return ((Math.round(percentComplete * 1000) / 1000) * 100).toFixed(1);
    }

    const loadAndDecodeImage = (completeLink) => {
        return new Promise(async (resolve, reject) => {
            const image = new Image();
            image.src = completeLink;
            try {
                await image.decode();
                percentComplete += percentIncrement;
                onProgress(cleanPercent(percentComplete));
                resolve(image);
            } catch (error) {
                reject(error);
            }
        });
    };

    let percentComplete = (0); // See how far along the operation we already are
    onProgress(cleanPercent(percentComplete));

    console.log(goesJson)
    const imageLinks = await MultiLoader(goesJson)
    .then((response) => response.json())
    .then((responseJSON) => responseJSON.images[goesResolution]) // Ensure the correct resolution is picked
    
    //const imagePromises = [];
    const imageArray = [];
    for (let i = 0; i < (numImagesToRequest); i++) {
        
        let partialLink = imageLinks[imageLinks.length - numImages + i - 1];
        let completeLink = goesLink + partialLink;
        
        let image = new Image();
        image.src = completeLink;
        await image.decode();
        percentComplete += percentIncrement;
        onProgress(cleanPercent(percentComplete));

        imageArray.push(image)
        /*const imagePromise = loadAndDecodeImage(completeLink).then((image) => {
            percentComplete += percentIncrement;
            onProgress(cleanPercent(percentComplete));
            return image; // This image will be part of the resolved values of Promise.all
        });*/
        
        //imagePromises.push(imagePromise);
    }

    try {
        //const imageArray = await Promise.all(imagePromises);
        return imageArray;
    } catch (error) {
        // Handle any errors from the image loading here
        console.error("Error loading images:", error);
    }
    
};

export default GoesUtil;