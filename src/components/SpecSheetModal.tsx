import React, { useState, useEffect } from 'react';
import { X, Printer, Download, ShieldCheck, FileText, CheckCircle2, ExternalLink } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useLanguage } from '../i18n/LanguageContext';

export interface ServiceCardData {
  id: string;
  title: string;
  image: string;
  desc: string;
  benefits: readonly string[];
  techSpecsTitle: string;
  techSpecs: readonly {
    label: string;
    value: string;
  }[];
  priceFrom: string;
  btnText: string;
}

interface SpecSheetModalProps {
  isOpen: boolean;
  card: ServiceCardData | null;
  onClose: () => void;
}

export const SpecSheetModal: React.FC<SpecSheetModalProps> = ({
  isOpen,
  card,
  onClose,
}) => {
  const { t, lang } = useLanguage();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [lastBlobUrl, setLastBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setDownloadSuccess(false);
      setLastBlobUrl(null);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !card) return null;

  // Find reference code and technical number
  const refSpec = card.techSpecs.find(
    (s) =>
      s.label.toLowerCase().includes('referència') ||
      s.label.toLowerCase().includes('referencia') ||
      s.label.toLowerCase().includes('reference')
  );
  const techNumSpec = card.techSpecs.find(
    (s) =>
      s.label.toLowerCase().includes('núm') ||
      s.label.toLowerCase().includes('n.º') ||
      s.label.toLowerCase().includes('number')
  );

  const refCode = refSpec ? refSpec.value : 'TF-SPEC-2026';
  const techNum = techNumSpec ? techNumSpec.value : 'TS-SPEC';

  // Synchronous, bulletproof PDF generator with pixel-perfect mathematical grid
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // Top corporate red bar
      doc.setFillColor(220, 38, 38);
      doc.rect(0, 0, 210, 6, 'F');

      // Top cyber branding badge on left
      doc.setFillColor(10, 15, 29);
      doc.roundedRect(15, 11, 40, 16, 2, 2, 'F');
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.4);
      doc.roundedRect(15, 11, 40, 16, 2, 2, 'D');

      // Inside badge: TARRAKO in red, FREIGHT in luminous cyan
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(239, 68, 68);
      doc.text('TARRAKO', 35, 18, { align: 'center' });

      doc.setFontSize(7.5);
      doc.setTextColor(34, 211, 238); // Cyan
      doc.text('[ FREIGHT ]', 35, 23, { align: 'center' });

      // Brand Title text next to logo
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42);
      doc.text('TARRAKO', 60, 19);

      doc.setTextColor(220, 38, 38); // Corporate Red
      doc.text('FREIGHT', 98, 19);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(t.specModal.companySub + ' · UN/LOCODE: ESTAR', 60, 24.5);

      // Top right badge with Ref code & Tech code
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(252, 165, 165);
      doc.setLineWidth(0.4);
      doc.roundedRect(145, 11, 50, 16, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(185, 28, 28);
      doc.text(refCode, 170, 17.5, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(techNum, 170, 23, { align: 'center' });

      // Header bottom divider line
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.8);
      doc.line(15, 31, 195, 31);

      // Document title banner
      doc.setFillColor(248, 250, 252);
      doc.rect(15, 35, 180, 14, 'F');
      doc.setFillColor(220, 38, 38);
      doc.rect(15, 35, 3, 14, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.rect(15, 35, 180, 14, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(220, 38, 38);
      doc.text(t.specModal.docTitle.toUpperCase(), 22, 40);

      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(card.title, 22, 46);

      // Status pill on right of banner (dynamically measured and perfectly framed)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      const statusLabel = t.specModal.docStatus;
      const statusTextWidth = doc.getTextWidth(statusLabel);
      const padX = 4;
      const pillWidth = statusTextWidth + padX * 2 + 5; // dynamic width fits any text exactly
      const pillHeight = 7.5;
      const pillX = 192 - pillWidth; // align cleanly 3mm from right border
      const pillY = 38.25;

      // Draw green pill background and border
      doc.setFillColor(236, 253, 245);
      doc.setDrawColor(167, 243, 208);
      doc.setLineWidth(0.4);
      doc.roundedRect(pillX, pillY, pillWidth, pillHeight, 2, 2, 'FD');

      // Draw crisp green indicator circle
      doc.setFillColor(16, 185, 129);
      doc.circle(pillX + padX + 1.2, pillY + pillHeight / 2, 1.1, 'F');

      // Draw status text completely inside the green box
      doc.setTextColor(5, 150, 105);
      doc.text(statusLabel, pillX + padX + 4.5, pillY + 5.1);

      let currentY = 54;

      // Section 1: Service Summary
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(220, 38, 38);
      doc.text(t.specModal.summaryTitle.toUpperCase(), 15, currentY);
      currentY += 3.5;

      const descLines = doc.splitTextToSize(card.desc, 172);
      const descBoxHeight = descLines.length * 4.2 + 5;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(15, currentY, 180, descBoxHeight, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(descLines, 19, currentY + 4.5);
      currentY += descBoxHeight + 6;

      // Section 2: Technical Specifications Table (Mathematically aligned grid)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(220, 38, 38);
      doc.text(t.specModal.specsTitle.toUpperCase(), 15, currentY);
      currentY += 3.5;

      const tableStartX = 15;
      const tableWidth = 180;
      const colSplitX = 68; // 53mm for Col 1, 127mm for Col 2
      const tableStartY = currentY;

      // Table Header Row
      doc.setFillColor(15, 23, 42); // Slate-900
      doc.rect(tableStartX, currentY, tableWidth, 7, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(t.specModal.colParam, tableStartX + 4, currentY + 4.8);
      doc.text(t.specModal.colValue, colSplitX + 4, currentY + 4.8);
      currentY += 7;

      // Table Rows with precise height and vertical line alignment
      card.techSpecs.forEach((spec, idx) => {
        const labelLines = doc.splitTextToSize(spec.label, 48);
        const valLines = doc.splitTextToSize(spec.value, 118);
        const maxLines = Math.max(labelLines.length, valLines.length);
        const rowHeight = maxLines * 4.2 + 3.8;

        // Alternating background
        doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
        doc.rect(tableStartX, currentY, tableWidth, rowHeight, 'F');

        // Draw horizontal bottom border
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.line(tableStartX, currentY + rowHeight, tableStartX + tableWidth, currentY + rowHeight);

        // Draw vertical divider between columns
        doc.line(colSplitX, currentY, colSplitX, currentY + rowHeight);

        // Render Label Text (Bold)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.8);
        doc.setTextColor(15, 23, 42);
        doc.text(labelLines, tableStartX + 4, currentY + 4.5);

        // Render Value Text (Normal)
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.8);
        doc.setTextColor(51, 65, 85);
        doc.text(valLines, colSplitX + 4, currentY + 4.5);

        currentY += rowHeight;
      });

      // Draw outer table border
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.rect(tableStartX, tableStartY, tableWidth, currentY - tableStartY, 'D');

      currentY += 5;

      // Section 3: Operational Advantages Box
      const advBoxHeight = 19;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(15, currentY, 180, advBoxHeight, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(
        lang === 'ca'
          ? 'GARANTIES OPERATIVES I AVANTATGES:'
          : lang === 'es'
          ? 'GARANTÍAS OPERATIVAS Y VENTAJAS:'
          : 'OPERATIONAL GUARANTEES & ADVANTAGES:',
        19,
        currentY + 4.5
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(71, 85, 105);
      card.benefits.forEach((benefit, bIdx) => {
        const lineY = currentY + 8.5 + bIdx * 3.4;
        if (lineY < currentY + advBoxHeight) {
          doc.setFillColor(220, 38, 38);
          doc.circle(20, lineY - 0.9, 0.6, 'F');
          const bText = doc.splitTextToSize(benefit, 168);
          doc.text(bText[0], 23, lineY);
        }
      });

      // Bottom Stamp & Disclaimers
      const footerY = 277;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(15, footerY - 4, 195, footerY - 4);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(15, 23, 42);
      doc.text(t.specModal.seal, 15, footerY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.2);
      doc.setTextColor(148, 163, 184);
      const noticeLines = doc.splitTextToSize(t.specModal.footerNotice, 128);
      doc.text(noticeLines, 15, footerY + 3.5);

      // Official Stamp box
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(252, 165, 165);
      doc.setLineWidth(0.4);
      doc.roundedRect(148, footerY - 2, 47, 12, 1.5, 1.5, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(185, 28, 28);
      doc.text('✓ TARRAKO FREIGHT', 171.5, footerY + 2.5, { align: 'center' });
      doc.setFontSize(6);
      doc.setTextColor(100, 116, 139);
      doc.text('PORT DE TARRAGONA · 2026', 171.5, footerY + 6.5, { align: 'center' });

      // Generate the Blob directly (synchronous in click event)
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      setLastBlobUrl(blobUrl);

      // Create download anchor and trigger click immediately
      const filename = `tarrako-freight-${card.id}-fitxa-tecnica.pdf`;
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 8000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  // Print function with print style support
  const handlePrint = () => {
    try {
      window.print();
    } catch {
      handleDownloadPDF();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="spec-sheet-title"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-4xl my-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3.5 bg-slate-950 border-b border-slate-800 text-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-red-400 uppercase">
              {t.specModal.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Primary Download PDF Button (Direct Synchronous Vector Generation) */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-red-950/40 cursor-pointer border border-red-400/50"
              title={t.specModal.btnDownloadPdf}
            >
              <Download className="w-4 h-4" />
              <span>{t.specModal.btnDownloadPdf}</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer border border-slate-700"
              title={t.specModal.btnPrint}
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">{t.specModal.btnPrint}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer ml-1"
              aria-label={t.specModal.btnClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Download Success Notification Toast */}
        {downloadSuccess && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-200 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">
                Fitxa tècnica descarregada en PDF correctament al teu dispositiu!
              </span>
            </div>
            {lastBlobUrl && (
              <a
                href={lastBlobUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 underline text-emerald-300 hover:text-white font-mono text-[11px]"
              >
                <span>Obrir en nova pestanya</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Scrollable Printable Document Body */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-950/40">
          {/* Printable White-Paper Sheet with Clean B/W and Red Corporate Accents */}
          <div
            id="printable-spec-sheet"
            className="w-full bg-white text-slate-900 p-6 sm:p-10 rounded-xl shadow-lg border-2 border-slate-300 font-sans print:border-none print:shadow-none print:p-0 print:m-0"
          >
            {/* Header with Enlarged Logo & Highlighted Brand */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-red-600">
              <div className="flex items-center gap-3.5">
                <img
                  src="/assets/aistudio/tarrako_freight_logo_tight.png"
                  alt="TARRAKO FREIGHT Logo"
                  className="h-9 sm:h-11 w-auto object-contain shrink-0 bg-black rounded-md p-1 border border-slate-800 shadow-sm"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 uppercase">
                    TARRAKO{' '}
                    <span className="text-red-600 font-extrabold tracking-wider">
                      FREIGHT
                    </span>
                  </h1>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-600 tracking-wide font-mono">
                    {t.specModal.companySub}
                  </p>
                </div>
              </div>

              {/* Document Meta Badges */}
              <div className="text-left sm:text-right text-xs space-y-1 font-mono">
                <div className="inline-block px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 font-bold rounded">
                  {refCode}
                </div>
                {techNumSpec && (
                  <div className="text-slate-600 font-medium">
                    {techNumSpec.label}: <span className="font-bold text-slate-900">{techNumSpec.value}</span>
                  </div>
                )}
                <div className="text-[11px] text-slate-500">
                  UN/LOCODE: <strong className="text-slate-800">ESTAR</strong> (Port de Tarragona)
                </div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="my-6 p-4 bg-slate-50 border-l-4 border-red-600 rounded-r flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block font-mono">
                  {t.specModal.docTitle}
                </span>
                <h2
                  id="spec-sheet-title"
                  className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight"
                >
                  {card.title}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t.specModal.docStatus}</span>
              </div>
            </div>

            {/* Service Summary Overview */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-red-600" />
                <span>{t.specModal.summaryTitle}</span>
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded border border-slate-200">
                {card.desc}
              </p>
            </div>

            {/* Technical Specifications Table */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                <span>{t.specModal.specsTitle}</span>
              </h3>

              <div className="overflow-hidden border border-slate-300 rounded-lg">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-mono text-xs">
                      <th className="py-2.5 px-4 font-bold border-b border-slate-800 w-1/3">
                        {t.specModal.colParam}
                      </th>
                      <th className="py-2.5 px-4 font-bold border-b border-slate-800 w-2/3">
                        {t.specModal.colValue}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-sans">
                    {card.techSpecs.map((item, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
                      >
                        <td className="py-2.5 px-4 font-bold text-slate-900 align-top border-r border-slate-200">
                          {item.label}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700 leading-relaxed align-top">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Advantages Checklist */}
            <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-900 uppercase font-mono block mb-2.5">
                {lang === 'ca'
                  ? 'Garanties operatives i avantatges:'
                  : lang === 'es'
                  ? 'Garantías operativas y ventajas:'
                  : 'Operational guarantees and advantages:'}
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {card.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Actions inside document */}
            <div className="mb-6 flex flex-wrap items-center gap-3 print:hidden">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-950/30 transition-all cursor-pointer border border-red-400/50"
              >
                <Download className="w-4 h-4" />
                <span>{t.specModal.btnDownloadPdf}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer border border-slate-300"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>{t.specModal.btnPrint}</span>
              </button>
            </div>

            {/* Document Footer: Stamp, Port Authority & Academic Disclaimer */}
            <div className="pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
              <div className="space-y-1 max-w-lg">
                <p className="font-semibold text-slate-800 uppercase tracking-tight">
                  {t.specModal.seal}
                </p>
                <p className="leading-normal">{t.specModal.footerNotice}</p>
              </div>

              <div className="p-2.5 rounded border border-red-300 bg-red-50/60 text-red-800 font-mono text-[10px] text-center shrink-0 uppercase tracking-wider font-bold">
                ✓ VERIFICAT TARRAKO FREIGHT<br />
                PORT DE TARRAGONA · 2026
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded print stylesheet so user gets flawless print-to-PDF output */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-spec-sheet, #printable-spec-sheet * {
            visibility: visible !important;
          }
          #printable-spec-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
};
