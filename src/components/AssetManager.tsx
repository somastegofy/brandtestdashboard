import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Upload, FolderPlus, Folder as FolderIcon, Image as ImageIcon, Video as VideoIcon, FileText, Music, FileCode, File, Check, Copy, Edit2, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { fetchFolders, createFolder, deleteFolder } from '../api/folders';
import { fetchAssets, uploadAsset, updateAsset, deleteAsset } from '../api/assets';
import { Folder, Asset } from '../lib/supabase';

interface AssetManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: Asset) => void;
  filterType?: string;
}

const AssetManager: React.FC<AssetManagerProps> = ({
  isOpen,
  onClose,
  onSelect,
  filterType = 'all'
}) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>(filterType);
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'size'>('newest');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadFolders();
      loadAssets();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      loadAssets();
    }
  }, [selectedFolderId, searchTerm, typeFilter, sortBy, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const loadFolders = async () => {
    try {
      const data = await fetchFolders();
      setFolders(data);
    } catch (err) {
      console.error('Error loading folders:', err);
      setError('Failed to load folders');
    }
  };

  const loadAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAssets({
        type: typeFilter !== 'all' ? typeFilter : undefined,
        folderId: selectedFolderId || undefined,
        search: searchTerm || undefined,
        sort: sortBy
      });
      setAssets(data);
    } catch (err) {
      console.error('Error loading assets:', err);
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(Array.from(files));
    }
  };

  const handleFileUpload = async (files: File[]) => {
    setUploading(true);
    setUploadProgress(0);
    setError(null);

    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name} exceeds 10MB limit`);
        continue;
      }

      if (!isValidFileType(file.type)) {
        errors.push(`${file.name} has unsupported file type`);
        continue;
      }

      validFiles.push(file);
    }

    if (errors.length > 0) {
      setError(errors.join(', '));
    }

    try {
      for (let i = 0; i < validFiles.length; i++) {
        await uploadAsset(validFiles[i], selectedFolderId);
        setUploadProgress(((i + 1) / validFiles.length) * 100);
      }
      await loadAssets();
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Failed to upload files');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const isValidFileType = (mimeType: string): boolean => {
    const validTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp',
      'video/mp4', 'video/webm',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'audio/mpeg', 'audio/wav', 'audio/ogg',
      'text/css'
    ];
    return validTypes.includes(mimeType);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolder(newFolderName, selectedFolderId);
      setNewFolderName('');
      setIsCreatingFolder(false);
      await loadFolders();
    } catch (err) {
      console.error('Error creating folder:', err);
      setError('Failed to create folder');
    }
  };

  const handleDeleteAsset = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await deleteAsset(id);
      await loadAssets();
    } catch (err) {
      console.error('Error deleting asset:', err);
      setError('Failed to delete file');
    }
  };

  const handleCopyUrl = async (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      alert('URL copied to clipboard!');
    } catch (err) {
      console.error('Error copying URL:', err);
    }
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderTree = () => {
    const rootFolders = folders.filter(f => !f.parent_id);

    return (
      <div className="space-y-1">
        {rootFolders.map(folder => (
          <div key={folder.id}>
            <button
              onClick={() => setSelectedFolderId(folder.id)}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${
                selectedFolderId === folder.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <FolderIcon className="w-4 h-4 mr-2" />
              {folder.name}
            </button>
          </div>
        ))}
      </div>
    );
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-6 h-6 text-blue-500" />;
      case 'video': return <VideoIcon className="w-6 h-6 text-purple-500" />;
      case 'audio': return <Music className="w-6 h-6 text-green-500" />;
      case 'css': return <FileCode className="w-6 h-6 text-orange-500" />;
      case 'document': return <FileText className="w-6 h-6 text-red-500" />;
      default: return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div
        ref={modalRef}
        className="relative bg-white h-full w-full max-w-5xl shadow-2xl flex flex-col"
        style={{ width: '1000px' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Asset Manager</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Folders</h3>
              <button
                onClick={() => setIsCreatingFolder(true)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FolderPlus className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {isCreatingFolder && (
              <div className="mb-3 flex items-center space-x-2">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                  placeholder="Folder name"
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={handleCreateFolder}
                  className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedFolderId(null)}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm mb-2 ${
                selectedFolderId === null
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <FolderIcon className="w-4 h-4 mr-2" />
              All Files
            </button>

            {renderFolderTree()}
          </div>

          <div className="flex-1 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="document">Documents</option>
                  <option value="audio">Audio</option>
                  <option value="css">CSS</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest</option>
                  <option value="name">Name</option>
                  <option value="size">Size</option>
                </select>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              {uploading && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between text-sm text-blue-700 mb-2">
                    <span>Uploading files...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div
              className={`flex-1 overflow-y-auto p-6 ${isDragging ? 'bg-blue-50' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isDragging && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 z-10 pointer-events-none">
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <p className="text-lg font-medium text-blue-900">Drop files to upload</p>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-500">Loading files...</p>
                  </div>
                </div>
              ) : assets.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 mb-2">No files found</p>
                    <p className="text-sm text-gray-400">Upload files or change filters</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => onSelect(asset)}
                    >
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                        {asset.type === 'image' && asset.thumbnail_url ? (
                          <img
                            src={asset.thumbnail_url}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getFileIcon(asset.type)
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900 truncate" title={asset.name}>
                          {asset.name}
                        </p>
                        <p className="text-xs text-gray-500">{formatFileSize(asset.size)}</p>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelect(asset);
                            }}
                            className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Select
                          </button>
                          <button
                            onClick={(e) => handleCopyUrl(asset.url, e)}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                            title="Copy URL"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteAsset(asset.id, e)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetManager;
