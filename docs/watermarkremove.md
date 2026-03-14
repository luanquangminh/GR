### install
```bash
npm install --save @pixelbin/admin
```
### Environment
Set your API token as an environment variable for secure authentication. Get your API token here.

```bash
export PIXELBIN_API_TOKEN="YOUR_API_TOKEN"
```
### Set client 
Initialize the PixelBin SDK with your API token. The SDK automatically handles headers and authentication.

```bash 
const { PixelbinConfig, PixelbinClient } = require("@pixelbin/admin");

const pixelbin = new PixelbinClient(
  new PixelbinConfig({
    domain: "https://api.pixelbin.io",
    apiSecret: process.env.PIXELBIN_API_TOKEN || "API_TOKEN",
  }),
);
```
### Making request
Set up your input parameters, optionally configure a webhook, and create the prediction job. You can either create and wait for the result in one step, or create the job and poll for completion separately.

```bash
// Method 1: Create and wait for result in one step
const result = await pixelbin.predictions.createAndWait({
  name: "wm_remove",
  input: {
    image: "https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg",
    mask: "",
    rem_text: false,
    rem_logo: false,
    box1: "0_0_100_100",
    box2: "0_0_0_0",
    box3: "0_0_0_0",
    box4: "0_0_0_0",
    box5: "0_0_0_0"
  },
  webhook: "https://example.com/webhook", // optional
});

console.log(result); // { status, output, ... }
```
### Create Job (Alternative Method)
Create a prediction job and handle polling separately for more control over the process.

```bash
// Method 2: Create job and poll separately
const job = await pixelbin.predictions.create({
  name: "wm_remove",
  input: {
    image: "https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg",
    mask: "",
    rem_text: false,
    rem_logo: false,
    box1: "0_0_100_100",
    box2: "0_0_0_0",
    box3: "0_0_0_0",
    box4: "0_0_0_0",
    box5: "0_0_0_0"
  },
  webhook: "https://example.com/webhook", // optional
});

console.log(job._id);     // Prediction ID
console.log(job.status);  // Initial status
console.log(job.urls.get); // Status URL
```
### Wait Helper
Instead of manually polling, use the built-in wait method to automatically wait for the job to finish.

```bash
const result = await pixelbin.predictions.wait(job._id);

console.log(result.status); // SUCCESS | FAILURE
console.log(result.output); // Output URLs
```

### Poll For Response
Use the job ID to check the status of the prediction until it completes.
```bash
let output, status;

do {
  output = await pixelbin.predictions.get(job._id);
  status = details.status;
  if (status !== "SUCCESS" && status !== "FAILURE") {
    await new Promise((r) => setTimeout(r, 1000));
  }
} while (status !== "SUCCESS" && status !== "FAILURE");

console.log(output);
```

### Full Working Code
Complete working example that combines creating a job and waiting for the result.

```bash
const { PixelbinConfig, PixelbinClient } = require("@pixelbin/admin");

// Initialize the client
const pixelbin = new PixelbinClient(
  new PixelbinConfig({
    domain: "https://api.pixelbin.io",
    apiSecret: process.env.PIXELBIN_API_TOKEN || "API_TOKEN",
  }),
);

async function runPrediction() {
  try {
    // Step 1: Create the prediction job
    const job = await pixelbin.predictions.create({
      name: "wm_remove",
      input: {
        image: "https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg",
        mask: "",
        rem_text: false,
        rem_logo: false,
        box1: "0_0_100_100",
        box2: "0_0_0_0",
        box3: "0_0_0_0",
        box4: "0_0_0_0",
        box5: "0_0_0_0"
      },
    });

    console.log("Job created:", job._id);
    console.log("Initial status:", job.status);

    // Step 2: Wait for the job to complete
    const result = await pixelbin.predictions.wait(job._id);

    // Step 3: Handle the result
    if (result.status === "SUCCESS") {
      console.log("Prediction completed successfully!");
      console.log("Output:", result.output);
      return result.output;
    } else {
      console.error("Prediction failed:", result.status);
      console.error("Error details:", result.error);
      throw new Error(`Prediction failed with status: ${result.status}`);
    }
  } catch (error) {
    console.error("Error running prediction:", error.message);
    throw error;
  }
}

// Usage
runPrediction()
  .then(output => {
    console.log("Final output:", output);
  })
  .catch(error => {
    console.error("Failed to run prediction:", error);
  });
```

### Input Schema

image*
file
URL of the input image

Default: "https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg"

mask
rem_text
boolean
Whether to remove text from the image or not. Default is false.

Default: false

rem_logo
boolean
Whether to remove logo from the image or not. Default is false.

Default: false

box1
string
In the format: x-axis_y-axis_width_height. If not applying use: 0_0_0_0 & on full image use: 0_0_100_100. Default is 0_0_100_100.

Default: "0_0_100_100"

box2
string
In the format: x-axis_y-axis_width_height. If not applying use: 0_0_0_0 & on full image use: 0_0_100_100. Default is 0_0_0_0.

Default: "0_0_0_0"

box3
string
In the format: x-axis_y-axis_width_height. If not applying use: 0_0_0_0 & on full image use: 0_0_100_100. Default is 0_0_0_0.

Default: "0_0_0_0"

box4
string
In the format: x-axis_y-axis_width_height. If not applying use: 0_0_0_0 & on full image use: 0_0_100_100. Default is 0_0_0_0.

Default: "0_0_0_0"

box5
string
In the format: x-axis_y-axis_width_height. If not applying use: 0_0_0_0 & on full image use: 0_0_100_100. Default is 0_0_0_0.

Default: "0_0_0_0"

### Example JSON object for input parameters:
 ```json
 {
  "image": "https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg",
  "rem_text": false,
  "rem_logo": false,
  "box1": "0_0_100_100",
  "box2": "0_0_0_0",
  "box3": "0_0_0_0",
  "box4": "0_0_0_0",
  "box5": "0_0_0_0"
}
 ```

### Output Schema

Complete schema for the output response structure.

input
object
The input parameters that were used for the prediction.

status
string
The status of the prediction job. Can be "SUCCESS", "FAILURE", or "PENDING".

Possible values:

"SUCCESS"
"FAILURE"
"PENDING"
urls
object
URLs for accessing the prediction results and status.

orgId
number
The organization ID associated with the prediction.

retention
string
The retention period for the prediction results (e.g., "30d" for 30 days).

createdAt
string
ISO 8601 timestamp when the prediction was created.

_id
string
Unique identifier for the prediction job.

consumedCredits
number
Number of credits consumed for this prediction.

output
array
Array of URLs to the processed output files.

### Example JSON object for output response
```json
{
  "input": {
    "image": "https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg"
  },
  "status": "SUCCESS",
  "urls": {
    "get": "https://api.pixelbin.io/service/panel/transformation/v1.0/org/orgId/predictions/wm_remove--0198f5e0-5eb4-7eef-be24-f740c5dcd7d1"
  },
  "orgId": "YOUR_ORG_ID",
  "retention": "30d",
  "createdAt": "2025-08-29T12:49:38.996Z",
  "_id": "wm_remove--0198f5e0-5eb4-7eef-be24-f740c5dcd7d1",
  "consumedCredits": 1,
  "output": [
    "https://delivery.pixelbin.io/predictions/outputs/30d/wm_remove/0198f5e0-5eb4-7eef-be24-f740c5dcd7d1/result_0.jpeg"
  ]
}
```

