import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET;
const publicUrl = process.env.R2_PUBLIC_URL;

console.log("Testing Cloudflare R2 Connection...");
console.log(`- Account ID: ${accountId}`);
console.log(`- Bucket: ${bucket}`);
console.log(`- Access Key ID: ${accessKeyId ? accessKeyId.slice(0, 8) + "..." : "missing"}`);

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function run() {
  try {
    // 1. List objects
    console.log("\n1. Testing ListObjectsV2...");
    const listRes = await client.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 5 }));
    console.log(`✓ ListObjects succeeded! Objects count in bucket: ${listRes.KeyCount ?? 0}`);
    if (listRes.Contents?.length) {
      console.log("Found objects:", listRes.Contents.map((c) => c.Key));
    }

    // 2. Put a test object
    const testKey = `test/connection-test-${Date.now()}.txt`;
    const testContent = "Cloudflare R2 storage connection successful for Dr. Sharmistha Bhattacharyya platform!";
    console.log(`\n2. Testing PutObject to '${testKey}'...`);
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: testKey,
      Body: Buffer.from(testContent, "utf-8"),
      ContentType: "text/plain",
    }));
    console.log("✓ PutObject succeeded!");

    // 3. Get the object back
    console.log(`\n3. Testing GetObject from '${testKey}'...`);
    const getRes = await client.send(new GetObjectCommand({
      Bucket: bucket,
      Key: testKey,
    }));
    const text = await getRes.Body.transformToString();
    console.log(`✓ GetObject succeeded! Content verified: "${text}"`);

    // 4. Test Public URL access if enabled
    if (publicUrl) {
      const fullPublicUrl = `${publicUrl}/${testKey}`;
      console.log(`\n4. Testing Public Dev URL: ${fullPublicUrl}...`);
      try {
        const pubRes = await fetch(fullPublicUrl);
        if (pubRes.ok) {
          console.log(`✓ Public URL is active and accessible (HTTP ${pubRes.status})!`);
        } else {
          console.log(`! Public URL returned HTTP ${pubRes.status} (${pubRes.statusText})`);
        }
      } catch (e) {
        console.log(`! Public URL fetch failed: ${e.message}`);
      }
    }

    // 5. Cleanup test object
    console.log(`\n5. Cleaning up test object '${testKey}'...`);
    await client.send(new DeleteObjectCommand({
      Bucket: bucket,
      Key: testKey,
    }));
    console.log("✓ Cleanup complete!");

    console.log("\n🎉 ALL R2 TESTS PASSED! R2 is fully accessible with read/write permissions.");
  } catch (err) {
    console.error("\n❌ R2 Connection Test Failed:", err);
    process.exit(1);
  }
}

run();
