import React from 'react';
import { Settings } from 'lucide-react';

const QrSettingsTab: React.FC<any> = () => {
  return (
    <div className="p-8 text-center">
      <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code Settings</h3>
      <p className="text-gray-600">Configure QR code settings here</p>
    </div>
  );
};

export default QrSettingsTab;
