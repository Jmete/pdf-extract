// components/pdf-viewer.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { useDropzone, FileRejection } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, Upload, Download } from "lucide-react";

// Define interfaces for component props
interface PDFViewerProps {
  className?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ className }) => {
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize PDF.js worker
  useEffect(() => {
    if (typeof window !== 'undefined') {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    }
  }, []);

  // Handle client-side only code
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle file drop or selection
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setError(null);
    if (fileRejections.length > 0) {
      console.error("File rejection:", fileRejections);
      setError("Please upload a valid PDF file");
      return;
    }
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      console.log("Accepted file:", file.name, file.type, file.size);
      if (file.type === "application/pdf") {
        setFileName(file.name);
        const fileUrl = URL.createObjectURL(file);
        console.log("Created URL:", fileUrl);
        setPdfFile(fileUrl);
      } else {
        setError("Please upload a valid PDF file");
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  // Handle document load success
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    console.log("PDF loaded successfully with", numPages, "pages");
    setError(null);
    setNumPages(numPages);
  };

  // Handle document load error
  const onDocumentLoadError = (error: Error): void => {
    console.error("Error loading PDF:", error);
    setError("Failed to load PDF. Please try again with a valid PDF file.");
  };

  // Zoom controls
  const zoomIn = (): void => setScale((prev) => Math.min(prev + 0.1, 3));
  const zoomOut = (): void => setScale((prev) => Math.max(prev - 0.1, 0.5));
  
  // Rotation controls
  const rotateClockwise = (): void => setRotation((prev) => (prev + 90) % 360);
  const rotateCounterClockwise = (): void => setRotation((prev) => (prev - 90 + 360) % 360);

  // Reset the viewer
  const resetViewer = (): void => {
    setPdfFile(null);
    setFileName("");
    setNumPages(null);
    setScale(1);
    setRotation(0);
    setError(null);
  };

  // If rendering on server, return a placeholder
  if (!isClient) {
    return (
      <Card>
        <CardContent className="p-6 h-64 flex items-center justify-center">
          <p>Loading PDF viewer...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className || ""}`}>
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}
      
      {!pdfFile ? (
        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer ${
                isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-primary font-medium">Drop the PDF file here ...</p>
              ) : (
                <div className="space-y-4">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-gray-600">Drag and drop a PDF file here, or click to select</p>
                  <Button variant="outline">Select PDF</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium truncate max-w-md">{fileName}</h3>
            
            <Button variant="outline" onClick={resetViewer} size="sm">
              Upload Another PDF
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={zoomOut}>
                <ZoomOut size={18} />
              </Button>
              <div className="w-40">
                <Slider
                  value={[scale * 100]}
                  min={50}
                  max={300}
                  step={10}
                  onValueChange={(value) => setScale(value[0] / 100)}
                />
              </div>
              <Button variant="outline" size="icon" onClick={zoomIn}>
                <ZoomIn size={18} />
              </Button>
              <span className="text-sm w-16">{Math.round(scale * 100)}%</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={rotateCounterClockwise}>
                <RotateCcw size={18} />
              </Button>
              <Button variant="outline" size="icon" onClick={rotateClockwise}>
                <RotateCw size={18} />
              </Button>
              <span className="text-sm w-12">{rotation}°</span>
            </div>
            
            {pdfFile && (
              <Button variant="outline" size="sm" onClick={() => window.open(pdfFile, '_blank')}>
                <Download size={18} className="mr-2" />
                Download
              </Button>
            )}
          </div>
          
          <div className="flex-1 min-h-0 relative bg-muted rounded-lg">
            <div className="absolute inset-0 overflow-y-auto">
              <div className="flex flex-col items-center p-4">
                <Document
                  file={pdfFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  className="pdf-document"
                  loading={
                    <div className="py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Loading PDF...</p>
                    </div>
                  }
                >
                  {numPages && Array.from(new Array(numPages), (_, index) => (
                    <div key={`page_${index + 1}`} className="mb-8 last:mb-0">
                      <Page
                        pageNumber={index + 1}
                        scale={scale}
                        rotate={rotation}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        className="shadow-lg bg-white"
                      />
                    </div>
                  ))}
                </Document>
              </div>
            </div>
          </div>
          
          {numPages && (
            <div className="text-sm text-gray-500 text-center py-2 mt-4">
              {numPages} page{numPages > 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PDFViewer;