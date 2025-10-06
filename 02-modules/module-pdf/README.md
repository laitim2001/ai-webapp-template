# PDF Generation Module

Production-ready PDF generation module using Puppeteer for HTML-to-PDF conversion.

## 📋 Overview

This module provides enterprise-grade PDF generation capabilities with support for:
- HTML-to-PDF conversion using Puppeteer
- Custom page settings (A4, Letter, Legal formats)
- Headers and footers support
- High-quality rendering
- Singleton browser instance for performance
- Resource management and error handling

## 📦 Module Contents

**Total**: 3 files, 636 lines of code

### Core Files
- `lib/pdf/pdf-generator.ts` (258 lines) - Main PDF generation service
- `lib/pdf/proposal-pdf-template.ts` (356 lines) - Example PDF template
- `lib/pdf/index.ts` (22 lines) - Module exports

## 🚀 Features

### 1. HTML-to-PDF Conversion
- Convert any HTML content to PDF format
- Support for complex layouts and styling
- CSS rendering with print media support
- Background graphics and images

### 2. Page Configuration
- **Formats**: A4, Letter, Legal
- **Orientation**: Portrait or Landscape
- **Margins**: Customizable top/right/bottom/left
- **Scale**: Adjustable page scale (default 1)
- **Page Ranges**: Select specific pages to print

### 3. Headers & Footers
- Custom header HTML templates
- Custom footer HTML templates
- Page numbers and metadata support
- Conditional display control

### 4. Performance Optimization
- Singleton browser instance pattern
- Reduced startup overhead
- Connection pooling
- Graceful shutdown handling

### 5. Error Handling
- Comprehensive error catching
- Resource cleanup on failure
- Browser instance recovery
- Detailed error messages

## 🔧 Installation

### Dependencies
```bash
npm install puppeteer
```

### Optional Dependencies (for templates)
```bash
npm install handlebars  # If using templating
```

## 📖 Usage Examples

### Basic PDF Generation
```typescript
import { generatePDFFromHTML } from '@/lib/pdf';

const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        h1 { color: #333; }
      </style>
    </head>
    <body>
      <h1>Sample Document</h1>
      <p>This is a PDF generated from HTML.</p>
    </body>
  </html>
`;

const pdfBuffer = await generatePDFFromHTML(htmlContent);
// Save or return the PDF buffer
```

### Advanced Configuration
```typescript
import { generatePDFFromHTML, PDFGenerationOptions } from '@/lib/pdf';

const options: PDFGenerationOptions = {
  format: 'A4',
  landscape: false,
  margin: {
    top: '1cm',
    right: '1.5cm',
    bottom: '1cm',
    left: '1.5cm'
  },
  displayHeaderFooter: true,
  headerTemplate: `
    <div style="font-size: 10px; text-align: center; width: 100%;">
      Company Name - Confidential
    </div>
  `,
  footerTemplate: `
    <div style="font-size: 10px; text-align: center; width: 100%;">
      Page <span class="pageNumber"></span> of <span class="totalPages"></span>
    </div>
  `,
  printBackground: true,
  scale: 1
};

const pdfBuffer = await generatePDFFromHTML(htmlContent, options);
```

### Using PDF Template
```typescript
import { generateProposalPDF } from '@/lib/pdf/proposal-pdf-template';

const proposalData = {
  title: 'Business Proposal',
  clientName: 'Acme Corp',
  date: new Date(),
  sections: [
    { heading: 'Executive Summary', content: '...' },
    { heading: 'Services Offered', content: '...' },
    { heading: 'Pricing', content: '...' }
  ]
};

const pdfBuffer = await generateProposalPDF(proposalData);
```

### API Route Integration
```typescript
// app/api/pdf/generate/route.ts
import { generatePDFFromHTML } from '@/lib/pdf';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { htmlContent, options } = await req.json();

    const pdfBuffer = await generatePDFFromHTML(htmlContent, options);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'PDF generation failed' },
      { status: 500 }
    );
  }
}
```

### Server Action Example
```typescript
// app/actions/pdf-actions.ts
'use server';

import { generatePDFFromHTML } from '@/lib/pdf';

export async function generateReportPDF(data: ReportData) {
  const htmlContent = renderReportToHTML(data);

  const pdfBuffer = await generatePDFFromHTML(htmlContent, {
    format: 'A4',
    margin: { top: '1cm', bottom: '1cm', left: '1.5cm', right: '1.5cm' }
  });

  // Save to storage or return
  return pdfBuffer;
}
```

## 🏗️ Architecture

### Browser Instance Management
```typescript
// Singleton pattern for browser instance
let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return browserInstance;
}

// Cleanup on shutdown
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
```

### PDF Generation Flow
1. **HTML Input** - Receive HTML content and options
2. **Browser Initialization** - Get or create Puppeteer instance
3. **Page Creation** - Create new page with viewport settings
4. **Content Rendering** - Set HTML content and wait for load
5. **PDF Generation** - Convert page to PDF with options
6. **Resource Cleanup** - Close page, keep browser alive
7. **Return Buffer** - Return PDF as Buffer for further processing

## 🔒 Security Considerations

### Input Sanitization
```typescript
// Sanitize HTML input before PDF generation
import DOMPurify from 'isomorphic-dompurify';

const sanitizedHTML = DOMPurify.sanitize(userProvidedHTML, {
  ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'div', 'span', 'table', 'tr', 'td'],
  ALLOWED_ATTR: ['class', 'style']
});

const pdfBuffer = await generatePDFFromHTML(sanitizedHTML);
```

### Resource Limits
- Set timeout for PDF generation (default: 30s)
- Limit concurrent PDF operations
- Monitor memory usage
- Implement request throttling

### Puppeteer Security
```typescript
// Secure browser launch configuration
const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',              // Required for Docker
    '--disable-setuid-sandbox',  // Required for Docker
    '--disable-dev-shm-usage',   // Overcome limited resource problems
    '--disable-gpu',             // Applicable to Windows OS only
  ]
});
```

## ⚡ Performance Tips

### 1. Reuse Browser Instance
- Use singleton pattern (already implemented)
- Keep browser alive between requests
- Close only on application shutdown

### 2. Optimize HTML
- Minimize external resources
- Use inline styles instead of external CSS
- Optimize images before embedding

### 3. Concurrent Limits
```typescript
import pLimit from 'p-limit';

const limit = pLimit(3); // Max 3 concurrent PDF generations

const pdfPromises = htmlContents.map(html =>
  limit(() => generatePDFFromHTML(html))
);

const pdfs = await Promise.all(pdfPromises);
```

### 4. Caching
```typescript
import { cache } from 'react';

export const getCachedPDF = cache(async (contentHash: string) => {
  // Check cache first
  const cached = await redis.get(`pdf:${contentHash}`);
  if (cached) return Buffer.from(cached, 'base64');

  // Generate if not cached
  const pdf = await generatePDFFromHTML(htmlContent);
  await redis.set(`pdf:${contentHash}`, pdf.toString('base64'), 'EX', 3600);

  return pdf;
});
```

## 🧪 Testing

### Unit Tests
```typescript
import { generatePDFFromHTML } from '@/lib/pdf';

describe('PDF Generation', () => {
  it('should generate PDF from HTML', async () => {
    const html = '<h1>Test</h1>';
    const pdf = await generatePDFFromHTML(html);

    expect(pdf).toBeInstanceOf(Buffer);
    expect(pdf.length).toBeGreaterThan(0);
  });

  it('should apply custom options', async () => {
    const html = '<p>Test</p>';
    const pdf = await generatePDFFromHTML(html, {
      format: 'Letter',
      landscape: true
    });

    expect(pdf).toBeInstanceOf(Buffer);
  });
});
```

### Integration Tests
```typescript
import { POST } from '@/app/api/pdf/generate/route';

describe('PDF API', () => {
  it('should generate PDF via API', async () => {
    const req = new Request('http://localhost/api/pdf/generate', {
      method: 'POST',
      body: JSON.stringify({
        htmlContent: '<h1>Test PDF</h1>',
        options: { format: 'A4' }
      })
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/pdf');
  });
});
```

## 📊 Monitoring

### Key Metrics
- PDF generation time
- Browser instance health
- Memory usage
- Error rate
- Queue length (if using job queue)

### Example Monitoring
```typescript
import { metrics } from '@/lib/monitoring';

export async function generatePDFFromHTML(
  htmlContent: string,
  options?: PDFGenerationOptions
): Promise<Buffer> {
  const startTime = Date.now();

  try {
    const pdf = await _generatePDF(htmlContent, options);

    metrics.recordPDFGeneration({
      duration: Date.now() - startTime,
      success: true,
      format: options?.format || 'A4'
    });

    return pdf;
  } catch (error) {
    metrics.recordPDFGeneration({
      duration: Date.now() - startTime,
      success: false,
      error: error.message
    });
    throw error;
  }
}
```

## 🐛 Common Issues

### Issue: Puppeteer fails to launch
**Solution**: Ensure all required dependencies are installed
```bash
# Ubuntu/Debian
apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 \
  libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 \
  libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 \
  libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
  libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
  libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 \
  libnss3 lsb-release xdg-utils wget
```

### Issue: Memory leaks
**Solution**: Ensure proper browser cleanup
```typescript
// Add cleanup on process exit
process.on('SIGTERM', async () => {
  await closeBrowser();
  process.exit(0);
});
```

### Issue: Slow generation
**Solution**:
- Use browser instance pooling
- Optimize HTML structure
- Reduce external resource loading
- Implement caching strategy

## 📚 Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [PDF Generation Best Practices](https://pptr.dev/guides/pdf-generation)
- [Chromium Print CSS](https://www.chromium.org/for-testers/enable-logging/)

## 🔄 Version History

- **v1.0.0** - Initial extraction from AI Sales Enablement Platform
  - Basic HTML-to-PDF conversion
  - Custom page settings
  - Header/footer support
  - Browser instance management

---

Part of **AI Web App Template v5.0**
