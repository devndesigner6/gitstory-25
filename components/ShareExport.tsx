import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Share2, Twitter, Linkedin, Facebook, Mail, 
  Copy, Check, Image, FileText, Coffee 
} from 'lucide-react';
import { GitStoryData } from '../types';
import { 
  exportAsPNG, exportAsPDF, exportAsJPG, 
  copyToClipboard, generateShareableLink 
} from '../services/exportService';
import { 
  shareToTwitter, shareToLinkedIn, shareToFacebook, 
  shareToReddit, generateAllShareLinks, generateShareText 
} from '../services/socialService';

interface ShareExportProps {
  data: GitStoryData;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onPanelToggle?: (isOpen: boolean) => void;
}

export const ShareExport: React.FC<ShareExportProps> = ({
  data,
  onExportStart,
  onExportComplete,
  onPanelToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'export' | 'share'>('export');
  const [exportFormat, setExportFormat] = useState<'png' | 'pdf' | 'jpg'>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseUrl = generateShareableLink(data.username);
  const shareText = generateShareText(data, 'twitter');

  const togglePanel = (open: boolean) => {
    setIsOpen(open);
    onPanelToggle?.(open);
  };

  const handleExport = async (format: 'png' | 'pdf' | 'jpg') => {
    setIsExporting(true);
    onExportStart?.();

    try {
      const elementId = 'story-container';
      const filename = `gitstory-${data.username}-2025`;

      switch (format) {
        case 'png':
          await exportAsPNG(elementId, filename);
          break;
        case 'pdf':
          await exportAsPDF(elementId, filename);
          break;
        case 'jpg':
          await exportAsJPG(elementId, filename);
          break;
      }

      setTimeout(() => {
        setIsExporting(false);
        onExportComplete?.();
      }, 500);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook' | 'reddit') => {
    switch (platform) {
      case 'twitter':
        shareToTwitter(shareText, baseUrl);
        break;
      case 'linkedin':
        shareToLinkedIn(baseUrl, `${data.username}'s GitStory 2025`);
        break;
      case 'facebook':
        shareToFacebook(baseUrl);
        break;
      case 'reddit':
        shareToReddit(baseUrl, `${data.username}'s GitStory 2025`);
        break;
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(baseUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl p-4 w-80"
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-neutral-800">
              <button
                onClick={() => setActiveTab('export')}
                className={`pb-2 px-3 text-sm font-medium transition-colors ${
                  activeTab === 'export'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-neutral-400 hover:text-neutral-300'
                }`}
              >
                <Download className="inline mr-2 w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => setActiveTab('share')}
                className={`pb-2 px-3 text-sm font-medium transition-colors ${
                  activeTab === 'share'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-neutral-400 hover:text-neutral-300'
                }`}
              >
                <Share2 className="inline mr-2 w-4 h-4" />
                Share
              </button>
            </div>

            {/* Export Tab */}
            {activeTab === 'export' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <p className="text-xs text-neutral-400 mb-3">Download your GitStory in:</p>
                
                <button
                  onClick={() => handleExport('png')}
                  disabled={isExporting}
                  className="w-full flex items-center gap-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700 transition-colors disabled:opacity-50"
                >
                  <Image className="w-4 h-4" />
                  <span className="text-sm">PNG Image</span>
                  {isExporting && <span className="text-xs text-neutral-400">exporting...</span>}
                </button>

                <button
                  onClick={() => handleExport('jpg')}
                  disabled={isExporting}
                  className="w-full flex items-center gap-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700 transition-colors disabled:opacity-50"
                >
                  <Image className="w-4 h-4" />
                  <span className="text-sm">JPG Image</span>
                </button>

                <button
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className="w-full flex items-center gap-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700 transition-colors disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">PDF Document</span>
                </button>
              </motion.div>
            )}

            {/* Share Tab */}
            {activeTab === 'share' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <p className="text-xs text-neutral-400 mb-3">Share your story on:</p>

                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center gap-3 p-2 rounded bg-blue-900/30 hover:bg-blue-900/50 transition-colors"
                >
                  <Twitter className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Twitter</span>
                </button>

                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-full flex items-center gap-3 p-2 rounded bg-blue-900/30 hover:bg-blue-900/50 transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">LinkedIn</span>
                </button>

                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full flex items-center gap-3 p-2 rounded bg-blue-900/30 hover:bg-blue-900/50 transition-colors"
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Facebook</span>
                </button>

                <button
                  onClick={() => handleShare('reddit')}
                  className="w-full flex items-center gap-3 p-2 rounded bg-orange-900/30 hover:bg-orange-900/50 transition-colors"
                >
                  <Coffee className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">Reddit</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 p-2 rounded bg-neutral-800 hover:bg-neutral-700 transition-colors mt-4"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy Link</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => togglePanel(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
      >
        {isOpen ? <span className="text-xl">×</span> : <Share2 className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};
