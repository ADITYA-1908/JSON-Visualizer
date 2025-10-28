import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';

export default function Toolbar({ darkMode }) {
  // const { getNodes } = useReactFlow();

  const handleDownload = async () => {
    const flowElement = document.querySelector('.react-flow');

    if (!flowElement) {
      console.error('Flow element not found');
      return;
    }

    try {
      const dataUrl = await toPng(flowElement, {
        backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
        filter: (node) => {
          if (node?.classList?.contains('react-flow__minimap')) return false;
          if (node?.classList?.contains('react-flow__controls')) return false;
          return true;
        }
      });

      const link = document.createElement('a');
      link.download = `json-tree-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        title="Download tree as image"
      >
        <Download className="w-5 h-5 text-gray-700" />
        <span className="text-sm font-medium text-gray-700">Export</span>
      </button>
    </div>
  );
}
