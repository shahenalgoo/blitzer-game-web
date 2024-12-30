

export function compressImage(blob: Blob, maxWidthOrHeight: number = 800, quality: number = 0.7): Promise<Blob> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.src = URL.createObjectURL(blob);

		img.onload = () => {
			URL.revokeObjectURL(img.src);
			const canvas = document.createElement('canvas');

			// Calculate new dimensions maintaining aspect ratio
			let width = img.width;
			let height = img.height;

			if (width > height) {
				if (width > maxWidthOrHeight) {
					height = Math.round((height * maxWidthOrHeight) / width);
					width = maxWidthOrHeight;
				}
			} else {
				if (height > maxWidthOrHeight) {
					width = Math.round((width * maxWidthOrHeight) / height);
					height = maxWidthOrHeight;
				}
			}

			canvas.width = width;
			canvas.height = height;

			const ctx = canvas.getContext('2d');
			if (!ctx) {
				reject(new Error('Could not get canvas context'));
				return;
			}

			// Draw and compress
			ctx.drawImage(img, 0, 0, width, height);

			// Convert to blob
			canvas.toBlob(
				(blob) => {
					if (blob) {
						resolve(blob);
					} else {
						reject(new Error('Blob conversion failed'));
					}
				},
				'image/jpeg',
				quality
			);
		};

		img.onerror = () => {
			reject(new Error('Image loading failed'));
		};
	});
}