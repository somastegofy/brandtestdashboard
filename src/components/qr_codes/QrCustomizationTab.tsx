import React from 'react';
import { Palette } from 'lucide-react';

const QrCustomizationTab: React.FC<any> = () => {
  return (
    <div className="p-8 text-center">
      <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code Customization</h3>
      <p className="text-gray-600">Customize your QR code appearance here</p>
    </div>
  );
};

export default QrCustomizationTab;
