import React, { useState, useEffect, useRef } from 'react';
import { Search, Upload, FolderPlus, Folder as FolderIcon, Image as ImageIcon, Video as VideoIcon, FileText, Music, FileCode, File, Grid3x3, List, Copy, Trash2, Download, Share2, Tag, Star, Calendar, HardDrive, Filter, X } from 'lucide-react';
import { fetchFolders, createFolder, deleteFolder } from '../api/folders';
import { fetchAssets, uploadAsset, updateAsset, deleteAsset } from '../api/assets';
import { Folder, Asset } from '../lib/supabase';

const FileManagerTab: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'size'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [stats, setStats] = useState({ total: 0, size: 0, byType: {} as Record<string, number> });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFolders();
    loadAssets();
  }, []);

  useEffect(() => {
    loadAssets();
  }, [selectedFolderId, searchTerm, typeFilter, sortBy]);

  useEffect(() => {
    calculateStats();
  }, [assets]);

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

  const calculateStats = () => {
    const total = assets.length;
    const size = assets.reduce((sum, asset) => sum + asset.size, 0);
    const byType = assets.reduce((acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    setStats({ total, size, byType });
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

  const handleSelectAsset = (id: string) => {
    const newSelected = new Set(selectedAssets);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedAssets(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedAssets.size === assets.length) {
      setSelectedAssets(new Set());
    } else {
      setSelectedAssets(new Set(assets.map(a => a.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAssets.size === 0) return;
    if (!confirm(`Delete ${selectedAssets.size} file(s)?`)) return;

    try {
      for (const id of selectedAssets) {
        await deleteAsset(id);
      }
      setSelectedAssets(new Set());
      await loadAssets();
    } catch (err) {
      console.error('Error deleting files:', err);
      setError('Failed to delete files');
    }
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL copied to clipboard!');
    } catch (err) {
      console.error('Error copying URL:', err);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'video': return <VideoIcon className="w-5 h-5 text-purple-500" />;
      case 'audio': return <Music className="w-5 h-5 text-green-500" />;
      case 'css': return <FileCode className="w-5 h-5 text-orange-500" />;
      case 'document': return <FileText className="w-5 h-5 text-red-500" />;
      default: return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">File Manager</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all your files in one place</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{stats.total}</span> files • {formatFileSize(stats.size)} used
            </div>
          </div>
        </div>

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

          <div className="flex items-center space-x-1 border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

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
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {uploading && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
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

        {selectedAssets.size > 0 && (
          <div className="mt-4 p-3 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedAssets.size} file(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </button>
              <button
                onClick={() => setSelectedAssets(new Set())}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Folders</h3>
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="p-1 hover:bg-gray-100 rounded"
              title="New Folder"
            >
              <FolderPlus className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {isCreatingFolder && (
            <div className="mb-3 space-y-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                placeholder="Folder name"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCreateFolder}
                  className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName('');
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
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

          <div className="space-y-1">
            {folders.filter(f => !f.parent_id).map(folder => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                  selectedFolderId === folder.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <FolderIcon className="w-4 h-4 mr-2" />
                  {folder.name}
                </div>
                <span className="text-xs text-gray-500">
                  {assets.filter(a => a.folder_id === folder.id).length}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-xs font-medium text-gray-500 uppercase mb-3">Storage</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Used</span>
                <span className="font-medium text-gray-900">{formatFileSize(stats.size)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: '30%' }}
                />
              </div>
              <p className="text-xs text-gray-500">30% of 1 GB used</p>
            </div>
          </div>
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
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className={`border rounded-lg p-3 hover:shadow-md transition-all cursor-pointer ${
                    selectedAssets.has(asset.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    setSelectedAsset(asset);
                    handleSelectAsset(asset.id);
                  }}
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
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate" title={asset.name}>
                      {asset.name}
                    </p>
                    <p className="text-xs text-gray-500">{formatFileSize(asset.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className={`border rounded-lg p-4 hover:shadow-sm transition-all cursor-pointer flex items-center ${
                    selectedAssets.has(asset.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    setSelectedAsset(asset);
                    handleSelectAsset(asset.id);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedAssets.has(asset.id)}
                    onChange={() => handleSelectAsset(asset.id)}
                    className="mr-4"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-4">
                      {asset.type === 'image' && asset.thumbnail_url ? (
                        <img
                          src={asset.thumbnail_url}
                          alt={asset.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        getFileIcon(asset.type)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{asset.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(asset.created_at)}</p>
                    </div>
                    <div className="flex items-center space-x-4 ml-4">
                      <span className="text-sm text-gray-500">{formatFileSize(asset.size)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(asset.url);
                        }}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm('Delete this file?')) {
                            await deleteAsset(asset.id);
                            await loadAssets();
                          }
                        }}
                        className="p-2 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedAsset && (
          <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">File Details</h3>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {selectedAsset.type === 'image' && selectedAsset.thumbnail_url ? (
                  <img
                    src={selectedAsset.thumbnail_url}
                    alt={selectedAsset.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="scale-150">
                    {getFileIcon(selectedAsset.type)}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Name</label>
                  <p className="text-sm text-gray-900 mt-1 break-all">{selectedAsset.name}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Type</label>
                  <p className="text-sm text-gray-900 mt-1 capitalize">{selectedAsset.type}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Size</label>
                  <p className="text-sm text-gray-900 mt-1">{formatFileSize(selectedAsset.size)}</p>
                </div>

                {selectedAsset.width && selectedAsset.height && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Dimensions</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedAsset.width} × {selectedAsset.height}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Uploaded</label>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(selectedAsset.created_at)}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">URL</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="text"
                      value={selectedAsset.url}
                      readOnly
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-gray-50"
                    />
                    <button
                      onClick={() => handleCopyUrl(selectedAsset.url)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Copy URL"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => window.open(selectedAsset.url, '_blank')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Delete this file?')) {
                      await deleteAsset(selectedAsset.id);
                      setSelectedAsset(null);
                      await loadAssets();
                    }
                  }}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManagerTab;
