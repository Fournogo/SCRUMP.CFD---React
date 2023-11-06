function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const DecodeUtil = async (element) => {
    for (let attempt = 0; attempt < 10; ++attempt) {
        if (attempt > 0) {
            console.log('Decode failed... Attempt #' + attempt)
            await delay(100);
        }
        try {
            await element.decode();
            return; // It worked
        } catch {
        }
    }
    // Out of retries
    throw new Error("Serious Decoding Error");
}