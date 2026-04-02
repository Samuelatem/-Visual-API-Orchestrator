import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { ExportedProject } from './backendExporter';

/**
 * Creates a ZIP file from the exported project
 * Returns the path to the ZIP file
 */
export async function createProjectZip(project: ExportedProject): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      // Create temp folder
      const tempFolder = path.join(process.cwd(), 'temp-exports');
      if (!fs.existsSync(tempFolder)) {
        fs.mkdirSync(tempFolder, { recursive: true });
      }

      // Create project folder inside temp
      const projectFolder = path.join(tempFolder, 'generated-backend');
      if (!fs.existsSync(projectFolder)) {
        fs.mkdirSync(projectFolder, { recursive: true });
      }

      // Write all files to disk
      for (const [filePath, content] of Object.entries(project.files)) {
        const fullPath = path.join(projectFolder, filePath);
        const dirPath = path.dirname(fullPath);

        // Create directories if they don't exist
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        // Write file
        fs.writeFileSync(fullPath, content, 'utf-8');
      }

      // Create ZIP file
      const zipPath = path.join(tempFolder, `generated-backend-${Date.now()}.zip`);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      // Handle archive events
      output.on('close', () => {
        console.log(`[OK] ZIP created: ${zipPath} (${archive.pointer()} bytes)`);
        resolve(zipPath);
      });

      archive.on('error', (error) => {
        console.error(`[Error] Archive error: ${error.message}`);
        reject(error);
      });

      // Pipe to output
      archive.pipe(output);

      // Add files to archive
      for (const [filePath, content] of Object.entries(project.files)) {
        archive.append(content, { name: `generated-backend/${filePath}` });
      }

      // Finalize archive
      archive.finalize();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Cleans up temporary files after download
 */
export function cleanupTempFiles() {
  try {
    const tempFolder = path.join(process.cwd(), 'temp-exports');
    if (fs.existsSync(tempFolder)) {
      fs.rmSync(tempFolder, { recursive: true, force: true });
      console.log('[OK] Temporary files cleaned up');
    }
  } catch (error) {
    console.error('Error cleaning up temp files:', error);
  }
}
