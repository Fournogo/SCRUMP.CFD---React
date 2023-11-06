const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const MultiLoader = async (link) => {
    for (let attempt = 0; attempt < 3; ++attempt) {
        if (attempt > 0) {
            await delay(100);
        }
        try {
            const response = await fetch(link);
            return response; // It worked
        } catch(err) {
            console.error(`Attempt ${attempt + 1} failed. Error:`, err);
        }
    }
    // Out of retries
    throw new Error("Serious Loading Error");
}