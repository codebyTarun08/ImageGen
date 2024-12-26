// const token = "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";
// const inputTxt = document.getElementById("input");
// const image = document.getElementById("image");
// const button = document.getElementById("btn");

// async function query() {
//     try {
//         const response = await fetch(
//             "https://api-inference.huggingface.co/models/stable-diffusion-v1-5/stable-diffusion-v1-5",  // Double-check this URL
//             {
//                 headers: { Authorization: `Bearer ${token}` },
//                 method: "POST",
//                 body: JSON.stringify({ "inputs": inputTxt.value }),
//             }
//         );
//         if (!response.ok) {
//             if (response.status === 503) {
//                 console.error("Service is unavailable. Retrying...");
//                 setTimeout(query, 5000); // Retry after 5 seconds
//             } else if (response.status === 404) {
//                 console.error("Resource not found. Please check the URL.");
//             }
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const result = await response.blob();
//         return result;
//     } catch (error) {
//         console.error("Error:", error);
//         throw error;
//     }
// }

// button.addEventListener('click', async function () {
//     try {
//         const response = await query();
//         if (response) {
//             const objectURL = URL.createObjectURL(response);
//             image.src = objectURL;
//             image.style.display='block';
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }
// });


const token = "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";
const inputTxt = document.getElementById("input");
const button = document.getElementById("btn");
const generatedContainer = document.getElementById("generated-container");

// Function to query the API and generate an image
async function query(prompt, retries = 3, delay = 2000) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stable-diffusion-v1-5/stable-diffusion-v1-5",
            {
                headers: { Authorization: `Bearer ${token}` },
                method: "POST",
                body: JSON.stringify({ "inputs": prompt }),
            }
        );

        if (!response.ok) {
            if (response.status === 503 && retries > 0) {
                console.warn("Service unavailable, retrying...");
                await new Promise((res) => setTimeout(res, delay));
                return query(prompt, retries - 1, delay * 2);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.blob();
    } catch (error) {
        console.error("Error querying API:", error);
        throw error;
    }
}


// Function to create an image element with a download button
function createImageElement(imageBlob, index) {
    const objectURL = URL.createObjectURL(imageBlob);

    // Create image element
    const img = document.createElement("img");
    img.src = objectURL;
    img.alt = `Generated Image ${index + 1}`;
    img.style.display='block';
    // img.style.width = "200px";
    // img.style.margin = "10px";

    // Create download button
    const downloadBtn = document.createElement("button");
    downloadBtn.innerText = `Download Image ${index + 1}`;
    downloadBtn.style.display = "block";
    downloadBtn.style.marginBottom = "20px";
    downloadBtn.style.width="150px";
    downloadBtn.style.height="35px";
    downloadBtn.style.borderRadius="10px";
    downloadBtn.style.marginLeft="105px";
    downloadBtn.style.backgroundColor = "#d1ee8b";
    downloadBtn.addEventListener("click", () => {
        const a = document.createElement("a");
        a.href = objectURL;
        a.download = `generated-image-${index + 1}.jpg`;
        a.click();
    });

    // Append image and button to the container
    const container = document.createElement("div");
    container.appendChild(img);
    container.appendChild(downloadBtn);
    generatedContainer.appendChild(container);
}

// Generate 4 images
button.addEventListener("click", async function () {
    const prompt = inputTxt.value;
    if (!prompt) {
        alert("Please enter a description.");
        return;
    }

    generatedContainer.innerHTML = ""; // Clear previous images

    try {
        for (let i = 0; i < 4; i++) {
            const response = await query(`${prompt} variation ${i + 1}`);
            if (response) {
                createImageElement(response, i);
            }
        }
    } catch (error) {
        console.error("Error generating images:", error);
    }
});

