import { UserStore } from '@/stores';
import logger from '@/user/logger';

const invoke = `${(import.meta as any).env.VITE_APP_INVOKE_URL || ''}`;

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': (import.meta as any).env.VITE_APP_API_KEY || '',
  'Access-Control-Request-Headers': 'Content-Type,x-api-key',
};

export const getUser = async (id: string): Promise<any> => {
  const url = new URL(`${invoke}/user`);
  url.searchParams.append('userID', id);
  url.searchParams.append('scope', 'meta');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
};

export const getUserData = async (id: string): Promise<any> => {
  const url = new URL(`${invoke}/user`);
  url.searchParams.append('userID', id);
  url.searchParams.append('scope', 'all');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
};

export async function updateItem(metadata: any, scope = 'item'): Promise<any> {
  console.log('Updating item with metadata:', metadata);
  const url = new URL(`${invoke}/user`);
  url.searchParams.append('userID', UserStore().User.ID);
  url.searchParams.append('scope', scope);

  const body = typeof metadata === 'string' ? metadata : JSON.stringify(metadata);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

export async function updateUser(id: string, payload: any): Promise<any> {
  const url = new URL(`${invoke}/user`);
  url.searchParams.append('userID', id);
  url.searchParams.append('scope', 'meta');

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

export async function uploadToS3(data, presignedUrl, type = 'application/json') {
  logger.info('Uploading data to S3:', data);

  if (data.cloud?.cloud_data) delete data.cloud.cloud_data;

  const body = type === 'application/json' ? JSON.stringify(data) : data;

  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body,
      headers: {
        'Content-Type': type,
      },
    });
    logger.info(`Response from S3 upload: ${response.status}`);

    if (response.ok) {
      logger.info(`Upload successful: ${response.status}`);
      return true;
    } else {
      logger.error('Upload failed:', response.statusText);
      return false;
    }
  } catch (error) {
    throw new Error(`HTTP error! status: ${error}`);
  }
}

export async function downloadFromS3(s3Url) {
  const url = `${import.meta.env.VITE_APP_USERDATA_DISTRIBUTOR || ''}/${s3Url}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const jsonData = await response.json();
      return jsonData;
    } else {
      logger.error('Download failed:', response.statusText);
    }
  } catch (error) {
    logger.error('Error downloading JSON:', error);
  }
}

export async function getFromPresignDirect(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const rawData = await response.blob();
      return rawData;
    } else {
      logger.error('Download failed:', response.statusText);
    }
  } catch (error) {
    logger.error('Error downloading JSON:', error);
  }
}

export async function cloudDelete(user_id: string, sortkey: string, uri?: string) {
  const url = new URL(`${invoke}/user`);
  url.searchParams.append('user_id', user_id);
  url.searchParams.append('sortkey', sortkey);
  if (uri) url.searchParams.append('uri', uri);

  const response = await fetch(url.toString(), {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

export async function GetFromCode(codes: string | string[]) {
  const url = new URL(`${invoke}/code`);
  const isArray = Array.isArray(codes);
  url.searchParams.append('scope', isArray ? 'items' : 'item');
  url.searchParams.append('codes', JSON.stringify(isArray ? codes : [codes]));

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

export async function GetAchievement(code: string) {
  const url = new URL(`${invoke}/achievement`);
  url.searchParams.append('code', code);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}
