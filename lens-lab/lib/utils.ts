/**
 * Converts a File object to a base64 string (without the data:... prefix).
 */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // Strip the "data:image/...;base64," prefix
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Converts a base64 string to a data URL for display in <img> tags.
 */
export function base64ToDataUrl(base64: string, mimeType = 'image/png'): string {
    return `data:${mimeType};base64,${base64}`;
}

/**
 * Extracts the generated image (base64) from a Gemini API response.
 * Gemini returns images as inline_data parts in the response.
 */
export function extractImageFromGeminiResponse(data: any): string | null {
    try {
        const candidates = data?.candidates;
        if (!candidates || candidates.length === 0) return null;

        const parts = candidates[0]?.content?.parts;
        if (!parts) return null;

        for (const part of parts) {
            if (part.inlineData || part.inline_data) {
                const inlineData = part.inlineData || part.inline_data;
                return inlineData.data;
            }
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Get the MIME type of a File.
 */
export function getFileMimeType(file: File): string {
    return file.type || 'image/jpeg';
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
