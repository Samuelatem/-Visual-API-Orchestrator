import { Router, Request, Response } from 'express';
import { generateBackendProject } from '../utils/backendExporter';
import { createProjectZip, cleanupTempFiles } from '../utils/zipGenerator';
import path from 'path';
import fs from 'fs';

const router = Router();

/**
 * GET /api/export-backend
 * Generates a complete backend project and returns it as a downloadable ZIP file
 */
router.get('/', async (req: Request, res: Response) => {
  let zipPath: string | null = null;

  try {
    // Step 1: Generate the backend project
    console.log('Generating backend project...');
    const project = await generateBackendProject();

    // Step 2: Create ZIP file
    console.log('Creating ZIP archive...');
    zipPath = await createProjectZip(project);

    // Step 3: Check if file exists
    if (!fs.existsSync(zipPath)) {
      throw new Error('ZIP file was not created');
    }

    // Step 4: Send file as download
    const fileName = `visual-api-orchestrator-backend-${Date.now()}.zip`;
    res.download(zipPath, fileName, (error) => {
      if (error) {
        console.error('Download error:', error);
      } else {
        console.log('[OK] Download completed');
      }

      // Clean up temp files after download completes
      setTimeout(() => {
        if (zipPath && fs.existsSync(zipPath)) {
          try {
            fs.unlinkSync(zipPath);
            console.log('[OK] ZIP file cleaned up');
          } catch (cleanupError) {
            console.error('Error cleaning up ZIP:', cleanupError);
          }
        }
      }, 2000);
    });
  } catch (error: any) {
    console.error('Export error:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to export backend',
    });

    // Clean up if something went wrong
    if (zipPath && fs.existsSync(zipPath)) {
      try {
        fs.unlinkSync(zipPath);
      } catch (e) {
        console.error('Error cleaning up failed ZIP:', e);
      }
    }
  }
});

export default router;
