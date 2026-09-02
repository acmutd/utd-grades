import { Storage } from "@google-cloud/storage";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function parseSemesterFromEnhancedFileName(fileName) {
  const match = fileName.match(/enhanced_grades_(\d{2})([fsu])\.csv$/i);
  if (!match) return null;

  const year = Number.parseInt(match[1], 10);
  const seasonCode = match[2].toLowerCase();
  const seasonMap = {
    f: "Fall",
    s: "Spring",
    u: "Summer",
  };

  const season = seasonMap[seasonCode];
  if (!season) return null;

  const fullYear = year >= 90 ? 1900 + year : 2000 + year;
  return `${season} ${fullYear}`;
}

async function main() {
  const projectId =
    getArg("--project") ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    process.env.FIREBASE_PROJECT_ID;

  const bucketName =
    getArg("--bucket") ||
    process.env.FIREBASE_STORAGE_BUCKET ||
    (projectId ? `${projectId}.appspot.com` : undefined);

  const prefix = getArg("--prefix") || "enhanced_grades/";
  const currentFilePath = fileURLToPath(import.meta.url);
  const rootDir = path.resolve(path.dirname(currentFilePath), "..", "..");
  const rawDataDir = path.join(rootDir, "raw_data");

  if (!bucketName) {
    throw new Error(
      "Missing bucket name. Provide --bucket <name> or set FIREBASE_STORAGE_BUCKET."
    );
  }

  console.log(`Using bucket: ${bucketName}`);
  console.log(`Using prefix: ${prefix}`);
  console.log(`Writing files to: ${rawDataDir}`);

  await fs.mkdir(rawDataDir, { recursive: true });

  const storage = new Storage(projectId ? { projectId } : undefined);
  const [files] = await storage.bucket(bucketName).getFiles({ prefix });

  const csvFiles = files.filter((file) => file.name.toLowerCase().endsWith(".csv"));
  if (csvFiles.length === 0) {
    console.log("No CSV files found under that prefix.");
    return;
  }

  let downloaded = 0;

  for (const file of csvFiles) {
    const baseName = path.basename(file.name);
    const semester = parseSemesterFromEnhancedFileName(baseName);

    if (!semester) {
      console.log(`Skipping unrecognized file name format: ${baseName}`);
      continue;
    }

    const destinationName = `${semester} with course names.csv`;
    const destinationPath = path.join(rawDataDir, destinationName);

    await file.download({ destination: destinationPath });
    downloaded += 1;

    console.log(`Downloaded ${baseName} -> ${destinationName}`);
  }

  console.log(`Done. Downloaded ${downloaded} enhanced CSV file(s).`);
  console.log("Next step: npm run createDb");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
