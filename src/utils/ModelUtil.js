import { delay } from 'framer-motion';
import { MultiLoader } from '../utils/MultiLoader';

function extractMenuItems(object, modelCode) {
    const result = {};

    result["modelCode"] = []
    result["subsetCode"] = []
    result["productCode"] = []
    result["regionCode"] = []
    
    for (let key in Object.keys(object)) {
        result["modelCode"].push(Object.keys(object)[key])
    }   

    const firstSubset = Object.keys(object[modelCode])[0]
    for (let subsetKey in Object.keys(object[modelCode])) {
        result["subsetCode"].push(Object.keys(object[modelCode])[subsetKey])
    }
    
    const firstProduct = Object.keys(object[modelCode][firstSubset])[0]
    for (let productKey in Object.keys(object[modelCode][firstSubset])) {
        result["productCode"].push(Object.keys(object[modelCode][firstSubset])[productKey])
    }

    const firstRegion = Object.keys(object[modelCode][firstSubset][firstProduct])[0]
    for (let regionKey in Object.keys(object[modelCode][firstSubset][firstProduct])) {
        result["regionCode"].push(Object.keys(object[modelCode][firstSubset][firstProduct])[regionKey])
    }
    console.log(result)
    return result;
}

async function ModelUtil(modelCode, source, onProgress) {

    const jsonLink = '/json/modelData.json'
    const rootLink = '/modelData/'

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

    let { subsetCode, productCode, regionCode } = source;

    let percentComplete = (0); // See how far along the operation we already are
    onProgress(cleanPercent(percentComplete));

    const dataSourceObject = await MultiLoader(jsonLink)
    .then((response) => response.json())
    
    let imageLinks
    try {
        imageLinks = dataSourceObject[modelCode][subsetCode][productCode][regionCode];
    } catch(err) {
        subsetCode = Object.keys(dataSourceObject[modelCode])[0]
        productCode = Object.keys(dataSourceObject[modelCode][subsetCode])[0]
        regionCode = Object.keys(dataSourceObject[modelCode][subsetCode][productCode])[0]
        imageLinks = dataSourceObject[modelCode][subsetCode][productCode][regionCode];
    }

    const menuItems = extractMenuItems(dataSourceObject, modelCode);
    
    /*try {
        imageLinks = dataSourceObject[modelCode][subsetCode][productCode][regionCode];
    } catch(err) {
        firstSubset = Object.keys(dataSourceObject[modelCode])[0]
        firstProduct = Object.keys(dataSourceObject[modelCode][firstSubset])[0]
        firstRegion = Object.keys(dataSourceObject[modelCode][firstSubset][firstProduct])[0]
        imageLinks = dataSourceObject[modelCode][firstSubset][firstProduct][firstRegion]
    }*/
    
    const numImages = imageLinks.length;
    const percentIncrement = (1 / numImages);
    const delayArray = []
    let previousNumber = -1;

    const regex = /(\d+)\.png$/;

    //const imagePromises = []
    const imageArray = [];
    for (let i = 0; i < (numImages); i++) {
        let completeLink = rootLink + imageLinks[i]

        let matches = completeLink.match(regex);
        let number = matches ? matches[1] : null;
        let delay = number - previousNumber;
        delayArray.push(delay);
        previousNumber = number;

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
        return {'imageArray': imageArray, 'menuItems': menuItems, 'delayArray': delayArray};
    } catch (error) {
        // Handle any errors from the image loading here
        console.error("Error loading images:", error);
    }
    
};

export default ModelUtil;