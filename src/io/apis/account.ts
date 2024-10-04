const invoke = `${(import.meta as any).env.VITE_APP_INVOKE_URL}`;

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': (import.meta as any).env.VITE_APP_API_KEY,
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

export async function updateItem(metadata: any): Promise<any> {
  const url = new URL(`${invoke}/user`);
  url.searchParams.append('userID', metadata.user_id);
  url.searchParams.append('scope', 'item');

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

export async function uploadToS3(data, presignedUrl) {
  console.log('Uploading data to S3:', data);

  if (data.cloud?.cloud_data) delete data.cloud.cloud_data;

  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    console.log('Upload response:', response);

    if (response.ok) {
      console.log('Upload successful:', response.status);
      return true;
    } else {
      console.error('Upload failed:', response.statusText);
      return false;
    }
  } catch (error) {
    throw new Error(`HTTP error! status: ${error}`);
  }
}

export async function downloadFromS3(s3Url) {
  const url = `${import.meta.env.VITE_APP_USERDATA_DISTRIBUTOR}/${s3Url}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const jsonData = await response.json();
      return jsonData;
    } else {
      console.error('Download failed:', response.statusText);
    }
  } catch (error) {
    console.error('Error downloading JSON:', error);
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
