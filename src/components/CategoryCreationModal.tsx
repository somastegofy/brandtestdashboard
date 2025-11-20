import React, { useState } from 'react';
import { X, Save, Tag, AlertCircle } from 'lucide-react';

interface CategoryCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryName: string) => void;
  existingCategoryNames?: string[];
}

const CategoryCreationModal: React.FC<CategoryCreationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingCategoryNames = []
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');

  const validateCategoryName = (name: string) => {
    if (!name.trim()) {
      return 'Category name is required';
    }
    if (existingCategoryNames.some(existing => existing.toLowerCase() === name.toLowerCase())) {
      return 'Category name already exists';
    }
    return '';
  };

  const handleSave = () => {
    const validationError = validateCategoryName(categoryName);
    if (validationError) {
      setError(validationError);
      return;
    }

    onSave(categoryName.trim());
    setCategoryName('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setCategoryName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Tag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create New Category</h3>
                <p className="text-sm text-gray-600">Add a new product category</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter category name"
                autoFocus
              />
              {error && (
                <div className="flex items-center space-x-2 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Tag className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Category Guidelines</h4>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Use clear, descriptive names</li>
                    <li>• Keep names concise and professional</li>
                    <li>• Avoid special characters</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!categoryName.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            Create Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreationModal;