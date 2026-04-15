import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "node:child_process";
import { unlink } from "node:fs";
import {uploader}  from "../utils/s3.js"
const raw_video_file = path.join(
  fileURLToPath(import.meta.url),
  "..",
  "..",
  "upload",
);

const mp4_video_files = path.join(
  fileURLToPath(import.meta.url),
  "..",
  "..",
  "preprocess",
);
const hls_video_files = path.join(
  fileURLToPath(import.meta.url),
  "..",
  "..",
  "hls",
);

export class VideoPipeline {
  private videofile: File;
  private filePath: string;
  private filename: string;

  constructor(file: File, filename: string) {
    this.videofile = file;
    this.filename = filename;
    this.filePath = "";
    const buffer = new Promise((resolve, reject) => {
      if (this.videofile) {
        const b = this.videofile.arrayBuffer();
        resolve(b);
      } else {
        reject("");
      }
    });
    buffer.then((data: any) => {
      const d = Buffer.from(data);
      const upload_path = path.join(raw_video_file, filename);
      this.filePath = upload_path;
      writeFileSync(upload_path, d);
    });
  }

  public async convertVideoToMP4() {
    try {
      const _ = new Promise((resolve, reject) => {
        if (!this.filePath) {
          reject("File path is required");
          return;
        }
        exec(``, (err, stdout, stderr) => {
          if (err) {
            reject(err);
          }
          if (stdout) {
            resolve(`${mp4_video_files}` + "video.mp4");
            unlink(`${raw_video_file}/${this.filename}`, (err) => {
              console.log(err);
            });
          }
          if (stderr) {
            reject(stderr);
          }
        });
      });
    } catch (error) {
      console.log(error);
      throw new Error(String(error));
    }
  }

  public async convertVideoToHLS() {
    try {
      const _ = new Promise((resolve, reject) => {
        exec(`${mp4_video_files}/video.mp4`, (err, stdout, stderr) => {
          if (err) {
            reject(err);
          }
          if (stdout) {
            this.uploadToObjectStorage()
            resolve("");
          }
          if (stderr) {
            reject("");
          }
        });
      });
    } catch (error) {
      console.log(error);
      throw new Error(String(error));
    }
  }

  private async uploadToObjectStorage(){
    uploader(this.videofile);

  }
}
