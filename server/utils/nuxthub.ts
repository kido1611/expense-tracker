export async function deleteImage(imagePath: string | null | undefined) {
  if (!imagePath) {
    return;
  }

  await hubBlob().delete(imagePath);
}
