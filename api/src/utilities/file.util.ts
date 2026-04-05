import { promises as fs } from "node:fs";
import { randomBytes } from "node:crypto";
import { join } from "node:path";

export default class FileUtil {
  private readonly DEFAULT_DIR = join(
    process.cwd(),
    "tmp",
    "io-jobs",
  );

  public async writeLargeFile(
    sizeBytes: number,
    filename = `large-${Date.now()}.bin`,
    chunkSizeBytes = 1024 * 1024,
    random = false,
  ): Promise<{ path: string; bytesWritten: number }> {
    if (!Number.isFinite(sizeBytes) || sizeBytes < 0) {
      throw new Error("sizeBytes must be a non-negative number");
    }
    if (!Number.isFinite(chunkSizeBytes) || chunkSizeBytes <= 0) {
      throw new Error("chunkSizeBytes must be > 0");
    }

    await fs.mkdir(this.DEFAULT_DIR, { recursive: true });
    const path = join(this.DEFAULT_DIR, filename);
    const handle = await fs.open(path, "w");

    let remaining = Math.floor(sizeBytes);
    let bytesWritten = 0;
    const pattern = Buffer.from("0123456789abcdef");

    try {
      while (remaining > 0) {
        const size = remaining > chunkSizeBytes ? chunkSizeBytes : remaining;
        const buffer = random
          ? randomBytes(size)
          : this.buildPattern(pattern, size);
        await handle.write(buffer, 0, size);
        remaining -= size;
        bytesWritten += size;
      }
    } finally {
      await handle.close();
    }

    return { path, bytesWritten };
  }

  public async manySmallFiles(
    count: number,
    bytesPerFile = 128,
    readAfterWrite = false,
    deleteAfterRead = false,
  ): Promise<{
    dir: string;
    filesWritten: number;
    bytesRead: number;
    filesDeleted: number;
  }> {
    if (!Number.isFinite(count) || count < 0) {
      throw new Error("count must be a non-negative number");
    }
    if (!Number.isFinite(bytesPerFile) || bytesPerFile < 0) {
      throw new Error("bytesPerFile must be a non-negative number");
    }

    const dir = join(this.DEFAULT_DIR, `many-${Date.now()}`);
    await fs.mkdir(dir, { recursive: true });

    const payload = Buffer.alloc(Math.floor(bytesPerFile), 97);
    let bytesRead = 0;
    let filesDeleted = 0;

    for (let i = 0; i < count; i += 1) {
      const path = join(dir, `file-${i}.txt`);
      await fs.writeFile(path, payload);

      if (readAfterWrite) {
        const data = await fs.readFile(path);
        bytesRead += data.length;
      }

      if (deleteAfterRead) {
        await fs.unlink(path);
        filesDeleted += 1;
      }
    }

    return { dir, filesWritten: count, bytesRead, filesDeleted };
  }

  private buildPattern(pattern: Buffer, size: number): Buffer {
    const out = Buffer.alloc(size);
    for (let i = 0; i < size; i += 1) {
      out[i] = pattern[i % pattern.length];
    }
    return out;
  }
}
