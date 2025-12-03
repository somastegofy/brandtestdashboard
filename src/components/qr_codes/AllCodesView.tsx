import React from 'react';
import { QrCode as QrCodeIcon, Edit2, Trash2, ExternalLink } from 'lucide-react';
import type { QrCode } from '../../types/qrCodeTypes';
import type { Product } from '../../types/productTypes';
import type { StudioPage } from '../../types/qrCodeTypes';

interface AllCodesViewProps {
  qrCodes: QrCode[];
  products: Product[];
  studioPages: StudioPage[];
  onQrCodeUpdate: (qr: QrCode) => void;
  onQrCodeDelete: (id: string) => void;
  onEditQrCode: (qr: QrCode) => void;
  activeFilter: 'all-codes' | 'products-qr' | 'studio-pages-qr';
}

const AllCodesView: React.FC<AllCodesViewProps> = ({
  qrCodes,
  onQrCodeDelete,
  onEditQrCode,
}) => {
  if (qrCodes.length === 0) {
    return (
      <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
        <QrCodeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No QR codes yet</h3>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Use the <span className="font-semibold">Create QR Code</span> button above to generate your first code,
          add a redirect link, and customize its design.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="min-w-full divide-y divide-gray-200">
        <div className="bg-gray-50 px-6 py-3 flex text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="w-16">Preview</div>
          <div className="flex-1 pl-4">Name</div>
          <div className="w-64">Destination URL</div>
          <div className="w-32 text-right">Total Scans</div>
          <div className="w-40 text-right">Created</div>
          <div className="w-40 text-right">Last Updated</div>
          <div className="w-32 text-right">Actions</div>
        </div>
        {qrCodes.map((qr) => (
          <div
            key={qr.id}
            className="px-6 py-4 flex items-center hover:bg-gray-50 transition-colors"
          >
            <div className="w-16">
              <div className="w-12 h-12 border border-gray-200 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                {qr.previewImage ? (
                  <img
                    src={qr.previewImage}
                    alt={qr.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <QrCodeIcon className="w-6 h-6 text-gray-300" />
                )}
              </div>
            </div>
            <div className="flex-1 pl-4">
              <p className="text-sm font-medium text-gray-900">{qr.name}</p>
              <p className="text-xs text-gray-500">
                {qr.type} · {qr.status}
              </p>
            </div>
            <div className="w-64">
              <a
                href={qr.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 break-all"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                {qr.url}
              </a>
            </div>
            <div className="w-32 text-right">
              <span className="text-sm font-medium text-gray-900">
                {qr.totalScans.toLocaleString()}
              </span>
            </div>
            <div className="w-40 text-right">
              <p className="text-xs text-gray-500">
                {new Date(qr.dateCreated).toLocaleDateString()}
              </p>
            </div>
            <div className="w-40 text-right">
              <p className="text-xs text-gray-500">
                {new Date(qr.lastUpdated).toLocaleDateString()}
              </p>
            </div>
            <div className="w-32 flex justify-end space-x-2">
              <button
                onClick={() => onEditQrCode(qr)}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-blue-600 hover:bg-blue-50"
              >
                <Edit2 className="w-3 h-3 mr-1" />
                Edit
              </button>
              <button
                onClick={() => onQrCodeDelete(qr.id)}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCodesView;
