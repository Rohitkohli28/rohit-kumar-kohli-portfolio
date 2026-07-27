import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, FileText, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const pdfUrl = '/Rohit_Kumar_Kohli_Resume.pdf';
  const downloadUrl = `${API_BASE_URL}/api/resume/download`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, translateY: 20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            exit={{ opacity: 0, scale: 0.95, translateY: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl h-[88vh] bg-card border border-border/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/80 bg-card/90 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-sm text-text tracking-wide">
                    Rohit_Kumar_Kohli_Resume.pdf
                  </h3>
                  <p className="text-[11px] font-mono text-muted">
                    Official Software Engineer Resume • PDF Document
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={downloadUrl}
                  download="Rohit_Kumar_Kohli_Resume.pdf"
                  className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-mono text-xs font-semibold rounded-lg shadow-md hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download size={14} /> Download PDF
                </a>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted hover:text-text hover:bg-card-hover rounded-lg transition-all border border-border/50 hidden sm:flex items-center gap-1.5 text-xs font-mono"
                  title="Open in new tab"
                >
                  <ExternalLink size={15} />
                </a>

                <button
                  onClick={onClose}
                  className="p-2 text-muted hover:text-text hover:bg-card-hover rounded-lg transition-all cursor-pointer border border-border/50"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Embedded PDF Viewer */}
            <div className="flex-1 w-full bg-slate-900/90 relative flex flex-col">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0`}
                title="Rohit Kumar Kohli Resume PDF Preview"
                className="w-full h-full border-0 rounded-b-2xl"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
