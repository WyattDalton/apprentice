
import pdf from 'pdf-parse';
import mammoth from 'mammoth';


// PDF Extractor
export async function extractTextFromPDFBuffer(buffer: Buffer): Promise<string> {

    const data = await pdf(buffer);
    return data.text;
}

// DOCX Extractor
export async function extractTextFromDocxBuffer(buffer: Buffer): Promise<string> {

    const arrayBuffer = new Uint8Array(buffer).buffer;
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value;
}

// TXT Extractor
export async function extractTextFromTXTBuffer(buffer: Buffer): Promise<string> {

    return buffer.toString('utf8');
}
