import { MultiLoader } from '../utils/MultiLoader';

function extractKeys(object) {
    const result = {};
    const labels = ["modelCode", "subsetCode", "productCode", "regionCode"];
    let index = 0;

    function helper(innerObj) {
        if (typeof innerObj !== 'object' || innerObj === null || index >= labels.length) {
            return;
        }
        if (!result[labels[index]]) {
            result[labels[index]] = [];
        }
        Object.keys(innerObj).forEach(key => {
            if (!result[labels[index]].includes(key)) {
                result[labels[index]].push(key);
            }
        });
        index++;
        for (const key in innerObj) {
            helper(innerObj[key]);
        }
    }

    helper(object);
    return result;
}

async function ModelUtil(source, onProgress) {

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

    const { modelCode, subsetCode, productCode, regionCode } = source;

    let percentComplete = (0); // See how far along the operation we already are
    onProgress(cleanPercent(percentComplete));

    const dataSourceObject = await MultiLoader(jsonLink)
    .then((response) => response.json())

    const dataStructure = extractKeys(dataSourceObject);
    const imageLinks = dataSourceObject[modelCode][subsetCode][productCode][regionCode];
    
    const numImages = imageLinks.length;
    const percentIncrement = (1 / numImages);

    const imagePromises = []
    for (let i = 0; i < (numImages); i++) {
        let completeLink = rootLink + imageLinks[i]
        
        const imagePromise = loadAndDecodeImage(completeLink).then((image) => {
            percentComplete += percentIncrement;
            onProgress(cleanPercent(percentComplete));
            return image; // This image will be part of the resolved values of Promise.all
        });
        
        imagePromises.push(imagePromise);
    }

    try {
        const imageArray = await Promise.all(imagePromises);
        return {'imageArray': imageArray, 'dataStructure': dataStructure};
    } catch (error) {
        // Handle any errors from the image loading here
        console.error("Error loading images:", error);
    }
    
};

export default ModelUtil;