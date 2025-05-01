// utils/storage.ts
const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN")!;
const GITHUB_REPO = Deno.env.get("GITHUB_REPO")!;
const MAX_FILE_SIZE = 50 * 1024 * 1024;

interface FileMetadata {
  originalName: string;
  type: string;
  size: number;
  uploadDate: string;
}

interface FileResponse {
  data: Uint8Array;
  metadata: FileMetadata;
}

export async function uploadFile(file: File): Promise<string> {
  try {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    const fileId = crypto.randomUUID();
    const extension = file.name.split('.').pop();
    const fileName = `${fileId}.${extension}`;
    
    const arrayBuffer = await file.arrayBuffer();
    const base64Content = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    const metadata: FileMetadata = {
      originalName: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
    };

    const issueContent = JSON.stringify({
      metadata,
      content: base64Content,
    });

    const issue = await createGitHubIssue(fileName, issueContent);
    return issue.number.toString();
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
}

export async function getFile(issueNumber: string): Promise<FileResponse> {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues/${issueNumber}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'deno-app',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch issue: ${response.status}`);
    }

    const issue = await response.json();
    const { metadata, content } = JSON.parse(issue.body);

    const binaryContent = atob(content);
    const bytes = new Uint8Array(binaryContent.length);
    for (let i = 0; i < binaryContent.length; i++) {
      bytes[i] = binaryContent.charCodeAt(i);
    }

    return {
      data: bytes,
      metadata,
    };
  } catch (error) {
    console.error('Download error:', error);
    throw new Error(`Download failed: ${error.message}`);
  }
}

async function createGitHubIssue(fileName: string, content: string) {
  const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'deno-app',
    },
    body: JSON.stringify({
      title: fileName,
      body: content,
      labels: ['file-storage']
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${await response.text()}`);
  }

  return await response.json();
}

export async function deleteFile(issueNumber: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/issues/${issueNumber}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
            'User-Agent': 'deno-app',
          },
          body: JSON.stringify({
            state: 'closed',
            labels: ['file-storage', 'deleted']
          })
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to delete issue: ${response.status}`);
      }
  
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  }