# File Parsers Module

Production-ready file parsing module supporting PDF, Word, Excel, and Image OCR.

## 📋 Overview

This module provides comprehensive file parsing capabilities for multiple document formats:
- **PDF** - Extract text from PDF documents
- **Word** - Parse .doc and .docx files
- **Excel** - Read .xlsx, .xls, and .csv files
- **Image OCR** - Extract text from images (PNG, JPG, JPEG)

## 📦 Module Contents

**Total**: 5 files, 1,577 lines of code

### Core Files
- `lib/parsers/pdf-parser.ts` (275 lines) - PDF text extraction
- `lib/parsers/word-parser.ts` (288 lines) - Word document parsing
- `lib/parsers/excel-parser.ts` (368 lines) - Excel/CSV parsing
- `lib/parsers/image-ocr-parser.ts` (350 lines) - OCR text extraction
- `lib/parsers/index.ts` (296 lines) - Unified API and file type detection

## 🚀 Features

### 1. PDF Parsing
- Text extraction from PDF documents
- Support for multi-page PDFs
- Metadata extraction (author, title, creation date)
- Page-by-page parsing option
- Table extraction support

### 2. Word Document Parsing
- Support for .docx and .doc formats
- Text and formatting preservation
- Image extraction capability
- Paragraph and heading detection
- Style information retention

### 3. Excel/CSV Parsing
- Read .xlsx, .xls, and .csv files
- Sheet-by-sheet processing
- Header row detection
- Cell type preservation
- Formula evaluation support
- Large file streaming

### 4. Image OCR
- Text extraction from images
- Support for PNG, JPG, JPEG formats
- Multi-language support (configurable)
- Confidence scoring
- Preprocessing for better accuracy

### 5. Unified API
- Automatic file type detection
- Single parse function for all formats
- Consistent result interface
- Error handling and warnings
- Performance metrics

## 🔧 Installation

### Dependencies
```bash
# PDF parsing
npm install pdf-parse

# Word parsing
npm install mammoth

# Excel parsing
npm install xlsx

# Image OCR
npm install tesseract.js

# File type detection
npm install file-type
```

## 📖 Usage Examples

### Unified API (Recommended)
```typescript
import { parseFile, detectFileType } from '@/lib/parsers';

// Auto-detect and parse any supported file
const fileBuffer = await readFile('document.pdf');
const fileType = detectFileType(fileBuffer, 'document.pdf');
const result = await parseFile(fileBuffer, fileType);

console.log(result.text);
console.log(`Parsed in ${result.parseTime}ms`);
```

### PDF Parsing
```typescript
import { PDFParser } from '@/lib/parsers';

const pdfBuffer = await readFile('document.pdf');
const parser = new PDFParser();

const result = await parser.parse(pdfBuffer);
console.log('Text:', result.text);
console.log('Pages:', result.metadata?.numPages);
console.log('Author:', result.metadata?.info?.Author);
```

### Word Document Parsing
```typescript
import { WordParser } from '@/lib/parsers';

const docxBuffer = await readFile('document.docx');
const parser = new WordParser();

const result = await parser.parse(docxBuffer);
console.log('Text:', result.text);
console.log('Paragraphs:', result.metadata?.paragraphs?.length);
```

### Excel Parsing
```typescript
import { ExcelParser } from '@/lib/parsers';

const xlsxBuffer = await readFile('data.xlsx');
const parser = new ExcelParser();

const result = await parser.parse(xlsxBuffer);

// Access sheet data
const sheets = result.metadata?.sheets;
sheets.forEach(sheet => {
  console.log(`Sheet: ${sheet.name}`);
  sheet.data.forEach(row => {
    console.log(row);
  });
});
```

### Image OCR
```typescript
import { ImageOCRParser } from '@/lib/parsers';

const imageBuffer = await readFile('scan.jpg');
const parser = new ImageOCRParser({
  language: 'eng+chi_tra',  // English + Traditional Chinese
  minConfidence: 60
});

const result = await parser.parse(imageBuffer);
console.log('Extracted text:', result.text);
console.log('Confidence:', result.metadata?.confidence);
```

### API Route Integration
```typescript
// app/api/parse/route.ts
import { parseFile, detectFileType } from '@/lib/parsers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = detectFileType(buffer, file.name);

    const result = await parseFile(buffer, fileType);

    return NextResponse.json({
      text: result.text,
      fileType: result.fileType,
      parseTime: result.parseTime,
      metadata: result.metadata
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'File parsing failed' },
      { status: 500 }
    );
  }
}
```

### Server Action Example
```typescript
'use server';

import { parseFile, detectFileType, FileType } from '@/lib/parsers';

export async function parseDocument(formData: FormData) {
  const file = formData.get('document') as File;

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileType = detectFileType(buffer, file.name);

  if (fileType === FileType.UNKNOWN) {
    throw new Error('Unsupported file type');
  }

  const result = await parseFile(buffer, fileType);

  return {
    text: result.text,
    metadata: result.metadata,
    warnings: result.warnings
  };
}
```

## 🏗️ Architecture

### File Type Detection
```typescript
export function detectFileType(
  buffer: Buffer,
  filename?: string
): FileTypeResult {
  // 1. Check magic numbers (file signature)
  const magicNumber = buffer.slice(0, 8).toString('hex');

  // PDF: %PDF- (25 50 44 46 2D)
  if (magicNumber.startsWith('255044462d')) {
    return { type: FileType.PDF, mimeType: 'application/pdf' };
  }

  // 2. Check file extension if magic number fails
  if (filename) {
    const ext = filename.toLowerCase().split('.').pop();
    return getFileTypeFromExtension(ext);
  }

  // 3. Default to unknown
  return { type: FileType.UNKNOWN, mimeType: 'application/octet-stream' };
}
```

### Parser Interface
```typescript
export interface FileParser {
  parse(buffer: Buffer): Promise<ParseResult>;
}

export interface ParseResult {
  text: string;              // Extracted text content
  fileType: FileType;        // File type
  fileSize: number;          // File size in bytes
  parseTime: number;         // Parsing duration (ms)
  metadata?: Record<string, any>;  // Format-specific metadata
  warnings?: string[];       // Warnings during parsing
}
```

### Parsing Flow
1. **File Upload** - Receive file from client
2. **Type Detection** - Identify file format (magic numbers → extension)
3. **Parser Selection** - Choose appropriate parser
4. **Content Extraction** - Parse file and extract text
5. **Metadata Collection** - Gather format-specific information
6. **Result Return** - Send structured result to client

## 🔒 Security Considerations

### File Type Validation
```typescript
// Validate file type before parsing
const allowedTypes = [FileType.PDF, FileType.WORD, FileType.EXCEL];

if (!allowedTypes.includes(fileType)) {
  throw new Error('File type not allowed');
}
```

### File Size Limits
```typescript
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

if (buffer.length > MAX_FILE_SIZE) {
  throw new Error('File size exceeds limit');
}
```

### Virus Scanning
```typescript
import { scanFile } from '@/lib/security/virus-scanner';

// Scan file before parsing
const scanResult = await scanFile(buffer);
if (!scanResult.clean) {
  throw new Error('File failed security scan');
}
```

### Content Sanitization
```typescript
import DOMPurify from 'isomorphic-dompurify';

// Sanitize extracted text for XSS prevention
const sanitizedText = DOMPurify.sanitize(result.text, {
  ALLOWED_TAGS: [],  // Strip all HTML
  KEEP_CONTENT: true
});
```

## ⚡ Performance Tips

### 1. Streaming for Large Files
```typescript
// Excel streaming for large files
import * as XLSX from 'xlsx';

export async function parseExcelStream(buffer: Buffer) {
  const workbook = XLSX.read(buffer, {
    type: 'buffer',
    sheetRows: 1000  // Process in chunks
  });

  // Process sheets one at a time
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    // Process data...
  }
}
```

### 2. Parallel Parsing
```typescript
import pLimit from 'p-limit';

const limit = pLimit(5);  // Max 5 concurrent parsers

const results = await Promise.all(
  files.map(file =>
    limit(async () => {
      const buffer = await readFile(file.path);
      return parseFile(buffer, file.type);
    })
  )
);
```

### 3. Caching Results
```typescript
import { cache } from 'react';

export const getCachedParseResult = cache(
  async (fileHash: string, buffer: Buffer) => {
    const cached = await redis.get(`parse:${fileHash}`);
    if (cached) return JSON.parse(cached);

    const result = await parseFile(buffer, detectFileType(buffer));
    await redis.set(`parse:${fileHash}`, JSON.stringify(result), 'EX', 3600);

    return result;
  }
);
```

### 4. OCR Optimization
```typescript
// Preprocess image for better OCR accuracy
import sharp from 'sharp';

const optimizedBuffer = await sharp(imageBuffer)
  .grayscale()           // Convert to grayscale
  .normalize()           // Normalize contrast
  .sharpen()             // Sharpen edges
  .resize(null, 2000)    // Upscale if needed
  .toBuffer();

const result = await imageOCRParser.parse(optimizedBuffer);
```

## 🧪 Testing

### Unit Tests
```typescript
import { PDFParser, WordParser, ExcelParser } from '@/lib/parsers';

describe('File Parsers', () => {
  describe('PDF Parser', () => {
    it('should extract text from PDF', async () => {
      const buffer = await readFile('test-files/sample.pdf');
      const parser = new PDFParser();
      const result = await parser.parse(buffer);

      expect(result.text).toContain('Expected text');
      expect(result.fileType).toBe(FileType.PDF);
    });
  });

  describe('Word Parser', () => {
    it('should parse DOCX file', async () => {
      const buffer = await readFile('test-files/sample.docx');
      const parser = new WordParser();
      const result = await parser.parse(buffer);

      expect(result.text).toBeDefined();
      expect(result.metadata?.format).toBe('docx');
    });
  });
});
```

### Integration Tests
```typescript
describe('Parse API', () => {
  it('should parse uploaded PDF', async () => {
    const formData = new FormData();
    formData.append('file', new Blob([pdfBuffer]), 'test.pdf');

    const res = await fetch('/api/parse', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    expect(data.text).toBeDefined();
    expect(data.fileType).toBe('pdf');
  });
});
```

## 📊 Monitoring

### Key Metrics
- Parse success/failure rate
- Average parse time by file type
- File size distribution
- OCR accuracy (confidence scores)
- Memory usage during parsing

### Example Monitoring
```typescript
import { metrics } from '@/lib/monitoring';

export async function parseFile(buffer: Buffer, type: FileType) {
  const startTime = Date.now();
  const fileSize = buffer.length;

  try {
    const result = await _parse(buffer, type);

    metrics.recordParsing({
      fileType: type,
      fileSize,
      parseTime: Date.now() - startTime,
      success: true
    });

    return result;
  } catch (error) {
    metrics.recordParsing({
      fileType: type,
      fileSize,
      parseTime: Date.now() - startTime,
      success: false,
      error: error.message
    });
    throw error;
  }
}
```

## 🐛 Common Issues

### Issue: PDF parsing returns empty text
**Solution**: PDF may contain scanned images. Use OCR instead:
```typescript
// Fallback to OCR for image-based PDFs
if (!result.text || result.text.trim().length < 10) {
  // Convert PDF to images and use OCR
  const images = await pdfToImages(buffer);
  const ocrResults = await Promise.all(
    images.map(img => imageOCRParser.parse(img))
  );
  result.text = ocrResults.map(r => r.text).join('\n');
}
```

### Issue: Excel parsing fails for large files
**Solution**: Use streaming mode:
```typescript
const parser = new ExcelParser({ streaming: true, chunkSize: 1000 });
```

### Issue: OCR accuracy is low
**Solution**: Preprocess images and adjust Tesseract settings:
```typescript
const parser = new ImageOCRParser({
  language: 'eng',
  tesseractOptions: {
    tessedit_pageseg_mode: 1,  // Automatic page segmentation
    tessedit_ocr_engine_mode: 2  // LSTM only
  }
});
```

### Issue: Memory issues with concurrent parsing
**Solution**: Limit concurrent operations:
```typescript
import pLimit from 'p-limit';
const limit = pLimit(3);  // Reduce to 3 concurrent parsers
```

## 📚 Resources

- [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- [mammoth.js](https://www.npmjs.com/package/mammoth)
- [xlsx](https://www.npmjs.com/package/xlsx)
- [tesseract.js](https://www.npmjs.com/package/tesseract.js)

## 🔄 Version History

- **v1.0.0** - Initial extraction from AI Sales Enablement Platform
  - PDF, Word, Excel, Image OCR parsers
  - Unified parsing API
  - File type detection
  - Metadata extraction

---

Part of **AI Web App Template v5.0**
