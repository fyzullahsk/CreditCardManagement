import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useNavigate } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFViewer = ({ base64String }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
useEffect(() => {
 
}, [base64String])

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleDownload = async () => {
    const binaryData = atob(base64String);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
  
    const blob = new Blob([uint8Array], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', 'document.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    // await new Promise(resolve => setTimeout(resolve, 2000));
    //   window.location.reload(false);
  };
  

  return (
    <div style={{ height: '500px', overflowY: 'scroll', position: 'relative' }}>
  {/* <div style={{ textAlign: 'center', position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white' }}>
    <a href="" onClick={handleDownload}>
      Download PDF
    </a>
  </div> */}
  <div style={{ marginTop: '30px' }}>
    <Document
      file={{ data: new Uint8Array(atob(base64String).split('').map(char => char.charCodeAt(0))) }}
      onLoadSuccess={onDocumentLoadSuccess}
      className="pdf-viewer"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          style={{ marginBottom: '20px' }}
        />
      ))}
    </Document>
  </div>
</div>

  );
};

export default PDFViewer;