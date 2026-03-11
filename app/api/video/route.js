import { NextResponse } from 'next/server';
import { writeFile, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { spawn } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import { generateCommand } from '@/app/video/logic/videoProcessor';

// Allow up to 100 MB uploads
export const config = { api: { bodyParser: false } };

/**
 * Runs the ffmpeg binary with the given args in the specified working directory.
 */
function runFFmpeg(args, cwd) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, ['-y', ...args], { cwd });
    const stderr = [];
    proc.stderr.on('data', (chunk) => stderr.push(chunk));
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg failed (code ${code}): ${Buffer.concat(stderr).toString().slice(-500)}`));
      }
    });
    proc.on('error', reject);
  });
}

export async function POST(request) {
  let inputPath = null;
  let outputPath = null;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const tool = formData.get('tool');
    const settings = JSON.parse(formData.get('settings') || '{}');

    if (!file || !tool) {
      return NextResponse.json({ error: 'Missing file or tool parameter' }, { status: 400 });
    }

    const id = randomUUID();
    const ext = file.name.split('.').pop().toLowerCase();
    const inputFileName = `${id}-input.${ext}`;
    inputPath = join(tmpdir(), inputFileName);

    // Write uploaded file to temp dir
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, buffer);

    // Generate FFmpeg command args (filenames only, not full paths)
    const { args, outputFile, mimeType } = generateCommand(tool, inputFileName, settings);
    outputPath = join(tmpdir(), outputFile);

    // Run FFmpeg from the temp directory so relative filenames resolve correctly
    await runFFmpeg(args, tmpdir());

    // Read and return the output file
    const outputBuffer = await readFile(outputPath);

    return new Response(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${outputFile}"`,
        'X-File-Name': outputFile,
      },
    });
  } catch (err) {
    console.error('[API /api/video] Error:', err.message);
    return NextResponse.json({ error: err.message || 'Video processing failed' }, { status: 500 });
  } finally {
    // Clean up temp files
    if (inputPath) unlink(inputPath).catch(() => {});
    if (outputPath) unlink(outputPath).catch(() => {});
  }
}
