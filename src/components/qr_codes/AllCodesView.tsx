import React from 'react';
import { QrCode as QrCodeIcon } from 'lucide-react';

const AllCodesView: React.FC<any> = () => {
  return (
    <div className="p-8 text-center">
      <QrCodeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Codes View</h3>
      <p className="text-gray-600">QR codes list will be displayed here</p>
    </div>
  );
};

export default AllCodesView;
