import { NextResponse } from 'next/server';
import { writeFile, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { spawn } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import { generateAudioCommand } from '@/app/audio/logic/audioProcessor';

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
  const tmpFiles = [];

  try {
    const formData = await request.formData();
    const tool = formData.get('tool');
    const settings = JSON.parse(formData.get('settings') || '{}');

    if (!tool) {
      return NextResponse.json({ error: 'Missing tool parameter' }, { status: 400 });
    }

    const id = randomUUID();
    let commandData;

    // ======================================================
    // MERGE AUDIO: Multiple files
    // ======================================================
    if (tool.toLowerCase().includes('merge')) {
      const files = formData.getAll('files');
      if (!files || files.length < 2) {
        return NextResponse.json({ error: 'At least 2 files are required for merge' }, { status: 400 });
      }

      const inputFileNames = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const ext = f.name.split('.').pop().toLowerCase();
        const name = `${id}-input${i}.${ext}`;
        const path = join(tmpdir(), name);
        await writeFile(path, Buffer.from(await f.arrayBuffer()));
        tmpFiles.push(path);
        inputFileNames.push(name);
      }

      commandData = generateAudioCommand(tool, inputFileNames, settings);
    }
    // ======================================================
    // SINGLE FILE TOOLS
    // ======================================================
    else {
      const file = formData.get('file');
      if (!file) {
        return NextResponse.json({ error: 'Missing file parameter' }, { status: 400 });
      }

      const ext = file.name.split('.').pop().toLowerCase();
      const inputFileName = `${id}-input.${ext}`;
      const inputPath = join(tmpdir(), inputFileName);
      await writeFile(inputPath, Buffer.from(await file.arrayBuffer()));
      tmpFiles.push(inputPath);

      commandData = generateAudioCommand(tool, inputFileName, settings);
    }

    const { args, outputFile, mimeType } = commandData;
    const outputPath = join(tmpdir(), outputFile);
    tmpFiles.push(outputPath);

    // Run FFmpeg from tmpdir so relative filenames resolve correctly
    await runFFmpeg(args, tmpdir());

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
    console.error('[API /api/audio] Error:', err.message);
    return NextResponse.json({ error: err.message || 'Audio processing failed' }, { status: 500 });
  } finally {
    for (const f of tmpFiles) {
      unlink(f).catch(() => {});
    }
  }
}
