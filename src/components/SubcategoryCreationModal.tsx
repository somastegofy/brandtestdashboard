import React, { useState } from 'react';
import { X, Save, Tag, AlertCircle, ArrowRight } from 'lucide-react';
import { Category } from '../types/productTypes';

interface SubcategoryCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subcategoryName: string, parentCategoryId: string) => void;
  parentCategory: Category | null;
  existingSubcategoryNames?: string[];
}

const SubcategoryCreationModal: React.FC<SubcategoryCreationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  parentCategory,
  existingSubcategoryNames = []
}) => {
  const [subcategoryName, setSubcategoryName] = useState('');
  const [error, setError] = useState('');

  const validateSubcategoryName = (name: string) => {
    if (!name.trim()) {
      return 'Subcategory name is required';
    }
    if (existingSubcategoryNames.some(existing => existing.toLowerCase() === name.toLowerCase())) {
      return 'Subcategory name already exists in this category';
    }
    return '';
  };

  const handleSave = () => {
    if (!parentCategory) return;

    const validationError = validateSubcategoryName(subcategoryName);
    if (validationError) {
      setError(validationError);
      return;
    }

    onSave(subcategoryName.trim(), parentCategory.id);
    setSubcategoryName('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setSubcategoryName('');
    setError('');
    onClose();
  };

  if (!isOpen || !parentCategory) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Tag className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create New Subcategory</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{parentCategory.name}</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>New Subcategory</span>
                </div>
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
                Subcategory Name *
              </label>
              <input
                type="text"
                value={subcategoryName}
                onChange={(e) => {
                  setSubcategoryName(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter subcategory name"
                autoFocus
              />
              {error && (
                <div className="flex items-center space-x-2 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Tag className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-900">Parent Category</h4>
                  <p className="text-sm text-green-700 mt-1">
                    This subcategory will be created under <strong>{parentCategory.name}</strong>
                  </p>
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
            disabled={!subcategoryName.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            Create Subcategory
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryCreationModal;