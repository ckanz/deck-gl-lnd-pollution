const fs = require("fs");
const https = require("https");
const unzipper = require("unzipper");

// Data comes from https://data.london.gov.uk/dataset/london-atmospheric-emissions-inventory--laei--2016/
const downloadAndExtract = async () => {
  const zipUrl =
    "https://data.london.gov.uk/download/london-atmospheric-emissions-inventory--laei--2016/20fd5087-ee4e-4037-8b3a-61271f31348a/LAEI_2016_Concentrations_Data_Excel.zip";
  const zipPath = "./data/data.zip";

  console.log("Downloading zip file...");

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(zipPath);

    const handleResponse = (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        let redirectUrl = response.headers.location;
        // Handle relative redirects
        if (redirectUrl.startsWith("/")) {
          redirectUrl = `https://data.london.gov.uk${redirectUrl}`;
        }
        console.log("Following redirect to:", redirectUrl);
        https.get(redirectUrl, handleResponse).on("error", reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(
          new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`)
        );
        return;
      }

      const totalSize = parseInt(response.headers["content-length"], 10);
      let downloadedSize = 0;

      console.log(
        `Total file size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`
      );

      response.on("data", (chunk) => {
        downloadedSize += chunk.length;
        const progress = ((downloadedSize / totalSize) * 100).toFixed(1);
        const downloadedMB = (downloadedSize / 1024 / 1024).toFixed(2);
        process.stdout.write(
          `\rDownload progress: ${progress}% (${downloadedMB} MB)`
        );
      });

      response.pipe(file);

      file.on("finish", () => {
        file.close();
        console.log("\nDownload completed. Extracting...");

        const extractStream = fs.createReadStream(zipPath)
          .pipe(unzipper.Extract({ path: "./data" }));
        
        extractStream.on("close", () => {
          fs.unlinkSync(zipPath);
          console.log("Extraction completed.");
          resolve();
        });
        
        extractStream.on("error", reject);
      });
    };

    https.get(zipUrl, handleResponse).on("error", reject);
  });
};

const main = async () => {
  try {
    await downloadAndExtract();
    process.exit(0);
  } catch (error) {
    console.error("Error during download:", error);
    process.exit(1);
  }
};

main();
