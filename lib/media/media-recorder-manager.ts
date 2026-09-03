export class MediaRecorderManager {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private mimeType: string = '';

  private getSupportedMimeType(): string {
    const candidates = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4;codecs=h264,aac',
      'video/mp4',
    ];

    for (const mime of candidates) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) {
        return mime;
      }
    }
    return '';
  }

  startRecording(stream: MediaStream): void {
    this.recordedChunks = [];
    this.mimeType = this.getSupportedMimeType();

    try {
      const options: MediaRecorderOptions = this.mimeType
        ? { mimeType: this.mimeType }
        : {};
      this.mediaRecorder = new MediaRecorder(stream, options);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // collect 100ms chunks
    } catch (err) {
      console.error('MediaRecorder start error:', err);
      throw new Error('MEDIA_RECORDER_FAILED');
    }
  }

  stopRecording(): Promise<{ blob: Blob; url: string }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('NO_ACTIVE_RECORDER'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const type = this.mimeType || 'video/webm';
        const blob = new Blob(this.recordedChunks, { type });
        const url = URL.createObjectURL(blob);
        resolve({ blob, url });
      };

      this.mediaRecorder.onerror = (event) => {
        reject(event);
      };

      this.mediaRecorder.stop();
    });
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }
}
